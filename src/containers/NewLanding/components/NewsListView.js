import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import URLS from '../../../URLS';
import moment from 'moment';

// API and store imports
import {useNews} from '../../../api/hooks/News';

// Material-UI
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

// Project componets
import LinkButton from '../../../components/navigation/LinkButton';
import NewsListItem from '../../News/components/NewsListItem';

// Styles
const styles = (theme) => ({
  newsListContainer: {
    display: 'grid',
    gridGap: 1,
    color: theme.palette.text.secondary,
    margin: 'auto',
  },
  noEventText: {
    padding: 5,
    textAlign: 'center',
  },
  text: {
    padding: 0,
  },
  progress: {
    margin: 'auto',
    marginTop: 10,
    marginBottom: 10,
  },
  moreBtn: {
    boxShadow: '0px 2px 4px ' + theme.colors.border.main + '88, 0px 0px 4px ' + theme.colors.border.main + '88',
    borderRadius: theme.sizes.border.radius,
    overflow: 'hidden',
  },
});

function NewsListView(props) {
  const {classes} = props;
  const [news, isLoading, isError] = useNews();
  const [newsToDisplay, setNewsToDisplay] = useState(1);
  const today = new Date();
  today.setDate(today.getDate() - 7);
  const lastWeek = moment(today, ['YYYY-MM-DD HH:mm:ss'], 'nb');

  useEffect(() => {
    // Calculate how many news to show based on created news last 7 days. Minimum 1 and max 3
    if (!isError) {
      const freshNews = news.filter((n) => moment(n.created_at, ['YYYY-MM-DD HH:mm:ss'], 'nb') > lastWeek);
      setNewsToDisplay(Math.min(Math.max(parseInt(freshNews.length), 1), 3));
    } else {
      setNewsToDisplay(0);
    }
  }, [news, lastWeek, isError]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  let newsList = <div className={classes.noEventText}><CircularProgress className={classes.progress}/></div>;
  if (!isLoading) {
    newsList = news && news.length > 0 ?
        <React.Fragment>
          {news.map((newsData, index) => {
            if (index < newsToDisplay) {
              return (<NewsListItem key={index} data={newsData} />);
            }
            return ('');
          })}
          <div className={classes.moreBtn}>
            <LinkButton noPadding to={URLS.news}>
              <Typography align='center'>Alle nyheter</Typography>
            </LinkButton>
          </div>
        </React.Fragment> :
        <Typography
          variant='subtitle1'
          className={classes.noEventText}
          align='center'>Ingen nyheter å vise</Typography>;
  }

  return (
    <div className={classes.newsListContainer}>
      {newsList}
    </div>
  );
}

NewsListView.propTypes = {
  classes: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
};

export default withStyles(styles)(NewsListView);
import { useState, useEffect } from 'react';
import { News } from 'types/Types';
import URLS from 'URLS';
import { Link } from 'react-router-dom';

// API and store imports
import { useNews } from 'api/hooks/News';

// Material-UI
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

// Project componets
import ListItem from 'components/miscellaneous/ListItem';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'grid',
    gridGap: theme.spacing(0, 1),
    gridTemplateColumns: '1fr 1fr',
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '1fr',
    },
  },
  noNewsText: {
    color: theme.palette.text.secondary,
    padding: theme.spacing(0.5),
    textAlign: 'center',
  },
  progress: {
    margin: 'auto',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  btn: {
    padding: theme.spacing(1),
  },
}));

const NO_OF_NEWS_TO_SHOW = 2;

const NewsListView = () => {
  const classes = useStyles();
  const { getNews } = useNews();
  const [news, setNews] = useState<Array<News>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getNews()
      .then((news) => setNews(news))
      .finally(() => setIsLoading(false));
  }, [getNews]);

  if (isLoading) {
    return (
      <div className={classes.noNewsText}>
        <CircularProgress className={classes.progress} />
      </div>
    );
  } else if (news.length) {
    return (
      <>
        <div className={classes.container}>{news.map((newsItem, index) => index < NO_OF_NEWS_TO_SHOW && <ListItem key={index} news={newsItem} />)}</div>
        <Button className={classes.btn} color='primary' component={Link} fullWidth to={URLS.news} variant='outlined'>
          Alle nyheter
        </Button>
      </>
    );
  } else {
    return (
      <Typography align='center' className={classes.noNewsText} variant='subtitle1'>
        Fant ingen nyheter
      </Typography>
    );
  }
};

export default NewsListView;
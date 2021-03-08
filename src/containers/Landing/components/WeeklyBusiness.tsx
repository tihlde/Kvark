// import URLS from 'URLS';
// import { Link } from 'react-router-dom';

// Material UI Components
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  weekly: {
    marginBottom: 35,
    display: 'flex',
    justifyContent: 'center',
    height: 45,
  },
  weeklyBtn: {
    color: theme.palette.common.white,
    borderColor: `${theme.palette.common.white}44`,
    background: `${theme.palette.common.white}44`,
    '&:hover': {
      background: `${theme.palette.common.white}22`,
    },
    fontSize: 15,
  },
  weeklyImg: {
    maxWidth: 100,
    maxHeight: 40,
  },
}));

// const url = 'https://res.cloudinary.com/blank/image/upload/v1520936053/blankno/logo01_w4ap4n.svg';
const url = 'https://arendalsuka.no/images/logos/SopraSterialogo.svg.png';
// const url =
// 'https://en.bouvet.no/about-bouvet/board/_/attachment/inline/0b3dd0bb-fe36-457
// 2-b993-700a1b18d50a:2e8f6686a18c8088cb3e87a7c64f29f350754e7b/bouvet-logo-1200x630-white-on-orange@2x.png';
// const url = 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Bouvet_logo.svg/1280px-Bouvet_logo.svg.png';
// const url = 'http://i.vimeocdn.com/portfolio_header/327912';

const WeeklyBusiness = () => {
  const classes = useStyles();
  return (
    <div className={classes.weekly}>
      <Button className={classes.weeklyBtn} endIcon={<img className={classes.weeklyImg} src={url} />} variant='outlined'>
        Ukens bedrift:
      </Button>
    </div>
  );
};

export default WeeklyBusiness;

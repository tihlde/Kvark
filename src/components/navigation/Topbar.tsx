import { useMemo, useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import URLS from 'URLS';
import classNames from 'classnames';

// Material UI Components
import { makeStyles } from '@material-ui/styles';
import { useTheme, AppBar, Toolbar, Button, Grow, Paper, Popper, MenuItem, MenuList, useMediaQuery } from '@material-ui/core';

// Assets/Icons
import ExpandIcon from '@material-ui/icons/ExpandMoreRounded';

// Project Components
import { NavigationItem, NavigationOptions } from 'components/navigation/Navigation';
import ProfileTopbarButton from 'components/navigation/ProfileTopbarButton';
import TihldeLogo from 'components/miscellaneous/TihldeLogo';

const useStyles = makeStyles((theme) => ({
  appBar: {
    boxSizing: 'border-box',
    backgroundColor: theme.palette.colors.gradient.main.top,
    color: theme.palette.text.primary,
    flexGrow: 1,
    zIndex: theme.zIndex.drawer + 2,
    transition: '0.2s',
  },
  fancyAppBar: {
    backgroundColor: 'transparent',
  },
  backdrop: {
    ...theme.palette.blurred,
    ...theme.palette.transparent,
    backgroundColor: `${theme.palette.colors.gradient.main.top}bf`,
    border: 'none',
    boxShadow: 'none',
  },
  toolbar: {
    width: '100%',
    maxWidth: theme.breakpoints.values.xl,
    margin: 'auto',
    padding: theme.spacing(0, 1),
    display: 'grid',
    gridTemplateColumns: '170px 1fr 170px',
  },
  filledTopbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: 65,
    background: theme.palette.colors.gradient.main.top,
    zIndex: theme.zIndex.drawer + 1,
  },
  topbarMobile: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: theme.spacing(0.5),
    zIndex: theme.zIndex.drawer,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    height: 32,
    width: 'auto',
    marginLeft: 0,
  },
  items: {
    display: 'flex',
    justifyContent: 'center',
    color: theme.palette.common.white,
  },
  black: {
    color: theme.palette.common.black,
  },
  right: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  selected: {
    borderBottom: '2px solid ' + theme.palette.getContrastText(theme.palette.colors.gradient.main.top),
    '& a': {
      fontWeight: 600,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
  },
  avatar: {
    width: 45,
    height: 45,
  },
  topbarItem: {
    alignSelf: 'center',
  },
  menulist: {
    padding: theme.spacing(0.5, 0),
    background: theme.palette.background.smoke,
    borderRadius: theme.spacing(1),
    textTransform: 'uppercase',
    minWidth: 150,
  },
  menulistItem: {
    display: 'block',
    textAlign: 'center',
  },
  dropdownIcon: {
    transition: 'transform 0.5s',
  },
  expanded: {
    transform: 'rotate(180deg)',
  },
}));

export type TopBarItemProps = {
  items?: {
    text: string;
    to: string;
  }[];
  text: string;
  to?: string;
  type: 'dropdown' | 'link';
};

const TopBarItem = ({ items, text, to, type }: TopBarItemProps) => {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const selected = useMemo(() => location.pathname === to, [location.pathname, to]);
  if (type === 'link' && to) {
    return (
      <div className={classNames(classes.topbarItem, selected && classes.selected)}>
        <Button color='inherit' component={Link} onClick={selected ? () => window.location.reload() : undefined} to={to}>
          {text}
        </Button>
      </div>
    );
  } else if (type === 'dropdown' && Array.isArray(items)) {
    return (
      <div className={classes.topbarItem} onMouseLeave={() => setIsOpen(false)}>
        <Button
          className={classes.topbarItem}
          color='inherit'
          endIcon={<ExpandIcon className={classNames(classes.dropdownIcon, isOpen && classes.expanded)} />}
          onClick={() => setIsOpen((prev) => !prev)}
          onMouseEnter={() => setIsOpen(true)}
          ref={anchorRef}>
          {text}
        </Button>
        <Popper anchorEl={anchorRef.current} disablePortal open={isOpen} role={undefined} transition>
          {({ TransitionProps, placement }) => (
            <Grow {...TransitionProps} style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}>
              <Paper>
                <MenuList className={classes.menulist}>
                  {items.map((item, i) => (
                    <MenuItem className={classes.menulistItem} component={Link} key={i} to={item.to}>
                      {item.text}
                    </MenuItem>
                  ))}
                </MenuList>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    );
  } else {
    return null;
  }
};

export type TopbarProps = {
  items: Array<NavigationItem>;
} & Pick<NavigationOptions, 'darkColor' | 'lightColor' | 'filledTopbar'>;

const Topbar = ({ items, lightColor, darkColor, filledTopbar }: TopbarProps) => {
  const classes = useStyles();
  const theme = useTheme();
  const [scrollLength, setScrollLength] = useState(0);
  const lgDown = useMediaQuery(theme.breakpoints.down('lg'));

  const handleScroll = () => setScrollLength(window.pageYOffset);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isOnTop = useMemo(() => scrollLength < 20, [scrollLength]);
  const shouldOverrideColorProp = useMemo(() => !lgDown && (filledTopbar || !isOnTop), [lgDown, isOnTop, filledTopbar]);
  const colorOnDark = useMemo(() => (darkColor && !shouldOverrideColorProp ? darkColor : 'white'), [darkColor, shouldOverrideColorProp]);
  const colorOnLight = useMemo(() => (lightColor && !shouldOverrideColorProp ? lightColor : 'white'), [lightColor, shouldOverrideColorProp]);

  if (lgDown) {
    return (
      <div className={classes.topbarMobile}>
        <Link to={URLS.landing}>
          <TihldeLogo className={classes.logo} darkColor={colorOnDark} lightColor={colorOnLight} size='large' />
        </Link>
        <ProfileTopbarButton darkColor={colorOnDark} lightColor={colorOnLight} />
      </div>
    );
  }
  return (
    <>
      <AppBar className={classNames(classes.appBar, isOnTop ? classes.fancyAppBar : classes.backdrop)} elevation={isOnTop ? 0 : 1} position='fixed'>
        <Toolbar className={classes.toolbar} disableGutters>
          <Link to={URLS.landing}>
            <TihldeLogo className={classes.logo} darkColor={colorOnDark} lightColor={colorOnLight} size='large' />
          </Link>
          <div
            className={classNames(classes.items, (theme.palette.mode === 'light' ? colorOnLight : colorOnDark) !== 'white' && !filledTopbar && classes.black)}>
            {items.map((item, i) => (
              <TopBarItem key={i} {...item} />
            ))}
          </div>
          <div className={classes.right}>
            <ProfileTopbarButton darkColor={colorOnDark} lightColor={colorOnLight} />
          </div>
        </Toolbar>
      </AppBar>
      {filledTopbar && <div className={classes.filledTopbar} />}
    </>
  );
};

export default Topbar;

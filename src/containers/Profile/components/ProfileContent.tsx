import { useState, useEffect } from 'react';
import { PermissionApp } from 'types/Enums';
import { useUser, useHavePermission } from 'api/hooks/User';
import URLS from 'URLS';
import { useNavigate } from 'react-router-dom';
import { useLogout } from 'api/hooks/User';

// Material-UI
import { makeStyles } from '@material-ui/styles';
import { SvgIconProps, Badge, Collapse, List, ListItem, ListItemIcon, ListItemText, Stack } from '@material-ui/core';

// Icons
import EventIcon from '@material-ui/icons/DateRangeRounded';
import NotificationsIcon from '@material-ui/icons/NotificationsNoneRounded';
import SettingsIcon from '@material-ui/icons/SettingsRounded';
import AdminIcon from '@material-ui/icons/TuneRounded';
import LogOutIcon from '@material-ui/icons/ExitToAppRounded';
import BadgesIcon from '@material-ui/icons/EmojiEventsRounded';
import GroupsIcon from '@material-ui/icons/PeopleOutlineRounded';

// Project Components
import ProfileAdmin from 'containers/Profile/components/ProfileAdmin';
import ProfileSettings from 'containers/Profile/components/ProfileSettings';
import ProfileEvents from 'containers/Profile/components/ProfileEvents';
import ProfileGroups from 'containers/Profile/components/ProfileGroups';
import ProfileNotifications from 'containers/Profile/components/ProfileNotifications';
import ProfileBadges from 'containers/Profile/components/ProfileBadges';
import Paper from 'components/layout/Paper';

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'grid',
    gridTemplateColumns: '250px 1fr',
    gridGap: theme.spacing(1),
    alignItems: 'self-start',
    marginTop: theme.spacing(-6),
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '1fr',
    },
  },
  logOutButton: {
    color: theme.palette.error.main,
  },
}));

const ProfileContent = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const logOut = useLogout();
  const { data: user } = useUser();
  const { allowAccess: isAdmin } = useHavePermission([PermissionApp.EVENT, PermissionApp.JOBPOST, PermissionApp.NEWS, PermissionApp.USER]);

  const logout = () => {
    window.gtag('event', 'log-out', {
      event_category: 'profile',
      event_label: `Logged out`,
    });
    logOut();
    navigate(URLS.landing);
  };

  const eventTab = { label: 'Arrangementer', icon: EventIcon };
  const notificationsTab = { label: 'Varsler', icon: NotificationsIcon, badge: user?.unread_notifications };
  const badgesTab = { label: 'Badges', icon: BadgesIcon };
  const groupsTab = { label: 'Grupper', icon: GroupsIcon };
  const settingsTab = { label: 'Innstillinger', icon: SettingsIcon };
  const adminTab = { label: 'Admin', icon: AdminIcon };
  const logoutTab = { label: 'Logg ut', icon: LogOutIcon, onClick: logout, className: classes.logOutButton };
  const tabs: Array<NavListItem> = [eventTab, notificationsTab, badgesTab, groupsTab, settingsTab, ...(isAdmin ? [adminTab] : [])];
  const [tab, setTab] = useState(eventTab.label);

  useEffect(() => {
    window.gtag('event', 'change-tab', {
      event_category: 'profile',
      event_label: `Changed tab to: ${tab}`,
    });
  }, [tab]);

  type NavListItem = {
    label: string;
    icon: React.ComponentType<SvgIconProps>;
    badge?: string | number;
    onClick?: () => void;
    className?: string;
  };

  const NavListItem = ({ label, icon: Icon, onClick, badge, className = '', ...props }: NavListItem) => (
    <ListItem
      button
      onClick={onClick ? onClick : () => setTab(label)}
      selected={tab === label}
      sx={{ px: { xs: 1, sm: 2 }, borderRadius: ({ shape }) => `${shape.borderRadius}px` }}
      {...props}>
      <ListItemIcon sx={{ minWidth: { xs: 32, sm: 40 } }}>
        <Badge badgeContent={badge} color='error'>
          <Icon className={className} color={tab === label ? 'primary' : 'inherit'} />
        </Badge>
      </ListItemIcon>
      <ListItemText primary={label} />
    </ListItem>
  );

  return (
    <div className={classes.content}>
      <Stack spacing={1}>
        <Paper noOverflow noPadding>
          <List aria-label='Profil innholdsliste' disablePadding sx={{ display: 'grid', gridTemplateColumns: { xs: '50% 50%', md: '1fr' } }}>
            {tabs.map((tab) => (
              <NavListItem {...tab} key={tab.label} />
            ))}
          </List>
        </Paper>
        <Paper noOverflow noPadding>
          <List aria-label='Logg ut' disablePadding>
            <NavListItem {...logoutTab} />
          </List>
        </Paper>
      </Stack>
      <div>
        <Collapse in={tab === eventTab.label}>
          <ProfileEvents />
        </Collapse>
        <Collapse in={tab === notificationsTab.label} mountOnEnter unmountOnExit>
          <ProfileNotifications />
        </Collapse>
        <Collapse in={tab === badgesTab.label} mountOnEnter>
          <ProfileBadges />
        </Collapse>
        <Collapse in={tab === groupsTab.label} mountOnEnter>
          <ProfileGroups />
        </Collapse>
        <Collapse in={tab === settingsTab.label} mountOnEnter>
          <Paper>{user && <ProfileSettings user={user} />}</Paper>
        </Collapse>
        <Collapse in={tab === adminTab.label} mountOnEnter>
          <ProfileAdmin />
        </Collapse>
      </div>
    </div>
  );
};

export default ProfileContent;

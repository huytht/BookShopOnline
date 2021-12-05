/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  AppBar,
  Badge,
  Box,
  Hidden,
  IconButton,
  Toolbar
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import InputIcon from '@material-ui/icons/Input';
import { useDispatch, useSelector } from 'react-redux';
import Logo from './Logo';
import { clearMessage } from '../actions/message';
import { history } from '../helpers/history';
import EventBus from '../common/EventBus';
import { logout } from '../actions/auth';
import Login from '../pages/Login';

const DashboardNavbar = ({ onMobileNavOpen, ...rest }) => {
  const [notifications] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);
  const dispatch = useDispatch();

  history.listen((location) => {
    dispatch(clearMessage()); // clear message when changing location
  });

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
      setShowAdminBoard(user.roles.includes('ROLE_ADMIN'));
    }

    EventBus.on('logout', () => {
      this.logOut();
    });
    return () => {
      EventBus.remove('logout');
    };
  });

  const logOut = () => {
    dispatch(logout());
    setShowAdminBoard(false);
    setCurrentUser(undefined);
  };

  return (
    <AppBar
      elevation={0}
      {...rest}
    >
      <Toolbar>
        <RouterLink to="/">
          <Logo />
        </RouterLink>
        <Box sx={{ flexGrow: 1 }} />
        <Hidden lgDown>
          <IconButton color="inherit">
            <Badge
              badgeContent={notifications.length}
              color="primary"
              variant="dot"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton LinkComponent={<Login />} onClick={logOut} color="inherit">
            <InputIcon />
          </IconButton>
        </Hidden>
        <Hidden lgUp>
          <IconButton
            color="inherit"
            onClick={onMobileNavOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

DashboardNavbar.propTypes = {
  onMobileNavOpen: PropTypes.func
};

export default DashboardNavbar;

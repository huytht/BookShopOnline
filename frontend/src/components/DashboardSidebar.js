import { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography
} from '@material-ui/core';
import {
  AlertCircle as AlertCircleIcon,
  BarChart as BarChartIcon,
  Lock as LockIcon,
  Settings as SettingsIcon,
  User as UserIcon,
  UserPlus as UserPlusIcon,
  Users as UsersIcon,
  Book as BookIcon,
  BookOpen as BookOpenIcon,
  CreditCard as CreditCardIcon,
  FileText as FileTextIcon,
  FileMinus as FileMinusIcon,
  BarChart2,
  Layers
} from 'react-feather';
import NavItem from './NavItem';

const items = [
  {
    href: '/dashboard',
    icon: BarChartIcon,
    title: 'Dashboard'
  },
  {
    href: '/admin/users',
    icon: UsersIcon,
    title: 'Users'
  },
  {
    href: '/admin/category',
    icon: BookIcon,
    title: 'Category'
  },
  {
    href: '/admin/book',
    icon: BookOpenIcon,
    title: 'Book'
  },
  {
    href: '/admin/book-details',
    icon: BookOpenIcon,
    title: 'Book Details'
  },
  {
    href: '/admin/payment',
    icon: CreditCardIcon,
    title: 'Payment'
  },
  {
    href: '/admin/order',
    icon: FileTextIcon,
    title: 'Order'
  },
  {
    href: '/admin/orderdetails',
    icon: FileMinusIcon,
    title: 'Order Details'
  },
  {
    href: '/admin/reviewbook',
    icon: BarChart2,
    title: 'Review Book'
  },
  {
    href: '/admin/publisher',
    icon: UsersIcon,
    title: 'Publisher'
  },
  {
    href: '/admin/totalrevenue',
    icon: Layers,
    title: 'Total Revenu'
  },
  {
    href: '/profile',
    icon: UserIcon,
    title: 'Profile'
  },
  {
    href: '/admin/account',
    icon: UserIcon,
    title: 'Account'
  },
  {
    href: '/settings',
    icon: SettingsIcon,
    title: 'Settings'
  },
  {
    href: '/login',
    icon: LockIcon,
    title: 'Login'
  },
  {
    href: '/register',
    icon: UserPlusIcon,
    title: 'Register'
  },
  {
    href: '/404',
    icon: AlertCircleIcon,
    title: 'Error'
  }
];

const DashboardSidebar = ({ onMobileClose, openMobile }) => {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          p: 2
        }}
      >
        <Avatar
          component={RouterLink}
          // src={user.avatar}
          sx={{
            cursor: 'pointer',
            width: 64,
            height: 64
          }}
          to="/account"
        />
        <Typography color="textPrimary" variant="h5">
          {user.username}
        </Typography>
        {/* <Typography
          color="textSecondary"
          variant="body2"
        >
          {user.jobTitle}
        </Typography> */}
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <List>
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
          PaperProps={{
            sx: {
              width: 256
            }
          }}
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden lgDown>
        <Drawer
          anchor="left"
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: 256,
              top: 64,
              height: 'calc(100% - 64px)'
            }
          }}
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

DashboardSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

DashboardSidebar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};

export default DashboardSidebar;

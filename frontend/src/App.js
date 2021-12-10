/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider, StyledEngineProvider } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import GlobalStyles from './components/GlobalStyles';
import theme from './theme';
import { routesAdmin } from './routes';
import EventBus from './common/EventBus';
import 'react-perfect-scrollbar/dist/css/styles.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.css';
// import { history } from './helpers/history';
// import { clearMessage } from './actions/message';
// import { logout } from './actions/auth';

const App = () => {
  // const { user, isLoggedIn } = useSelector((state) => state.auth);
  // const [showAdminBoard, setShowAdminBoard] = useState(false);
  // const [currentUser, setCurrentUser] = useState(undefined);
  // const dispatch = useDispatch();

  // history.listen((location) => {
  //   dispatch(clearMessage()); // clear message when changing location
  // });

  // useEffect(() => {
  //   if (user) {
  //     setCurrentUser(user);
  //     // setShowAdminBoard(user.roles.includes('ROLE_ADMIN'));
  //   }

  //   EventBus.on('logout', () => {
  //     this.logOut();
  //   });
  //   return () => {
  //     EventBus.remove('logout');
  //   };
  // });

  // const logOut = () => {
  //   dispatch(logout());
  //   setShowAdminBoard(false);
  //   setCurrentUser(undefined);
  // };

  const contentAdmin = useRoutes(routesAdmin());
  // const contentUser = useRoutes(routesUser(isLoggedIn));
  // const content = useRoutes(routes(isLoggedIn));

  return (
    <StyledEngineProvider injectFirst>
      {/* {currentUser && (
        <li className="nav-item">
          <a href="/login" className="nav-link" onClick={logOut}>
            LogOut
          </a>
        </li>
      )} */}
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {/* {!currentUser && content} */}
        {contentAdmin}
        {/* {currentUser && contentUser} */}
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;

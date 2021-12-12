import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  SET_MESSAGE,
} from "./types";

import AuthService from "../services/auth";

export const register = (userRegister) => (dispatch) => {
  return AuthService.register(userRegister).then(
    (response) => {
      if (response.status === 201) {
        dispatch({
          type: REGISTER_SUCCESS,
        });

        dispatch({
          type: SET_MESSAGE,
          payload: response.data.message,
        });

        return Promise.resolve();
      } else {
        const message =
          (response &&
            response.data &&
            response.data.message) ||
          response.message ||
          response.toString();

        dispatch({
          type: REGISTER_FAIL,
        });

        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });

        return Promise.reject();
      }
    }
  );
};

export const login = (username, password) => (dispatch) => {
  return AuthService.login(username, password).then((data) => {
    if (data.success === true) {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { user: data },
      });

      return Promise.resolve();
    } else {
      const message =
        (data.response && data.response.data && data.response.data.message) ||
        data.message ||
        data.toString();

      dispatch({
        type: LOGIN_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  });
};

export const logout = () => (dispatch) => {
  AuthService.logout();

  dispatch({
    type: LOGOUT,
  });
};

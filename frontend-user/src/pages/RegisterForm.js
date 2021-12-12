import {
  Grid
} from "@material-ui/core";
import { Avatar } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../actions/auth";
import { clearMessage } from "../actions/message";
import Form from 'react-validation/build/form';
import Input from "react-validation/build/input";
import CheckButton from 'react-validation/build/button';
import { Alert, Dialog } from "@mui/material";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

export const RegisterForm = () => {
  const avatarStyle = { backgroundColor: "#1bbd7e" };
  const btnstyle = { margin: "8px 0" };

  const { message } = useSelector((state) => state.message);
  let form = useRef();
  let checkBtn = useRef();
  const dispatch = useDispatch();
  

  const [value, setValue] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    password_confirm: "",
    loading: false,
  });

  const handleChange = (e) => {
    e.preventDefault();
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    setValue({
      ...value,
      loading: true,
    });

    form.validateAll();
    dispatch(clearMessage());

    if (checkBtn.context._errors.length === 0) {
      dispatch(register({
          firstName: value.firstName,
          lastName: value.lastName,
          username: value.username,
          email: value.email,
          password: value.password,
          password_confirm: value.password_confirm,
      }))
        .then(() => {
        //   navigate("/");
          localStorage.setItem("registered", true);
        })
        .catch(() => {
          setValue({
            ...value,
            loading: false,
          });
        });
    } else {
      setValue({
        ...value,
        loading: false,
      });
    }
  };
  return (
    <Grid>
      <Grid align="center">
        <Avatar style={avatarStyle} />
        <h2>ĐĂNG KÝ</h2>
      </Grid>
      <Form onSubmit={handleLogin} ref={(f) => (form = f)}>
        <label style={{ fontWeight: "bold" }} htmlFor="username">
          Tài khoản
        </label>
        <Input
          placeholder="Nhập tài khoản"
          className="form-control"
          onChange={handleChange}
          value={value.username}
          variant="outlined"
          name="username"
          type="text"
          validations={[required]}
          style={{ width: "100%" }}
        />
        <label style={{ fontWeight: "bold" }} htmlFor="username">
          Họ và tên đệm
        </label>
        <Input
          placeholder="Nhập họ và tên đệm"
          className="form-control"
          onChange={handleChange}
          value={value.lastName}
          variant="outlined"
          name="lastName"
          type="text"
          validations={[required]}
          style={{ width: "100%" }}
        />
        <label style={{ fontWeight: "bold" }} htmlFor="username">
          Tên
        </label>
        <Input
          placeholder="Nhập tên"
          className="form-control"
          onChange={handleChange}
          value={value.firstName}
          variant="outlined"
          name="firstName"
          type="text"
          validations={[required]}
          style={{ width: "100%" }}
        />
        <label style={{ fontWeight: "bold" }} htmlFor="username">
          Địa chỉ email
        </label>
        <Input
          placeholder="Nhập địa chỉ email"
          className="form-control"
          onChange={handleChange}
          value={value.email}
          variant="outlined"
          name="email"
          type="text"
          validations={[required]}
          style={{ width: "100%" }}
        />
        <label style={{ fontWeight: "bold" }} htmlFor="password">
          Mật khẩu
        </label>
        <Input
          placeholder="Nhập mật khẩu"
          type="password"
          onChange={handleChange}
          className="form-control"
          variant="outlined"
          name="password"
          value={value.password}
          validations={[required]}
          style={{ width: "100%" }}
        />
        <label style={{ fontWeight: "bold" }} htmlFor="password">
          Mật khẩu xác nhận
        </label>
        <Input
          placeholder="Nhập mật khẩu xác nhận"
          type="password"
          onChange={handleChange}
          className="form-control"
          variant="outlined"
          name="password_confirm"
          value={value.password_confirm}
          validations={[required]}
          style={{ width: "100%" }}
        />
        <Button
          type="submit"
          color="primary"
          variant="contained"
          style={btnstyle}
          fullWidth
          disabled={value.loading}
        >
          {value.loading && (
            <span className="spinner-border spinner-border-sm" />
          )}
          ĐĂNG KÝ
        </Button>
        {message && (
          <div className="form-group">
            <div className="alert alert-danger" role="alert">
              {message}
            </div>
          </div>
        )}
        <CheckButton
          style={{ display: "none" }}
          ref={(c) => {
            checkBtn = c;
          }}
          name="checkBtn"
        />
      </Form>
    </Grid>

  );
};

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid
} from '@material-ui/core';
import axios from 'axios';
import moment from 'moment';
import Controls from '../controls/Controls';
import { useForm, Form } from '../useForm';

const AuthLevel = [
  {
    value: 'customer',
    label: 'Customer'
  },
  {
    value: 'admin',
    label: 'Admin'
  }
];

const gender = [
  {
    value: 1,
    label: 'Nữ'
  },
  {
    value: 0,
    label: 'Nam'
  },
  {
    value: 2,
    label: 'Khác'
  }
];

const UserForm = () => {
  const initValues = {
    username: '',
    password: '',
    date_of_birth: '',
    registration_date: '',
    email: '',
    gender: 0,
    authLevel: 'customer'
  };
  const [userExist, setUserExist] = useState(false);

  const validate = () => {
    const temp = {};
    temp.username = userExist ? 'Username has exist.' : '';
    temp.password =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(
        values.password
      )
        ? ''
        : 'Password must be 6 to 16 character, at least a number and at least a special character.';
    temp.email = /$^|.+@.+..+/.test(values.email) ? '' : 'Email is not valid.';
    setErrors({
      ...temp
    });

    return Object.values(temp).every((x) => x === '');
  };

  const checkUserExist = () => {
    if (params.has('id')) {
      axios
        .get(
          `${process.env.REACT_APP_API_ENDPOINT}/user/check-user/${
            values.username
          }/${params.get('id')}`
        )
        .then((res) => setUserExist(res.data));
    } else {
      axios
        .get(
          `${process.env.REACT_APP_API_ENDPOINT}/user/check-user/${values.username}`
        )
        .then((res) => setUserExist(res.data));
    }
  };

  const params = new URL(document.location).searchParams;
  if (params.has('id')) {
    useEffect(() => {
      const fetchUserData = async () => {
        const response = await fetch(
          `${process.env.REACT_APP_API_ENDPOINT}/user/get-user/${params.get(
            'id'
          )}`
        );
        const fetchedUser = await response.json();
        fetchedUser.date_of_birth = moment
          .unix(fetchedUser.date_of_birth)
          .format('yyyy-MM-DD');
        setValues(fetchedUser);
      };
      fetchUserData();
      const interval = setInterval(1000);

      return () => {
        clearInterval(interval);
      };
    }, []);
  }

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(initValues, true, validate);

  const submitFormHandler = (event) => {
    event.preventDefault();
    if (validate()) {
      const dob = Math.floor(new Date(values.date_of_birth).getTime() / 1000);
      if (params.has('id')) {
        axios
          .put(
            `${
              process.env.REACT_APP_API_ENDPOINT
            }/user/update-user/${params.get('id')}`,
            {
              username: values.username,
              password: values.password,
              date_of_birth: dob,
              email: values.email,
              gender: parseInt(values.gender, 10),
              authLevel: values.authLevel
            }
          )
          .then((res) => console.log(res));
        window.alert('Update successfully!!');
      } else {
        const currentDate = Math.floor(new Date().getTime() / 1000);
        axios
          .post(`${process.env.REACT_APP_API_ENDPOINT}/user/create-user/`, {
            username: values.username,
            password: values.password,
            date_of_birth: dob,
            registration_date: currentDate,
            email: values.email,
            gender: parseInt(values.gender, 10),
            authLevel: values.authLevel
          })
          .then((res) => console.log(res));
        window.alert('Insert successfully!!');
        resetForm();
      }
    }
  };

  return (
    <Form onSubmit={submitFormHandler}>
      <Card>
        <CardHeader subheader="The information can be add" title="USER FORM" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <Controls.Input
                helperText="Username"
                label="Username"
                name="username"
                onChange={handleInputChange}
                required
                error={errors.username}
                InputLabelProps={{
                  shrink: true
                }}
                inputProps={params.has('id') ? { readOnly: true } : ''}
                value={values.username}
                variant="outlined"
                onBlur={() => {
                  checkUserExist();
                }}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Controls.Input
                helperText="Password"
                label="Password"
                name="password"
                type="password"
                error={errors.password}
                InputLabelProps={{
                  shrink: true
                }}
                onChange={handleInputChange}
                required
                value={values.password}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Controls.Input
                id="date"
                required
                name="date_of_birth"
                label="Date of birth"
                type="date"
                onChange={handleInputChange}
                value={values.date_of_birth}
                InputLabelProps={{
                  shrink: true
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Controls.Input
                label="Email Address"
                name="email"
                type="text"
                error={errors.email}
                InputLabelProps={{
                  shrink: true
                }}
                onChange={handleInputChange}
                required
                value={values.email}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Controls.Input
                label="Gender"
                name="gender"
                onChange={handleInputChange}
                select
                InputLabelProps={{
                  shrink: true
                }}
                SelectProps={{ native: true }}
                value={values.gender}
                variant="outlined"
              >
                {gender.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Controls.Input>
            </Grid>
            <Grid item md={6} xs={12}>
              <Controls.Input
                label="AuthLevel"
                name="authLevel"
                onChange={handleInputChange}
                select
                InputLabelProps={{
                  shrink: true
                }}
                SelectProps={{ native: true }}
                value={values.authLevel}
                variant="outlined"
              >
                {AuthLevel.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Controls.Input>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            p: 2
          }}
        >
          <Button type="submit" color="primary" variant="contained">
            Submit
          </Button>
        </Box>
      </Card>
    </Form>
  );
};

export default UserForm;

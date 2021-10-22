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

const BookForm = () => {
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
    setErrors({
      ...temp
    });

    return Object.values(temp).every((x) => x === '');
  };

  const checkUserExist = () => {
    axios
      .get(`http://localhost:8000/user/check-user/${values.username}`)
      .then((res) => setUserExist(res.data));
  };

  const params = new URL(document.location).searchParams;
  if (params.has('id')) {
    useEffect(() => {
      const fetchUserData = async () => {
        const response = await fetch(
          `http://localhost:8000/user/get-user/${params.get('id')}`
        );
        const fetchedUser = await response.json();
        fetchedUser.date_of_birth = moment
          .unix(fetchedUser.date_of_birth)
          .format('yyyy-MM-DD');
        setValues(fetchedUser);
      };
      fetchUserData();
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
          .put(`http://localhost:8000/user/update-user/${params.get('id')}`, {
            username: values.username,
            password: values.password,
            date_of_birth: dob,
            email: values.email,
            gender: parseInt(values.gender, 10),
            authLevel: values.authLevel
          })
          .then((res) => console.log(res));
      } else {
        const currentDate = Math.floor(new Date().getTime() / 1000);
        axios
          .post('http://localhost:8000/user/create-user/', {
            username: values.username,
            password: values.password,
            date_of_birth: dob,
            registration_date: currentDate,
            email: values.email,
            gender: parseInt(values.gender, 10),
            authLevel: values.authLevel
          })
          .then((res) => console.log(res));
      }
      resetForm();
    }
  };

  return (
    <Form onSubmit={submitFormHandler}>
      <Card>
        <CardHeader subheader="The information can be add" title="BOOK FORM" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <Controls.Input
                fullWidth
                helperText="ISBN"
                label="ISBN"
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
              {errors.length > 0 ? (
                <div className="has-error">{errors.join(', ')}</div>
              ) : null}
            </Grid>
            <Grid item md={6} xs={12}>
              <Controls.Input
                fullWidth
                helperText="Title"
                label="Title"
                name="password"
                type="text"
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
                fullWidth
                required
                helperText="Sumary_Content"
                label="Sumary_Content"
                name="date_of_birth"
                type="text"
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
                fullWidth
                label="Author"
                helperText="Author"
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
                fullWidth
                label="Pulished_date"
                name="gender"
                onChange={handleInputChange}
                type="date"
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
                fullWidth
                label="Price"
                name="password"
                type="numeric"
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
                fullWidth
                label="Image"
                name="password"
                type="file"
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
                fullWidth
                label="Category_Id"
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

export default BookForm;

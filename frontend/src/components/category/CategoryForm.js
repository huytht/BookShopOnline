import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField
} from '@material-ui/core';
import axios from 'axios';
import moment from 'moment';

const CategoryForm = () => {
  const [values, setValues] = useState({
    username: ''
  });

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

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const submitFormHandler = (event) => {
    event.preventDefault();
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
      // setValues('');
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
      // setValues('');
      // console.log();
    }
  };

  return (
    <form autoComplete="off" onSubmit={submitFormHandler}>
      <Card>
        <CardHeader subheader="The information can be add" title="CATEGORY FORM" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={12} xs={12}>
              <TextField
                fullWidth
                helperText="Name Category"
                label="Category"
                name="username"
                onChange={handleChange}
                required
                InputLabelProps={{
                  shrink: true
                }}
                value={values.username}
                variant="outlined"
              />
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
    </form>
  );
};

export default CategoryForm;

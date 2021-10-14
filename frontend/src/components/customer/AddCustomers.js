import { useState } from 'react';
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
    value: 'female',
    label: 'Female'
  },
  {
    value: 'male',
    label: 'Male'
  },
  {
    value: 'lgbt',
    label: 'LGBT'
  }
];

const AddCustomers = (props) => {
  const [values, setValues] = useState({
    username: 'Test',
    date_of_brith: '',
    email: 'abc@gmail.com',
    gender: 'Male',
    authlevel: 'Admin'
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  return (
    <form
      autoComplete="off"
      noValidate
      {...props}
    >
      <Card>
        <CardHeader
          subheader="The information can be add"
          title="ADD CUSTOMER"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                helperText="Please specify the first name"
                label="Username"
                name="username"
                onChange={handleChange}
                required
                value={values.username}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Date of brith"
                name="date_of_brith"
                type="date"
                onChange={handleChange}
                required
                value={values.date_of_brith}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="text"
                onChange={handleChange}
                required
                value={values.email}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Gender"
                name="gender"
                onChange={handleChange}
                select
                SelectProps={{ native: true }}
                value={values.gender}
                variant="outlined"
              >
                {gender.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="AuthLevel"
                name="authlevel"
                onChange={handleChange}
                required
                select
                SelectProps={{ native: true }}
                value={values.authlevel}
                variant="outlined"
              >
                {AuthLevel.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </TextField>
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
          <Button
            color="primary"
            variant="contained"
          >
            Add Customer
          </Button>
        </Box>
      </Card>
    </form>
  );
};

export default AddCustomers;

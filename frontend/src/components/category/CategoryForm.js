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

const CategoryForm = () => {
  const initValues = {
    name: ''
  };

  const [categoryExist, setCategoryExist] = useState(false);

  const validate = () => {
    const temp = {};
    temp.name = !values.name ? 'This field is required.' : categoryExist ? 'Name has exist.' : '';

    setErrors({
      ...temp
    });
    return Object.values(temp).every((x) => x === '');
  };

  const checkCategoryExist = () => {
    if (params.has('id')) {
      axios
        .get(
          `http://localhost:8000/category/check-category/${
            values.name
          }/${params.get('id')}`
        )
        .then((res) => setCategoryExist(res.data));
    } else {
      axios
        .get(`http://localhost:8000/category/check-category/${values.name}`)
        .then((res) => setCategoryExist(res.data));
    }
  };

  const params = new URL(document.location).searchParams;
  if (params.has('id')) {
    useEffect(() => {
      const fetchCategoryData = async () => {
        const response = await fetch(
          `http://localhost:8000/category/get-category/${params.get('id')}`
        );
        const fetchedCategory = await response.json();

        setValues(fetchedCategory);
      };
      fetchCategoryData();
    }, []);
  }

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(initValues, true, validate);

  const submitFormHandler = (event) => {
    event.preventDefault();
    if (validate()) {
      if (params.has('id')) {
        axios
          .put(
            `http://localhost:8000/category/update-category/${params.get(
              'id'
            )}`,
            {
              name: values.name
            }
          )
          .then((res) => console.log(res));
        window.alert('Update successfully!!');
      } else {
        axios
          .post('http://localhost:8000/category/create-category/', {
            name: values.name
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
        <CardHeader
          subheader="The information can be add"
          title="CATEGORY FORM"
        />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={12} xs={12}>
              <Controls.Input
                helperText="Name Category"
                label="Name"
                name="name"
                error={errors.name}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true
                }}
                value={values.name}
                variant="outlined"
                onBlur={() => {
                  checkCategoryExist();
                }}
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
    </Form>
  );
};

export default CategoryForm;

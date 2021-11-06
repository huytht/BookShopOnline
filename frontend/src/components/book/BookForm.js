import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Checkbox,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  FormHelperText
} from '@material-ui/core';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import axios from 'axios';
import moment from 'moment';
import Controls from '../controls/Controls';
import { useForm, Form } from '../useForm';
import { storage } from '../../firebase';

const initValues = {
  isbn: '',
  title: '',
  summary_content: '',
  author: '',
  published_date: '',
  price: 0,
  image: '',
  category_id: [],
  isSold: false
};

const BookForm = () => {
  const [bookExist, setBookExist] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [defaultVal, setDefaultVal] = useState([]);
  const [loading, setLoading] = useState(false);
  const animatedComponents = makeAnimated();

  const validate = (fieldValues = values) => {
    const temp = {};
    temp.isbn = !fieldValues.isbn
      ? 'This field is required.'
      : bookExist
      ? 'ISBN has exist.'
      : '';
    temp.title = fieldValues.title ? '' : 'This field is required.';
    temp.summary_content = fieldValues.summary_content
      ? ''
      : 'This field is required.';
    temp.author = fieldValues.author ? '' : 'This field is required.';
    temp.published_date = fieldValues.published_date
      ? ''
      : 'This field is required.';
    temp.category_id =
      selectedCategories.length !== 0 ? '' : 'This field is required.';

    temp.price = !/^\d+$/.test(fieldValues.price)
      ? 'Price must be number.'
      : fieldValues.price <= 0
      ? 'Price must be greater than 0.'
      : '';

    setErrors({
      ...temp
    });
    if (fieldValues === values) {
      return Object.values(temp).every((x) => x === '');
    }
  };
  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(initValues, true, validate);

  // Read all category
  useEffect(() => {
    axios.get('http://localhost:8000/category/').then((res) => {
      setCategories(res.data);
    });
  }, []);

  // HandleChange for dropdown multiselect
  const handleChange = (e) => {
    setSelectedCategories(e);
  };

  // HandleChange for choose file
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const Category = () => {
    return categories.map((category) => ({
      label: category.name,
      value: category._id
    }));
  };

  const checkBookExist = () => {
    axios
      .get(`http://localhost:8000/book/check-book/${values.isbn}`)
      .then((res) => setBookExist(res.data));
  };

  const params = new URL(document.location).searchParams;
  if (params.has('id')) {
    useEffect(() => {
      const fetchBookData = async () => {
        const response = await fetch(
          `http://localhost:8000/book/get-book/${params.get('id')}`
        );
        const fetchedBook = await response.json();
        fetchedBook.published_date = moment
          .unix(fetchedBook.published_date)
          .format('yyyy-MM-DD');
        setValues(fetchedBook);
      };
      fetchBookData();
    }, []);
  }

  const getDefaultCategory = () => {
    if (defaultVal !== []) {
      return defaultVal.map((category) => ({
        label: category.name,
        value: category._id
      }));
    }
  };

  useEffect(() => {
    setDefaultVal([]);
    setLoading(true);
  }, [loading]);

  useEffect(() => {
    if (defaultVal.length > 0) {
      console.log(getDefaultCategory());
      setSelectedCategories(getDefaultCategory());
    } else if (params.has('id') && !defaultVal.length) {
      axios
        .post('http://localhost:8000/category/get-list-category/', {
          idList: values.category_id
        })
        .then((res) => {
          setDefaultVal(res.data);
        })
        .catch((error) => {
          console.log(error.response);
        });
      console.log(defaultVal);
    }
  }, [defaultVal]);

  const submitFormHandler = (event) => {
    event.preventDefault();
    console.log(errors.category_id);
    if (validate()) {
      const pd = Math.floor(new Date(values.published_date).getTime() / 1000);
      if (params.has('id')) {
        axios
          .put(`http://localhost:8000/book/update-book/${params.get('id')}`, {
            isbn: values.isbn,
            title: values.title,
            summary_content: values.summary_cotent,
            author: values.author,
            published_date: pd,
            price: parseInt(values.price, 10),
            image: image.name,
            category_id: selectedCategories.map((item) => item.value),
            isSold: values.isSold
          })
          .then((res) => console.log(res));
      } else {
        const currentDate = Math.floor(new Date().getTime() / 1000);
        const uploadBook = storage.ref(`book/${image.name}`).put(image);
        axios
          .post('http://localhost:8000/book/create-book/', {
            isbn: values.isbn,
            title: values.title,
            summary_content: values.summary_content,
            author: values.author,
            published_date: pd,
            price: parseInt(values.price, 10),
            image: image.name,
            category_id: selectedCategories.map((item) => item.value),
            isSold: values.isSold
          })
          .then((res) => console.log(res));
        // Upload image book
        uploadBook.on(
          'state_changed',
          (snapshot) => {},
          (error) => {
            console.log(error);
          },
          () => {
            storage
              .ref('book')
              .child(image.name)
              .getDownloadURL()
              .then((urlImage) => {
                console.log(urlImage);
              });
          }
        );
      }
      // resetForm();
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
                label="ISBN"
                name="isbn"
                onChange={handleInputChange}
                error={errors.isbn}
                InputLabelProps={{
                  shrink: true
                }}
                value={values.isbn}
                variant="outlined"
                onBlur={() => {
                  checkBookExist();
                }}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Controls.Input
                label="Title"
                name="title"
                type="text"
                error={errors.title}
                InputLabelProps={{
                  shrink: true
                }}
                onChange={handleInputChange}
                value={values.title}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Controls.Input
                label="Summary Content"
                name="summary_content"
                type="text"
                rowsmax={3}
                rows={2}
                multiline
                onChange={handleInputChange}
                value={values.summary_content}
                InputLabelProps={{
                  shrink: true
                }}
                error={errors.summary_content}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Controls.Input
                label="Author"
                name="author"
                type="text"
                error={errors.author}
                InputLabelProps={{
                  shrink: true
                }}
                onChange={handleInputChange}
                value={values.author}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Controls.Input
                label="Published Date"
                name="published_date"
                onChange={handleInputChange}
                type="date"
                InputLabelProps={{
                  shrink: true
                }}
                error={errors.published_date}
                SelectProps={{ native: true }}
                value={values.published_date}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Controls.Input
                label="Price"
                name="price"
                type="numeric"
                error={errors.price}
                InputLabelProps={{
                  shrink: true
                }}
                onChange={handleInputChange}
                value={values.price}
                variant="outlined"
              />
            </Grid>
            {params.has('id') ? (
              <Grid item md={6} xs={12}>
                <p>&nbsp;Image (current)</p>
                <img
                  width="100px"
                  height="100px"
                  src={`https://firebasestorage.googleapis.com/v0/b/bookshoponline-85349.appspot.com/o/book%2F${values.image}?alt=media`}
                  alt=""
                />
              </Grid>
            ) : (
              ''
            )}
            <Grid item md={6} xs={12}>
              <p>&nbsp;Category</p>
              <Select
                className="dropdown"
                placeholder="Choose category"
                value={selectedCategories}
                options={Category()}
                components={animatedComponents}
                onChange={handleChange}
                isMulti
                isClearable
              />
              <FormHelperText style={{ color: '#d32f2f' }}>
                &nbsp;&nbsp;&nbsp;
                {errors.category_id ? errors.category_id : ''}
              </FormHelperText>
            </Grid>
            <Grid item md={6} xs={12}>
              <Controls.Input
                label="Image"
                name="image"
                type="file"
                InputLabelProps={{
                  shrink: true
                }}
                onChange={handleFileChange}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Controls.Input
                label="Is Sold"
                name="isSold"
                select
                InputLabelProps={{
                  shrink: true
                }}
                onChange={handleInputChange}
                SelectProps={{
                  native: true
                }}
                value={values.isSold}
                variant="outlined"
              >
                <option value="true">True</option>
                <option value="false">False</option>
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

/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  FormHelperText
} from '@material-ui/core';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import Controls from '../controls/Controls';
import { useForm, Form } from '../useForm';
import { storage } from '../../firebase';

const initValues = {
  title: '',
  summary_content: '',
  author: '',
  price: 0,
  image: '',
  publisher_id: 1,
  category_id: []
};

const BookForm = () => {
  const [bookExist, setBookExist] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [defaultVal, setDefaultVal] = useState([]);
  const [loading, setLoading] = useState(false);
  const animatedComponents = makeAnimated();
  const [publishers, setPublishers] = useState([]);
  const navigate = useNavigate();

  const validate = (fieldValues = values) => {
    const temp = {};
    temp.title = !fieldValues.title
      ? 'This field is required.'
      : bookExist
      ? 'This title has exist'
      : '';
    temp.summary_content = fieldValues.summary_content
      ? ''
      : 'This field is required.';
    temp.author = fieldValues.author ? '' : 'This field is required.';
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
    axios.get(`${process.env.REACT_APP_API_ENDPOINT}/category/`).then((res) => {
      setCategories(res.data);
    });
    const interval = setInterval(1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Read all publisher
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/publisher/`)
      .then((res) => {
        setPublishers(res.data);
      });
    const interval = setInterval(1000);

    return () => {
      clearInterval(interval);
    };
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
    if (!params.has('id')) {
      axios
        .get(
          `${process.env.REACT_APP_API_ENDPOINT}/book/check-book/${values.title}`
        )
        .then((res) => setBookExist(res.data));
    } else {
      axios
        .get(
          `${process.env.REACT_APP_API_ENDPOINT}/book/check-book/${
            values.title
          }/${params.get('id')}`
        )
        .then((res) => setBookExist(res.data));
    }
  };

  const params = new URL(document.location).searchParams;
  if (params.has('id')) {
    useEffect(() => {
      const fetchBookData = async () => {
        const response = await fetch(
          `${process.env.REACT_APP_API_ENDPOINT}/book/get-book/${params.get(
            'id'
          )}`
        );
        const fetchedBook = await response.json();
        fetchedBook.published_date = moment
          .unix(fetchedBook.published_date)
          .format('yyyy-MM-DD');
        setValues(fetchedBook);
      };
      fetchBookData();
      const interval = setInterval(1000);

      return () => {
        clearInterval(interval);
      };
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
    if (values.title !== '') checkBookExist();
    const interval = setInterval(1000);

    return () => {
      clearInterval(interval);
    };
  }, [values.title]);

  useEffect(() => {
    setDefaultVal([]);
    setLoading(true);
    const interval = setInterval(1000);

    return () => {
      clearInterval(interval);
    };
  }, [loading]);

  useEffect(() => {
    if (defaultVal.length > 0) {
      setSelectedCategories(getDefaultCategory());
    } else if (params.has('id') && !defaultVal.length) {
      axios
        .post(
          `${process.env.REACT_APP_API_ENDPOINT}/category/get-list-category/`,
          {
            idList: values.category_id
          }
        )
        .then((res) => {
          setDefaultVal(res.data);
        })
        .catch((error) => {
          console.log(error.response);
        });
      console.log(defaultVal);
    }
    const interval = setInterval(1000);

    return () => {
      clearInterval(interval);
    };
  }, [defaultVal]);

  const submitFormHandler = (event) => {
    event.preventDefault();
    if (validate()) {
      if (params.has('id')) {
        axios
          .put(
            `${
              process.env.REACT_APP_API_ENDPOINT
            }/book/update-book/?id=${params.get('id')}`,
            {
              title: values.title,
              summary_content: values.summary_cotent,
              author: values.author,
              price: parseInt(values.price, 10),
              image: image === null ? values.image : image.name,
              publisher_id: values.publisher_id,
              category_id: selectedCategories.map((item) => item.value)
            }
          )
          .then((res) => console.log(res));
        navigate('/admin/book');
      } else {
        axios
          .post(`${process.env.REACT_APP_API_ENDPOINT}/book/create-book/`, {
            title: values.title,
            summary_content: values.summary_content,
            author: values.author,
            price: parseInt(values.price, 10),
            image: image.name,
            publisher_id: values.publisher_id,
            category_id: selectedCategories.map((item) => item.value)
          })
          .then((res) => console.log(res));
      }
      if (image !== null) {
        // Upload image book
        const uploadBook = storage.ref(`book/${image.name}`).put(image);
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
      navigate('/admin/book');
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
              <Controls.Input
                label="Choose publisher"
                name="publisher_id"
                key={values.publisher_id}
                select
                InputLabelProps={{
                  shrink: true
                }}
                onChange={handleInputChange}
                SelectProps={{
                  native: true
                }}
                value={values.publisher_id}
                variant="outlined"
              >
                {publishers.map((publisher) => (
                  <option key={publisher._id} value={publisher._id}>
                    {publisher.name}
                  </option>
                ))}
              </Controls.Input>
            </Grid>
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
              {params.has('id') ? (
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
              ) : (
                <Controls.Input
                  label="Image"
                  name="image"
                  type="file"
                  required
                  InputLabelProps={{
                    shrink: true
                  }}
                  onChange={handleFileChange}
                  variant="outlined"
                />
              )}
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

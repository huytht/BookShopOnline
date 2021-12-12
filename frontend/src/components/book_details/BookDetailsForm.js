/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
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
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import Controls from '../controls/Controls';
import { useForm, Form } from '../useForm';

const initValues = {
  isbn: '',
  published_date: '',
  book_id: 1,
  isSold: false
};

const BookDetailForm = () => {
  const [bookExist, setBookExist] = useState(false);
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  const validate = (fieldValues = values) => {
    const temp = {};
    temp.isbn = !fieldValues.isbn
      ? 'This field is required.'
      : bookExist
      ? 'ISBN has exist.'
      : '';
    temp.published_date = fieldValues.published_date
      ? ''
      : 'This field is required.';
    temp.book_id = fieldValues.book_id !== 0 ? '' : 'This field is required.';

    setErrors({
      ...temp
    });
    if (fieldValues === values) {
      return Object.values(temp).every((x) => x === '');
    }
  };
  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(initValues, true, validate);

  // Read all book
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_ENDPOINT}/book/`).then((res) => {
      setBooks(res.data);
    });
    const interval = setInterval(1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (values.isbn !== '') {
      checkBookExist();
    }
    const interval = setInterval(1000);

    return () => {
      clearInterval(interval);
    };
  }, [values.isbn]);

  const checkBookExist = () => {
    if (!params.has('id')) {
      axios
        .get(
          `${process.env.REACT_APP_API_ENDPOINT}/book-detail/check-book-detail/${values.book_id}/${values.isbn}`
        )
        .then((res) => setBookExist(res.data));
    } else {
      axios
        .get(
          `${
            process.env.REACT_APP_API_ENDPOINT
          }/book-detail/check-book-detail/${values.book_id}/${
            values.isbn
          }/${params.get('id')}`
        )
        .then((res) => setBookExist(res.data));
    }
  };

  const params = new URL(document.location).searchParams;
  if (params.has('id')) {
    useEffect(() => {
      const fetchBookDetailsData = async () => {
        const response = await fetch(
          `${
            process.env.REACT_APP_API_ENDPOINT
          }/book-detail/get-book-detail/${params.get('id')}`
        );
        const fetchedBookDetail = await response.json();
        fetchedBookDetail.published_date = moment
          .unix(fetchedBookDetail.published_date)
          .format('yyyy-MM-DD');
        setValues(fetchedBookDetail);
      };
      fetchBookDetailsData();
      const interval = setInterval(1000);

      return () => {
        clearInterval(interval);
      };
    }, []);
  }

  const submitFormHandler = (event) => {
    event.preventDefault();
    if (validate()) {
      const pd = Math.floor(new Date(values.published_date).getTime() / 1000);
      if (params.has('id')) {
        axios
          .put(
            `${
              process.env.REACT_APP_API_ENDPOINT
            }/book-detail/update-book-detail/${params.get('id')}`,
            {
              isbn: values.isbn,
              published_date: pd,
              book_id: values.book_id,
              isSold: values.isSold
            }
          )
          .then((res) => console.log(res));
        navigate('/admin/book-details');
      } else {
        axios
          .post(
            `${process.env.REACT_APP_API_ENDPOINT}/book-detail/create-book-detail/`,
            {
              isbn: values.isbn,
              published_date: pd,
              book_id: values.book_id,
              isSold: values.isSold
            }
          )
          .then((res) => console.log(res));
        navigate('/admin/book-details');
      }
      // resetForm();
    }
  };

  return (
    <Form onSubmit={submitFormHandler}>
      <Card>
        <Grid container spacing={6}>
          <Grid item md={9} xs={12}>
            <CardHeader
              subheader="The information can be add"
              title="BOOK DETAIL FORM"
            />
          </Grid>
          <Grid item md={3} xs={12}>
            <CardHeader
              subheader={
                // eslint-disable-next-line react/jsx-wrap-multilines
                <Button
                  color="primary"
                  variant="contained"
                  component={RouterLink}
                  to="/admin/book-form"
                >
                  Add new book
                </Button>
              }
              title="BOOK DOESN'T EXIST?"
            />
          </Grid>
        </Grid>
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <Controls.Input
                label="Choose book"
                name="book_id"
                key={values.book_id}
                select
                InputLabelProps={{
                  shrink: true
                }}
                onChange={handleInputChange}
                SelectProps={{
                  native: true
                }}
                value={values.book_id}
                variant="outlined"
              >
                {books.map((book) => (
                  <option key={book._id} value={book._id}>
                    {book.title}
                  </option>
                ))}
              </Controls.Input>
            </Grid>
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
                label="Status"
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
                <option value="true">Sold</option>
                <option value="false">Available</option>
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

export default BookDetailForm;

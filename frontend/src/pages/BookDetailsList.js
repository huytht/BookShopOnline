import { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import BookDetailsListToolbar from '../components/book_details/BookDetailsListToolbar';
import BookDetailsListResult from '../components/book_details/BookDetailsListResult';

const BookList = () => {
  const [books, setBooks] = useState([]);
  // Read all book
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_ENDPOINT}/book-detail/`).then((res) => setBooks(res.data));
    const interval = setInterval(books, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [books]);
  return (
    <>
      <Helmet>
        <title>Books | Material Kit</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <BookDetailsListToolbar />
          <Box sx={{ pt: 3 }}>
            <BookDetailsListResult books={books} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default BookList;

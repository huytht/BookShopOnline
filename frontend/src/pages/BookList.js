import { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import BookListToolbar from '../components/book/BookListToolbar';
import BookListResult from '../components/book/BookListResult';

const BookList = () => {
  const [books, setBooks] = useState([]);
  // Read all book
  useEffect(() => {
    axios.get('http://localhost:8000/book/').then((res) => setBooks(res.data));
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
          <BookListToolbar />
          <Box sx={{ pt: 3 }}>
            <BookListResult books={books} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default BookList;

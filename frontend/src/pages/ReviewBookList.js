import { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import ReviewBookResult from '../components/reviewbook/ReviewBookResult';
import ReviewBookToolbar from '../components/reviewbook/ReviewBookToolbar';

const ReviewBookList = () => {
  const [reviews, setReviews] = useState([]);
  // Read all review
  useEffect(() => {
    axios.get('http://localhost:8000/review/').then((res) => {
      setReviews(res.data);
    });
    const interval = setInterval(reviews, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [reviews]);
  return (
    <>
      <Helmet>
        <title>Order Details | Material Kit</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <ReviewBookToolbar />
          <Box sx={{ pt: 3 }}>
            <ReviewBookResult reviews={reviews} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ReviewBookList;

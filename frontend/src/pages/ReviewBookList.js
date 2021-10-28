import { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import ReviewBookResult from '../components/reviewbook/ReviewBookResult';
import ReviewBookToolbar from '../components/reviewbook/ReviewBookToolbar';

const ReviewBookList = () => {
  const [users, setUsers] = useState([]);
  // Read all user
  useEffect(() => {
    axios.get('http://localhost:8000/user/').then((res) => {
      setUsers(res.data);
    });
    const interval = setInterval(users, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [users]);
  return (
    <>
      <Helmet>
        <title>Invoice Details | Material Kit</title>
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
            <ReviewBookResult users={users} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ReviewBookList;

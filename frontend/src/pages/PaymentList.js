import { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import PaymentToolbar from '../components/payment/PaymentToolbar';
import PaymentResult from '../components/payment/PaymentResult';

const PaymentList = () => {
  const [categories, setCategories] = useState([]);
  // Read all category
  useEffect(() => {
    axios.get('http://localhost:8000/category/').then((res) => {
      setCategories(res.data);
    });
    const interval = setInterval(categories, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [categories]);
  return (
    <>
      <Helmet>
        <title>Payment | Material Kit</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <PaymentToolbar />
          <Box sx={{ pt: 3 }}>
            <PaymentResult categories={categories} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default PaymentList;

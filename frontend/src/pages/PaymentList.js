import { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import PaymentToolbar from '../components/payment/PaymentToolbar';
import PaymentResult from '../components/payment/PaymentResult';

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  // Read all payment
  useEffect(() => {
    axios.get('http://localhost:8000/payment/').then((res) => {
      setPayments(res.data);
    });
    const interval = setInterval(payments, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [payments]);
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
            <PaymentResult payments={payments} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default PaymentList;

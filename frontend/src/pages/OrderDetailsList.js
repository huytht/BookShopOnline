import { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import OrderDetailsResult from '../components/order_details/OrderDetailsResult';
import OrderDetailsToolbar from '../components/order_details/OrderDetailsToolbar';

const OrderDetailsList = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  // Read all orderDetail
  useEffect(() => {
    axios.get('http://localhost:8000/order-detail/').then((res) => {
      setOrderDetails(res.data);
    });
    const interval = setInterval(orderDetails, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [orderDetails]);
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
          <OrderDetailsToolbar />
          <Box sx={{ pt: 3 }}>
            <OrderDetailsResult orderDetails={orderDetails} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default OrderDetailsList;

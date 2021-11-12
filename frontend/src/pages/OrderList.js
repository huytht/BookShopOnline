import { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import OrderResult from '../components/order/OrderResult';
import OrderToolbar from '../components/order/OrderToolbar';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  // Read all order
  useEffect(() => {
    axios.get('http://localhost:8000/order/').then((res) => {
      setOrders(res.data);
    });
    const interval = setInterval(orders, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [orders]);
  return (
    <>
      <Helmet>
        <title>Order | Material Kit</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <OrderToolbar />
          <Box sx={{ pt: 3 }}>
            <OrderResult orders={orders} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default OrderList;

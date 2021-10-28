import { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import InvoiceResult from '../components/invoice/InvoiceResult';
import InvoiceToolbar from '../components/invoice/InvoiceToolbar';

const InvoiceList = () => {
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
        <title>Invoice | Material Kit</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <InvoiceToolbar />
          <Box sx={{ pt: 3 }}>
            <InvoiceResult users={users} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default InvoiceList;

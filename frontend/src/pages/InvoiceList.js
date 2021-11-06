import { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import InvoiceResult from '../components/invoice/InvoiceResult';
import InvoiceToolbar from '../components/invoice/InvoiceToolbar';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  // Read all invoice
  useEffect(() => {
    axios.get('http://localhost:8000/invoice/').then((res) => {
      setInvoices(res.data);
    });
    const interval = setInterval(invoices, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [invoices]);
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
            <InvoiceResult invoices={invoices} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default InvoiceList;

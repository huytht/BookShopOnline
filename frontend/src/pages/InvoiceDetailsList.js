import { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import InvoiceDetailsResult from '../components/invoice_details/InvoiceDetailsResult';
import InvoiceDetailsToolbar from '../components/invoice_details/InvoiceDetailsToolbar';

const InvoiceDetailsList = () => {
  const [invoiceDetails, setInvoiceDetails] = useState([]);
  // Read all invoiceDetail
  useEffect(() => {
    axios.get('http://localhost:8000/invoice-detail/').then((res) => {
      setInvoiceDetails(res.data);
    });
    const interval = setInterval(invoiceDetails, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [invoiceDetails]);
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
          <InvoiceDetailsToolbar />
          <Box sx={{ pt: 3 }}>
            <InvoiceDetailsResult invoiceDetails={invoiceDetails} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default InvoiceDetailsList;

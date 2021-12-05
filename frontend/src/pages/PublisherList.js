import { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import PublisherResult from '../components/publisher/PublisherResult';
import PublisherToolbar from '../components/publisher/PublisherToolbar';

const PublisherList = () => {
  const [publishers, setPublishers] = useState([]);
  // Read all publisher
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_ENDPOINT}/publisher/`).then((res) => {
      setPublishers(res.data);
    });
    const interval = setInterval(publishers, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [publishers]);
  return (
    <>
      <Helmet>
        <title>Publisher | Material Kit</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <PublisherToolbar />
          <Box sx={{ pt: 3 }}>
            <PublisherResult publishers={publishers} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default PublisherList;

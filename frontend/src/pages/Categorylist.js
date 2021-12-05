import { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import CategoryResult from '../components/category/CategoryResult';
import CategoryToolbar from '../components/category/CategoryToolbar';

const Categorylist = () => {
  const [categories, setCategories] = useState([]);
  // Read all category
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_ENDPOINT}/category/`).then((res) => {
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
        <title>Category | Material Kit</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <CategoryToolbar />
          <Box sx={{ pt: 3 }}>
            <CategoryResult categories={categories} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Categorylist;

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import CategoryResult from '../components/category/CategoryResult';
import CategoryToolbar from '../components/category/CategoryToolbar';

const Categorylist = () => {
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
            <CategoryResult users={users} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Categorylist;

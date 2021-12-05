import { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import UserListResults from '../components/user/UserListResults';
import UserListToolbar from '../components/user/UserListToolbar';

const UserList = () => {
  const [users, setUsers] = useState([]);
  // Read all user
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_ENDPOINT}/user/`).then((res) => {
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
        <title>Users | Material Kit</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <UserListToolbar />
          <Box sx={{ pt: 3 }}>
            <UserListResults users={users} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default UserList;

import { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow
} from '@material-ui/core';
import axios from 'axios';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const UserListResults = ({ users }) => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const deleteUserHandler = (id) => {
    axios
      .delete(`${process.env.REACT_APP_API_ENDPOINT}/user/delete-user/${id}`)
      .then((res) => console.log(res));
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Card>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Avatar</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Date of birth</TableCell>
                <TableCell>Registration date</TableCell>
                <TableCell>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.slice(page * limit, page * limit + limit).map((user) => (
                <TableRow hover key={user._id}>
                  <TableCell>
                    <LazyLoadImage
                      // effect="blur"
                      width="100px"
                      height="100px"
                      src={`https://firebasestorage.googleapis.com/v0/b/bookshoponline-85349.appspot.com/o/user%2F${user.avatar}?alt=media`}
                      alt=""
                      placeholderSrc={`${process.env.PUBLIC_URL}/static/images/default.png`}
                    />
                  </TableCell>
                  <TableCell>{user.fullname}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.gender === 0
                      ? 'Nam'
                      : user.gender === 1
                      ? 'Nữ'
                      : 'Khác'}
                  </TableCell>
                  <TableCell>
                    {moment.unix(user.date_of_birth).format('DD/MM/yyyy')}
                  </TableCell>
                  <TableCell>
                    {moment.unix(user.registration_date).format('DD/MM/yyyy')}
                  </TableCell>
                  <TableCell>
                    {/* <IconButton
                      component={RouterLink}
                      to={`/admin/user-form?id=${user._id}`}
                    >
                      <EditIcon />
                    </IconButton> */}
                    <IconButton
                      onClick={() => {
                        deleteUserHandler(user._id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={users.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

UserListResults.propTypes = {
  users: PropTypes.array.isRequired
};

export default UserListResults;

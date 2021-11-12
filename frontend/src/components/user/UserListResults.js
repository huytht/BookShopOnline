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

const UserListResults = ({ users }) => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const deleteUserHandler = (id) => {
    axios
      .delete(`http://localhost:8000/user/delete-user/${id}`)
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
                <TableCell>Full Name</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Date of birth</TableCell>

                <TableCell>Registration date</TableCell>
                <TableCell>AuthLevel</TableCell>
                <TableCell colSpan={2} style={{ textAlign: 'center' }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.slice(0, limit).map((user) => (
                <TableRow hover key={user._id}>
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
                  <TableCell>{user.authLevel}</TableCell>
                  <TableCell>
                    <IconButton
                      component={RouterLink}
                      to={`/app/user-form?id=${user._id}`}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
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

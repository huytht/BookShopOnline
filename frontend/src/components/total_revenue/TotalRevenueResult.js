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

const TotalRevenueResult = ({ users }) => {
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleSelectAll = (event) => {
    let newSelectedUserIds;

    if (event.target.checked) {
      newSelectedUserIds = users.map((user) => user.id);
    } else {
      newSelectedUserIds = [];
    }

    setSelectedUserIds(newSelectedUserIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedUserIds.indexOf(id);
    let newSelectedUserIds = [];

    if (selectedIndex === -1) {
      newSelectedUserIds = newSelectedUserIds.concat(selectedUserIds, id);
    } else if (selectedIndex === 0) {
      newSelectedUserIds = newSelectedUserIds.concat(selectedUserIds.slice(1));
    } else if (selectedIndex === selectedUserIds.length - 1) {
      newSelectedUserIds = newSelectedUserIds.concat(
        selectedUserIds.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedUserIds = newSelectedUserIds.concat(
        selectedUserIds.slice(0, selectedIndex),
        selectedUserIds.slice(selectedIndex + 1)
      );
    }

    setSelectedUserIds(newSelectedUserIds);
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
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedUserIds.length === users.length}
                    color="primary"
                    indeterminate={
                      selectedUserIds.length > 0 &&
                      selectedUserIds.length < users.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Month</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.slice(0, limit).map((user) => (
                <TableRow
                  hover
                  key={user._id}
                  selected={selectedUserIds.indexOf(user._id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedUserIds.indexOf(user._id) !== -1}
                      onChange={(event) => handleSelectOne(event, user._id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.gender === 0
                      ? 'Nam'
                      : user.gender === 1
                      ? 'Nữ'
                      : 'Khác'}
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

TotalRevenueResult.propTypes = {
  users: PropTypes.array.isRequired
};

export default TotalRevenueResult;

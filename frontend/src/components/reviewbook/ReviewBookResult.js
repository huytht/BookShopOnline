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

const ReviewBookResult = ({ reviews }) => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

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
                <TableCell>Username</TableCell>
                <TableCell>Title book</TableCell>
                <TableCell>Rate</TableCell>
                <TableCell>Remark</TableCell>
                <TableCell>Favourite</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reviews.slice(page * limit, page * limit + limit).map((review) => (
                <TableRow hover key={review._id}>
                  <TableCell>{review.user_username}</TableCell>
                  <TableCell>{review.book_title}</TableCell>
                  <TableCell>{review.rate}</TableCell>
                  <TableCell>{review.remark}</TableCell>
                  <TableCell>{review.favourite ? 'true' : 'false'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={reviews.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

ReviewBookResult.propTypes = {
  reviews: PropTypes.array.isRequired
};

export default ReviewBookResult;

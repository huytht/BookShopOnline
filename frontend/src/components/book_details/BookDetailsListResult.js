import { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link as RouterLink } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import {
  Box,
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow
} from '@material-ui/core';
import axios from 'axios';

const BookListResult = ({ books }) => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const deleteBookHandler = (id) => {
    axios
      .delete(`${process.env.REACT_APP_API_ENDPOINT}/book-detail/delete-book-detail/${id}`)
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
                <TableCell>Title</TableCell>
                <TableCell>ISBN</TableCell>
                <TableCell>Published Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {books.slice(page * limit, page * limit + limit).map((book) => (
                <TableRow hover key={book._id}>
                  <TableCell>{book.book.title}</TableCell>
                  <TableCell>{book.isbn}</TableCell>
                  <TableCell>
                    {moment.unix(book.published_date).format('DD/MM/yyyy')}
                  </TableCell>
                  <TableCell>{book.isSold ? 'SOLD' : 'AVAILABLE'}</TableCell>
                  <TableCell>
                    <IconButton
                      component={RouterLink}
                      to={`/admin/book-details-form?id=${book._id}`}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        deleteBookHandler(book._id);
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
        count={books.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

BookListResult.propTypes = {
  books: PropTypes.array.isRequired
};

export default BookListResult;

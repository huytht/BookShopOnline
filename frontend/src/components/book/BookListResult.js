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

const BookListResult = ({ books }) => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const deleteBookHandler = (id) => {
    axios
      .delete(`http://localhost:8000/book/delete-book/${id}`)
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
                <TableCell>ISBN</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Author</TableCell>

                <TableCell>Published Date</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Sold</TableCell>
                <TableCell colSpan={2} style={{ textAlign: 'center' }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {books.slice(0, limit).map((book) => (
                <TableRow hover key={book._id}>
                  <TableCell>{book.isbn}</TableCell>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>
                    {moment.unix(book.published_date).format('DD/MM/yyyy')}
                  </TableCell>
                  <TableCell>{book.price}</TableCell>
                  <TableCell>
                    <img
                      width="100px"
                      height="100px"
                      src={`https://firebasestorage.googleapis.com/v0/b/bookshoponline-85349.appspot.com/o/book%2F${book.image}?alt=media`}
                      alt=""
                    />
                  </TableCell>
                  <TableCell>
                    {book.category_id.map((category, idx) =>
                      idx === book.category_id.length - 1
                        ? category.concat('')
                        : category.concat(' - ')
                    )}
                  </TableCell>
                  <TableCell>{book.isSold ? 'TRUE' : 'FALSE'}</TableCell>
                  <TableCell>
                    <IconButton
                      component={RouterLink}
                      to={`/app/book-form?id=${book._id}`}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
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

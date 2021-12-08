import { useState } from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link as RouterLink } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
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
      .delete(`${process.env.REACT_APP_API_ENDPOINT}/book/delete-book/${id}`)
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
                <TableCell />
                <TableCell>Title</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Publisher</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {books.slice(page * limit, page * limit + limit).map((book) => (
                <TableRow hover key={book._id}>
                  <TableCell>
                    <LazyLoadImage
                      // effect="blur"
                      width="100px"
                      height="100px"
                      src={`https://firebasestorage.googleapis.com/v0/b/bookshoponline-85349.appspot.com/o/book%2F${book.image}?alt=media`}
                      alt=""
                      placeholderSrc={`${process.env.PUBLIC_URL}/static/images/default.png`}
                    />
                  </TableCell>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.price}</TableCell>
                  <TableCell>{book.publisher.name}</TableCell>
                  <TableCell>
                    {book.category.map((category, idx) =>
                      idx === book.category.length - 1
                        ? category.concat('')
                        : category.concat(' - ')
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      component={RouterLink}
                      to={`/admin/book-form?id=${book._id}`}
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

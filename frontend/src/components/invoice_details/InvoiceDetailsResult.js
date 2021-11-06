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

const InvoiceDetailsResult = ({ invoiceDetails }) => {
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
                <TableCell>Invoice_id</TableCell>
                <TableCell>ISBN</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoiceDetails.slice(0, limit).map((invoiceDetail) => (
                <TableRow hover key={invoiceDetail._id}>
                  <TableCell>{invoiceDetail.invoice_id}</TableCell>
                  <TableCell>{invoiceDetail.book_isbn}</TableCell>
                  <TableCell>{invoiceDetail.book_title}</TableCell>
                  <TableCell>{invoiceDetail.book_price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={invoiceDetails.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

InvoiceDetailsResult.propTypes = {
  invoiceDetails: PropTypes.array.isRequired
};

export default InvoiceDetailsResult;

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

const InvoiceResult = ({ invoices }) => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const deleteInvoiceHandler = (id) => {
    axios
      .delete(`http://localhost:8000/invoice/delete-invoice/${id}`)
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
                <TableCell>Username</TableCell>
                <TableCell>Created Date</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Payment</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.slice(0, limit).map((invoice) => (
                <TableRow hover key={invoice._id}>
                  <TableCell>{invoice.user_id}</TableCell>
                  <TableCell>
                    {moment.unix(invoice.created_date).format('DD/MM/yyyy')}
                  </TableCell>
                  <TableCell>{invoice.total_money}</TableCell>
                  <TableCell>{invoice.payment_id}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={invoices.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

InvoiceResult.propTypes = {
  invoices: PropTypes.array.isRequired
};

export default InvoiceResult;

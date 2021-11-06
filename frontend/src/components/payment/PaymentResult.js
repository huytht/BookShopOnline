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

const PaymentResult = ({ payments }) => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const deletePaymentHandler = (id) => {
    axios
      .delete(`http://localhost:8000/payment/delete-payment/${id}`)
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
                <TableCell style={{ textAlign: 'center' }}>Name</TableCell>
                <TableCell colSpan={2} style={{ textAlign: 'center' }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.slice(0, limit).map((payment) => (
                <TableRow hover key={payment._id}>
                  <TableCell style={{ textAlign: 'center' }}>
                    {payment.name}
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <IconButton
                      component={RouterLink}
                      to={`/app/payment-form?id=${payment._id}`}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        deletePaymentHandler(payment._id);
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
        count={payments.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

PaymentResult.propTypes = {
  payments: PropTypes.array.isRequired
};

export default PaymentResult;

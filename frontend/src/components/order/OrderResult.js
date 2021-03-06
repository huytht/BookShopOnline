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

const OrderResult = ({ orders }) => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const deleteOrderHandler = (id) => {
    axios
      .delete(`${process.env.REACT_APP_API_ENDPOINT}/order/delete-order/${id}`)
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
                <TableCell>Id</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Total Quantity</TableCell>
                <TableCell>Total Money</TableCell>
                <TableCell>Billing Address Id</TableCell>
                <TableCell>Shipping Address Id</TableCell>  
                <TableCell>Order Tracking Number</TableCell>              
                <TableCell>Payment</TableCell>
                <TableCell>Created Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.slice(page * limit, page * limit + limit).map((order) => (
                <TableRow hover key={order._id}>
                  <TableCell>{order._id}</TableCell>
                  <TableCell>{order.user_id.fullname}</TableCell>
                  <TableCell>{order.total_quantity}</TableCell>
                  <TableCell>{order.total_money}</TableCell>
                  <TableCell>{order.billing_address_id}</TableCell>
                  <TableCell>{order.shipping_address_id}</TableCell>
                  <TableCell>{order.order_tracking_number}</TableCell>
                  <TableCell>{order.payment_id.name}</TableCell>
                  <TableCell>
                    {moment.unix(order.created_date).format('DD/MM/yyyy')}
                  </TableCell>
                  <TableCell>{order.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={orders.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

OrderResult.propTypes = {
  orders: PropTypes.array.isRequired
};

export default OrderResult;

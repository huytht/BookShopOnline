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

const PublisherResult = ({ publishers }) => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const deletePublisherHandler = (id) => {
    axios
      .delete(`${process.env.REACT_APP_API_ENDPOINT}/publisher/delete-publisher/${id}`)
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
              {publishers.slice(page * limit, page * limit + limit).map((publisher) => (
                <TableRow
                  hover
                  key={publisher._id}
                >
                  <TableCell style={{ textAlign: 'center' }}>
                    {publisher.name}
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <IconButton
                      component={RouterLink}
                      to={`/admin/publisher-form?id=${publisher._id}`}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        deletePublisherHandler(publisher._id);
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
        count={publishers.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

PublisherResult.propTypes = {
  publishers: PropTypes.array.isRequired
};

export default PublisherResult;

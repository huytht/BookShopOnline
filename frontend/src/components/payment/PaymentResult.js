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

const PaymentResult = ({ categories }) => {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const deleteCategoryHandler = (id) => {
    axios
      .delete(`http://localhost:8000/category/delete-category/${id}`)
      .then((res) => console.log(res));
  };

  const handleSelectAll = (event) => {
    let newSelectedCategoryIds;

    if (event.target.checked) {
      newSelectedCategoryIds = categories.map((category) => category.id);
    } else {
      newSelectedCategoryIds = [];
    }

    setSelectedCategoryIds(newSelectedCategoryIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCategoryIds.indexOf(id);
    let newSelectedCategoryIds = [];

    if (selectedIndex === -1) {
      newSelectedCategoryIds = newSelectedCategoryIds.concat(
        selectedCategoryIds,
        id
      );
    } else if (selectedIndex === 0) {
      newSelectedCategoryIds = newSelectedCategoryIds.concat(
        selectedCategoryIds.slice(1)
      );
    } else if (selectedIndex === selectedCategoryIds.length - 1) {
      newSelectedCategoryIds = newSelectedCategoryIds.concat(
        selectedCategoryIds.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedCategoryIds = newSelectedCategoryIds.concat(
        selectedCategoryIds.slice(0, selectedIndex),
        selectedCategoryIds.slice(selectedIndex + 1)
      );
    }

    setSelectedCategoryIds(newSelectedCategoryIds);
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
                    checked={selectedCategoryIds.length === categories.length}
                    color="primary"
                    indeterminate={
                      selectedCategoryIds.length > 0 &&
                      selectedCategoryIds.length < categories.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>Name</TableCell>
                <TableCell colSpan={2} style={{ textAlign: 'center' }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.slice(0, limit).map((category) => (
                <TableRow
                  hover
                  key={category._id}
                  selected={selectedCategoryIds.indexOf(category._id) !== -1}
                >
                  <TableCell padding="checkbox" style={{ textAlign: 'center' }}>
                    <Checkbox
                      checked={selectedCategoryIds.indexOf(category._id) !== -1}
                      onChange={(event) => handleSelectOne(event, category._id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    {category.name}
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <IconButton
                      component={RouterLink}
                      to={`/app/category-form?id=${category._id}`}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        deleteCategoryHandler(category._id);
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
        count={categories.length}
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
  categories: PropTypes.array.isRequired
};

export default PaymentResult;

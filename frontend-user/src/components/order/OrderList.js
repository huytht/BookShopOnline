import React, { useEffect, useState } from "react";
import { IconButton, styled } from "@material-ui/core";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import { TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import callApi from "../../api";
import { useDispatch, useSelector } from "react-redux";
import { GetOrderList } from "../../actions/product";
import moment from "moment";
import SearchBar from "material-ui-search-bar";
import { useNavigate } from "react-router-dom";

const Container = styled("div")({
  padding: "10px",
});
const Title = styled("h1")({
  textAlign: "center",
  color: "rgba(86, 141, 229, 1)",
});
const OrderList = () => {
  const { _orderList } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.auth);
  const [orderTrackingNumber, setOrderTrackingNumber] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = new URL(document.location).searchParams;

  useEffect(() => {
    if (!params.has("order-tracking-number")) {
      callApi(`order/list-order-user/${user.id}`, "GET", null).then((res) =>
        dispatch(GetOrderList(res.data))
      );
    } else {
      callApi(
        `order/find-by-order-number/${user.id}/${params.get(
          "order-tracking-number"
        )}`,
        "GET",
        null
      ).then((res) => dispatch(GetOrderList(res.data)));
    }
  }, [params]);

  const handleChange = (orderNumber) => {
    setOrderTrackingNumber(orderNumber);
  };

  const handleRequestSearch = () => {
    if (orderTrackingNumber === "") navigate("/order-list");
    else navigate(`/order-list?order-tracking-number=${orderTrackingNumber}`);
  };

  return (
    <Container>
      <Title>????n h??ng c???a t??i</Title>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          border: "2px solid rgba(86, 141, 229, 1)",
        }}
      >
        <FormControl fullWidth sx={{ m: 1 }}>
          <SearchBar
            style={{ width: "100%" }}
            value={orderTrackingNumber}
            onChange={handleChange}
            placeholder="T??m ki???m theo m?? ????n h??ng"
            onRequestSearch={handleRequestSearch}
          />
        </FormControl>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell align="center">M?? ????n h??ng</TableCell>
                <TableCell align="center">Ng??y t???o</TableCell>
                <TableCell align="center">S??? l?????ng </TableCell>
                <TableCell align="center">T???ng c???ng</TableCell>
                <TableCell align="center">?????a ch??? giao h??ng</TableCell>
                <TableCell align="center">Lo???i thanh to??n</TableCell>
                <TableCell align="center">Tr???ng th??i</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {_orderList.map((row) => (
                <TableRow
                  key={row._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row" align="center">
                    {row.order_tracking_number}
                  </TableCell>
                  <TableCell align="center">
                    {moment.unix(row.created_date).format("DD-MM-yyyy")}
                  </TableCell>
                  <TableCell align="center">{row.total_quantity}</TableCell>
                  <TableCell align="center">{row.total_money}</TableCell>
                  <TableCell align="center">
                    {row.shipping_address_id.street +
                      ", " +
                      row.shipping_address_id.town_district +
                      ", " +
                      row.shipping_address_id.province_city}
                  </TableCell>
                  <TableCell align="center">{row.payment_id.name}</TableCell>
                  <TableCell align="center">
                    {row.status === "Complete" ? "???? thanh to??n" : "??ang ch???"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};
export default OrderList;

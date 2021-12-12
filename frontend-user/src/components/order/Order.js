import "../../css/Checkout.css";
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";

import { useRef, useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import {
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import callApi from "../../api";
import moment from "moment";
import { useDispatch } from "react-redux";
import { DeleteAllCart } from "../../actions/product";

export const Order = ({ order, orderItems, shippingAddress, userOrder }) => {
  const pdfExportComponent = useRef(null);
  // const dispatch = useDispatch();
  const [shippingAddressDetail, setShippingAddresDetail] = useState({});
  const [layoutSelection, setLayoutSelection] = useState({
    text: "A4",
    value: "size-a4",
  });

  const handleExportWithComponent = (event) => {
    pdfExportComponent.current.save();
  };

  function TotalPrice(price, quantity) {
    return Number(price * quantity).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }
  

  useEffect(() => {
    callApi(`address/get-address/${shippingAddress}`).then((res) => {
      setShippingAddresDetail(res.data);
    });
    localStorage.setItem("ordered", true);
  }, []);

  return (
    <div id="example">
      <div className="box wide hidden-on-narrow">
        <div style={{ display: "flex", flex: "1", justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleExportWithComponent}
          >
            In hóa đơn
          </Button>
        </div>
      </div>
      <div style={{ height: '100%' }} className="page-container hidden-on-narrow">
        <PDFExport paperSize="A4" ref={pdfExportComponent}>
          <div className={`pdf-page ${layoutSelection.value}`}>
            <div className="inner-page">
              <div
                style={{ display: "flex", flex: "1" }}
                className="pdf-header"
              >
                <div style={{ justifyContent: "flex-start" }}>
                  <Typography variant="subtitle1">Hóa đơn đến từ</Typography>
                  <Typography variant="subtitle2">
                    HKP Book Store <br />
                    280 An Dương Vương
                    <br />
                    Quận 5, Thành phố Hồ Chí Minh
                    <br />
                    onlinebookstore@hcmue.com
                  </Typography>
                </div>
                <div
                  style={{
                    display: "flex",
                    flex: "1",
                    justifyContent: "flex-end",
                  }}
                >
                  <span className="company-logo">
                    <img
                      width="250px"
                      src="/imagebanner/logo_1.png"
                      alt="Kendoka Company Logo"
                    />{" "}
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", flex: "1" }}>
                <Typography variant="subtitle1">Hóa đơn cho</Typography>
              </div>
              <div style={{ display: "flex", flex: "1" }}>
                <div style={{ justifyContent: "flex-start" }}>
                  <Typography variant="subtitle2">
                    {userOrder.lastName.concat(" ", userOrder.firstName)}
                    <br />
                    {shippingAddressDetail.street}
                    <br />
                    {shippingAddressDetail.town_district?.concat(
                      ", ",
                      shippingAddressDetail.province_city
                    )}
                  </Typography>
                </div>
                <div
                  style={{
                    display: "flex",
                    flex: "1",
                    justifyContent: "flex-end",
                  }}
                >
                  <br />
                  <Typography variant="subtitle2">
                    Mã hóa đơn: {order.order_tracking_number}
                    <br />
                    Ngày xuất hóa đơn:{" "}
                    {moment.unix(order.created_date).format("DD/MM/yyyy")}
                    <br />
                    Ngày đáo hạn:{" "}
                    {moment.unix(order.created_date).format("DD/MM/yyyy")}
                  </Typography>
                </div>
              </div>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: "100%" }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell width="40%">Tên sách</TableCell>
                      <TableCell width="20%" align="right">
                        Số lượng
                      </TableCell>
                      <TableCell width="20%" align="right">
                        Giá tiền
                      </TableCell>
                      <TableCell width="20%" align="right">
                        Tổng cộng
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderItems.map((item) => (
                      <TableRow>
                        <TableCell width="40%">{item.title}</TableCell>
                        <TableCell width="20%" align="right">
                          {item.quantity}
                        </TableCell>
                        <TableCell width="20%" align="right">
                          {item.price.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </TableCell>
                        <TableCell width="20%" align="right">
                          {TotalPrice(item.price, item.quantity)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <div style={{ display: "flex", flex: "1" }} className="pdf-body">
                <div style={{ justifyContent: "flex-start" }}>
                  <Typography variant="subtitle1">Ghi chú</Typography>
                  <Typography variant="subtitle2">
                    Phí vận chuyển: Miễn phí
                  </Typography>
                </div>
                <div
                  style={{
                    display: "flex",
                    flex: "1",
                    justifyContent: "flex-end",
                  }}
                >
                  <>
                    <Table sx={{ width: "65%" }} aria-label="simple table">
                      <TableRow>
                        <TableCell>Tổng phụ</TableCell>
                        <TableCell align="right">
                          {order.total_money?.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Thuế&nbsp;(0%)</TableCell>
                        <TableCell align="right">0</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Tổng cộng</TableCell>
                        <TableCell align="right">
                          {order.total_money?.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </TableCell>
                      </TableRow>
                    </Table>
                  </>
                </div>
              </div>
            </div>
          </div>
        </PDFExport>
      </div>
    </div>
  );
};

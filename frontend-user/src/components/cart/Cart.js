import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Container,
  IconButton,
  Link,
  styled,
} from "@mui/material";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import IndeterminateCheckBoxOutlinedIcon from "@mui/icons-material/IndeterminateCheckBoxOutlined";

import { useDispatch, useSelector } from "react-redux";
import {
  IncreaseQuantity,
  DecreaseQuantity,
  DeleteCart,
} from "../../actions/product";
import { useNavigate } from "react-router-dom";
import callApi from "../../api";

const Title = styled("h1")({
  paddingLeft: "10px",
  margin: "20px",
  marginRight: "40px",
  color: "rgba(86, 141, 229, 1)",
  width: "auto",
  display: "flex",
  flex: 1,
  justifyContent: "center",
});

 const Cart = () => {
  const { user } = useSelector((state) => state.auth);
  const { numberCart, Carts } = useSelector((state) => state.product);
  const [cartStorage, setCartStorage] = useState(
    JSON.parse(localStorage.getItem("carts")).Carts.length > 0 ? JSON.parse(localStorage.getItem("carts")).Carts : []
  );
  const [active, setActive] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let TotalCart = 0;
  Object.keys(cartStorage).forEach(function (item) {
    TotalCart += cartStorage[item].quantity * cartStorage[item].price;
  });

  function TotalPrice(price, quantity) {
    return Number(price * quantity).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }

  useEffect(() => {
    setCartStorage(JSON.parse(localStorage.getItem("carts")).Carts);
  }, [numberCart]);

  const handleIncreaseQuantity = (index) => {
    callApi(`book/get-quantity-active-book/${Carts[index]._id}`).then(
      (res) => {
        if (res.data - Carts[index].quantity > 0) {
          console.log(Carts[index])
          dispatch(IncreaseQuantity(index));
        } else {
          let newArr = [...active];
          newArr[index] = false;
          setActive(newArr);
        }
      }
    );
  };

  const handleDecreaseQuantity = (index) => {
    let newArr = [...active];
    newArr[index] = true;
    setActive(newArr);
    dispatch(DecreaseQuantity(index));
  };

  const handleDeleteCart = (index) => {
    dispatch(DeleteCart(index));
  };

  const handlePageReturn = () => {
    navigate("/");
  };
  const handlePageCheckout = () => {
    navigate("/checkout");
  };
  return (
    <Container>
      <Title>Giỏ Hàng</Title>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="spanning table">
          <TableHead>
            <TableRow>
              <TableCell>Tên sách</TableCell>
              <TableCell align="center">Hình ảnh</TableCell>
              <TableCell align="center">Số lượng</TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center">Giá</TableCell>
              <TableCell align="center">Tạm tính</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cartStorage.length > 0 && cartStorage.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.title}</TableCell>
                <TableCell align="center">
                  <img
                    alt=""
                    src={`https://firebasestorage.googleapis.com/v0/b/bookshoponline-85349.appspot.com/o/book%2F${item.image}?alt=media`}
                    style={{ width: "100px", height: "100px" }}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    disabled={active[index] === false ? true : false}
                    color="primary"
                    onClick={() => handleIncreaseQuantity(index)}
                  >
                    <AddBoxOutlinedIcon />
                  </IconButton>
                  {item.quantity}
                  <IconButton
                    color="primary"
                    onClick={() => handleDecreaseQuantity(index)}
                  >
                    <IndeterminateCheckBoxOutlinedIcon />
                  </IconButton>
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="secondary"
                    onClick={() => handleDeleteCart(index)}
                  >
                    <DeleteOutlineOutlinedIcon />
                  </IconButton>
                </TableCell>
                <TableCell align="center">
                  {item.price?.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </TableCell>
                <TableCell align="center">
                  {TotalPrice(item.price, item.quantity)}
                </TableCell>
              </TableRow>
            ))}

            <TableRow>
              <TableCell rowSpan={5} />
              <TableCell colSpan={4}>Thành tiền</TableCell>
              <TableCell align="center">
                {Number(TotalCart).toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={4}>Phí vận chuyển</TableCell>
              <TableCell align="center">Miễn phí</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={4}>Tổng cộng</TableCell>
              <TableCell align="center">
                {Number(TotalCart).toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3} />
              <TableCell>
                <Button
                  style={{
                    backgroundColor: "#CECDCD",
                    color: "black",
                    fontWeight: "bold",
                    height: "50px",
                    marginTop: "25px",
                    borderRadius: "0px",
                    textDecoration: "none",
                  }}
                  onClick={handlePageReturn}
                  fullWidth
                  variant="outlined"
                >
                  Quay lại
                </Button>
              </TableCell>
              {user === null ? (
                <TableCell>
                  <Button
                    disabled
                    style={{
                      backgroundColor: "#dddddd",
                      color: "black",
                      fontWeight: "bold",
                      height: "50px",
                      marginTop: "25px",
                      borderRadius: "0px",
                      width: "80%",
                    }}
                    fullWidth
                    variant="outlined"
                    onClick={handlePageCheckout}
                  >
                    đăng nhập <br /> để thanh toán
                  </Button>
                </TableCell>
              ) : (
                <TableCell>
                  <Button
                    style={{
                      backgroundColor: "#FDC92D",
                      color: "black",
                      fontWeight: "bold",
                      height: "50px",
                      marginTop: "25px",
                      borderRadius: "0px",
                    }}
                    fullWidth
                    variant="outlined"
                    onClick={handlePageCheckout}
                  >
                    Thanh toán
                  </Button>
                </TableCell>
              )}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
export default Cart;
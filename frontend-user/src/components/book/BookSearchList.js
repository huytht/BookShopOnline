import React, { useEffect, useState } from "react";
import { Breadcrumbs, styled } from "@material-ui/core";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import callApi from "../../api";
import { AddCart, GetAllProductByKeyword } from "../../actions/product";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Grid } from "@material-ui/core";
import { ShoppingCartOutlined } from "@material-ui/icons";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import usePagination from "../pagination/PaginationItem";
import StarIcon from "@mui/icons-material/Star";

const Container = styled("div")({
  padding: "10px",
});
const Left = styled("div")({
  display: "flex",
});
const Center = styled("div")({
  flex: 1,
  display: "flex",
  marginLeft: "5px",
});
const Wrapper = styled("div")({
  display: "flex",
});
const Title = styled("h1")({
  textAlign: "center",
  color: "rgba(86, 141, 229, 1)",
});
const Titleh3 = styled("h3")({
  textAlign: "center",
  marginTop: "10px",

  borderBottom: "1px solid rgba(86, 141, 229, 1)",
  height: "5%",
  width: "100%",
  textAlign: "left",
});
const BookSearchList = () => {
  const { _products, _categories } = useSelector((state) => state.product);
  const navigate = useNavigate();
  const params = new URL(document.location).searchParams;

  const handleClick = (category) => {
    navigate(`/bookcate?id=${category._id}`);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    if (params.has("keyword") && params.get("keyword") !== "") {
      callApi(
        `book/list-book-by-name/${params.get("keyword")}`,
        "GET",
        null
      ).then((res) => {
        dispatch(GetAllProductByKeyword(res.data));
      });
    }
  }, [params.get("keyword"), dispatch]);
  useEffect(() => {
    if (params.has("author")) {
      callApi(
        `book/list-book-by-author/${params.get("author")}`,
        "GET",
        null
      ).then((res) => {
        dispatch(GetAllProductByKeyword(res.data));
      });
    }
  }, [params.get("author"), dispatch]);
  useEffect(() => {
    if (params.has("id") && params.has("publisher")) {
      callApi(
        `book/list-book-by-publisher/${params.get("id")}`,
        "GET",
        null
      ).then((res) => {
        dispatch(GetAllProductByKeyword(res.data));
      });
    }
  }, [params.get("publisher"), dispatch]);

  const handleAddToCart = (item) => {
    console.log(item);
    dispatch(AddCart(item));
  };
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  const count = Math.ceil(_products.length / PER_PAGE);

  const _DATA = usePagination(_products, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
    console.log(_DATA);
    console.log(count);
  };

  return (
    <Container>
      <Wrapper>
        <Left>
          <Box
            sx={{
              border: 1,
              borderColor: "rgba(86, 141, 229, 1)",
              height: "780px",
            }}
            role="presentation"
          >
            <Title>Danh mục</Title>
            <Divider />
            <List>
              {_categories.map((category) => (
                <Link
                  style={{ textDecoration: "none" }}
                  to={`/bookcate?id=${category._id}`}
                  key={category._id}
                  onClick={() => handleClick(category)}
                >
                  <ListItem
                    style={{ width: "220px", textAlign: "center" }}
                    button
                    key={category._id}
                  >
                    <ListItemText key={category._id} primary={category.name} />
                  </ListItem>
                </Link>
              ))}
            </List>
          </Box>
        </Left>
        <Center>
          <Box style={{ width: "100%" }}>
            <Titleh3>Kết quả tìm kiếm</Titleh3>
            <Grid container spacing={2} direction="row" sx={{ width: "auto" }}>
              {_DATA.currentData()?.length > 0 ? (
                _DATA.currentData().map((item, key) => (
                  <Grid
                    key={item._id}
                    item
                    xs={12}
                    md={4}
                    style={{ padding: 10 }}
                  >
                    <Card
                      sx={{
                        marginTop: 1,
                        width: "100%",
                        borderBottomColor: "red",
                      }}
                    >
                      <Grid sx={{ height: "100%" }} container spacing={2}>
                        <Grid item xs={1} />
                        <Grid item xs={4}>
                          <CardMedia
                            component="img"
                            height="160px"
                            width="115"
                            src={`https://firebasestorage.googleapis.com/v0/b/bookshoponline-85349.appspot.com/o/book%2F${item.image}?alt=media`}
                            alt="green iguana"
                            style={{
                              border: "1px solid #d8d8d8",
                              marginTop: 10,
                            }}
                          />
                        </Grid>
                        <Grid item xs={7}>
                          <CardContent sx={{ height: "50px" }}>
                            <Typography
                              gutterBottom
                              variant="h6"
                              style={{ alignItems: "center" }}
                            >
                              <Link
                                style={{
                                  textDecoration: "none",
                                }}
                                to={`/book?id=${item._id}`}
                              >
                                <ListItemText
                                  primary={
                                    <Typography
                                      style={{
                                        fontWeight: "bold",
                                        fontSize: 18,
                                      }}
                                    >
                                      {item.title.length > 11
                                        ? item.title.substr(0, 11).concat("...")
                                        : item.title}
                                    </Typography>
                                  }
                                  secondary={item.author}
                                />
                              </Link>
                              <Divider />
                              <ListItemText
                                secondary={item.summary_content
                                  ?.substr(0, 95)
                                  .concat("...")}
                              />
                            </Typography>
                          </CardContent>
                        </Grid>
                      </Grid>
                      <Divider sx={{ mt: 2 }} />
                      <Grid sx={{ height: "100%" }} container spacing={2}>
                        <CardActions
                          sx={{
                            height: "90px",
                            width: "100%",
                          }}
                        >
                          <Grid item xs={1} />
                          <Grid item xs={5}>
                            <ListItemText
                              primary={
                                <Typography style={{ fontSize: 20 }}>
                                  Đánh giá
                                </Typography>
                              }
                              disableTypography
                              secondary={
                                <Typography style={{ display: "flex" }}>
                                  {item.review > 0
                                    ? item.rate
                                    : "Chưa có đánh giá"}
                                  {item.review > 0 && (
                                    <StarIcon
                                      style={{ fontSize: 22, color: "yellow" }}
                                    />
                                  )}
                                </Typography>
                              }
                            />
                          </Grid>

                          <span style={{ color: "red", marginLeft: "20px" }}>
                            <h5>
                              {item.price?.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </h5>
                          </span>
                        </CardActions>
                      </Grid>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12} md={4} style={{ padding: 10 }}>
                  Không tìm thấy kết quả
                </Grid>
              )}
            </Grid>
            <Box style={{ marginBottom: "40px" }}>
              <Stack spacing={2}>
                <Pagination
                  count={count}
                  size="small"
                  page={page}
                  
                  onChange={handleChange}
                />
              </Stack>
            </Box>
          </Box>
        </Center>
      </Wrapper>
    </Container>
  );
};
export default BookSearchList;

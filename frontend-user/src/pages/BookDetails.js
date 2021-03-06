import { useState, useEffect } from "react";
import { styled } from "@material-ui/core";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Button, Grid } from "@material-ui/core";
import { ShoppingCartOutlined } from "@material-ui/icons";
import RBookDetails from "../components/book/RBookDetails";
import RRatingBook from "../components/book/RRatingBook";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import callApi from "../api/index";
import { useDispatch } from "react-redux";
import { AddCart, GetProductDetail } from "../actions/product";
import { useSelector } from "react-redux";
import RelatedBook from "../components/book/RelatedBook";
import { Link } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";

const Container = styled("div")({});

const Wrapper = styled("div")({
  marginTop: "10px",
  padding: 10,
  flex: "1",
});

const DESCSUMARY = styled("div")({
  marginTop: "50px",
});

const PAY = styled("h3")({
  textAlign: "center",
  borderBottom: "1px solid rgba(86, 141, 229, 1)",
  color: "blue",
  paddingBottom: "10px",
});
const Info = styled("div")({});

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const BookDetails = () => {
  const [value, setValue] = useState(0);
  const { _product, Carts } = useSelector((state) => state.product);
  const [active, setActive] = useState(true);
  const dispatch = useDispatch();

  const params = new URL(document.location).searchParams;
  const handleAddToCart = (item) => {
    callApi(`book/get-quantity-active-book/${item._id}`).then((res) => {
      if (Carts.length !== 0) {
        for (let i = 0; i < Carts.length; ++i) {
          if (item._id === Carts[i]._id) {
            if (res.data - Carts[i].quantity > 0) {
              dispatch(AddCart(item));
              break;
            } else {
              setActive(false);
              break;
            }
          } else if (item._id !== Carts[i]._id && i === Carts.length - 1) {
            dispatch(AddCart(item));
          }
        }
      } else {
        dispatch(AddCart(item));
      }
    });
  };

  useEffect(() => {
    callApi(`book/get-book/${params.get("id")}`, "GET", null).then((res) => {
      dispatch(GetProductDetail(res.data));
    });
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Container>
      <Wrapper>
        <Breadcrumbs
          aria-label="breadcrumb"
          style={{ borderBottom: "1px solid rgba(86, 141, 229, 1)" }}
        >
          <Link style={{ textDecoration: "none" }} color="inherit" to="/">
            Danh m???c th??? lo???i
          </Link>
          <Link
            color="inherit"
            style={{ textDecoration: "none" }}
            to={
              _product.category_id?.length > 0 &&
              `/bookcate?id=${_product.category_id[0]}`
            }
          >
            {_product.category?.length > 0 && _product.category[0]}
          </Link>
          <Typography color="text.primary">{_product.title}</Typography>
        </Breadcrumbs>
        <Grid sx={{ height: "100%" }} container spacing={3}>
          <Grid item xs={12} md={9}>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                "& > :not(style)": {
                  m: 1,
                  width: "100%",
                  height: "100%",
                  border: "1px solid rgba(86, 141, 229, 1)",
                },
              }}
            >
              <Paper elevation={0} style={{}}>
                <Grid sx={{ height: "100%" }} container spacing={2}>
                  <Grid item xs={12} md={5}>
                    <Box
                      sx={{
                        width: "100%",
                        height: 480,
                        m: 1,
                        direction: "column",
                      }}
                    >
                      <img
                        style={{
                          width: "100%",
                          height: 480,
                        }}
                        alt=""
                        src={`https://firebasestorage.googleapis.com/v0/b/bookshoponline-85349.appspot.com/o/book%2F${_product?.image}?alt=media`}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={7}>
                    <Box
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <h1 style={{ fontWeight: "bold" }}>{_product.title}</h1>
                      <label>T??c gi???:</label>{" "}
                      <Link
                        to={`/search?author=${_product.author}`}
                        style={{ fontWeight: "bold", textDecoration: "none" }}
                      >
                        {_product.author}
                      </Link>{" "}
                      <br />
                      <label>Nh?? xu???t b???n:</label>{" "}
                      <Link
                        to={`/search?id=${_product.publisher_id}&publisher=${_product.publisher?.name}`}
                        style={{ fontWeight: "bold", textDecoration: "none" }}
                      >
                        {_product.publisher?.name}
                      </Link>{" "}
                      <br />
                      <label>Th??? lo???i:</label>{" "}
                      {_product.category?.map((item, index) => (
                        <Link
                          key={index}
                          to={`/bookcate?id=${_product.category_id[index]}`}
                          style={{ fontWeight: "bold", textDecoration: "none" }}
                        >
                          {item}
                          {index !== _product.category?.length - 1 ? ", " : " "}
                        </Link>
                      ))}
                      <br />
                      <label style={{ display: "flex" }}>
                        ????nh gi??:{" "}
                        {_product.review?.length === 0
                          ? "Ch??a c?? ????nh gi??"
                          : _product.rate}{" "}
                        {_product.review?.length !== 0 && (
                          <StarIcon style={{ fontSize: 22, color: "yellow" }} />
                        )}
                      </label>
                      <DESCSUMARY>
                        {_product.summary_content?.substr(0, 300)}...{" "}
                        <Link to="#">Xem th??m</Link>
                      </DESCSUMARY>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                "& > :not(style)": {
                  m: 1,
                  width: "100%",
                  height: "100%",
                  border: "1px solid rgba(86, 141, 229, 1)",
                },
              }}
            >
              <Paper elevation={0}>
                <PAY>Th??ng tin thanh to??n</PAY>
                <Info>
                  <div
                    style={{
                      display: "flex",
                      fontWeight: "bold",
                      marginLeft: "10px",
                    }}
                  >
                    Gi?? b??n:{" "}
                    <p
                      style={{
                        color: "red",
                        justifyContent: "flex-end",
                        display: "flex",
                        flex: 1,
                        marginRight: "10px",
                      }}
                    >
                      {_product.price?.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      fontWeight: "bold",
                      marginLeft: "10px",
                      marginTop: "25px",
                    }}
                  >
                    Tr???ng th??i:{" "}
                    <p
                      style={{
                        color: "rgba(86, 141, 229, 1)",
                        justifyContent: "flex-end",
                        display: "flex",
                        flex: 1,
                        marginRight: "10px",
                      }}
                    >
                      {_product.quantity_active === 0 ? "H???t h??ng" : "C??n h??ng"}
                    </p>
                  </div>
                </Info>

                <Link style={{textDecoration:'none'}} to="/cart">
                  <Button
                    style={{
                      backgroundColor: "rgba(86, 141, 229, 1)",
                      color: "white",
                      fontWeight: "bold",
                      
                      height: "50px",
                      marginTop: "10px",
                      borderRadius: "0px",
                    }}
                    fullWidth
                  >
                    Mua ngay
                  </Button>
                </Link>
                {active === false || _product.quantity_active === 0 ? (
                  <Button
                    disabled
                    style={{
                      backgroundColor: "transparent",
                      color: "rgba(0, 0, 0, 0.26)",
                      fontWeight: "bold",
                      height: "50px",
                      borderRadius: "0px",
                    }}
                    variant="outlined"
                    fullWidth
                  >
                    <ShoppingCartOutlined /> &nbsp; ???? h???t h??ng
                  </Button>
                ) : (
                  <Button
                    style={{
                      backgroundColor: "rgb(42, 128, 219)",
                      color: "white",
                      fontWeight: "bold",
                      height: "50px",
                      borderRadius: "0px",
                    }}
                    variant="outlined"
                    fullWidth
                    onClick={() => handleAddToCart(_product)}
                  >
                    <ShoppingCartOutlined /> &nbsp; Th??m v??o gi??? h??ng
                  </Button>
                )}
              </Paper>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ width: "100%", marginTop: "10px" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Chi ti???t s??ch" {...a11yProps(0)} />
              <Tab label="????nh gi?? c???a ?????c gi???" {...a11yProps(1)} />
              <Tab label="S??ch li??n quan" {...a11yProps(2)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <RBookDetails props={_product} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <RRatingBook props={_product.review} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <RelatedBook props={_product.related_book} />
          </TabPanel>
        </Box>
      </Wrapper>
    </Container>
  );
};
export default BookDetails;

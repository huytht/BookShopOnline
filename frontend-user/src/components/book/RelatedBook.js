import React, { useEffect } from "react";
import { Divider, Grid, ListItemText } from "@material-ui/core";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import StarIcon from "@mui/icons-material/Star";
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import callApi from './../../api/index';
import { GetProductDetail } from './../../actions/product';

const RelatedBook = ({ props }) => {
  const dispatch = useDispatch();

  const handleChangeBook = (id) => {
    callApi(`book/get-book/${id}`, "GET", null).then((res) => {
      dispatch(GetProductDetail(res.data));
    });
  }
  return (
    <Grid container spacing={2} direction="row" sx={{ width: "auto" }}>
      {props.map((item, key) => (
        <Grid key={item._id} item xs={6} md={3} style={{ padding: 5 }}>
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
                  style={{ border: "1px solid #d8d8d8", marginTop: 10 }}
                />
              </Grid>
              <Grid item xs={7}>
                <CardContent sx={{ height: "50px" }}>
                  <Typography
                    gutterBottom
                    variant="h6"
                    style={{ alignItems: "center" }}
                  >
                    <Link onClick={() => handleChangeBook(item._id)} to={`/book?id=${item._id}`} style={{ textDecoration: 'none' }}>
                      <ListItemText
                        primary={
                          <Typography
                            style={{ fontWeight: "bold", fontSize: 18 }}
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
                  // justifyContent: "center",
                  height: "90px",
                  width: "100%",
                }}
              >
                <Grid item xs={1} />
                <Grid item xs={5}>
                  <ListItemText
                    primary={
                      <Typography style={{ fontSize: 20 }}>Đánh giá</Typography>
                    }
                    disableTypography
                    secondary={
                      <Typography style={{ display: "flex" }}>
                        {item.review > 0 ? item.rate : "Chưa có đánh giá"}
                        {item.review > 0 && (
                          <StarIcon style={{ fontSize: 22, color: "yellow" }} />
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
      ))}
    </Grid>
  );
};
export default RelatedBook;

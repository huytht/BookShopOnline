import { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import {
  Divider,
  Avatar,
  Grid,
  Button,
  styled,
  TextField,
} from "@material-ui/core";
import Moment from "react-moment";
import Rating from "@mui/material/Rating";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import callApi from "../../api";
import { Navigate, useNavigate } from 'react-router-dom';
import usePagination from "../pagination/PaginationItem";

const Title = styled("h1")({
  marginLeft: "10px",
  color: "rgba(86, 141, 229, 1)",
});
const Rate = styled("div")({
  display: "flex",
  marginLeft: "10px",
  marginTop: "10px",
});

const Content = styled("div")({
  display: "flex",
  marginLeft: "10px",
  marginTop: "10px",
});

const RRatingBook = ({ props }) => {
  const [page, setPage] = useState(1);
  const PER_PAGE = 4;

  const count = Math.ceil(props.length / PER_PAGE);

  const _DATA = usePagination(props, PER_PAGE);
  
  const { user } = useSelector((state) => state.auth);
  const { _product } = useSelector((state) => state.product);
  const navigate = useNavigate();
  const [value, setValue] = useState({
    book_id: _product._id,
    user_id: 0,
    created_date: new Date(),
    rate: 0,
    remark: "",
    favourite: true,
  });
  const handleChange = (e) => {
    e.preventDefault();
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (user !== null)
        setValue({
            ...value,
            user_id: user.id
        })
  }, [user])

  const handleRemark = (e) => {
    e.preventDefault();
    if (value.remark !== "") {
        callApi('review/create-review/', 'POST', value)
        .then((res) => console.log(res.data));
    }
  };
  const handleCommentPagination = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };
  return (
    <Paper
      elevation={0}
      style={{ marginTop: "10px", width: "1015px", height: "100%" }}
    >
      <Title>Đánh giá của độc giả</Title>
      <Paper
        elevation={0}
        style={{
          marginTop: "10px",
          width: "400px",
          height: "100%",
          marginLeft: "10px",
        }}
      >
        {" "}
        {user !== null ? (
          <>
            <Box style={{ border: "1px solid black", height: "215px" }}>
              <Rate>
                {" "}
                Đánh giá:
                <Box>
                  <Rating
                    name="rate"
                    value={value.rate}
                    onChange={handleChange}
                    style={{ marginLeft: "10px" }}
                  />
                </Box>
              </Rate>
              <Content>
                Nội dung:{" "}
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  multiline
                  name="remark"
                  variant="outlined"
                  style={{
                    marginLeft: "15px",
                    width: "70%",
                    marginTop: "10px",
                  }}
                  required
                  value={value.remark}
                  onChange={handleChange}
                />
              </Content>
              <Button
                style={{
                  backgroundColor: "rgba(86, 141, 229, 1)",
                  color: "white",
                  marginLeft: "95px",
                  marginTop: "10px",
                }}
                onClick={handleRemark}
              >
                {" "}
                Gửi đánh giá
              </Button>
            </Box>
            <div style={{ padding: 14 }} >
              <Title>Bình luận</Title>
              {_DATA.currentData().map((item) => (
                <Paper
                  style={{
                    padding: "40px 20px",
                    width: "1000px",
                    height: "100%",
                  }}
                >
                  <Grid container wrap="nowrap" spacing={2}>
                    <Grid item>
                      <Avatar
                        alt="Remy Sharp"
                        src={`https://firebasestorage.googleapis.com/v0/b/bookshoponline-85349.appspot.com/o/user%2F${item.user?.avatar}?alt=media`}
                      />
                    </Grid>
                    <Grid justifyContent="left" item xs zeroMinWidth>
                      <h4 style={{ margin: 0, textAlign: "left" }}>
                        {item.user.fullname}
                      </h4>
                      <p style={{ textAlign: "left" }}>{item.remark}</p>
                      <p style={{ textAlign: "left", color: "gray" }}>
                        <Moment fromNow>{item.created_date * 1000}</Moment>
                      </p>
                    </Grid>
                  </Grid>
                  <Divider variant="fullWidth" style={{ margin: "30px 0" }} />
                </Paper>
              ))}
              <Stack spacing={2}>      
                 <Pagination count={count} size="small" page={page}  onChange={handleCommentPagination} />
              </Stack>
            </div>
          </>
        ) : (
          <h2>Bạn cần đăng nhập để có thể xem và đánh giá sản phẩm này</h2>
        )}
      </Paper>
    </Paper>
  );
};
export default RRatingBook;

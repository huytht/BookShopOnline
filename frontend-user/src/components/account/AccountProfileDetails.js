import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
} from "@material-ui/core";
import moment from "moment";

const gender = [
  {
    value: 1,
    label: "Nữ",
  },
  {
    value: 0,
    label: "Nam",
  },
  {
    value: 2,
    label: "Khác",
  },
];

const AccountProfileDetails = ({ props }) => {
  const [values, setValues] = useState({});

  const handleChange = (event) => {
    event.preventDefault();
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    setValues({
      fullname: props.fullname,
      username: props.username,
      password: props.password,
      date_of_birth: moment.unix(props.date_of_birth).format("yyyy-MM-DD"),
      email: props.email,
      phone: props.phone,
      gender: props.gender,
    });
  }, [props]);

  return (
    <form autoComplete="off" noValidate>
      <Card {...props}>
        <CardHeader
          subheader="Thông tin có thể chỉnh sửa"
          title="Thông tin cá nhân"
        />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <label
                style={{ fontWeight: "bold", marginBottom: "10px" }}
                htmlFor="fullname"
              >
                Họ và tên
              </label>
              <TextField
                fullWidth
                name="fullname"
                onChange={handleChange}
                required
                value={values.fullname}
                defaultValue={props.fullname}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <label
                style={{ fontWeight: "bold", marginBottom: "10px" }}
                htmlFor="email"
              >
                Địa chỉ email
              </label>
              <TextField
                fullWidth
                name="email"
                onChange={handleChange}
                required
                value={values.email}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <label
                style={{ fontWeight: "bold", marginBottom: "10px" }}
                htmlFor="username"
              >
                Tài khoản
              </label>
              <TextField
                fullWidth
                readOnly
                name="username"
                onChange={handleChange}
                required
                InputProps={{
                  readOnly: true,
                }}
                value={values.username}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <label
                style={{ fontWeight: "bold", marginBottom: "10px" }}
                htmlFor="phone"
              >
                Số điện thoại
              </label>
              <TextField
                fullWidth
                name="phone"
                onChange={handleChange}
                required
                value={values.phone}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <label
                style={{ fontWeight: "bold", marginBottom: "10px" }}
                htmlFor="date_of_birth"
              >
                Ngày sinh
              </label>
              <TextField
                fullWidth
                name="date_of_birth"
                type="date"
                onChange={handleChange}
                required
                value={values.date_of_birth}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <label
                style={{ fontWeight: "bold", marginBottom: "10px" }}
                htmlFor="gender"
              >
                Giới tính
              </label>
              <TextField
                name="gender"
                fullWidth
                onChange={handleChange}
                select
                InputLabelProps={{
                  shrink: true,
                }}
                SelectProps={{ native: true }}
                value={values.gender}
                variant="outlined"
              >
                {gender.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            p: 2,
          }}
        >
          <Button color="primary" variant="contained">
            Save details
          </Button>
        </Box>
      </Card>
    </form>
  );
};

export default AccountProfileDetails;

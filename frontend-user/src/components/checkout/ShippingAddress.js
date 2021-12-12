import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  FormControlLabel,
  CardContent,
  CardHeader,
  Divider,
  Radio,
  MenuItem,
  InputLabel,
  Select,
} from "@mui/material";
import moment from "moment";
import callApi from "../../api";

const initShippingAddress = {
  province_city: 26,
  town_district: "",
  street: "",
  zip_code: 0,
};

export const ShippingAddress = ({
  user,
  provinceCityList,
  townDistrictList,
}) => {
  const [values, setValues] = useState({});
  const [townDistrict, setTownDistrict] = useState([{}]);
  const [shippingAddress, setShippingAddress] = useState(
    localStorage.getItem("shippingAddress") !== null
      ? JSON.parse(localStorage.getItem("shippingAddress"))
      : initShippingAddress);

  const handleChange = (event) => {
    event.preventDefault();
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
    setShippingAddress({
      ...shippingAddress,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    if (user.fullname !== undefined) {
      setValues({
        firstName: user.fullname.split(" ").slice(-1).join(" "),
        lastName: user.fullname.split(" ").slice(0, -1).join(" "),
        username: user.username,
        date_of_birth: moment.unix(user.date_of_birth).format("yyyy-MM-DD"),
        email: user.email,
        phone: user.phone,
      })
    }
  }, [user]);

  useEffect(() => {
    if (shippingAddress !== null) {
      callApi(
        `province-city/get-town-district-by-province-city/${shippingAddress?.province_city}`,
        "GET",
        null
      ).then((res) => setTownDistrict(res.data));
    }
    localStorage.setItem("shippingAddress", JSON.stringify(shippingAddress));
  }, [shippingAddress]);

  useEffect(() => {
    localStorage.setItem("userOrder", JSON.stringify(values));
  }, [values]);

  return (
    <>
      <CardHeader title="Thông tin khách hàng" />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              label="Tên"
              name="firstName"
              onChange={handleChange}
              value={values.firstName}
              placeholder="Nhập tên của bạn"
            />
          </Grid>
          <Grid item xs={8}>
            <TextField
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              label="Họ và tên đệm"
              name="lastName"
              placeholder="Nhập họ và tên đệm của bạn"
              onChange={handleChange}
              value={values.lastName}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleChange}
              value={values.date_of_birth}
              label="Date of birth"
              name="date_of_birth"
              type="date"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              label="Phone number"
              name="phone"
              placeholder="09xxxxxx"
              onChange={handleChange}
              value={values.phone}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              label="Email"
              name="email"
              onChange={handleChange}
              value={values.email}
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardHeader title="Phương thức giao hàng" />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControlLabel
              value="free"
              control={<Radio />}
              label="Miễn phí"
              checked="true"
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardHeader title="Địa chỉ giao hàng" />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <InputLabel id="province_city">Tỉnh/thành</InputLabel>
            <Select
              fullWidth
              name="province_city"
              label="Tỉnh/thành"
              onChange={handleChange}
              select
              value={shippingAddress?.province_city}
              MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
            >
              {provinceCityList.map((option) => (
                <MenuItem key={option?.code} value={option?.code}>
                  {option?.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12}>
            <InputLabel id="town_district">Quận/huyện</InputLabel>
            <Select
              fullWidth
              name="town_district"
              label="Quận/huyện"
              onChange={handleChange}
              select
              value={shippingAddress?.town_district}
              MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
            >
              {townDistrict.map((option) => (
                <MenuItem key={option?.code} value={option?.code}>
                  {option?.name_with_type}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Địa chỉ (đường, phường, xã, ...)"
              name="street"
              value={shippingAddress?.street}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Zip/Postal code"
              name="zip_code"
              placeholder="70000"
              value={shippingAddress?.zip_code}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </CardContent>
    </>
  );
};

import React, { useState, useEffect } from "react";
import {
  Grid,
  CardHeader,
  CardContent,
  Divider,
  Checkbox,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import callApi from "../../api";

const initShippingAddress = {
  province_city: 26,
  town_district: "",
  street: "",
  zip_code: 0,
}

const initPayment = {
  payment_id: 1,
  card_number: "",
  expire_date: "",
  security_number: ""
}

export const Payment = ({ provinceCityList, townDistrictList, paymentList }) => {
  const [sameShippingAddress, setSameShippingAddress] = useState(localStorage.getItem("sameShippingAddress") !== undefined ? localStorage.getItem("sameShippingAddress") : false);

  const handleCheckBoxChange = (event) => {
    localStorage.setItem("sameShippingAddress", !sameShippingAddress);
    setSameShippingAddress(!sameShippingAddress);
  };

  const [townDistrict, setTownDistrict] = useState([{}]);
  const [payment, setPayment] = useState(JSON.parse(localStorage.getItem("payment")) !== null ? JSON.parse(localStorage.getItem("payment")) : initPayment);
  const [billingAddress, setBillingAddress] = useState(initShippingAddress);

  const handleChange = (event) => {
    event.preventDefault();
    setBillingAddress({
      ...billingAddress,
      [event.target.name]: event.target.value,
    });
    setPayment({
      ...payment,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    if (payment.payment_id !== "") {
      localStorage.setItem("payment", JSON.stringify(payment));
    }
  }, [payment]);

  useEffect(() => {
    localStorage.setItem("sameShippingAddress", sameShippingAddress);
  }, [])

  useEffect(() => {
    if (sameShippingAddress) {
      setBillingAddress(JSON.parse(localStorage.getItem("shippingAddress")));
    } else {
      setBillingAddress(initShippingAddress);
    }
  }, [sameShippingAddress])

  useEffect(() => {
    if (billingAddress.province_city !== "") {
      callApi(
        `province-city/get-town-district-by-province-city/${billingAddress.province_city}`,
        "GET",
        null
      ).then((res) => setTownDistrict(res.data));
    }
    localStorage.setItem("billingAddress", JSON.stringify(billingAddress));
  }, [billingAddress]);

  return (
    <>
      <CardHeader title="?????a ch??? thanh to??n" />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={handleCheckBoxChange}
                  checked={sameShippingAddress}
                  inputProps={{ "aria-label": "controlled" }}
                  color="primary"
                />
              }
              label="?????a ch??? giao h??ng gi???ng ?????a ch??? thanh to??n"
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel id="province_city">T???nh/th??nh</InputLabel>
            <Select
              fullWidth
              name="province_city"
              label="T???nh/th??nh"
              onChange={handleChange}
              select
              value={billingAddress?.province_city}
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
            <InputLabel id="town_district">Qu???n/huy???n</InputLabel>
            <Select
              fullWidth
              name="town_district"
              label="Qu???n/huy???n"
              onChange={handleChange}
              select
              value={billingAddress?.town_district}
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
              label="?????a ch??? (???????ng, ph?????ng, x??, ...)"
              name="street"
              value={billingAddress.street}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Zip/Postal code"
              name="zip_code"
              placeholder="70000"
              value={billingAddress.zip_code}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardHeader title="Th??ng tin th???" />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <InputLabel id="payment_id">Lo???i th???</InputLabel>
            <Select
              fullWidth
              name="payment_id"
              label="Lo???i th???"
              onChange={handleChange}
              select
              value={payment.payment_id}
              MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
            >
              {paymentList.map((option) => (
                <MenuItem key={option._id} value={option._id}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="S??? th???"
              onChange={handleChange}
              value={payment.card_number}
              name="card_number"
              placeholder="xxxx-xxxx-xxxx-xxxx"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Ng??y h???t h???n"
              name="expire_date"
              value={payment.expire_date}
              onChange={handleChange}
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              onChange={handleChange}
              label="M?? b???o v???"
              value={payment.security_code}
              name="security_code"
              placeholder="xxx"
            />
          </Grid>
        </Grid>
      </CardContent>
    </>
  );
};

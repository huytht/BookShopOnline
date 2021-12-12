import React, { useContext, useEffect, useState } from "react";
import { CardHeader, Divider, CardContent, Typography } from "@mui/material";
import callApi from "../../api";

export const Confirmation = () => {
  const user = JSON.parse(localStorage.getItem("userOrder"));
  const carts = JSON.parse(localStorage.getItem("carts")).Carts;
  const shippingAddress = JSON.parse(localStorage.getItem("shippingAddress"));
  const billingAddress = JSON.parse(localStorage.getItem("billingAddress"));
  const sameShippingAddress = JSON.parse(
    localStorage.getItem("sameShippingAddress")
  );
  const [provinceCitySADetail, setProvinceCitySADetail] = useState({});
  const [townDistrictSADetail, setTownDistrictSADetail] = useState({});
  const [provinceCityBADetail, setProvinceCityBADetail] = useState({});
  const [townDistrictBADetail, setTownDistrictBADetail] = useState({});

  useEffect(() => {
    callApi(
      `province-city/get-province-city/${shippingAddress.province_city.toString()}`
    ).then((res) => {
      setProvinceCitySADetail(res.data);
      if (sameShippingAddress === true) setProvinceCityBADetail(res.data);
    });
    callApi(
      `town-district/get-town-district/${shippingAddress.town_district.toString()}`
    ).then((res) => {
      setTownDistrictSADetail(res.data);
      if (sameShippingAddress === true) setTownDistrictBADetail(res.data);
    });
    if (sameShippingAddress === false) {
      callApi(
        `province-city/get-province-city/${billingAddress.province_city.toString()}`
      ).then((res) => setProvinceCityBADetail(res.data));
      callApi(
        `town-district/get-town-district/${billingAddress.town_district.toString()}`
      ).then((res) => setTownDistrictBADetail(res.data));
    }
  }, []);

  return (
    <>
      <CardHeader title="Thông tin giao hàng" />
      <Divider />
      <CardContent>
        <Typography variant="subtitle1">Địa chỉ giao hàng:</Typography>
        <Typography variant="subtitle2">
          Họ và tên: {user.lastName.concat(" ", user.firstName)}
        </Typography>
        <br />
        <Typography variant="subtitle2">
          Địa chỉ: {shippingAddress.street}
        </Typography>
        <br />
        <Typography variant="subtitle2">
          Tỉnh/thành, Quận/huyện:{" "}
          {townDistrictSADetail.name_with_type?.concat(
            ", ",
            provinceCitySADetail.name
          )}
        </Typography>
        <br />
        <Typography variant="subtitle2">
          Zip code: {shippingAddress.zip_code}
        </Typography>
      </CardContent>
      <CardContent>
        <Typography variant="subtitle1">
          Phương thức giao hàng:{" "}
          <Typography variant="subtitle2"> Miễn phí </Typography>
        </Typography>
      </CardContent>
      <CardHeader title="Thông tin thanh toán" />
      <Divider />
      <CardContent>
        <Typography variant="subtitle1">Địa chỉ thanh toán: </Typography>
        <Typography variant="subtitle2">
          Địa chỉ: {billingAddress.street}
        </Typography>
        <br />
        <Typography variant="subtitle2">
          Tỉnh/thành, Quận/huyện:{" "}
          {townDistrictBADetail.name_with_type?.concat(
            ", ",
            provinceCityBADetail.name
          )}
        </Typography>
        <br />
        <Typography variant="subtitle2">
          Zip code: {billingAddress.zip_code}
        </Typography>
      </CardContent>
    </>
  );
};

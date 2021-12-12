import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import callApi from "../api";
import EventBus from "../common/EventBus";
import { Box, Grid } from '@material-ui/core';
import AccountProfile from './../components/account/AccountProfile';
import AccountProfileDetails from './../components/account/AccountProfileDetails';
import { Container } from '@material-ui/core';

export const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [userInfo, setUserInfo] = useState({});
  useEffect(() => {
    if (user) {
      callApi(`user/get-user/${user.id}`, "GET", null).then((res) =>
        setUserInfo(res.data)
      );
    }

    EventBus.on("logout", () => {
      this.logOut();
    });
    return () => {
      EventBus.remove("logout");
    };
  }, [user]);

  return (
    <>
      <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        py: 3
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={4}
            md={6}
            xs={12}
          >
            <AccountProfile props={userInfo} />
          </Grid>
          <Grid
            item
            lg={8}
            md={6}
            xs={12}
          >
            <AccountProfileDetails props={userInfo} />
          </Grid>
        </Grid>
      </Container>
    </Box>
    </>
  );
};

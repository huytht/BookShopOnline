import React, { useEffect, useState } from "react";
import { styled } from "@material-ui/core";
import { AppBar, Toolbar, IconButton } from "@material-ui/core";
import { Tooltip } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { MenuList } from "@material-ui/core";
import { Paper } from "@material-ui/core";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Popper from "@mui/material/Popper";
import { Link } from "react-router-dom";
import { GridList, GridListTile } from "@material-ui/core";
import { AspectRatio } from "@material-ui/icons";
import { display, height } from "@mui/system";
import callApi from './../../api/index';
import { GetAllCategory } from "../../actions/product";
import { useDispatch, useSelector } from "react-redux";

const Container = styled("div")({
  height: 60,
});
const Wrapper = styled("div")({
  padding: 10,
  flex: 1,
  justifyContent: "space-between",
});

const Right = styled("div")({
  justifyContent: "flex-end",
  display: "flex",
  flex: 1,
});

const MenuStore = () => {
  const [open, setOpen] = useState(false);
  const { _categories } = useSelector(state => state.product)
  const dispatch = useDispatch();
  const anchorRef = React.useRef(null);
  const params = new URL(document.location);

  useEffect(() => {
    if (params.pathname.includes("bookcate") || params.pathname.includes("search")) {
      setOpen(false);
    }
  }, [params])

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    callApi('category', 'GET', null)
    .then(res => dispatch(GetAllCategory(res.data)))
  },[])

  const handleListKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <Container>
      <Wrapper>
        <AppBar
          position="static"
          style={{
            backgroundColor: "rgba(86, 141, 229, 1)",
            maxHeight: 50,
            justifyContent: "center",
            border: 0,
          }}
        >
          <Toolbar style={{}}>
            <Button
              ref={anchorRef}
              id="composition-button"
              aria-controls={open ? "composition-menu" : undefined}
              aria-expanded={!open ? "true" : undefined}
              aria-haspopup="true"
              style={{ color: "white" }}
              onClick={handleToggle}
            >
              <MenuIcon />&nbsp;
              Danh mục thể loại
            </Button>
            <Popper
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              placement="bottom-start"
              transition
             
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    borderRadius: "0px",
                    border:'0.1px solid rgba(86, 141, 229, 1)',
                    marginTop:'5px',
                   
                    transformOrigin:
                      placement === "bottom-start" ? "left top" : "left bottom",
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList
                        autoFocusItem={open}
                        id="composition-menu"
                        aria-labelledby="composition-button"
                        onKeyDown={handleListKeyDown}
                        style={{ marginTop: "1ch" }}
                      >
                        {_categories.map((option) => (
                          <Link key={option._id} style={{textDecoration:'none'}} to={`/bookcate?id=${option._id}`}>
                            <MenuItem
                              key={option._id}
                              style={{ width: "22ch", justifyContent: "center" }}
                              onClick={handleClose}
                            >
                              {option.name}
                            </MenuItem>
                          </Link>
                        ))}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
            <Right>
              <Tooltip
                title="Tổng đài chăm sóc và Hỗ trợ Khách hàng hoạt động suốt 7 ngày trong tuần
                                        Thứ 2 - 7: hoạt động từ 7:30 - 20:00
                                        Chủ nhật: hoạt động từ 8:00 - 17:00"
                style={{ color: "white" }}
                arrow
              >
                <Button>Hotline:0123456789</Button>
              </Tooltip>
            </Right>
          </Toolbar>
        </AppBar>
      </Wrapper>
    </Container>
  );
};
export default MenuStore;

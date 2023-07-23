// import for appbar
import * as React from "react";
import logo from "../assets/burung_nusatrip.png";
import Hamburger from "./humberger";
import { Toolbar, AppBar } from "@mui/material";
import { useMediaQuery } from "react-responsive";

// import for humberger
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";

// import for main box whaite
import {
  TextField,
  Button,
  Grid,
  Autocomplete,
  Select,
  Input,
} from "@mui/material";

const Dashboard = () => {
  // responsive appbar

  const isMobileDevice = useMediaQuery({
    query: "(max-device-width: 480px) and (min-device-width: 320px)",
  });

  const isTablet = useMediaQuery({
    query: "(max-device-width: 768px) and (min-device-width: 481px)",
  });

  const isLaptop = useMediaQuery({
    query: "(max-device-width: 1024px) and (min-device-width: 769px)",
  });

  const isDesktop = useMediaQuery({
    query: "(min-device-width: 1025px)",
  });

  //   properti for humberger
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar sx={{ bgcolor: "#004360", boxShadow: "none", paddingX: "50px" }}>
        {isMobileDevice && (
          <Toolbar sx={{ justifyContent: "flex-end" }}>
            <div sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
              <img
                src={logo}
                alt="logo"
                sx={{ mr: 1, marginTop: 16, maxWidth: 200, maxHeight: 200 }}
                style={{
                  marginTop: "16px",
                  width: 186,
                  height: 39,
                }}
              />
            </div>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                textAlign: "center",
                marginLeft: "auto",
              }}
            >
              <Tooltip title="Humberger Menu">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  <MenuIcon
                    sx={{ width: 32, height: 32, color: "#ffffff" }}
                  ></MenuIcon>
                </IconButton>
              </Tooltip>
            </Box>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleClose}>
                <Avatar /> Scraping
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Avatar /> Dashboard
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <PersonAdd fontSize="small" />
                </ListItemIcon>
                Add another account
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        )}
        {isDesktop && (
          <Toolbar sx={{ justifyContent: "flex-end" }}>
            <div sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
              <img
                src={logo}
                alt="logo"
                sx={{ mr: 1, marginTop: 16 }}
                style={{
                  marginTop: "16px",
                }}
              />
            </div>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                textAlign: "center",
                marginLeft: "auto",
              }}
            >
              <Tooltip title="Humberger Menu">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  <MenuIcon
                    sx={{ width: 32, height: 32, color: "#ffffff" }}
                  ></MenuIcon>
                </IconButton>
              </Tooltip>
            </Box>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleClose}>
                <Avatar /> Scraping
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Avatar /> Dashboard
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <PersonAdd fontSize="small" />
                </ListItemIcon>
                Add another account
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        )}
        {isTablet && (
          <Toolbar sx={{ justifyContent: "flex-end" }}>
            <div sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
              <img
                src={logo}
                alt="logo"
                sx={{ mr: 1, marginTop: 16 }}
                style={{
                  marginTop: "16px",
                }}
              />
            </div>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                textAlign: "center",
                marginLeft: "auto",
              }}
            >
              <Tooltip title="Humberger Menu">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  <MenuIcon
                    sx={{ width: 32, height: 32, color: "#ffffff" }}
                  ></MenuIcon>
                </IconButton>
              </Tooltip>
            </Box>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleClose}>
                <Avatar /> Scraping
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Avatar /> Dashboard
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <PersonAdd fontSize="small" />
                </ListItemIcon>
                Add another account
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        )}
        {isLaptop && (
          <Toolbar sx={{ justifyContent: "flex-end" }}>
            <div sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
              <img
                src={logo}
                alt="logo"
                sx={{ mr: 1, marginTop: 16 }}
                style={{
                  marginTop: "16px",
                }}
              />
            </div>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                textAlign: "center",
                marginLeft: "auto",
              }}
            >
              <Tooltip title="Humberger Menu">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  <MenuIcon
                    sx={{ width: 32, height: 32, color: "#ffffff" }}
                  ></MenuIcon>
                </IconButton>
              </Tooltip>
            </Box>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleClose}>
                <Avatar /> Scraping
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Avatar /> Dashboard
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <PersonAdd fontSize="small" />
                </ListItemIcon>
                Add another account
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        )}
      </AppBar>

      <main>
        <div className="rectangle-13">
          {/* <form onSubmit={handleSubmit}> */}
          <div >
            <Grid container justifyContent="center" direction={"row"} sx = {{paddingX : 10}} >
              <Grid
                item
                xs={12}
                sm
                md
                className="form-text"
                style={{ margin: 1 }}
              >
                <div
                  style={{
                    // width: "100%",
                    height: "74px",
                    background: "#F6F5F5",
                    borderTopLeftRadius: 25,
                    borderBottomLeftRadius: 25,
                  }}
                ></div>
              </Grid>

              <Grid
                item
                xs={12}
                sm
                md
                className="form-text"
                style={{ margin: 1 }}
              >
                <div
                  style={{
                    // width: "100%",
                    height: "74px",
                    background: "#F6F5F5",
                  }}
                ></div>
              </Grid>

              <Grid
                item
                xs={12}
                sm
                md
                className="form-text"
                style={{ margin: 1 }}
              >
                <div
                  style={{
                    // width: "100%",
                    height: "74px",
                    background: "#F6F5F5",
                  }}
                ></div>
              </Grid>

              <Grid
                item
                xs={12}
                sm
                md
                className="form-text"
                style={{ margin: 1 }}
              >
                <div
                  style={{
                    // width: "100%",
                    height: "74px",
                    background: "#F6F5F5",
                  }}
                ></div>
              </Grid>

              <Grid
                item
                xs={12}
                sm
                md
                className="form-text"
                style={{ margin: 1 }}
              >
                <div
                  style={{
                    //   width: "100%",
                    height: "74px",
                    background: "#F6F5F5",
                  }}
                ></div>
              </Grid>

              <Grid
                item
                xs={12}
                sm
                md
                style={{ margin: 1 }}
                justifyContent="center"
              >
                <div
                  style={{
                    //   width: "100%",
                    height: "74px",
                    background: "#F6F5F5",
                    borderTopRightRadius: 25,
                    borderBottomRightRadius: 25,
                  }}
                ></div>
              </Grid>
            </Grid>
          </div>
        </div>
        
        <div className="content" style={{height : 100, paddingLeft : 10, paddingRight : 10}}>

            <div style={{ height: 450, background: '#F6F5F5', borderRadius: 25}} >



            </div>
        </div>


      </main>
    </>
  );
};

export default Dashboard;

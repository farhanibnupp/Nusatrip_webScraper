import * as React from "react";
import logo from "../assets/burung_nusatrip.png";
// import Hamburger from './humberger';
import { Toolbar, AppBar } from "@mui/material";
import { useMediaQuery } from "react-responsive";
// import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Grid, Input} from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
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


const Scraping = () => {
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

  const [inputCount, setInputCount] = useState(0);
  const [formData, setFormData] = useState({
    from1: "",
    to1: "",
    depart1: "",
    cabin1: "",
    platform1: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddInput = () => {
    setInputCount(inputCount + 1);
    setFormData({
      ...formData,
      [`from${inputCount + 2}`]: "",
      [`to${inputCount + 2}`]: "",
      [`depart${inputCount + 2}`]: "",
      [`cabin${inputCount + 2}`]: "",
      [`platform${inputCount + 2}`]: "",
    });
  };

  const handleRemoveInput = () => {
    if (inputCount > 0) {
      setInputCount(inputCount - 1);
      const newFormData = { ...formData };
      delete newFormData[`from${inputCount + 1}`];
      delete newFormData[`to${inputCount + 1}`];
      delete newFormData[`depart${inputCount + 1}`];
      delete newFormData[`cabin${inputCount + 1}`];
      delete newFormData[`platform${inputCount + 1}`];
      setFormData(newFormData);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:5000/api/submit-form", formData)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const renderInputs = () => {
    const inputs = [];

    for (let i = 0; i < inputCount; i++) {
      const inputIndex = i + 2;

      inputs.push(
        <React.Fragment key={i}>
          <Grid item xs={10} sm={2} className='form-text' style={{ margin: 5 }}>
            <Input
              label={`from${inputIndex}`}
              variant="outlined"
              className="input-style"
              placeholder='From'
              disableUnderline={true}
              style={{ paddingLeft: 15, height: 35 }}
              name={`from${inputIndex}`}
              value={formData[`from${inputIndex}`]}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={10} sm={2} className='form-text' style={{ margin: 5 }}>
                <Input
                  label={`to${inputIndex}`}
                  variant="outlined"
                  className="input-style"
                  placeholder='To'
                  disableUnderline={true}
                  style={{ paddingLeft: 15, height: 35 }}
                  name={`to${inputIndex}`}
                  value={formData[`to${inputIndex}`]}
                  onChange={handleInputChange}
                />
            </Grid>
            <Grid item xs={10} sm={2} className='form-text' style={{ margin: 5 }}>
                <Input
                  label={`depart${inputIndex}`}
                  variant="outlined"
                  className="input-style"
                  placeholder='Depart'
                  disableUnderline={true}
                  style={{ paddingLeft: 15, height: 35 }}
                  name={`depart${inputIndex}`}
                  value={formData[`depart${inputIndex}`]}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={10} sm={2} className='form-text' style={{ margin: 5 }}>
                <Input
                  label={`cabin${inputIndex}`}
                  variant="outlined"
                  className="input-style"
                  placeholder='Cabin'
                  disableUnderline={true}
                  style={{ paddingLeft: 15, height: 35 }}
                  name={`cabin${inputIndex}`}
                  value={formData[`cabin${inputIndex}`]}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={10} sm={2} className='form-text' style={{ margin: 5 }}>
                <Input
                  label={`platform${inputIndex}`}
                  variant="outlined"
                  className="input-style"
                  placeholder='Platform'
                  disableUnderline={true}
                  style={{ paddingLeft: 15, height: 35 }}
                  name={`platform${inputIndex}`}
                  value={formData[`platform${inputIndex}`]}
                  onChange={handleInputChange}
                />
              </Grid>
          {/* Add other inputs with appropriate names and values */}
          {/* ... */}
        </React.Fragment>
      );
    }
    return inputs;
  };

//   ========================untuk table===========================
  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }
  
  const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];
//   ============================ untuk humberger ====================
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
      {/* appbar */}
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
        {/* main */}


        {/* form */}
        <div className="rectangle-13">
          <div className="form">
            <form onSubmit={handleSubmit}>
              <Grid
                container
                justifyContent="center"
                className="form-container"
              >
                <Grid item container xs={10} sm={10} justifyContent="center">
                  <Grid
                    item
                    xs={10}
                    sm={2}
                    className="form-text"
                    style={{ margin: 5 }}
                  >
                    <Input
                      label="from1"
                      variant="outlined"
                      className="input-style"
                      placeholder="From"
                      disableUnderline={true}
                      style={{ paddingLeft: 15, height: 35 }}
                      name="from1"
                      value={formData.from1}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={10}
                    sm={2}
                    className="form-text"
                    style={{ margin: 5 }}
                  >
                    <Input
                      label="to1"
                      variant="outlined"
                      className="input-style"
                      placeholder="To"
                      disableUnderline={true}
                      style={{ paddingLeft: 15, height: 35 }}
                      name="to1"
                      value={formData.to1}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={10}
                    sm={2}
                    className="form-text"
                    style={{ margin: 5 }}
                  >
                    <Input
                      label="depart1"
                      variant="outlined"
                      className="input-style"
                      placeholder="Depart"
                      disableUnderline={true}
                      style={{ paddingLeft: 15, height: 35 }}
                      name="depart1"
                      value={formData.depart1}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={10}
                    sm={2}
                    className="form-text"
                    style={{ margin: 5 }}
                  >
                    <Input
                      label="cabin1"
                      variant="outlined"
                      className="input-style"
                      placeholder="Cabin"
                      disableUnderline={true}
                      style={{ paddingLeft: 15, height: 35 }}
                      name="cabin1"
                      value={formData.cabin1}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={10}
                    sm={2}
                    className="form-text"
                    style={{ margin: 5 }}
                  >
                    <Input
                      label="platform1"
                      variant="outlined"
                      className="input-style"
                      placeholder="Platform"
                      disableUnderline={true}
                      style={{ paddingLeft: 15, height: 35 }}
                      name="platform1"
                      value={formData.platform1}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  {renderInputs()}
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={1}
                  style={{ margin: 5 }}
                  justifyContent="center"
                >
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ fontSize: "12px", height: 50 }}
                    color="primary"
                  >
                    Submit
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ fontSize: "12px", height: 50 }}
                    color="primary"
                    onClick={handleAddInput}
                  >
                    +
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ fontSize: "12px", height: 50 }}
                    color="primary"
                    onClick={handleRemoveInput}
                  >
                    -
                  </Button>
                </Grid>
              </Grid>
            </form>
          </div>
        </div>

        {/* download */}
        <div className="">
        <form action="#" method="POST">
          <div className="download">
            <p className="text-end">
              <a href="#" className="download-data-as-csv ">
                Download data as csv
              </a>
            </p>
          </div>
        </form>
      </div>

      {/* table */}
      <div className='table'>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell>Dessert (100g serving)</TableCell>
                    <TableCell align="right">Calories</TableCell>
                    <TableCell align="right">Fat&nbsp;(g)</TableCell>
                    <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                    <TableCell align="right">Protein&nbsp;(g)</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {rows.map((row) => (
                    <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell component="th" scope="row">
                        {row.name}
                    </TableCell>
                    <TableCell align="right">{row.calories}</TableCell>
                    <TableCell align="right">{row.fat}</TableCell>
                    <TableCell align="right">{row.carbs}</TableCell>
                    <TableCell align="right">{row.protein}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
    </div>
      </main>
    </>
  );
};
export default Scraping;

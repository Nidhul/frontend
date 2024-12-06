import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import "@fontsource/poppins";
import "./Navbar.css";
import StockList from "../Stocks/StockList";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { Navigate } from "react-router-dom";

function Navbar({ onToggleDarkMode, darkMode }) {

  const navigate =useNavigate()

  const theme = useTheme();
  const isBelow700px = useMediaQuery("(max-width:700px)");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [stocklistOpen, setStocklistOpen] = useState(false);

  const toggleDrawer = (open) => () => setDrawerOpen(open);
  const toggleStocklist = () => setStocklistOpen(!stocklistOpen);

  const drawerItems = [
    { text: "Home", path: "/home" },
    { text: "Holdings", path: "/holdings"},
    { text: "Orders", path: "/orders" },
    { text: "Positions", path: "/positions" },
    { text: "GTrade" , path:"/multiclient" },
  ];

  // useEffect(()=>{
  //   console.log("whiteeee",darkMode)
  // })
  const logout = () =>{
    localStorage.clear()
    navigate('')
    window.location.reload()
  }
  return (
    <Box sx={{ flexGrow: 1 }} className="navbar">
      <AppBar
        sx={{
          backgroundColor: darkMode ? "#121212" : "white",
          color: darkMode ? "#E0E0E0" : "black",
        }}
      >
        <Toolbar
          className="toolBar"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          
          {/* Search Icon for small screens */}
          {isBelow700px && (
            <IconButton
              edge="start"
              onClick={toggleStocklist}
              sx={{ color: darkMode ? "#E0E0E0" : "black" }}
            >
              <SearchIcon />
            </IconButton>
          )}

          {/* Logo */}
          <Typography>
            <img
              className="navbar-logo"
              src="/asset/images/BullsMoves-logo.png"
              alt="GreeksLabs Logo"
              style={{
                height: "40px",
                padding: "5px 10px",
                objectFit: "contain",
              }}
            />
          </Typography>

          {/* Navbar Items */}
          {!isBelow700px && (
            <Box
              className="navbar-items"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexGrow: 1,
                gap: "10px",
              }}
              // sx={{
              //   display: "flex",
              //   justifyContent: "center",
              //   marginLeft: 1,
              //   gap: "10px",
              // }}
            >
              {drawerItems.map((item, index) => (
                <Button
                  color="inherit"
                  key={index}
                  component={Link}
                  to={item.path}
                  sx={{
                    fontFamily: "Poppins",
                    position: "relative",
                    "&:hover::after": {
                      content: '""',
                      position: "absolute",
                      left: "50%",
                      bottom: -5,
                      transform: "translateX(-50%)",
                      width: "100%",
                      height: "2px",
                      backgroundColor: darkMode ? "#BB86FC" : "green",
                      transition: "width 0.3s ease",
                    },
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          {/* Dark Mode Toggle */}
          <Button
            className="navbar-button"
            color="inherit"
            onClick={onToggleDarkMode}
            sx={{
              marginLeft: "auto",
              color: darkMode ? "#E0E0E0" : "black",
            }}
          >
            {darkMode ? <DarkModeIcon /> : <LightModeIcon />}
          </Button>

          <Link to="/profile">
            <button className="profile" style={{ border: "none" }}>
              <i className="bi bi-person-circle"></i>
            </button>
          </Link>
          {/* Menu Icon or Logout Icon based on screen width */}
          {isBelow700px ? (
            <IconButton
              edge="end"
              onClick={toggleDrawer(true)}
              sx={{ color: darkMode ? "#E0E0E0" : "black" }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <i className="bi bi-box-arrow-right logout" onClick={logout}></i>
          )}
        </Toolbar>
      </AppBar>

      {/* Toolbar Spacer */}
      <Toolbar />

      {/* Menu Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 250,
            backgroundColor: darkMode ? "#1F1F1F" : "#0E7594",
            color: darkMode ? "#E0E0E0" : "white",
            textAlign: "center",
            py: 2,
          }}
        >
          <Typography variant="h6" component="div">
            Menu
          </Typography>
        </Box>
        <Divider />
        <List sx={{ width: 250 }}>
          {drawerItems.map((item, index) => (
            <ListItem
              button
              component={Link}
              to={item.path}
              key={index}
              sx={{
                transition: "transform 0.2s ease",
                "&:hover": {
                  backgroundColor: darkMode ? "#BB86FC" : "lightgray",
                  transform: "scale(1.05)",
                },
              }}
            >
              <ListItemText
                primary={item.text}
                sx={{ color: darkMode ? "#E0E0E0" : "black" }}
              />
            </ListItem>
          ))}
          <div className="logout-btn">
            <i className="bi bi-box-arrow-right"></i>
          </div>
        </List>
      </Drawer>

      {/* Stocklist Drawer */}
      <Drawer anchor="left" open={stocklistOpen} onClose={toggleStocklist}>
        <StockList darkMode={darkMode} />
      </Drawer>
    </Box>
  );
}

export default Navbar;

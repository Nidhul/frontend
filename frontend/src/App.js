import React, { useEffect, useState } from "react";
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  useMediaQuery,
  Grid,
  Drawer,
  IconButton,
  Alert,
} from "@mui/material";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Home from "./components/home/Home";
import Order_details from "./components/OrderDetails/Order_details";
// import Positions from "./components/Positions/Positions"; // Import Positions component
import DarkModeToggle from "./components/DarkModeToggle"; // Import Dark Mode Toggle Component
import StockList from "./components/Stocks/StockList"; // Import StockList component
import SearchIcon from "@mui/icons-material/Search"; // Import search icon
import StockChart from "./components/Chart/StockChart";
import Login from "./components/Login/Login";

// import Order_details from "./components/OrderDetails/Order_details";
import Strategies from "./components/Strategies/Strategies";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Positions from "./components/Positions/Positions";
import Profile from "./components/Profile/Profile";
import Multiclient from "./components/Multiclient/Multiclient";
import Holding from "./components/Holdings/Holding";
import Childgroup from "./components/ChildGroup/Childgroup";

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;
  const isMobile = useMediaQuery("(max-width:700px)");
  const [darkMode, setDarkMode] = useState(false); // State to track dark mode
  const [selectedStock, setSelectedStock] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication status

  // const navigate = useNavigate();

  // Create light and dark themes
  const lightTheme = createTheme({
    palette: {
      mode: "light",
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  // Toggle dark mode
  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  const handleStockSelect = (stock) => {
    setSelectedStock(stock); // Set the selected stock in state
  };

  useEffect(() => {
    const access = localStorage.getItem("accessToken");
    // setToken(localStorage.getItem("accessToken"));
    if (access) {
      brokerDetails(access);
    } else {
      // window.location.href="/"
    }
    // console.log('hello',process.env.REACT_APP_WEBSOCKET_URL)
  }, [apiUrl]);

  const brokerDetails = async (accessToken) => {
    try {
      console.log("Access token:", accessToken); // Log the token being sent
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL_ACCOUNT}master-broker/filterbyuser/`,
        {
          headers: {
            Authorization: `Token ${accessToken}`,
          },
        }
      );

      // Log the full response object
      console.log("Full API response:", response);

      // Extract and log specific data from the response
      const data = response.data;
      console.log("Response data:", data);

      const brokerData = data.data; // Assuming `data` contains a `data` field
      console.log("Broker data:", brokerData);

      // Handle response data
      if (brokerData && brokerData.length > 0) {
        setIsAuthenticated(true);
        isMobile(true);
        console.log("Authentication successful");
      } else {
        alert("No data found for the broker group.");
      }
    } catch (error) {
      // Log the full error response if available
      console.error("Error response:", error.response?.data || error.message);

      if (error.response?.data?.detail === "Invalid token.") {
        // console.error("Invalid token detected.");
        // alert("Invalid token. Redirecting to login.");
        localStorage.removeItem("accessToken"); // Clear invalid token
        // navigate("/login"); // Redirect to login page
      } else {
      }
    }
  };

  useEffect(() => {
    // Simulate fetching authentication status from an API or local storage
    const authStatus = localStorage.getItem("authToken"); // Example token storage
    setIsAuthenticated(!!authStatus); // Set isAuthenticated to true if authToken exists
  }, []);

  return (
    <div className="main">
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <CssBaseline />

        <Router>
          {isAuthenticated ? ( // Show app only if authenticated
            <>
              <Navbar
                onToggleDarkMode={() => setDarkMode(!darkMode)}
                darkMode={darkMode}
              />
              {/* <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/" element={<Login />} />
              <Route path="/order-details" element={<Order_details />} />
              <Route path="/strategies" element={<Strategies />} />
            </Routes> */}
              {!isMobile ? ( // Grid layout for large screens
                <Grid container>
                  <Grid item xs={3}>
                    <StockList onStockSelect={handleStockSelect} />
                  </Grid>
                  <Grid item xs={9} className="main-page">
                    <Routes>
                      <Route
                        className="home-page"
                        path="/home"
                        element={<Home isDarkMode={darkMode} />}
                      />
                      {/* <Route path="/mul" element={<Multiclient />} /> */}
                      <Route path="/orders" element={<Order_details />} />
                      <Route path="/positions" element={<Positions />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/multiclient" element={<Multiclient />} />

                      <Route path="/" element={<Login />} />

                      <Route path="/holdings" element={<Holding />} />

                      <Route path="/group" element={<Childgroup />} />

                      {/* <Route path="/alert" element={<Alerts/>} /> */}
                      {selectedStock && (
                        <Route
                          path="/"
                          element={<StockChart stockName={selectedStock} />}
                        />
                      )}
                    </Routes>
                  </Grid>
                </Grid>
              ) : (
                <div>
                  <IconButton
                    onClick={toggleDrawer(true)}
                    sx={{ position: "fixed", top: 16, left: 16 }}
                  >
                    <SearchIcon />
                  </IconButton>
                  <Drawer
                    anchor="left"
                    open={drawerOpen}
                    onClose={toggleDrawer(false)}
                  >
                    <StockList onStockSelect={handleStockSelect} />
                  </Drawer>
                  <Routes>
                    <Route
                      path="/home"
                      element={<Home isDarkMode={darkMode} />} // Ensure Home is displayed on mobile
                    />
                    <Route path="/orders" element={<Order_details isDarkMode={darkMode} />} />
                    <Route path="/positions" element={<Positions />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/multiclient" element={<Multiclient />} />
                    <Route path="/" element={<Login />} />

                    {/* <Route path="/orders" element={<multiclient />} /> */}
                  </Routes>
                </div>
              )}
            </>
          ) : (
            // Show login page if not authenticated
            <Routes>
              <Route path="/" element={<Login />} />
            </Routes>
          )}
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;

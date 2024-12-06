import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { TrendingDown, TrendingUp } from "@mui/icons-material";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "@fontsource/poppins";
import "./Home.css";
import axios from "axios";

const ChevronLeft = () => <span>{"<"}</span>;
const ChevronRight = () => <span>{">"}</span>;

// CustomArrow for StockTicker
const CustomArrow = ({ className, style, onClick, icon: Icon }) => (
  <div
    className={className}
    style={{
      ...style,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "rgba(0, 0, 0, 0.1)",
      borderRadius: "50%",
      width: "20px",
      height: "20px",
    }}
    onClick={onClick}
  >
    <Icon size={12} />
  </div>
);

const Home = ({ isDarkMode }) => {
  const [stockData, setStockData] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [accountData, setaccountData] = useState(0)
  const [profitLoss, setprofitLoss] = useState(0)

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    
    if (token) {
      angelLogin(token)
      fetchData(token);
      
    }
    else{
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const socket = new WebSocket(
      process.env.REACT_APP_WEBSOCKET_URL + "ws/market-data/"
    );

    socket.onopen = () => {
      console.log("WebSocket connection established.");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Market data from server:", data);

      const updatedStockData = Object.entries(data).map(
        ([token, stockInfo]) => ({
          name: stockInfo.stock_name,
          ltp: stockInfo.ltp,
          profit_loss: stockInfo.profit_loss,
        })
      );
      setStockData(updatedStockData);
    };

    socket.onclose = (event) => {
      console.log("WebSocket connection closed:", event);
    };

    socket.onerror = (error) => {
      console.log("WebSocket error:", error);
    };

    return () => {
      socket.close();
    };
  }, []);


  const angelLogin = async (token) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/angel/angel_login/",
        {},
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      const da = response.data;

      setaccountData(Number(da.data.available_cash).toFixed(2));


      console.log("Balance:", da.data.available_cash);

    } catch (error) {
      console.error("Error logging in:", error);
    }
  };



  const fetchData = async (token) => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/angel/angel_holdings/",{
        headers:{
          Authorization:`Token ${token}`
        }
      });
      console.log('history',response.data.data.totalholding)
      setprofitLoss(response.data.data.totalholding.totalpnlpercentage);
       // Initialize with all data
    } catch (error) {
      console.log("Error fetching positions", error);
    }
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    centerMode: true,
    centerPadding: "15px",
    prevArrow: <CustomArrow icon={ChevronLeft} />,
    nextArrow: <CustomArrow icon={ChevronRight} />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 4, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 576, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 375, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  const SummaryBox = ({ title, subtitle, value }) => (
    <Box
      sx={{
        padding: 2,
        borderRadius: 5,
        backgroundColor: isDarkMode ? "#444" : "#f5f5f5",
        boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
        "&:hover": { boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)" },
        height: "110px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontFamily: "Poppins",
          fontWeight: "bold",
          color: isDarkMode ? "#FFF" : "#333",
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontFamily: "Poppins",
          marginTop: "4px",
          color: isDarkMode ? "#DDD" : "#666",
        }}
      >
        {subtitle}
      </Typography>
      <Typography
        variant="h6"
        sx={{
          fontFamily: "Poppins",
          fontWeight: "500",
          marginTop: "8px",
          color: isDarkMode ? "#FFF" : "#333",
        }}
      >
        {value}
      </Typography>
    </Box>
  );

  const options = [
    {
      icon: "/asset/images/equity.png",
      title: "Option Hedging Training",
      description: "Master risk management in options trading.",
    },
    {
      icon: "/asset/images/mutual funds.png",
      title: "Mutual Funds",
      description: "Grow your wealth with expert-managed funds.",
    },
    {
      icon: "/asset/images/exchanges.png",
      title: "Unlisted Shares",
      description: "Unlock Potential: Invest in Unlisted Shares.",
    },
    {
      icon: "/asset/images/bond.png",
      title: "Bonds",
      description: "Stable investments offering predictable interest income.",
    },
    {
      icon: "/asset/images/custom.png",
      title: "Custom Algo Developments",
      description:
        "Custom algorithms built to fit your unique trading strategies.",
    },
  ];

  return (
    <Box
      width={isMobile ? "100%" : "75%"}
      sx={{ padding: 1, position: "relative", height: "100%" }}
    >
      <div className="home-page">
        <Box
          sx={{
            position: "absolute",
            top: 20,
            right: 0,
            width: "100%",
            backgroundColor: "transparent",
            borderRadius: "15px",
            overflow: "hidden",
            padding: "10px",
            zIndex: 1,
          }}
        >
          {stockData.length === 0 ? (
            <Box>No stock data available</Box>
          ) : (
            <Slider {...settings}>
              {stockData.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    textAlign: "center",
                    borderRadius: "20px",
                    background: isDarkMode
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.03)",
                    padding: "5px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s ease",
                    marginLeft: "15px",
                    "&:hover": {
                      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      marginBottom: "2px",
                      fontSize: "0.9rem",
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      marginBottom: "2px",
                      fontSize: "1rem",
                    }}
                  >
                    {item.ltp}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color:
                        item.profit_loss && parseFloat(item.profit_loss) < 0
                          ? "#F44336"
                          : "#4CAF50",
                    }}
                  >
                    {item.profit_loss &&
                    parseFloat(item.profit_loss) < 0 ? (
                      <TrendingDown size={14} />
                    ) : (
                      <TrendingUp size={14} />
                    )}
                    <Typography
                      variant="caption"
                      sx={{
                        marginLeft: "3px",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                      }}
                    >
                      {item.profit_loss
                        ? parseFloat(item.profit_loss).toFixed(2)
                        : "N/A"}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Slider>
          )}
        </Box>
      </div>

      <Grid container spacing={2} sx={{ marginTop: 17, width: "100%" }}>
        <Grid item xs={12} md={6}>
          <SummaryBox
            title="Portfolio"
            subtitle="Overall Profits / Loss"
            value={`${profitLoss} % `}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <SummaryBox
            title="Account"
            subtitle="Available Balance"
            value={`₹ ${accountData}`}

          />
        </Grid>
      </Grid>

      <Grid
        container
        spacing={2}
        sx={{
          marginTop: 5,
          marginBottom: 5,
          width: "100%",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        {options.map((option, index) => (
          <Grid item xs={6} md={3} key={index}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px",
                borderRadius: "8px",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.1)",
                  boxShadow: "0px 6px 20px rgba(0,0,0,0.15)",
                },
              }}
            >
              <img
                src={option.icon}
                alt={option.title}
                style={{
                  width: "45px",
                  height: "45px",
                  objectFit: "contain",
                  marginBottom: "8px",
                }}
              />
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "500",
                  textAlign: "center",
                  color: isDarkMode ? "#FFF" : "#333",
                }}
              >
                {option.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  marginTop: "6px",
                  fontWeight: "normal",
                  textAlign: "center",
                  fontSize: "0.8rem",
                  color: isDarkMode ? "#DDD" : "#666",
                }}
              >
                {option.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Home;

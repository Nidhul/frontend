import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Typography, useTheme } from "@mui/material";
import CandlestickChartIcon from "@mui/icons-material/CandlestickChart";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import "./stockList.css"; // Custom CSS for additional styling
import BuyStockModal from "../Modal/Modal";
import DeleteIcon from "@mui/icons-material/Delete";
import { event } from "jquery";

const StockList = ({ onStockSelect }) => {
  const [stockNames, setStockNames] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Use only one state for search query
  const [isFocused, setIsFocused] = useState(false);
  const [selectedStock, setSelectedStock] = useState("");
  const [showChart, setShowChart] = useState(false);
  const [openBuyDialog, setOpenBuyDialog] = useState(false);
  const theme = useTheme();
  const stockListRef = useRef(null);
  const [selectedstockcode, setselectedstockcode] = useState("");
  const [buyOrSell, setbuyOrSell] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
    }
    fetchStockData();
  }, [navigate]);

  // Fetch stock data
  const fetchStockData = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/v1/market_data/stock/"
      );
      setStockNames(response.data.data); // Set stock names directly from the response
      console.log(response.data.data); // Log the stock data for debugging
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  // Filter stocks based on search query
  const filteredStocks = stockNames.filter((stock) =>
    stock.stock_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = () => {
    setSelectedStock("");
    setShowChart(false);
  };

  const handleBuySellClick = (stock, e) => {
    setSelectedStock(stock.stock_name);
    setselectedstockcode(stock.stock_code);
    setOpenBuyDialog(true);
    setbuyOrSell(e);

    console.log(e, stock.stock_name, stock.stock_code);
  };

  const handleCloseDialog = () => {
    setSelectedStock(null);
    setOpenBuyDialog(false);
  };

  const onSelectStock = (stock) => {
    setSelectedStock(stock);
  };

  const handleCandlestickClick = (stock) => {
    setSelectedStock(stock);
    setShowChart(true);
    onStockSelect(stock);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        stockListRef.current &&
        !stockListRef.current.contains(event.target)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [stockListRef]);

  return (
    <div ref={stockListRef}>
      <div className="search-wrapper stock-search">
        <input
          type="text"
          id="search-input"
          placeholder="Search by stock name"
          onFocus={() => setIsFocused(true)}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Use searchQuery here
        />
        <i className="fas fa-search"></i>
        <button
          style={{
            minWidth: 0,
            padding: "4px 4px",
            fontFamily: "Poppins",
            borderRadius: "4px",
            backgroundColor: "transparent", // Mimics the outlined variant
            border: "1px solid #1976d2", // Matches the Material-UI 'secondary' color
            color: "#1976d2", // Matches the Material-UI 'secondary' text color
            cursor: "pointer",
            display: "flex", // Align the icon properly
            alignItems: "center",
            justifyContent: "center",
          }}
          data-bs-toggle="modal"
          data-bs-target="#addWatchList"
        >
          <AddIcon /> {/* Add Icon */}
        </button>
        {/* add watch list modal */}
        <div
          class="modal fade"
          id="addWatchList"
          tabindex="-1"
          aria-labelledby="addWatchListLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="addWatchListLabel">
                  Add Watchlist
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <input type="text" placeholder="Enter watchlist" />
              </div>
              <div class="modal-footer watchlist">
                <button type="button" class="btn btn-primary watlistbtn">
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="display-wtchlst"
        style={{ backgroundColor: theme.palette.background.paper }}
      >
        <div className="wtchlst-items">
        <p>watchlist 1</p>
        </div>
      </div>
      

      {filteredStocks.length > 0 ? (
        <div
          className="stock-list"
          style={{ backgroundColor: theme.palette.background.default }}
        >
          {filteredStocks.map((stock, index) => (
            <div
              key={index}
              className="stock-item"
              style={{ backgroundColor: theme.palette.background.paper }}
            >
              <p
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  marginLeft: 5,
                }}
              >
                {stock.stock_name}
              </p>
              <div className="b_s_buttons" sx={{ display: "flex", gap: 0.5 }}>
                <button
                  className="all-buttons"
                  style={{
                    ...buttonStyle,
                    border: "1px solid #4caf50",
                    color: "#4caf50",
                  }}
                  value="BUY"
                  onClick={(e) => handleBuySellClick(stock, e.target.value)}
                >
                  B
                </button>
                <button
                  className="all-buttons"
                  style={{
                    ...buttonStyle,
                    border: "1px solid #f44336",
                    color: "#f44336",
                  }}
                  value="SELL"
                  onClick={(e) => handleBuySellClick(stock, e.target.value)}
                >
                  S
                </button>
                <button
                  className="all-buttons"
                  style={{
                    ...buttonStyle,
                    border: "1px solid #1976d2",
                    color: "#1976d2",
                  }}
                  onClick={() => handleCandlestickClick(stock)}
                >
                  <CandlestickChartIcon fontSize="small" />
                </button>
                <button
                    className="all-buttons"
                    style={{
                      minWidth: 0,
                      padding: "4px 8px",
                      fontFamily: "Poppins",
                      borderRadius: "4px",
                      backgroundColor: "transparent", // Mimics the outlined variant
                      border: "1px solid #9c27b0", // Matches the Material-UI 'secondary' color
                      color: "#9c27b0", // Matches the Material-UI 'secondary' text color
                      cursor: "pointer",
                      display: "flex", // Align the icon properly
                      alignItems: "center",
                    }}
                    onClick={() => onSelectStock(stock)}
                  >
                    <AddIcon /> {/* Add Icon */}
                  </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Typography
          variant="body2"
          sx={{ padding: "10px", fontFamily: "Poppins" }}
        >
          No stocks found.
        </Typography>
      )}

      {selectedStock && (
        <div style={{ padding: 1 }}>
          <div
            style={{
              marginLeft: 10,
              marginTop: 5,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              padding: "5px",
              borderRadius: "8px",
              // boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              fontFamily: "Poppins",
              fontSize: "1rem",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              // width: "100%",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <div
              style={{
                flexGrow: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {selectedStock.stock_name || "No stock selected"}
            </div>
            <div style={{ display: "flex", gap: 0.5 }}>
              <button
                style={{
                  minWidth: 0,
                  padding: "4px 13px",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  borderRadius: "4px",
                  fontFamily: "Poppins",
                  backgroundColor: "transparent", // Mimics the outlined variant's default background
                  border: "1px solid #4caf50", // Matches the Material-UI 'success' color
                  color: "#4caf50", // Matches the Material-UI 'success' text color
                  cursor: "pointer",
                }}
                value="buy"
                // onClick={(e) => handleBuySellClick(stock,e.target.value)}
              >
                B {/* Buy */}
              </button>
              <button
                style={{
                  minWidth: 0,
                  padding: "4px 13px",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  borderRadius: "4px",
                  fontFamily: "Poppins",
                  backgroundColor: "transparent", // Mimics the outlined variant's default background
                  border: "1px solid #f44336", // Matches the Material-UI 'error' color
                  color: "#f44336", // Matches the Material-UI 'error' text color
                  cursor: "pointer",
                }}
                value="sell"

                // onClick={(e) => handleBuySellClick(stock,e.target.value)}
              >
                S {/* Sell */}
              </button>

              <button
                style={{
                  minWidth: 0,
                  padding: "4px 8px",
                  fontFamily: "Poppins",
                  borderRadius: "4px",
                  backgroundColor: "transparent", // Mimics the outlined variant
                  border: "1px solid #1976d2", // Matches the Material-UI 'primary' color
                  color: "#1976d2", // Matches the Material-UI 'primary' text color
                  cursor: "pointer",
                  display: "flex", // Ensures the icon is aligned properly
                  alignItems: "center",
                }}
                onClick={() => handleCandlestickClick()}
              >
                <CandlestickChartIcon fontSize="small" />{" "}
              </button>
              <button
                style={{
                  minWidth: 0,
                  padding: "4px 8px",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  borderRadius: "4px",
                  fontFamily: "Poppins",
                  backgroundColor: "transparent", // Mimics the outlined variant's default background
                  border: "1px solid #f44336", // Matches the Material-UI 'error' color
                  color: "#f44336", // Matches the Material-UI 'error' text color
                  cursor: "pointer",
                }}
                onClick={handleDelete}
              >
                <DeleteIcon /> {/* Delete */}
              </button>
            </div>
            
          </div>
        </div>
      )}

       {/* Display chart */}
       {/* {showChart && (
        <div
          style={{
            marginTop: 2,
            backgroundColor: theme.palette.background.default,
            padding: 2,
            borderRadius: 2,
          }}
        >
          <StockChart stock={selectedStock} />
        </div>
      )} */}

      {/* Modal component for Buy */}
      <BuyStockModal
        stock={selectedStock}
        stockcode={selectedstockcode}
        open={openBuyDialog}
        onClose={handleCloseDialog}
        bs={buyOrSell}
      />
    </div>
  );
};

const buttonStyle = {
  minWidth: 0,
  padding: "4px 8px",
  fontSize: "0.9rem",
  fontWeight: 600,
  borderRadius: "4px",
  fontFamily: "Poppins",
  backgroundColor: "transparent",
  cursor: "pointer",
};

export default StockList;

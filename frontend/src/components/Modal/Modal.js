import React, { useEffect, useState } from "react";
import "./Modal.css";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import axios from "axios";

const BuyStockModal = ({ open, onClose, stock, stockcode, onConfirm, bs }) => {
  const [access, setaccess] = useState("");
  const [stock_name, setstock_name] = useState("");
  const [stock_code, setstock_code] = useState("");

  const [isBuy, setIsBuy] = useState(bs); // Initialize based on `bs` prop

  const [isNseChecked, setIsNseChecked] = useState(true); // NSE checked by default

  const navigate = useNavigate();

  // Reset isBuy state when modal opens or bs changes
  useEffect(() => {
    if (open) {
      setIsBuy(bs === "BUY");
      console.log('status',bs)
    }
  }, [open, bs]);

  // check it on 28/11/2024

  //   const [isBuy, setIsBuy] = useState(bs === "BUY");

  //   // Remove the previous useEffect for isBuy and replace with this
    // useEffect(() => {
    //   // Update isBuy state whenever bs prop changes
    //   setIsBuy(bs === "BUY");
    // }, [bs]);

  //   // Rest of the code remains the same...
  // }

  useEffect(() => {
    // console.log('modal open',open)
    // open=true
    setstock_code(stockcode);
    setstock_name(stock);
    console.log("selected stock", stock, stockcode);
    const token = localStorage.getItem("accessToken");
    setaccess(localStorage.getItem("accessToken"));
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    console.log("Updated stock:", stock);
    console.log("Updated stockcode:", stockcode);

    setnormalOrdervalue((prevState) => ({
      ...prevState,
      tradingsymbol: stock,
      symboltoken: stockcode,
      transactiontype: bs,
    }));

    setstopLoss((prevState) => ({
      ...prevState,
      tradingsymbol: stock,
      symboltoken: stockcode,
      transactiontype: bs,
    }));

    setadvance((prevState) => ({
      ...prevState,
      tradingsymbol: stock,
      symboltoken: stockcode,
      transactiontype: bs,
    }));
  }, [stock, stockcode]);


  // const normalOrder = async () => {
  //   const res = await axios.post(
  //     `http://127.0.0.1:8000/angel/angel_place_order/`,
  //     {
  //       normalOrdervalue,
  //     },
  //     {
  //       headers: {
  //         Authorization: `Token ${access}`,
  //       },
  //     }
  //   );

  //   // console.log(advance);
  //   console.log(normalOrdervalue);
  //   // onConfirm(normalOrder);
  //   console.log(stock);
  //   console.log(stockcode);
  //   onClose();
  // };

  const [normalOrdervalue, setnormalOrdervalue] = useState({
    product: "",
    quantity: "",
    orderType: "",
    price: 0,
    // stopLoss: "",
    // target: "",
    // group: "",
    // stopLossTrail: "",
    transactiontype: bs,
    exchange: "NSE",
    tradingsymbol: stock,
    symboltoken: stockcode,
  });


  const buySell=(type)=>{

    setnormalOrdervalue((prev) => ({
      ...prev,
      transactiontype: type, // Dynamically update transaction type
    }));

    setstopLoss((prev) => ({
      ...prev,
      transactiontype: type, // Dynamically update transaction type
    }));

    setadvance((prev) => ({
      ...prev,
      transactiontype: type, 
    }));
      console.log(type)
      if(type === 'BUY'){
        setIsBuy(true)
        bs='BUY'
      }
      else{
        setIsBuy(false)
        bs='SELL'
      }
  }



  const [stoplose, setstopLoss] = useState({
    variety: "STOPLOSS",
    product: "",
    quantity: "",
    orderType: "",
    transactiontype: bs,
    triggerPrice: "",
    SLLimitPrice: 0,
    exchange: "NSE",
    tradingsymbol: stock,
    symboltoken: stockcode,
    // price:0,
  });

  const [advance, setadvance] = useState({
    variety: "ROBO",
    product: "",
    quantity: "",
    orderType: "",
    transactiontype: bs,
    entryprice: "",
    squareoff: "",
    stoploss: "",
    exchange: "NSE",
    tradingsymbol: stock,
    symboltoken: stockcode,
  });

  const handleCheckboxChange = (isNseSelected) => {
    setIsNseChecked(isNseSelected);
    setnormalOrdervalue((prevValues) => ({
      ...prevValues,
      exchange: isNseSelected ? "NSE" : "BSE",
    }));
  };

  // Normal

  const normalOrderChange = (e) => {
    const { id, value } = e.target;
    setnormalOrdervalue((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };


  const normalOrder = async () => {
  //  if(isBuy === true){
  //   bs='BUY'
  //   console.log(bs)
  //  }
  //  else{
  //   bs='SELL'
  //   console.log(bs)
  //  }

    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/angel/angel_place_order/`,
        {
          orderValue: normalOrdervalue,
        },
        {
          headers: {
            Authorization: `Token ${access}`,
          },
        }
      );

      // console.log(normalOrdervalue);
      console.log(res.data.status);
      // alert(res.data.status);
      if(res.data.status=='complete'){
        alert('order placed Successfully')
      }
      else{
        alert(res.data.status + " : " + res.data.text);
      }
      

      // console.log(stockcode);
      onClose();
    } catch (error) {
      console.error("Error placing normal order:", error);
      // Optionally, handle specific error scenarios
      if (error.response) {
        console.error("Server responded with:", error.response.data);
      } else if (error.request) {
        console.error("No response received from server:", error.request);
      } else {
        console.error("Unexpected error:", error.message);
      }
    }
  };

  // StopLose

  const stopLoseOrderChange = (e) => {
    console.log(stoplose.orderType);
    const { id, value } = e.target;
    setstopLoss((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };
  const stopLoseOrder = async () => {
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/angel/angel_place_order/`,
        {
          orderValue: stoplose,
        },
        {
          headers: {
            Authorization: `Token ${access}`,
          },
        }
      );

      console.log(stoplose);
      console.log(res);
      alert(res.data.status + " : " + res.data.text);

      // console.log(stockcode);
      onClose();
    } catch (error) {
      console.error("Error placing stoploss order:", error);
      // Optionally, handle specific error scenarios
      if (error.response) {
        console.error("Server responded with:", error.response.data);
      } else if (error.request) {
        console.error("No response received from server:", error.request);
      } else {
        console.error("Unexpected error:", error.message);
      }
    }

    console.log(stoplose);
  };

  // Advance

  const advanceOrderChange = (e) => {
    // console.log(stoplose.orderType)
    const { id, value } = e.target;
    setadvance((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };
  const advanceOrder = async (e) => {
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/angel/angel_place_order/`,
        {
          orderValue: advance,
        },
        {
          headers: {
            Authorization: `Token ${access}`,
          },
        }
      );

      console.log(advance);
      console.log(res);
      alert(res.data.status + " : " + res.data.text);

      // console.log(stockcode);
      onClose();
    } catch (error) {
      console.error("Error placing Advance order:", error);
      // Optionally, handle specific error scenarios
      if (error.response) {
        console.error("Server responded with:", error.response.data);
      } else if (error.request) {
        console.error("No response received from server:", error.request);
      } else {
        console.error("Unexpected error:", error.message);
      }
    }

    console.log(stoplose);
  };

  const handleClose = () => {
    onClose();
    setIsBuy(isBuy);

    console.log("mmmm", isBuy);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <div className="model-head">
        <DialogTitle>{stock}</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            x
          </Button>
        </DialogActions>
      </div>
      {/* <h5>{stockcode}</h5> */}

      <ul className="nav nav-tabs" id="myTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active"
            id="regular-tab"
            data-bs-toggle="tab"
            data-bs-target="#regular"
            type="button"
            role="tab"
            aria-controls="regular"
            aria-selected="true"
          >
            Regular
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="stoplose-tab"
            data-bs-toggle="tab"
            data-bs-target="#stoplose"
            type="button"
            role="tab"
            aria-controls="stoplose"
            aria-selected="false"
          >
            Stop Loss
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="advance-tab"
            data-bs-toggle="tab"
            data-bs-target="#advance"
            type="button"
            role="tab"
            aria-controls="advance"
            aria-selected="false"
          >
            Advance
          </button>
        </li>
      </ul>

      <div className="tab-content" id="myTabContent">
        <div
          className="tab-pane fade show active"
          id="regular"
          role="tabpanel"
          aria-labelledby="regular-tab"
        >
          <span>Regular</span>
          <br />
          <br />

          <div
            className="btn-group"
            role="group"
            aria-label="Buy or Sell Toggle"
          >
            <button
              type="button"
              className={`btn ${isBuy ? "btn-success" : "btn-outline-success"}`}
              onClick={() => buySell('BUY')}
            >
              Buy
            </button>
            <button
              type="button"
              className={`btn ${!isBuy ? "btn-danger" : "btn-outline-danger"}`}
              onClick={() => buySell('SELL')}
            >
              Sell
            </button>
          </div>

          <div className="nse-bse">
            <div className="form-check">
              <input
                value="NSE"
                className="form-check-input"
                type="checkbox"
                id="nseCheck"
                checked={isNseChecked}
                onChange={() => handleCheckboxChange(true)}
              />
              <label className="form-check-label" htmlFor="nseCheck">
                NSE
              </label>
            </div>
            <div className="form-check">
              <input
                value="BSE"
                className="form-check-input"
                type="checkbox"
                disabled
                id="bseCheck"
                checked={!isNseChecked}
                onChange={() => handleCheckboxChange(false)}
              />
              <label className="form-check-label" htmlFor="bseCheck">
                BSE
              </label>
            </div>
          </div>

          <DialogContent>
            <div className="row mt-1">
              <div className="form-group col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3 mt-2">
                <label htmlFor="product">Product</label>
                <select
                  id="product"
                  value={normalOrder.product}
                  onChange={normalOrderChange}
                >
                  <option value="">Select Product</option>
                  <option value="INTRADAY">MIS</option>
                  <option value="DELIVERY">DELIVERY</option>
                </select>
              </div>

              <div className="form-group col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3 mt-2">
                <label htmlFor="quantity">Quantity</label>
                <input
                  type="number"
                  id="quantity"
                  value={normalOrdervalue.quantity}
                  onChange={normalOrderChange}
                />
              </div>

              <div className="form-group col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3 mt-2">
                <label htmlFor="orderType">Order Type</label>
                <select
                  id="orderType"
                  value={normalOrdervalue.orderType}
                  onChange={normalOrderChange}
                >
                  <option>Select Order</option>
                  <option value="MARKET">MARKET</option>
                  <option value="LIMIT">LIMIT</option>
                  {isBuy ? (
                    <option value="BUY ABOVE">BUY ABOVE</option>
                  ) : (
                    <option value="SELL BELOW">SELL BELOW</option>
                  )}
                </select>
              </div>

              {normalOrdervalue.orderType !== "MARKET" && (
                <div className="form-group col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3 mt-2">
                  <label htmlFor="price">Price</label>
                  <input
                    type="number"
                    id="price"
                    value={normalOrdervalue.price}
                    onChange={normalOrderChange}
                  />
                </div>
              )}

              {/* <div className="form-group col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3 mt-2">
                <label htmlFor="stopLoss">StopLoss</label>
                <input
                  type="number"
                  id="stopLoss"
                  value={normalOrdervalue.stopLoss}
                  onChange={normalOrderChange}
                />
              </div> */}

              {/* <div className="form-group col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3 mt-2">
                <label htmlFor="target">Target</label>
                <input
                  type="number"
                  id="target"
                  value={normalOrdervalue.target}
                  onChange={normalOrderChange}
                />
              </div> */}

              <div className="form-group col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3 mt-2">
                <label htmlFor="group">Group</label>
                <select
                  id="group"
                  value={normalOrdervalue.group}
                  onChange={normalOrderChange}
                >
                  <option value="Group-1">Group-1</option>
                  <option value="Group-2">Group-2</option>
                </select>
              </div>
            </div>
            <div className="submit">
              <button className="submit-btn order-submit" onClick={normalOrder}>
                Submit
              </button>
            </div>
          </DialogContent>
        </div>

        <div
          className="tab-pane fade"
          id="stoplose"
          role="tabpanel"
          aria-labelledby="stoplose-tab"
        >
          <span>Stop Loss</span>
          <br></br>
          <br></br>
          <div
            className="btn-group"
            role="group"
            aria-label="Buy or Sell Toggle"
          >
            <button
              type="button"
              className={`btn ${isBuy ? "btn-success" : "btn-outline-success"}`}
              onClick={() => setIsBuy(true)}
            >
              Buy
            </button>
            <button
              type="button"
              className={`btn ${!isBuy ? "btn-danger" : "btn-outline-danger"}`}
              onClick={() => setIsBuy(false)}
            >
              Sell
            </button>
          </div>

          <div className="nse-bse">
            <div className="form-check">
              <input
                value="NSE"
                className="form-check-input"
                type="checkbox"
                id="nseCheck"
                checked={isNseChecked}
                onChange={() => handleCheckboxChange(true)}
              />
              <label className="form-check-label" htmlFor="nseCheck">
                NSE
              </label>
            </div>
            <div className="form-check">
              <input
                value="BSE"
                className="form-check-input"
                type="checkbox"
                disabled
                id="bseCheck"
                checked={!isNseChecked}
                onChange={() => handleCheckboxChange(false)}
              />
              <label className="form-check-label" htmlFor="bseCheck">
                BSE
              </label>
            </div>
          </div>

          <DialogContent>
            <div className="row mt-1">
              <div className="form-group col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3 mt-2">
                <label htmlFor="product">Product</label>
                <select
                  id="product"
                  value={stoplose.product}
                  onChange={stopLoseOrderChange}
                >
                  <option value="">Select Product</option>
                  <option value="INTRADAY">MIS</option>
                  <option value="DELIVERY">DELIVERY</option>
                </select>
              </div>

              <div className="form-group col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3 mt-2">
                <label htmlFor="quantity">Quantity</label>
                <input
                  type="number"
                  id="quantity"
                  value={stoplose.quantity}
                  onChange={stopLoseOrderChange}
                />
              </div>

              <div className="form-group col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3 mt-2">
                <label htmlFor="orderType">Order Type</label>
                <select
                  id="orderType"
                  value={stoplose.orderType}
                  onChange={stopLoseOrderChange}
                >
                  <option>Select Order</option>
                  <option value="STOPLOSS_MARKET">MARKET</option>
                  <option value="STOPLOSS_LIMIT">LIMIT</option>
                  {isBuy ? (
                    <option value="BUY ABOVE">BUY ABOVE</option>
                  ) : (
                    <option value="SELL BELOW">SELL BELOW</option>
                  )}
                </select>
              </div>
              <div className="form-group col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3 mt-2">
                <label htmlFor="price">SL Trigger Price</label>
                <input
                  type="number"
                  id="triggerPrice"
                  value={stoplose.triggerPrice}
                  onChange={stopLoseOrderChange}
                />
              </div>

              {stoplose.orderType !== "MARKET" && (
                <div className="form-group col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3 mt-2">
                  <label htmlFor="price">SL Limit Price</label>
                  <input
                    type="number"
                    id="SLLimitPrice"
                    value={stoplose.SLLimitPrice}
                    onChange={stopLoseOrderChange}
                  />
                </div>
              )}

              <div className="form-group col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3 mt-2">
                <label htmlFor="group">Group</label>
                <select
                  id="group"
                  value={stoplose.group}
                  onChange={stopLoseOrderChange}
                >
                  <option value="Group-1">Group-1</option>
                  <option value="Group-2">Group-2</option>
                </select>
              </div>
            </div>
            <div className="submit">
              <button
                className="submit-btn order-submit"
                onClick={stopLoseOrder}
              >
                Submit
              </button>
            </div>
          </DialogContent>
        </div>

        <div
          className="tab-pane fade"
          id="advance"
          role="tabpanel"
          aria-labelledby="advance-tab"
        >
          <span>Bracket</span>
          <br></br>
          <br></br>
          <div
            className="btn-group"
            role="group"
            aria-label="Buy or Sell Toggle"
          >
            <button
              type="button"
              className={`btn ${isBuy ? "btn-success" : "btn-outline-success"}`}
              onClick={() => setIsBuy(true)}
            >
              Buy
            </button>
            <button
              type="button"
              className={`btn ${!isBuy ? "btn-danger" : "btn-outline-danger"}`}
              onClick={() => setIsBuy(false)}
            >
              Sell
            </button>
          </div>

          <div className="nse-bse">
            <div className="form-check">
              <input
                value="NSE"
                className="form-check-input"
                type="checkbox"
                id="nseCheck"
                checked={isNseChecked}
                onChange={() => handleCheckboxChange(true)}
              />
              <label className="form-check-label" htmlFor="nseCheck">
                NSE
              </label>
            </div>
            <div className="form-check">
              <input
                value="BSE"
                className="form-check-input"
                type="checkbox"
                disabled
                id="bseCheck"
                checked={!isNseChecked}
                onChange={() => handleCheckboxChange(false)}
              />
              <label className="form-check-label" htmlFor="bseCheck">
                BSE
              </label>
            </div>
          </div>

          <DialogContent>
            <div className="row mt-1">
              <div className="form-group col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3 mt-2">
                <label htmlFor="product">Product</label>
                <select
                  id="product"
                  value={advance.product}
                  onChange={advanceOrderChange}
                >
                  <option value="">Select Product</option>
                  <option value="BO">MIS</option>
                  <option disabled value="DELIVERY">
                    DELIVERY
                  </option>
                </select>
              </div>

              <div className="form-group col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3 mt-2">
                <label htmlFor="quantity">Quantity</label>
                <input
                  type="number"
                  id="quantity"
                  value={advance.quantity}
                  onChange={advanceOrderChange}
                />
              </div>

              <div className="form-group col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3 mt-2">
                <label htmlFor="orderType">Order Type</label>
                <select
                  id="orderType"
                  value={advance.orderType}
                  onChange={advanceOrderChange}
                >
                  <option>Select Order</option>
                  <option value="MARKET">MARKET</option>
                  <option value="LIMIT">LIMIT</option>
                  {isBuy ? (
                    <option value="BUY ABOVE">BUY ABOVE</option>
                  ) : (
                    <option value="SELL BELOW">SELL BELOW</option>
                  )}
                </select>
              </div>
              <div className="form-group col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3 mt-2">
                <label htmlFor="entryprice">Entry Price</label>
                <input
                  type="number"
                  id="entryprice"
                  value={advance.entryprice}
                  onChange={advanceOrderChange}
                />
              </div>

              {/* {stoplose.orderType !== "MARKET" && (
                <div className="form-group col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3 mt-2">
                  <label htmlFor="price">SL Limit Price</label>
                  <input
                    type="number"
                    id="SLLimitPrice"
                    value={stoplose.SLLimitPrice}
                    onChange={stopLoseOrderChange}
                  />
                </div>
              )} */}
              <div className="form-group col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3 mt-2">
                <label htmlFor="price">Target Price</label>
                <input
                  type="number"
                  id="squareoff"
                  value={advance.squareoff}
                  onChange={advanceOrderChange}
                />
              </div>

              <div className="form-group col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3 mt-2">
                <label htmlFor="price">Sl Trigger Price</label>
                <input
                  type="number"
                  id="stoploss"
                  value={advance.stoploss}
                  onChange={advanceOrderChange}
                />
              </div>

              <div className="form-group col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3 mt-2">
                <label htmlFor="group">Group</label>
                <select
                  id="group"
                  value={stoplose.group}
                  onChange={stopLoseOrderChange}
                >
                  <option value="Group-1">Group-1</option>
                  <option value="Group-2">Group-2</option>
                </select>
              </div>
            </div>
            <div className="submit">
              <button
                className="submit-btn order-submit"
                onClick={advanceOrder}
              >
                Submit
              </button>
            </div>
          </DialogContent>
        </div>
      </div>
    </Dialog>
  );
};

export default BuyStockModal;

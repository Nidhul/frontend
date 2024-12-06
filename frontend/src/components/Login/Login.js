import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Dialog, DialogContent, DialogActions } from "@mui/material";
import "./Login.css";
import "@fontsource/poppins"; // Import Poppins font
import { useNavigate } from "react-router-dom";

import axios from "axios";
import Swal from "sweetalert2";

function Login() {
  // State to toggle between login and register forms
  const [isLogin, setIsLogin] = useState(true);

  // State variables for login form fields
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // State variables for register form fields
  const [registerName, setRegisterName] = useState("");
  const [registerPhoneNumber, setRegisterPhoneNumber] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [broker, setBroker] = useState("");
  const [brokerid, setBrokerid] = useState("");
  const [twofa, setTwofa] = useState("");
  const [mpin, setMpin] = useState("");
  const [apikey, setApikey] = useState("");
  const [apisecret, setApiSecret] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [loginStatus, setLoginStatus] = useState(false);
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState("");
  const [userId, setUser_Id] = useState("");
  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  const showAlert = (title, text, icon) => {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      toast: true,
      position: "top-end", // This can still be used for initial positioning.
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      customClass: {
        popup: "custom-position", // Add your custom class here.
      },
    });
  };

  const handleChange = (e) => {
    setBroker(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();

  // Toggle between login and register forms

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  useEffect(() => {
    const access = localStorage.getItem("accessToken");
    setToken(localStorage.getItem("accessToken"));
    if (access) {
      setOpen(true);
      setLoginStatus(true);
    }
  }, []);

  // Login function

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_ACCOUNT}login/`,
        {
          login: loginUsername,
          password: loginPassword,
        }
      );

      if (response.status === 200) {
        showAlert("",response.data.message, "success");

        const access = response.data.token;
        const user_id = response.data.user_id;

        localStorage.setItem("accessToken", access);
        localStorage.setItem("userId", user_id);

        setUser_Id(user_id);
        setToken(access);

        brokerDetails(access);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.error || "An error occurred";
        console.error("Login failed:", errorMessage);
        showAlert(`Something went wrong: ${errorMessage}`);
      } else {
        console.error("Login failed:", error);
        showAlert("Something went wrong.");
      }
    }
  };

  // Register

  const HandleRegister = async () => {
    if (
      !registerName ||
      !registerEmail ||
      !registerPassword ||
      !registerConfirmPassword ||
      !registerPhoneNumber
    ) {
      showAlert("Warning","Please fill in all fields","warning");
      return;
    }
    if (registerPassword !== registerConfirmPassword) {
      showAlert("error","Passwords do not match","error");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_ACCOUNT}register/`,
        {
          username: registerName,
          phone_number: registerPhoneNumber,
          email: registerEmail,
          password: registerPassword,
          confirm_password: registerConfirmPassword,
          role:2,
        }
      );
      console.log(response);
      if (response.status == 201) {
        showAlert("success","Register successfully","success");
        setIsLogin(!isLogin);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.error || "An error occurred";
        console.error("Register failed:", errorMessage);
        showAlert("error",`Something went wrong: ${errorMessage}`,"error");
      } else {
        console.error("Register failed:", error);
        showAlert('error',"Something went wrong.",'error');
      }
    }
  };

  // check the broker details added or not

  const brokerDetails = async (accessToken) => {
    const token = accessToken;
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL_ACCOUNT + "master-broker/filterbyuser/",
        {
          headers: {
            Authorization: `Token ${accessToken}`,
          },
        }
      );

      const data = response.data;
      console.log("Response data:", data);
      const res = data.data;
      console.log("Message:", res);
      if (res != "") {
        // alert("Success");
        // angelLogin(token);
        navigate("/home");
        window.location.reload();
      } else {
        // alert("No Data");
        setOpen(true);
        setLoginStatus(true);
        // if(open == true){
        //   console.log(open)
        // }
        // else{
        //   console.log("not open")
        // }
      }

      // You can check for specific values in the message
      // if (message === "success") {
      //   window.alert("Success! Redirecting to home page.");
      //   navigate("/home");
      // } else {
      //   // Show modal for broker details
      //   setOpen(true);
      // }
    } catch (error) {
      console.error("Error:", error); // Add error handling if needed
    }
  };


  
  // Add Broker Details for registered users

  const submitBrokerDetails = async (e) => {
    e.preventDefault();
    console.log(apikey)
    try {
      if (broker === "iifl") {
        if (broker && brokerid && apikey && apisecret && phonenumber) {
          const res = await axios.post(
            `${process.env.REACT_APP_API_URL_ACCOUNT}master-broker-details/`,
            {
              login_id: brokerid,
              broker: broker,
              app_id: apikey,
              api_secret: apisecret,
              phone_num: phonenumber,
            },
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          );

          const statusCode = res.data.statuscode; // Accessing status code correctly
          console.log("Response Status Code:", statusCode);

          if (statusCode == 201) {
            showAlert("Success","Broker Details Saved Successfully","success");
            window.location.reload();
          } else {
            showAlert("error","Something Went Wrong... Please try again later","error");
          }
        } else {
          showAlert("warning","All required fields must be provided to submit broker details","warning");
        }
      } else if (broker === "angel") {
        if (broker && brokerid && twofa && mpin && apikey && phonenumber) {
          const res = await axios.post(
            `${process.env.REACT_APP_API_URL_ACCOUNT}master-broker-details/`,
            {
              login_id: brokerid,
              broker: broker,
              twofa: twofa,
              mpin: mpin,
              app_id: apikey,
              phone_num: phonenumber,
            },
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          );

          const statusCode = res.data.statuscode; // Accessing status code correctly
          console.log("Response Status Code:", statusCode);

          if (statusCode == 201) {
            showAlert("Success","Broker Details Saved Successfully","success");
            window.location.reload();
          } else {
            showAlert("Error","Something Went Wrong... Please try again later","error");
          }
        } else {
          showAlert("warning",
            "Error: All required fields must be provided to submit broker details.","warning"
          );
        }
      }
    } catch (error) {
      showAlert("error","Error submitting broker details:", "error");
    }
  };

  const handleClose = () => {
    setOpen(false);
  };




  return (
    <div className="login-bg">
      <Typography>
        <img
          className="logo"
          src="/asset/images/BullsMoves-logo.png"
          alt="GreeksLabs Logo"
        />
      </Typography>
      {!loginStatus ? (
        <Grid container className="main-body">
          <Grid
            item
            lg={6}
            md={12}
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            <Typography
              variant="h4"
              className="main-head"
              sx={{
                fontFamily: "Poppins",
                fontSize: { xs: "1rem", sm: "1rem", md: "2em" },
                padding: { xs: "1", sm: "1px" },
              }}
            >
              Trade on <span style={{ color: "red" }}>Bulls</span>
              <span style={{ color: "green" }}> Moves</span>
            </Typography>
            <Typography
              variant="h6"
              className="sub-head"
              sx={{ fontFamily: "Poppins", marginLeft: 2 }}
            >
              Stay Hedged
            </Typography>
          </Grid>
          <Grid item lg={4} sm={12} md={12}>
            <Container
              className="login-box"
              sx={{ maxWidth: "400px", width: "100%" }}
            >
              <h4 className="log-reg-head">
                {isLogin ? "Customer Login" : "Register"}
              </h4>

              <div className="fields">
                {isLogin ? (
                  // Login form
                  <>
                    <input
                      type="text"
                      className="input-field mt-2"
                      placeholder="username / phone number"
                      label="username"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                    />
                    <div className="position-relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="input-field mt-2"
                        placeholder="Password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                      />
                      <button type="button" onClick={togglePasswordVisibility}>
                        <i
                          className={`bi-eye ${
                            showPassword ? "bi-eye-slash" : "bi-eye"
                          }`}
                        ></i>
                      </button>
                    </div>

                    <div className="buttons">
                      <Button
                        variant="contained"
                        fullWidth
                        className="submit-btn"
                        sx={{
                          marginTop: 1,
                          color: "white",
                          fontFamily: "Poppins",
                        }}
                        onClick={handleLogin}
                      >
                        Login
                      </Button>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "10px",
                      }}
                    >
                      <Typography
                        className="register"
                        sx={{ cursor: "pointer" }}
                        onClick={toggleForm}
                      >
                        Don't have an account?
                      </Typography>
                      <Typography className="password">
                        Forgot Password?
                      </Typography>
                    </div>
                  </>
                ) : (
                  // Register form
                  <>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="username"
                      label="username"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                    />
                    <input
                      type="number"
                      className="input-field"
                      placeholder="Phone number"
                      label="Phone number"
                      value={registerPhoneNumber}
                      onChange={(e) => setRegisterPhoneNumber(e.target.value)}
                    />
                    <input
                      type="email"
                      className="input-field"
                      placeholder="Email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                    />

                    <div className="position-relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="input-field"
                        placeholder="Password"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        style={{ paddingRight: "2.5rem" }} // Space for icon
                      />
                      <button type="button" onClick={togglePasswordVisibility}>
                        <i
                          className={`bi ${
                            showPassword ? "bi-eye-slash" : "bi-eye"
                          }`}
                        ></i>
                      </button>
                    </div>

                    <div className="position-relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="input-field"
                        placeholder="Confirm Password"
                        value={registerConfirmPassword}
                        onChange={(e) =>
                          setRegisterConfirmPassword(e.target.value)
                        }
                        style={{ paddingRight: "2.5rem" }} // Space for icon
                      />
                      <button type="button" onClick={togglePasswordVisibility}>
                        <i
                          className={`bi ${
                            showPassword ? "bi-eye-slash" : "bi-eye"
                          }`}
                        ></i>
                      </button>
                    </div>
                    <div className="buttons">
                      <Button
                        className="submit-btn"
                        variant="contained"
                        fullWidth
                        sx={{
                          marginTop: 1,
                          color: "white",
                          fontFamily: "Poppins",
                        }}
                        onClick={HandleRegister}
                      >
                        Register
                      </Button>
                    </div>
                    <Typography
                      className="login-link"
                      sx={{
                        cursor: "pointer",
                        marginTop: "7px",
                        marginLeft: 5,
                      }}
                      onClick={toggleForm}
                    >
                      Already have an account? Login
                    </Typography>
                  </>
                )}
              </div>
            </Container>
          </Grid>
        </Grid>
      ) : (
        <Dialog
          fullWidth
          open={open}
          onClose={(_, reason) => {
            if (reason !== "backdropClick") {
              handleClose();
            }
          }}
        >
          <DialogContent>
            <div className="broker-modal">
              <form className="form-fields">
                <h4>Broker Details</h4>
                <h6>Enter broker details to continue</h6>
                <select onChange={handleChange} value={broker}>
                  <option value="">Select a broker</option>
                  <option value="iifl">IIFL</option>
                  <option value="angel">ANGEL</option>
                </select>

                <input
                  type="text"
                  placeholder="Broker user id"
                  value={brokerid}
                  onChange={(e) => setBrokerid(e.target.value)}
                />

                {broker === "angel" ? (
                  <>
                    <input
                      type="text"
                      placeholder="Twofa"
                      value={twofa}
                      onChange={(e) => setTwofa(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Mpin"
                      value={mpin}
                      onChange={(e) => setMpin(e.target.value)}
                    />
                  </>
                ) : null}
                {broker === "angel" ? (
                  <>
                    <input
                      type="text"
                      placeholder="Api Key"
                      value={apikey}
                      onChange={(e) => setApikey(e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Phone number"
                      value={phonenumber}
                      onChange={(e) => setPhonenumber(e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Api Key"
                      value={apikey}
                      onChange={(e) => setApikey(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Api Secret"
                      value={apisecret}
                      onChange={(e) => setApiSecret(e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Phone number"
                      value={phonenumber}
                      onChange={(e) => setPhonenumber(e.target.value)}
                    />
                  </>
                )}

                <div className="justify-content-center">
                  <input
                    type="submit"
                    onClick={submitBrokerDetails}
                    className="btn btn-success "
                  />
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default Login;

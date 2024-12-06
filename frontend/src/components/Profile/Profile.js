import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import "./Profile.css";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";

const Profile = () => {
  const [userprofile, setuserprofile] = useState([]);
  const [userbrokerlist, setuserbrokerlist] = useState([])
  const [broker, setBroker] = useState("");
  const [brokerid, setBrokerid] = useState("");
  const [twofa, setTwofa] = useState("");
  const [mpin, setMpin] = useState("");
  const [apikey, setApikey] = useState("");
  const [apisecret, setApiSecret] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const brokerbuttonRef = useRef(null);
  const [login_user_id,setlogin_user_id]=useState("")
  const [token , settoken] = useState("")
  const [selectedBroker,setselectedBroker] = useState("")
  const [username,setusername] = useState("")
  const [phone,setphone] = useState("")
  const [email,setemail] = useState("")


  const [formData, setFormData] = useState({
    username: userprofile.username,
    phone_number: userprofile.phone_number,
    email: userprofile.email,
  });

 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // const [isEditingBroker, setIsEditingBroker] = useState(false); // State to toggle profile or broker form

  // const handleEditBroker = () => {
  //   setIsEditingBroker(true); // Show broker form
  // };
  // const navigate = newNavigate()

  useEffect(() => {
    const access = localStorage.getItem("accessToken");
    // setToken(localStorage.getItem("accessToken"));
    const login_user_id = localStorage.getItem("userId")
    if (access, login_user_id) {
      fetchProDetails(access, login_user_id);
      brokerDetails(access)
      setlogin_user_id(login_user_id)
      settoken(access)
    } else {
      // navigate("/login");
    }
    // console.log('hello',process.env.REACT_APP_WEBSOCKET_URL)
  }, []);

  // function to fetch profile details
  const fetchProDetails = async (access, userid) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v1/accounts/profiles/${userid}/`,
        {
          headers: {
            Authorization: `Token ${access}`
          }
        }
      );
      console.log('profile', response.data);
      setuserprofile(response.data)
    } catch (error) {
      console.log("Error fetching profile details", error);
    }
  };



  const brokerDetails = async (accessToken) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL_ACCOUNT +
        "master-broker/filterbyuser/",
        {
          headers: {
            Authorization: `Token ${accessToken}`,
          },
        }
      );
      console.log('data', response)
      const data = response.data;
      errorshow(response.status)
      // console.log("Response data:", data);
      const res = data.data;
      setuserbrokerlist(data.data)
      console.log("Message:", res);
      if (res != "") {
        // Swal.fire({
        //   title: "Register Failed",
        //   text: `Something Went Wrong,${error}`,
        //   icon: "error",
        //   toast: true,
        //   position: "top-end", 
        //   showConfirmButton: false,
        //   timer: 2000,
        //   timerProgressBar: true,
        //   customClass: {
        //     popup: 'custom-toast',
        //     container: 'no-overlay' // Adds custom class for CSS adjustments
        //   }
        // });
        // alert("Success");
        // window.location.reload()
        // 
      } else {
        // alert("No Data");

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
      console.error("Error:", error);  // Add error handling if needed
    }
  };


  const brokerPopup= async (broker)=>{
    console.log(broker.id)
    console.log(broker.broker)
    setselectedBroker(broker.broker)
    if(broker.id){
      brokerbuttonRef.current.click();
    }
  }
  const showAlert = (title, text, icon) => {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      customClass: {
        popup: "custom-toast",
        container: "no-overlay",
      },
    });
  };

  const iifl_payloads={
    login_id: brokerid,
    broker: 'iifl',
    app_id: apikey,
    api_secret: apisecret,
    phone_num: phonenumber,
  }

  const angel_payloads={
    login_id: brokerid,
    broker: 'angel',
    twofa: twofa,
    mpin: mpin,
    app_id: apikey,
    phone_num: phonenumber,
  }

  const editBrokerDetails = async () => {
    try {
      // Select the correct payload based on the selected broker
      const payload = selectedBroker === "iifl" ? iifl_payloads : angel_payloads;
  
      // Validate that all fields in the payload are filled
      const isFieldsValid = Object.values(payload).every((field) => field);
      if (!isFieldsValid) {
        showAlert("Warning!", "All required fields must be provided.", "warning");
        return;
      }
  
      
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL_ACCOUNT}master-broker-group/${login_user_id}`,
        payload,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
  
      // Handle successful response
      console.log("Broker details updated successfully:", response.data);
      showAlert("Success!", "Broker details updated successfully.", "success");
    } catch (error) {
      console.error("Error editing broker details:", error);
      showAlert("Error!", "Failed to update broker details.", "error");
    }
  };
  

  const editedProfile = async()=>{
      // console.log(iifl_payloads)
      try {
     
  
        const response = await axios.put(
          `http://127.0.0.1:8000/api/v1/accounts/profile/update/${login_user_id}/`,formData,
          {
            headers:{
              Authorization:`Token ${token}`
            }
          }
        );
  
        console.log(response);
        errorshow(response.status)
        if(response.status == 200){
          console.log(response.status)
        }
      } catch (error) {
        console.log("Error editing profile details", error);
      }
    }
  

    const errorshow = (status) =>{
      if(status == 400 || status == 401){
        alert('error show')
      }
    }

  return (
    <div className="container-profile">
      <div className="profile-userpic">
      <i class="bi bi-person-circle"></i>
        <div class="profile-usertitle">
          <div class="profile-usertitle-name">{userprofile.username} </div>
        </div>
        <div class="profile-usermenu">
          <div>
            <ul className="user-details">
              <li>
                <i class="bi-user bi-person"></i>
                <p>{userprofile.username}</p>
              </li>
              <li>
                <i class="bi-user bi-telephone-fill"></i>
                <p>{userprofile.phone_number}</p>
              </li>
              <li>
                <i class="bi-user bi-envelope-fill"></i>
                <p>{userprofile.email}</p>
              </li>
              {userbrokerlist.map((item) => (
                <li className="edit-broker">
                  <p>{item.broker}</p>
                  <i
                    class="bi-edit bi-pencil-fill"
                  onClick={(e)=>brokerPopup(item)}
                  // onClick={handleEditBroker}
                  ></i>
                </li>
              ))}
              <div className="edit-profile">
                <button
                  className="btn btn-success"
                  data-bs-toggle="modal"
                  data-bs-target="#editProfile"
                  
                // onClick={() =>
                //   editProfileDetails("Arunima", "9633745016", "dsarunima7@gmail.com")
                // }
                >
                  Edit
                </button>
              </div>
            </ul>
          </div>
        </div>
      </div>

      {/* Broker details */}
      <button data-bs-toggle="modal"
        data-bs-target="#brokerDetailsModal" hidden ref={brokerbuttonRef}></button>
      <div
        class="modal fade"
        id="brokerDetailsModal"
        tabindex="-1"
        aria-labelledby="brokerDetailsModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content model-box">
            <div class="modal-header">
              <h5 class="modal-title" id="brokerDetailsModalLabel">
                Broker Details
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form className="profile-broker-form">


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
              </form>
            </div>
            <div class="modal-footer">
              <button type="submit" class="btn btn-success" onClick={editBrokerDetails}>
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
      className="modal fade"
      id="editProfile"
      tabIndex="-1"
      aria-labelledby="editProfileLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="editProfileLabel">
              Edit Profile
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div>
              <input
                type="text"
                name="username"
                className="form-control"
                placeholder="Username"
                value={formData.username}
                defaultValue={userprofile.username}
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="phone_number"
                className="form-control mt-2"
                placeholder="Phone number"
                defaultValue={formData.phone_number}
                onChange={handleInputChange}
              />
              <input
                type="email"
                name="email"
                className="form-control mt-2"
                placeholder="Email"
                defaultValue={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              onClick={editedProfile}
              className="save-profile btn btn-success"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Profile;

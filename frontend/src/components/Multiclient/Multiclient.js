
import './Multiclient.css'
import axios from 'axios';
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { MultiSelect } from "react-multi-select-component";




function Multiclient() {

  const [positions, setPositions] = useState([]);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default to 10 items per page
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const [currentEditData, setCurrentEditData] = useState(null);
  const buttonRef = useRef(null);
  const [token, settoken] = useState('')
  const [broker, setBroker] = useState("");
  const [brokerid, setBrokerid] = useState("");
  const [twofa, setTwofa] = useState("");
  const [mpin, setMpin] = useState("");
  const [apikey, setApikey] = useState("");
  const [apisecret, setApiSecret] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [lotsize, setlotsize] = useState("");
  const [user_name, setuser_name] = useState("");
  const [user_id, setuser_id] = useState("")
  const [editDetails, seteditDetails] = useState([])
  const [groupname, setgroupname] = useState("")
  const [groupList, setgroupList] = useState([])
  const [selected, setSelected] = useState([]);
  const [options, setOptions] = useState([]);
  const [group, setgroup] = useState("")
  const [formValues, setFormValues] = useState({
    transition_type: "",
    product_type: "",
    quantity: "",
    order_type: "",

  });
  const [user,setuser]=useState('')

  const [selectedid, setselectedid] = useState("")

  const closechildedit = useRef()

  const closeadduser = useRef()

  const [mapperList, setmapperList] = useState([])

  const navigate = useNavigate()


  useEffect(() => {
    const access = localStorage.getItem("accessToken");
    settoken(access);
    setuser(localStorage.getItem('userId'));
  
    // Check if access is missing or falsy
    if (!access) {
      console.log("Access Token:", access);

      navigate("/");
    } else {
      fetchuserDetails(access);
      getgroupList(access);
      // getmapperList(access);
    }
  }, []);
  




  const fetchuserDetails = async (token) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL_INTERACTIVE}user-broker-details/filterbyuser/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      console.log(response.data); // Log the response to check its structure
      setPositions(response.data.data); // Assuming `data` is an array
      setFilteredPositions(response.data.data); // Initialize with all data
      const data = response.data.data;
      const formattedOptions = data.map((item) => ({
        label: item.nick_name, // Use the user name as the label
        value: item.id, // Use the id or another unique value
      }));
      setOptions(formattedOptions);
    } catch (error) {
      console.log('Error fetching positions', error);
    }
  };





  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);

    // Check if positions is an array before filtering
    if (Array.isArray(positions)) {
      const filteredData = positions.filter((position) =>
        position.nick_name.toLowerCase().includes(searchValue) // Or the correct field
      );
      setFilteredPositions(filteredData);
    } else {
      console.error('Positions is not an array:', positions);
    }
    setCurrentPage(1); // Reset to first page after filtering
  };


  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPositions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredPositions?.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleRowsChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to first page when the rows per page change
  };

  // Function to handle the Modify button click
  const handleModify = (position) => {
    console.log(position)
    setBroker(position.broker || "");
    setBrokerid(position.login_id || "");
    setTwofa(position.twofa || "");
    setMpin(position.mpin || "");
    setApikey(position.app_id || "");
    setApiSecret(position.api_secret || "");
    setPhonenumber(position.phone_num || "");
    setlotsize(position.no_of_slots || "");
    setuser_name(position.nick_name || "");
    setuser_id(position.id);
    if (position.id) {
      buttonRef.current.click();
    }
    // Programmatically click the hidden button to open modal
  };



  const angel_payloads = {
    login_id: brokerid,
    nick_name: user_name,
    broker: broker,
    twofa: twofa,
    mpin: mpin,
    app_id: apikey,
    phone_num: phonenumber,
    no_of_lots: lotsize,
  };

  const iifl_payloads = {
    login_id: brokerid,
    nick_name: user_name,
    broker: broker,
    app_id: apikey,
    api_secret: apisecret,
    phone_num: phonenumber,
    no_of_lots: lotsize,
  };

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

  const removeData = () => {
    setBrokerid('');
    setuser_name('');
    setBroker('');
    setTwofa('');
    setMpin('');
    setApikey('');
    setApiSecret('');
    setPhonenumber('');
    setlotsize('');
  };


  const submitBrokerDetails = async (e) => {
    e.preventDefault();
    try {
      const brokerRequiredFields = broker === "iifl"
        ? [broker, brokerid, apikey, apisecret, phonenumber, lotsize]
        : [broker, brokerid, twofa, mpin, apikey, phonenumber, lotsize];

      const isFieldsValid = brokerRequiredFields.every((field) => !!field);

      if (!isFieldsValid) {
        showAlert("Warning!", "All required fields must be provided.", "warning");
        return;
      }

      const payload = broker === "iifl" ? iifl_payloads : angel_payloads;

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL_INTERACTIVE}user-broker-details/`,
        payload,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      const statusCode = res.data.statuscode;

      if (statusCode === 201) {
        console.log(res.data.message);
        fetchuserDetails(token)
        showAlert("Success!", res.data.message, "success");
        removeData()
      } else {
        showAlert("Error!", "Something went wrong. Please try again later.", "error");
      }
    } catch (error) {
      console.error("Error submitting broker details:", error);
      showAlert("Error!", "Error submitting broker details.", "error");
    }
  };


  const editBrokerDetails = async (e) => {
    e.preventDefault();
    try {
      const brokerRequiredFields = broker === "iifl"
        ? [broker, brokerid, apikey, apisecret, phonenumber, lotsize]
        : [broker, brokerid, twofa, mpin, apikey, phonenumber, lotsize];

      // const isFieldsValid = brokerRequiredFields.every((field) => !!field);

      // if (!isFieldsValid) {
      //   showAlert("Warning!", "All required fields must be provided.", "warning");
      //   return;
      // }

      const payload = broker === "iifl" ? iifl_payloads : angel_payloads;

      const res = await axios.patch(
        `${process.env.REACT_APP_API_URL_INTERACTIVE}user-broker-details/${user_id}/`,
        payload,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      const statusCode = res.data.statuscode;
      console.log('edit', statusCode)

      if (statusCode == 200) {
        console.log(res.data.message);
        fetchuserDetails(token)

        showAlert("Success!", res.data.message, "success");
        closechildedit.current.click()
        removeData()
      } else {
        showAlert("Error!", "Something went wrong. Please try again later.", "error");
      }
    } catch (error) {
      console.error("Error submitting broker details:", error);
      showAlert("Error!", "Error submitting broker details.", "error");
    }
  };

  const deleteBrokerdetails =  (id) => {
    console.log(id)
    if (id) {
      Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to delete this order? This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          // Wrap the async call inside a function
          (async () => {
      try {
        const res = await axios.delete(
          `${process.env.REACT_APP_API_URL_INTERACTIVE}user-broker-details/${id}/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        const statusCode = res.data.statuscode;

        if (statusCode === 200) {
          console.log(res.data.message);
          fetchuserDetails(token)
          Swal.fire("Success!",'Broker Details Deleted Successfully', "success");
          removeData()
        } else {
          Swal.fire("Error!", "Something went wrong. Please try again later.", "error");
        }
      } catch (error) {
        // console.error("Error deleting broker details:", error);
        Swal.fire("Error!", `Failed to delete the stock , ${`${error}`}.`, "error");
        // showAlert("Error!", "Error deleting broker details.", "error");
  }
        })();
      }
    });
  };
}

// Add New Group

  const addGroup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/v1/interactive_data/groups/`,
        {
          group_name: groupname,
          // members: [],
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
  
      console.log('Response:', res);
  
      // Check the status code
      if (res.status === 201) {
        alert('Group Created Successfully');
        getgroupList(token);
      } else {
        console.warn('Error Details:', res.data.errors);
        alert('Something went wrong:', JSON.stringify(res.data.errors));
      }
    } catch (error) {
      console.error('API Error:', error.response?.data?.errors);

      // Handle and display the error message
      const errorMessage = error.response?.data?.errors
        
      alert(`An error occurred:\n${errorMessage}`);
    }
  };
  
  const getgroupList = async (token) => {
    try {
      const res = await axios(`http://127.0.0.1:8000/api/v1/interactive_data/groups/filter/`, {
        headers: {
          Authorization: `Token ${token}`
        }
      })
      console.log('group list', res.data.data)
      // const data = res.data.data;
      setgroupList(res.data.data)
    }
    catch (error) {
      console.log(error, 'somethingwent Worng')
    }
  }


  const handleSelectGroup = (e) => {
    const selectedGroup = JSON.parse(e); 
    setgroup(selectedGroup); 
    console.log('Selected Group:', selectedGroup);
  };
  
  const mapUserGroup = async () => {
    const selectedIds = selected.map((item) => item.value);
    console.log('Selected IDs:', selectedIds);
    console.log('Group:', group);
  
    try {
      if (selectedIds.length > 0) {
        const res = await axios.post(
          `http://127.0.0.1:8000/api/v1/interactive_data/groups/${group.id}/add_member/`,
          {
            broker_detail_ids: selectedIds,
          },
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        console.log('Response:', res);
        if (res.status === 200) {
          alert('User added to group successfully');
          closeadduser.current.click();
          setSelected([]);
          // setgroup('');
        } else {
          console.error('Unexpected response:', res);
          alert('Something went wrong. Please try again later.');
        }
      } else {
        console.warn('Group ID or Selected IDs are missing.');
      }
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      alert('Error occurred. See console for details.');
    }
  };
  


  // const getmappedList = async (token)=>{
  //   try{
  //       const res = await axios.get('http://127.0.0.1:8000/api/v1/interactive_data/groups/',{
  //         headers:{
  //           Authorization:`Token ${token}`
  //         }
  //       })
  //       console.log('map list', res.data.data)
  //       setmapperList(res.data.data)
  //   }
  //   catch(error){

  //   }
  // }

  // const editMappedGroup = async (e) => {
    
  // }

  const navigateGroup = () =>{
    navigate('/group')
  }
  



  return (
    <div>
      <div className='multi-users'>
        <div className='heading'>
          <h4>Multi Users</h4>
        </div>
        <div className='add-user-button'>
        <div class="dropdown">
  <button class="btn btn-secondary dropdown-toggle group-settings-button" type="button" data-bs-toggle="dropdown" aria-expanded="false">
    Group
  </button>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item" onClick={navigateGroup} >View Group</a></li>
    <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#staticBackdropgrouplist">Add New Groups</a></li>
    {/* <li><a class="dropdown-item" href="#">Something else here</a></li> */}
  </ul>
</div>
          {/* <button data-bs-toggle="modal" data-bs-target="#staticBackdropgroup">Add New Group</button> */}
          <button data-bs-toggle="modal" data-bs-target="#staticBackdrop">Add New User</button>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <div className="search-wrapper">
            <input
              type="text"
              id="search-input"
              placeholder="Search by User"
              value={searchTerm}
              onChange={handleSearch} // Correct way to pass the function reference
            />

            <i className="fas fa-search"></i>
          </div>
        </div>
        <div className="table-responsive">
          <table className="position-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Broker Name</th>
                <th>Broker Id</th>
                <th>Twofa</th>
                <th>Mpin</th>
                <th>Lot size</th>
                <th>Api_id</th>
                <th>Api Secret</th>
                <th>Phone number</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((position, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{position.nick_name}</td>
                  <td>{position.broker}</td>
                  <td>{position.login_id}</td>
                  <td>{position.twofa}</td>
                  <td>{position.mpin}</td>
                  <td>{position.no_of_slots}</td>
                  <td>{position.app_id}</td>
                  <td>{position.api_secret}</td>
                  <td>{position.phone_num}</td>
                  <td>
                    <button
                      className="badge-dark-modify"
                      onClick={() => handleModify(position)} // Pass the position to handleModify
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button className="badge-danger-sqroff" onClick={() => deleteBrokerdetails(position.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <div className="view-options">
            <select
              id="rows-select"
              value={itemsPerPage}
              onChange={handleRowsChange}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* Add New Child Broker Data */}

      <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">User Details</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={removeData}></button>
            </div>
            <div className="modal-body add-user">
              <div className='row'>
                <div className="broker-modal">
                  <form className="form-fields">
                    <div className='row'>
                      <div className='col-4 mt-2'>
                        <div className='add-user'>
                          <select onChange={(e) => setBroker(e.target.value)} value={broker}>
                            <option value="">Select a broker</option>
                            <option value="iifl">IIFL</option>
                            <option value="angel">ANGEL</option>
                          </select>

                        </div>
                      </div>


                      {/* <div className='col-4 mt-2'>
                        <div className='add-user'>
                          <input
                            type="text"
                            placeholder="Broker user id"
                            value={brokerid}
                            onChange={(e) => setBrokerid(e.target.value)}
                          />
                        </div>
                      </div> */}

                      <div className='col-4 mt-2'>
                        <div className='add-user'>
                          <input
                            type="text"
                            placeholder="Broker user id"
                            value={brokerid}
                            onChange={(e) => setBrokerid(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className='col-4 mt-2'>
                        <div className='add-user'>
                          <input
                            type="text"
                            placeholder="Enter Name"
                            value={user_name}
                            onChange={(e) => setuser_name(e.target.value)}
                          />
                        </div>
                      </div>

                      {broker === "angel" ? (
                        <>
                          <div className='col-4 mt-2'>
                            <div className='add-user'>
                              <input
                                type="text"
                                placeholder="Twofa"
                                value={twofa}
                                onChange={(e) => setTwofa(e.target.value)}
                              />
                            </div>
                          </div>

                          <div className='col-4 mt-2'>
                            <div className='add-user'>
                              <input
                                type="text"
                                placeholder="Mpin"
                                value={mpin}
                                onChange={(e) => setMpin(e.target.value)}
                              />
                            </div>
                          </div>
                        </>
                      ) : null}
                      {broker === "angel" ? (
                        <>
                          <div className='col-4 mt-2'>
                            <div className='add-user'>
                              <input
                                type="text"
                                placeholder="Api Key"
                                value={apikey}
                                onChange={(e) => setApikey(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className='col-4 mt-2'>
                            <div className='add-user'>
                              <input
                                type="number"
                                placeholder="Phone number"
                                value={phonenumber}
                                onChange={(e) => setPhonenumber(e.target.value)}
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className='col-4 mt-2'>
                            <div className='add-user'>
                              <input
                                type="text"
                                placeholder="Api Key"
                                value={apikey}
                                onChange={(e) => setApikey(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className='col-4 mt-2'>
                            <div className='add-user'>
                              <input
                                type="text"
                                placeholder="Api Secret"
                                value={apisecret}
                                onChange={(e) => setApiSecret(e.target.value)}
                              />
                            </div>
                          </div>

                          <div className='col-4 mt-2'>
                            <div className='add-user'>
                              <input
                                type="number"
                                placeholder="Phone number"
                                value={phonenumber}
                                onChange={(e) => setPhonenumber(e.target.value)}
                              />
                            </div>
                          </div>
                        </>
                      )}
                      <div className='col-4 mt-2'>
                        <div className='add-user'>
                          <input
                            type="number"
                            placeholder="Lot Size"
                            value={lotsize}
                            onChange={(e) => setlotsize(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div>

                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {/* <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button> */}
              <input
                type="submit"
                onClick={submitBrokerDetails}
                className="btn btn-success add-user-broker-submit "
              />
            </div>
          </div>
        </div>
      </div>

      {/* Edit user  */}

      <button data-bs-toggle="modal" data-bs-target="#staticBackdropedit" ref={buttonRef} hidden></button>

      <div className="modal fade" id="staticBackdropedit" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">Edit User Details</h5>

              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ref={closechildedit} onClick={removeData} ></button>
            </div>
            <div className="modal-body add-user">
              <div className='row'>
                <div className="broker-modal">
                  <form className="form-fields">
                    <div className='row'>
                      <div className='col-4 mt-2'>
                        <div className='add-user'>
                          <label className='editlabel'>Broker</label>
                          <select onChange={(e) => setBroker(e.target.value)} value={broker}>
                            {/* <option value="">Select a broker</option> */}
                            <option defaultChecked value={broker}>{broker}</option>
                            {/* <option value="angel">ANGEL</option> */}
                          </select>

                        </div>
                      </div>


                      {/* <div className='col-4 mt-2'>
                        <div className='add-user'>
                          <input
                            type="text"
                            placeholder="Broker user id"
                            value={brokerid}
                            onChange={(e) => setBrokerid(e.target.value)}
                          />
                        </div>
                      </div> */}

                      <div className='col-4 mt-2'>
                        <div className='add-user'>
                          <label className='editlabel'>Broker Id</label>
                          <input
                            type="text"
                            placeholder="Broker user id"
                            value={brokerid}

                            onChange={(e) => setBrokerid(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className='col-4 mt-2'>
                        <div className='add-user'>
                          <label className='editlabel'>Name</label>
                          <input
                            type="text"
                            placeholder="Enter Name"
                            value={user_name}
                            onChange={(e) => setuser_name(e.target.value)}
                          />
                        </div>
                      </div>

                      {broker === "angel" ? (
                        <>
                          <div className='col-4 mt-2'>

                            <div className='add-user'>
                              <label className='editlabel'>Twofa</label>
                              <input
                                type="text"
                                placeholder="Twofa"
                                value={twofa}
                                onChange={(e) => setTwofa(e.target.value)}
                              />
                            </div>
                          </div>

                          <div className='col-4 mt-2'>

                            <div className='add-user'>
                              <label className='editlabel'>Mpin</label>
                              <input
                                type="text"
                                placeholder="Mpin"
                                value={mpin}
                                onChange={(e) => setMpin(e.target.value)}
                              />
                            </div>
                          </div>
                        </>
                      ) : null}
                      {broker === "angel" ? (
                        <>
                          <div className='col-4 mt-2'>

                            <div className='add-user'>
                              <label className='editlabel'>Api Key</label>
                              <input
                                type="text"
                                placeholder="Api Key"
                                value={apikey}
                                onChange={(e) => setApikey(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className='col-4 mt-2'>

                            <div className='add-user'>
                              <label className='editlabel'>Phone number</label>
                              <input
                                type="number"
                                placeholder="Phone number"
                                value={phonenumber}
                                onChange={(e) => setPhonenumber(e.target.value)}
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className='col-4 mt-2'>

                            <div className='add-user'>
                              <label className='editlabel'>Api Key</label>
                              <input
                                type="text"
                                placeholder="Api Key"
                                value={apikey}
                                onChange={(e) => setApikey(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className='col-4 mt-2'>

                            <div className='add-user'>
                              <label className='editlabel'>Api Secret</label>
                              <input
                                type="text"
                                placeholder="Api Secret"
                                value={apisecret}
                                onChange={(e) => setApiSecret(e.target.value)}
                              />
                            </div>
                          </div>

                          <div className='col-4 mt-2'>

                            <div className='add-user'>
                              <label className='editlabel'>Phone Number</label>
                              <input
                                type="number"
                                placeholder="Phone number"
                                value={phonenumber}
                                onChange={(e) => setPhonenumber(e.target.value)}
                              />
                            </div>
                          </div>
                        </>
                      )}
                      <div className='col-4 mt-2'>

                        <div className='add-user'>
                          <label className='editlabel'>Broker</label>
                          <input
                            type="number"
                            placeholder="Lot Size"
                            value={lotsize}
                            onChange={(e) => setlotsize(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div>

                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {/* <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button> */}
              <input
                type="submit"
                onClick={editBrokerDetails}
                className="btn btn-success add-user-broker-submit "
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add New Group */}

      <div className="modal fade" id="staticBackdropgrouplist" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">Add Group</h5>
              <button type="button" ref={closeadduser} className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={removeData}></button>
            </div>
            <div className="modal-body add-user">

              <div className="add-group-modal">
                <form>
                  <div className='row'>
                    <div className='col-8'>
                      <label>Group Name</label>
                      <br></br>
                      <input className='group-input' placeholder='Enter New Group Name' onChange={(e) => setgroupname(e.target.value)}></input>
                    </div>

                    <div className=' add-group-btn col-4'>
                      <div className='mt-3'>
                        <button onClick={addGroup} className="btn btn-success add-user-broker-submit">
                          Add Group
                        </button>
                      </div>
                    </div>
                  </div>
                </form>

              </div>

              <br></br>

              <div className='map-user'>
                <div>
                  <h5>Add User to Group</h5>
                </div>
                <div className='row'>
                  <div className='col-6'>
                    <select onChange={(e)=>handleSelectGroup(e.target.value)}>
                      <option>Select Group Name</option>
                      {groupList.map((item) => (
                        <option key={item.id} value={JSON.stringify(item)}>{item.group_name}</option>
                      ))}
                    </select>

                  </div>
                  <div className='col-6'>
                    <MultiSelect
                      id="multi-select"
                      options={options}
                      value={selected}
                      onChange={setSelected}
                      labelledBy="Select Users"
                      placeholder="Select Users"
                    />
                  </div>
                </div>

                <div className='map-button'>
                  <button onClick={mapUserGroup}>Map User</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>




    </div>
  )
}

export default Multiclient
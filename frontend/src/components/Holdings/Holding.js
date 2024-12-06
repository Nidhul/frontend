import React from 'react'
import './Holding.css'
import { useState , useEffect , useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Holding() {

    const [positions, setPositions] = useState([]);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default to 10 items per page
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const [currentEditData, setCurrentEditData] = useState(null); // Holds data to edit
  const buttonRef = useRef(null);

  const navigate = useNavigate()

  const [formValues, setFormValues] = useState({
    transition_type: "",
    product_type: "",
    quantity: "",
    order_type: "",
    
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
      
    }));
    console.log(currentEditData.stockName,formValues)
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if(token){
      fetchData(token);
    }
    else{
      navigate('/')
    }
  }, []);

  const fetchData = async (token) => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/angel/angel_holdings/",{
        headers:{
          Authorization:`Token ${token}`
        }
      });
      console.log('history',response.data.data.holdings)
      setPositions(response.data.data.holdings);
      setFilteredPositions(response.data.data.holdings); // Initialize with all data
    } catch (error) {
      console.log("Error fetching positions", error);
    }
  };

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filteredData = positions.filter((position) =>
      position.symbolname.toLowerCase().includes(searchValue)
    );

    setFilteredPositions(filteredData);
    setCurrentPage(1); // Reset to first page after filtering
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPositions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
//   console.log(currentItems)


  const totalPages = Math.ceil(filteredPositions.length / itemsPerPage);

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
    setCurrentEditData(position); // Set the current position data for editing
    buttonRef.current.click(); // Programmatically click the hidden button to open modal
  };
  return (
    <div>
            <div className="header">
        <h2>Holdings</h2>  
      </div>
    {currentItems.length > 0 ? (
            <div className="table-container">
            <div className="table-header">
              <div className="search-wrapper">
                <input
                  type="text"
                  id="search-input"
                  placeholder="Search by stock name"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <i className="fas fa-search"></i>
              </div>
            </div>
            <div className="table-responsive">
              <table className="position-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Stock Name</th>
                    <th>Product Type</th>
                    
                    {/* <th>Transition Type</th> */}
                    {/* <th>Order Type</th> */}
                    <th>Quantity</th>
                    <th>Placed Price</th>
                    <th>P/L</th>
                    <th>Modify</th>
                    <th>Square Off</th>
                  </tr>
                </thead>
                <tbody>
    {currentItems.map((position, index) => {
        return position.quantity>0 ? (
            <tr key={index}>
            <td>{index + 1}</td>
            <td>{position.tradingsymbol}</td>
            <td>{position.product}</td>
            <td>{position.quantity}</td>
            <td>{position.averageprice}</td>
            <td>{position.pnlpercentage}</td>
            <td>
              <button
                className="badge-dark-modify"
                onClick={() => handleModify(position)} // Pass the position to handleModify
              >
                Modify
              </button>
            </td>
            <td>
              <button className="badge-danger-sqroff">sq/off</button>
            </td>
          </tr>
        ):
        (
            <tr key={index} className='closed-holdings'>
            <td>{index + 1}</td>
            <td>{position.tradingsymbol}</td>
            <td>{position.product}</td>
            <td>{position.quantity}</td>
            <td>{position.averageprice}</td>
            <td>{position.pnlpercentage}</td>
            <td>
    
            </td>
            <td>
              
            </td>
          </tr>
        )
    
     
    })}
    
                </tbody>
              </table>
            </div>
    
            <div className="pagination">
              {/* <div className="view-options">
                <select
                  id="rows-select"
                  value={itemsPerPage}
                  onChange={handleRowsChange}
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div> */}
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
    ):(
        <div>
            <p className='text-center'>No Holdings Found</p>
        </div>
    )}

      {/* Modal */}
      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              {currentEditData ? (
                <h5 className="modal-title" id="staticBackdropLabel">
                  Modify {currentEditData.stockName}
                </h5>
              ) : (
                <p>No data selected</p>
              )}
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {currentEditData ? (
                <div>
                  {/* <p>Stock Name: {currentEditData.stockName}</p> */}
                  <div className="row">
                    <div className="col-6">
                      <label>Transition type</label>
                      <select id="transition_type" value={formValues.transition_type}   onChange={handleChange}>
                        <option>Select transition type</option>
                        <option value="buy">buy</option>
                        <option value="sell">sell</option>
                        
                      </select>
                    </div>
                    <div className="col-6">
                      <label>Product Type</label>

                      <select id="product_type" value={formValues.product_type}   onChange={handleChange}>
                        <option>Select Product</option>
                        <option value="intraday">Intraday</option>
                        <option value="delivery">Delivery</option>
                      </select>
                    </div>
                    <div className="col-6">
                    <label>Quantity</label>
                    <input id="quantity" type="number" value={formValues.quantity}   onChange={handleChange} />
                    </div>
                    <div className="col-6">
                      <label>Order type</label>
                      <select value={formValues.order_type} id="order_type"  onChange={handleChange} >
                        <option>Select order type</option>
                        <option value="market">Market</option>
                        <option value="limit">Limit</option>
                        <option value="buy-above">Buy above</option>
                        <option value="sell-below">Sell below</option>
                        
                      </select>
                    </div>
                   

                  </div>
                  {/* <input defaultValue={currentEditData.transition_type}/>
                  <input defaultValue={currentEditData.order_type}/> */}
                </div>
              ) : (
                <p>No data selected</p>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-success">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden button to trigger modal */}
      <button
        ref={buttonRef}
        hidden
        data-bs-toggle="modal"
        data-bs-target="#staticBackdrop"
      ></button>
    </div>
  )
}

export default Holding
import React, { useState , useEffect } from "react";
import "./Order-details.css";
import { useNavigate } from "react-router-dom";
function Order_details() {

  const navigate = useNavigate();
  useEffect(() => {
    
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const rowsPerPage = 5;

  // State for tracking the current page of each table
  const [currentPage, setCurrentPage] = useState({
    completed: 1,
    pending: 1,
    executed: 1,
  });

  const CompltedOrders = [
    {
      stock: "Apple Inc.",
      side: "Buy",
      quantity: 10,
      price: 150.0,
      type: "Limit",
      product: "NRML",
      status: "Completed",
      date: "2024-11-01",
      time: "09:30 AM",
    },
    {
      stock: "Microsoft Corp.",
      side: "Sell",
      quantity: 5,
      price: 320.0,
      type: "Market",
      product: "INTRADAY",
      status: "Completed",
      date: "2024-11-01",
      time: "10:15 AM",
    },
    {
      stock: "Amazon Inc.",
      side: "Buy",
      quantity: 20,
      price: 3100.0,
      type: "Limit",
      product: "NRML",
      status: "Completed",
      date: "2024-11-01",
      time: "11:45 AM",
    },
    {
      stock: "Amazon Inc.",
      side: "Buy",
      quantity: 20,
      price: 3100.0,
      type: "Limit",
      product: "NRML",
      status: "Completed",
      date: "2024-11-01",
      time: "11:45 AM",
    },
    {
      stock: "Amazon Inc.",
      side: "Buy",
      quantity: 20,
      price: 3100.0,
      type: "Limit",
      product: "NRML",
      status: "Completed",
      date: "2024-11-01",
      time: "11:45 AM",
    },
    {
      stock: "Amazon Inc.",
      side: "Buy",
      quantity: 20,
      price: 3100.0,
      type: "Limit",
      product: "NRML",
      status: "Completed",
      date: "2024-11-01",
      time: "11:45 AM",
    },
    {
      stock: "Amazon Inc.",
      side: "Buy",
      quantity: 20,
      price: 3100.0,
      type: "Limit",
      product: "NRML",
      status: "Completed",
      date: "2024-11-01",
      time: "11:45 AM",
    },
    // Add more rows here for testing
  ];

  const pendingOrders = [
    {
      stock: "Apple Inc.",
      side: "Buy",
      quantity: 10,
      orderPrice: 150.0,
      orderType: "Limit",
      productType: "NRML",
      orderStatus: "Pending",
      date: "2024-11-01",
      time: "09:30 AM",
    },
    {
      stock: "Microsoft Corp.",
      side: "Sell",
      quantity: 5,
      orderPrice: 320.0,
      orderType: "Market",
      productType: "INTRADAY",
      orderStatus: "Pending",
      date: "2024-11-01",
      time: "10:15 AM",
    },
    {
      stock: "Facebook Inc.",
      side: "Sell",
      quantity: 8,
      orderPrice: 380.0,
      orderType: "Limit",
      productType: "NRML",
      orderStatus: "Pending",
      date: "2024-11-01",
      time: "02:45 PM",
    },
  ];
  const ExecutedOrders = [
    {
      stock: "Apple Inc.",
      side: "Buy",
      quantity: 10,
      price: 150.0,
      type: "Limit",
      product: "NRML",
      status: "Executed",
      date: "2024-11-01",
      time: "09:30 AM",
    },
    {
      stock: "Microsoft Corp.",
      side: "Sell",
      quantity: 5,
      price: 320.0,
      type: "Market",
      product: "INTRADAY",
      status: "Executed",
      date: "2024-11-01",
      time: "10:15 AM",
    },
    {
      stock: "Amazon Inc.",
      side: "Buy",
      quantity: 20,
      price: 3100.0,
      type: "Limit",
      product: "NRML",
      status: "Executed",
      date: "2024-11-01",
      time: "11:45 AM",
    },
    // Add more rows here for testing
  ];
  const totalPages = {
    completed: Math.ceil(CompltedOrders.length / rowsPerPage),
    pending: Math.ceil(pendingOrders.length / rowsPerPage),
    executed: Math.ceil(ExecutedOrders.length / rowsPerPage),
  };

  // Function to get rows for the current page
  const getCurrentRows = (orders, page) => {
    return orders.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  };

  // Function to handle page change for any table
  const handlePageChange = (type, direction) => {
    setCurrentPage((prevPages) => ({
      ...prevPages,
      [type]: Math.min(
        totalPages[type],
        Math.max(1, prevPages[type] + direction)
      ),
    }));
  };

  return (
    <div className="main-table">
      <ul className="nav nav-tabs" id="myTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active"
            id="openOrder-tab"
            data-bs-toggle="tab"
            data-bs-target="#openOrders"
            type="button"
            role="tab"
            aria-controls="openOrders"
            aria-selected="true"
          >
            Orders
          </button>
        </li>
        
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="orderHistory-tab"
            data-bs-toggle="tab"
            data-bs-target="#orderHistory"
            type="button"
            role="tab"
            aria-controls="orderHistory"
            aria-selected="false"
          >
            Order history
          </button>
        </li>
      </ul>
      <div className="tab-content" id="myTabContent">
        <div
          className="tab-pane fade show active"
          id="openOrders"
          role="tabpanel"
          aria-labelledby="openOrder-tab"
        >
          <div className="order-details">
            <div className="heading">
              <p>Completed</p>
            </div>
            <div className="table-responsive">
              <table className="table table-striped table-bordered ">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">Stock</th>
                    <th scope="col">Side</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Order Price</th>
                    <th scope="col">Order Type</th>
                    <th scope="col">Product Type</th>
                    <th scope="col">Order Status</th>
                    <th scope="col">Date</th>
                    <th scope="col">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {getCurrentRows(CompltedOrders, currentPage.completed).map(
                    (order, index) => (
                      <tr key={index}>
                        <td>{order.stock}</td>
                        <td>{order.side}</td>
                        <td>{order.quantity}</td>
                        <td>{order.price}</td>
                        <td>{order.type}</td>
                        <td>{order.product}</td>
                        <td>{order.status}</td>
                        <td>{order.date}</td>
                        <td>{order.time}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
              <div className="pagination">
                <button
                  onClick={() => handlePageChange("completed", -1)}
                  disabled={currentPage.completed === 1}
                >
                  <i class="bi bi-chevron-double-left"></i>
                </button>
                <span>{currentPage.completed}</span>
                <button
                  onClick={() => handlePageChange("completed", 1)}
                  disabled={currentPage.completed === totalPages.completed}
                >
                  <i class="bi bi-chevron-double-right"></i>
                </button>
              </div>
            </div>
          </div>
          <div className="order-details">
            <div className="heading">
              <p>Pending</p>
            </div>
            <div className="table-responsive">
              <table className="table table-striped table-bordered ">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">Stock</th>
                    <th scope="col">Side</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Order Price</th>
                    <th scope="col">Order Type</th>
                    <th scope="col">Product Type</th>
                    <th scope="col">Order Status</th>
                    <th scope="col">Date</th>
                    <th scope="col">Time</th>
                    <th scope="col">Edit</th>
                    <th scope="col">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {getCurrentRows(pendingOrders, currentPage.pending).map(
                    (order, index) => (
                      <tr key={index}>
                        <td>{order.stock}</td>
                        <td>{order.side}</td>
                        <td>{order.quantity}</td>
                        <td>{order.orderPrice}</td>
                        <td>{order.orderType}</td>
                        <td>{order.productType}</td>
                        <td>{order.orderStatus}</td>
                        <td>{order.date}</td>
                        <td>{order.time}</td>
                        <td>
                          <i class="bi bi-pencil-fill edit-icon"></i>
                        </td>
                        <td>
                          <i class="bi bi-trash delete-icon"></i>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
              <div className="pagination">
                <button
                  onClick={() => handlePageChange("pending", -1)}
                  disabled={currentPage.pending === 1}
                >
                  <i class="bi bi-chevron-double-left"></i>
                </button>
                <span>{currentPage.pending}</span>
                <button
                  onClick={() => handlePageChange("pending", 1)}
                  disabled={currentPage.pending === totalPages.pending}
                >
                  <i class="bi bi-chevron-double-right"></i>
                </button>
              </div>
            </div>
          </div>
          <div className="order-details">
            <div className="heading">
              <p>Rejected</p>
            </div>
            <div className="table-responsive">
              <table className="table table-striped table-bordered ">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">Stock</th>
                    <th scope="col">Side</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Order Price</th>
                    <th scope="col">Order Type</th>
                    <th scope="col">Product Type</th>
                    <th scope="col">Order Status</th>
                    <th scope="col">Date</th>
                    <th scope="col">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {getCurrentRows(ExecutedOrders, currentPage.executed).map(
                    (order, index) => (
                      <tr key={index}>
                        <td>{order.stock}</td>
                        <td>{order.side}</td>
                        <td>{order.quantity}</td>
                        <td>{order.price}</td>
                        <td>{order.type}</td>
                        <td>{order.product}</td>
                        <td>{order.status}</td>
                        <td>{order.date}</td>
                        <td>{order.time}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
              <div className="pagination">
                <button
                  onClick={() => handlePageChange("executed", -1)}
                  disabled={currentPage.executed === 1}
                >
                  <i class="bi bi-chevron-double-left"></i>
                </button>
                <span>{currentPage.executed}</span>
                <button
                  onClick={() => handlePageChange("executed", 1)}
                  disabled={currentPage.executed === totalPages.executed}
                >
                  <i class="bi bi-chevron-double-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div
          className="tab-pane fade"
          id="orderHistory"
          role="tabpanel"
          aria-labelledby="orderHistory-tab"
        >
          nhfcnh
        </div>
      </div>
    </div>
  );
}

export default Order_details;

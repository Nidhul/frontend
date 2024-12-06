import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Childgroup.css';
import Swal from 'sweetalert2';

function Childgroup() {
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [mapperList, setMapperList] = useState([]);
  const [mappedUserList, setMappedUserList] = useState([]);
  const [token, setToken] = useState("");
  const [groupId, setgroupId] = useState("");

  const navigate = useNavigate();

  // Fetch Token and Group Data on Mount
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    setToken(accessToken);

    if (!accessToken) {
      console.warn("Access Token Missing");
      navigate("/");
    } else {
      getMappedList(accessToken);
    }
  }, []);

  // Fetch Group List
  const getMappedList = async (accessToken) => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/v1/interactive_data/groups/",
        {
          headers: { Authorization: `Token ${accessToken}` },
        }
      );
      console.log("Mapper List:", res.data.data);
      setMapperList(res.data.data || []);
    } catch (error) {
      if (error instanceof TypeError) {
        // Detecting a CORS error (TypeError is common for network issues)
        alert('Network problem. Please check your connection or try again later.');
      } else {
        alert('An error occurred: ' + error.message);
      }
      console.error("Error fetching group list:", error);
    }
  };

  // Handle Group Selection
  const handleGroupSelection = async (e) => {
    setgroupId(e);
    try {
      const res = await axios(`http://127.0.0.1:8000/api/v1/interactive_data/groups/${e}/member`, {
        headers: {
          Authorization: `Token ${token}`
        }
      })
      console.log('group list', res)
      // const data = res.data.data;
      setMappedUserList(res.data.members)
    }
    catch (error) {
      console.log(error, 'somethingwent Worng')
    }
  }

  // Handle Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = mappedUserList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(mappedUserList.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleRowsChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const removeruserGroup = async (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to remove user from group?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Wrap the async call inside a function
        (async () => {
 if(userId && groupId){
    try {
        const res = await axios.delete(
          `http://127.0.0.1:8000/api/v1/interactive_data/groups/${groupId}/remove_member/${userId}/`,
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        console.log("User removed from group:", res.data);
        Swal.fire("Success!", "User Removed Successfully", "success");
        handleGroupSelection(groupId);
      } catch (error) {
        Swal.fire("Error!", "Failed to delete the stock.", "error");
      }
    }
      })();
  }
});
};

  return (
    <div>
      {/* Group Dropdown */}
      <select
        className="group-name mb-3"
        onChange={(e) => handleGroupSelection(e.target.value)}
      >
        <option value="">Select Group Name</option>
        {mapperList.map((group) => (
          <option key={group.id} value={group.id}>
            {group.group_name}
          </option>
        ))}
      </select>

      {/* User List Table */}
      {mappedUserList.length > 0 ? (
        <div className="table-responsive">
          <table className="position-table">
            <thead>
              <tr>
                <th className='text-center'>ID</th>
                <th className='text-center'>Members</th>
                <th className='text-center'>Remove User From Group</th>
              </tr>
            </thead>

            <tbody>
  {currentItems.map((member, index) => 
    member.broker_details && member.broker_details.length > 0 ? ( // Check if broker_details exists and is not empty
      member.broker_details.map((broker, brokerIndex) => (
        <tr key={`${index}-${brokerIndex}`}>
          <td className="text-center">{brokerIndex + 1}</td>
          <td className="text-center">{broker.nick_name}</td>
          <td className="text-center">
            <i
              className="badge-dark-modify bi bi-x"
              onClick={() => removeruserGroup(broker.id)}
            ></i>
          </td>
        </tr>
      ))
    ) : (
      <tr key={index}>
        <td colSpan="3" className="text-center">No User in this Group</td>
      </tr>
    )
  )}

</tbody>

          </table>
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
      ) : (
        <p>Please Select Group to View Members</p>
      )}

 
    </div>
  );
}

export default Childgroup;

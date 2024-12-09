import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);
  const [filteredValue, setFilteredValue] = useState([]);
  const [userData, setUserData] = useState({
    name: "",
    city: "",
    age: "",
  });

  const getAllData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/users");
      setUsers(response.data);
      setFilteredValue(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getAllData();
  }, []);

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const filteredUsers = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchValue) ||
        user.city.toLowerCase().includes(searchValue)
    );
    setFilteredValue(filteredUsers);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/users/${id}`);
      getAllData(); 
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleAddRecord = () => {
    setUserData({
      name: "",
      city: "",
      age: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      if (userData.id) {
       
        await axios.patch(`http://localhost:8000/users/${userData.id}`, userData).then((res)=>{
          console.log(res)
        })
      } else {
       
        await axios.post("http://localhost:8000/users", userData).then((res)=>{
          console.log(res)
        })

      }
      getAllData();
      handleAddRecord();
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };
  
  const handleUpdateUser = (data) => {
    setUserData(data);
  };

  return (
    <div className="container">
      <h3 className="text-black">CRUD Application</h3>
      <div className="input-search">
        <input
          className="input"
          onChange={handleSearch}
          placeholder="Search by name or city"
        />
        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          onClick={handleAddRecord}
        >
          Add Record
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>City</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredValue.map((data) => (
            <tr key={data.id}>
              <td>{data.id}</td>
              <td>{data.name}</td>
              <td>{data.age}</td>
              <td>{data.city}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-success"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  onClick={() => handleUpdateUser(data)}
                >
                  Edit
                </button>
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleDelete(data.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {userData.id ? "Edit User" : "Add User"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleAddRecord}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="input1" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="input1"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  placeholder="Enter name"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="input2" className="form-label">
                  Age
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="input2"
                  name="age"
                  value={userData.age}
                  onChange={handleChange}
                  placeholder="Enter age"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="input3" className="form-label">
                  City
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="input3"
                  name="city"
                  value={userData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={handleAddRecord}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={handleSaveChanges}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

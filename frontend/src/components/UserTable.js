import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserTable() {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', age: '', email: '' });

  useEffect(() => {
    // Fetch data from the API endpoint
    axios.get('http://localhost:8080/api/all')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const deleteUser = (id) => {
    // Send a DELETE request to the API endpoint for deleting a user by ID
    axios.delete(`http://localhost:8080/api/delete/${id}`)
      .then((response) => {
        // Refresh the user list after deletion
        setUsers(users.filter((user) => user.id !== id));
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
      });
  };

  const handleEdit = (id) => {
    // Set the user ID to be edited
    setEditUserId(id);
  };

  const handleSave = (id, updatedUserData) => {
    // Send a PUT request to the API endpoint for updating a user by ID
    axios.put(`http://localhost:8080/api/update/${id}`, updatedUserData)
      .then((response) => {
        // Refresh the user list after saving
        setUsers(users.map((user) => (user.id === id ? response.data : user)));
        setEditUserId(null);
      })
      .catch((error) => {
        console.error('Error updating user:', error);
      });
  };

  const handleCancelEdit = () => {
    // Cancel editing and reset the editUserId state
    setEditUserId(null);
  };

  const handleInputChange = (e, user, field) => {
    // Update the field value in the user object
    const updatedUser = { ...user };
    updatedUser[field] = e.target.value;
    // Update the state with the modified user object
    setUsers(users.map((u) => (u.id === user.id ? updatedUser : u)));
  };

  const handleCreate = () => {
    // Show the create form
    setShowCreateForm(true);
  };

  const handleCreateSave = () => {
    // Send a POST request to the API endpoint for adding a new user
    axios.post('http://localhost:8080/api/add', newUser)
      .then((response) => {
        // Refresh the user list after adding a new user
        setUsers([...users, response.data]);
        setShowCreateForm(false);
        setNewUser({ username: '', age: '', email: '' });
      })
      .catch((error) => {
        console.error('Error creating user:', error);
      });
  };

  const handleCreateCancel = () => {
    // Hide the create form
    setShowCreateForm(false);
    setNewUser({ username: '', age: '', email: '' });
  };

  return (
    <div>
      <h2>User Table</h2>
      <div className="mb-3">
        <button className="btn btn-primary" onClick={handleCreate}>
          Create
        </button>
      </div>
      {showCreateForm && (
        <div>
          <input
            type="text"
            placeholder="Username"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          />
          <input
            type="text"
            placeholder="Age"
            value={newUser.age}
            onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
          />
          <input
            type="text"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <button className="btn btn-success" onClick={handleCreateSave}>
            Save
          </button>
          <button className="btn btn-danger ml-2" onClick={handleCreateCancel}>
            Cancel
          </button>
        </div>
      )}
      <table className="table table-striped table-bordered table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Age</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                {editUserId === user.id ? (
                  <input
                    type="text"
                    value={user.username}
                    onChange={(e) => handleInputChange(e, user, 'username')}
                  />
                ) : (
                  user.username
                )}
              </td>
              <td>
                {editUserId === user.id ? (
                  <input
                    type="text"
                    value={user.age}
                    onChange={(e) => handleInputChange(e, user, 'age')}
                  />
                ) : (
                  user.age
                )}
              </td>
              <td>
                {editUserId === user.id ? (
                  <input
                    type="text"
                    value={user.email}
                    onChange={(e) => handleInputChange(e, user, 'email')}
                  />
                ) : (
                  user.email
                )}
              </td>
              <td>
                {editUserId === user.id ? (
                  <div>
                    <button
                      className="btn btn-success"
                      onClick={() => handleSave(user.id, user)}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-danger ml-2"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleEdit(user.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger ml-2"
                      onClick={() => deleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;

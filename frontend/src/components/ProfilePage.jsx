import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`http://localhost:5050/users/${id}`);
      setUser(response.data);
      setEditedUser(response.data);
    } catch (error) {
      console.error(error);
      setMessage('An error occurred while fetching user data.');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser(user);
  };

  const handleSave = async () => {
    try {
      // Send updated user data to backend
      const formData = new FormData();
      formData.append('firstname', editedUser.firstname);
      formData.append('lastname', editedUser.lastname);
      formData.append('email', editedUser.email);
      formData.append('profilePhoto', selectedFile); // Append selected file to form data

      const response = await axios.put(`http://localhost:5050/users/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUser(response.data);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setMessage('An error occurred while updating profile.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 py-4 text-white text-center mb-8">
        <h1 className="text-3xl font-bold">User Profile</h1>
      </header>
      <div className="container mx-auto p-4">
        {message && <p className="text-red-600">{message}</p>}
        {user && (
          <div className="bg-white p-8 rounded shadow-md">
            <div className="flex items-center mb-4">
              <img
                src={user.profilePhoto}
                alt="Profile"
                className="w-20 h-20 rounded-full mr-4"
              />
              <h2 className="text-3xl font-bold">{user.username}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="col-span-1">
                <h3 className="text-xl font-semibold mb-2">Personal Info</h3>
                {!isEditing ? (
                  <>
                    <p className="text-lg"><strong>First Name:</strong> {user.firstname}</p>
                    <p className="text-lg"><strong>Last Name:</strong> {user.lastname}</p>
                    <p className="text-lg"><strong>Email:</strong> {user.email}</p>
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      name="firstname"
                      value={editedUser.firstname}
                      onChange={handleInputChange}
                      className="w-full border rounded p-2 mb-2"
                    />
                    <input
                      type="text"
                      name="lastname"
                      value={editedUser.lastname}
                      onChange={handleInputChange}
                      className="w-full border rounded p-2 mb-2"
                    />
                    <input
                      type="email"
                      name="email"
                      value={editedUser.email}
                      onChange={handleInputChange}
                      className="w-full border rounded p-2 mb-2"
                    />
                    <input
                      type="file"
                      name="profilePhoto"
                      onChange={handleFileChange}
                      className="w-full border rounded p-2 mb-2"
                    />
                  </>
                )}
              </div>
              <div className="col-span-1">
                <h3 className="text-xl font-semibold mb-2">Statistics</h3>
                <p className="text-lg"><strong>Questions Solved:</strong> {user.questionsSolved}</p>
              </div>
              <div className="col-span-1">
                <h3 className="text-xl font-semibold mb-2">Badges</h3>
                <p className="text-lg"><strong>Badges:</strong> {user.badges
                                  ? user.badges.join(', ') : 'None'}</p>
                                  </div>
                                </div>
                                <div className="mb-8">
                                  {!isEditing ? (
                                    <button onClick={handleEdit} className="bg-blue-500 text-white px-4 py-2 rounded mr-4">Edit Profile</button>
                                  ) : (
                                    <>
                                      <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded mr-4">Save Changes</button>
                                      <button onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                                    </>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    };
                    
                    export default ProfilePage;
                    
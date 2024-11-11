import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User } from '../types';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const ManageUser = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Fetch users from the server
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:7000/users');
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Error fetching users');
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Handle delete modal open
  const openDeleteModal = (userId: string) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  // Handle delete modal close
  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
  };

  // Handle user deletion
  const handleDelete = async () => {
    if (selectedUserId === null) return;
    try {
      await axios.delete(`http://localhost:7000/users/${selectedUserId}`);
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== selectedUserId)
      );
      toast.success('User deleted successfully');
      closeDeleteModal();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete user');
      closeDeleteModal();
    }
  };

  // Render loading or error messages
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left">Profile</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <img
                      src={`data:image/jpeg;base64,${user.profilePhoto}`}
                      alt={`${user.name}'s profile`}
                      className="w-12 h-12 rounded-full mx-auto"
                    />
                  </td>
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.role}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded ${
                        user.status
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {user.status ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 space-x-2 flex">
                    <Link
                      to={`/edit-user/${user.id}`}
                      className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => openDeleteModal(user.id)}
                      className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/3">
            <h2 className="text-xl font-semibold mb-4">
              Are you sure you want to delete?
            </h2>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Yes, Delete
              </button>
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUser;

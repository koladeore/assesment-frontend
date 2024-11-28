import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User } from '../types';

const Spinner = () => (
  <div className="flex justify-center items-center">
    <div className="border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
  </div>
);
const Home = () => {
  // State to store the fetched user data
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from the mock server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:7000/users');
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-10">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        User Profiles
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white p-5 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105"
          >
            <div className="flex justify-center mb-4">
              <img
                data-testid="user-image"
                src={user.profilePhoto ? `data:image/jpeg;base64,${user.profilePhoto}` : '/avatar.png'}
                alt={`${user.name}'s profile`}
                className="w-28 h-28 rounded-full border-4 border-blue-500 p-2"
              />
            </div>
            <div className="text-center">
              <h2
                data-testid="user-name"
                className="text-2xl font-semibold text-gray-800 mb-2"
              >
                {user.name}
              </h2>
              <p data-testid="user-role" className="text-lg text-gray-600 mb-1">
                {user.role}
              </p>
              <p
                data-testid="user-status"
                className={`text-sm font-medium ${user.status ? 'text-green-500' : 'text-red-500'} mb-2`}
              >
                {user.status ? 'Active' : 'Inactive'}
              </p>
              <p data-testid="user-email" className="text-sm text-gray-500">
                {user.email}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

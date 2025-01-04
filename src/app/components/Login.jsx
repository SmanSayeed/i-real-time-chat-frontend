'use client'
// src/components/Login.jsx
import { useState, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import useApi from '../hook/useApi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const { loginUser } = useChat();

  // Use useApi to fetch users
  const { data: users, loading, error } = useApi('/users');  // This will get all users

  useEffect(() => {
    // Automatically select the first user once data is fetched
    if (users?.length > 0) {
      setSelectedUser(users[0]);
    }
  }, [users]); // Only run when users data changes

  const handleLogin = () => {
    if (email && selectedUser) {
      loginUser(email, selectedUser._id);  // Pass selected user ID on login
    } else {
      console.error('Please select a user and provide an email');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading users: {error.message}</p>;

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">Welcome to the Chat</h2>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Enter your email" 
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <div className="my-4">
          <label className="text-lg text-gray-700">Select a user to chat with:</label>
          <select 
            onChange={(e) => setSelectedUser(users.find(u => u._id === e.target.value))}
            value={selectedUser?._id || ''}
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select User</option>
            {users?.map((u) => (
              <option key={u._id} value={u._id}>{u.username}</option>
            ))}
          </select>
        </div>

        <button 
          onClick={handleLogin} 
          className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;

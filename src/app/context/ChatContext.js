'use client'
// src/context/ChatContext.js
import { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../../utils/axios';

const ChatContext = createContext();

export const useChat = () => {
  return useContext(ChatContext);
};

export const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // Logged-in user
  const [users, setUsers] = useState([]);  // All users
  const [messages, setMessages] = useState([]);  // Messages for the logged-in user
  const [selectedUser, setSelectedUser] = useState(null);  // Selected user to send messages

  useEffect(() => {
    // Fetch all users except the logged-in user
    const fetchUsers = async () => {
      try {
        const { data } = await axiosInstance.get('/users');
        setUsers(data.filter(u => u._id !== user?._id));  // Exclude logged-in user
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (user) {
      fetchUsers();
    }
  }, [user]);

  // Login a user by email
  const loginUser = async (email, selectedUserId) => {
    try {
      const { data } = await axiosInstance.post('/users/login', { email });
      setUser(data);
      
      // Fetch messages for the logged-in user and selected user
      await fetchMessages(data._id, selectedUserId);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Fetch messages for the logged-in user and selected user
  const fetchMessages = async (loggedInUserId, selectedUserId) => {
    try {
      const { data } = await axiosInstance.get(`/users/${loggedInUserId}/messages`);
      setMessages(data.filter(msg => 
        (msg.from_user_id === loggedInUserId && msg.to_user_id === selectedUserId) || 
        (msg.from_user_id === selectedUserId && msg.to_user_id === loggedInUserId)
      ));
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Send a message
  const sendMessage = async (messageData) => {
    try {
      const response = await axiosInstance.post('/messages', messageData);
      setMessages((prevMessages) => [...prevMessages, response.data]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <ChatContext.Provider value={{
      user,
      users,
      messages,
      loginUser,
      sendMessage,
      selectedUser,
      setSelectedUser,
      fetchMessages  // Expose fetchMessages to the components if needed
    }}>
      {children}
    </ChatContext.Provider>
  );
};

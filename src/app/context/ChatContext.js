'use client'
// src/context/ChatContext.js
import { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../../utils/axios';
import io from 'socket.io-client';
import env from '../../config/envConfig';
import useApi from '../hook/useApi';  // Import the custom hook

const ChatContext = createContext();

export const useChat = () => {
  return useContext(ChatContext);
};

export const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // Logged-in user
  const [messages, setMessages] = useState([]);  // Messages for the logged-in user
  const [socket, setSocket] = useState(null);  // Socket connection
  const [selectedUser, setSelectedUser] = useState(null);  // Selected user to send messages
  
  // Fetch all users except the logged-in user using custom hook
  const { data: users, loading: usersLoading, error: usersError } = useApi('/users');

  useEffect(() => {
    const socketConnection = io(env.NEXT_PUBLIC_SOCKET_URL);
    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  useEffect(() => {
    if (user && users) {
      // Filter out the logged-in user from the users list
      setUsers(users.filter((u) => u._id !== user._id));
    }
  }, [user, users]);

  // Login a user by email
  const loginUser = async (email, selectedUserId) => {
    try {
      const { data } = await axiosInstance.post('/users/login', { email });
      setUser(data);
      socket.emit('user_joined', data._id); // Emit socket event for user joining

      // Fetch messages for the user
      const { data: userMessages } = await axiosInstance.get(`/users/${data._id}/messages`);
      setMessages(userMessages);
      
      // Set the selected user if provided
      if (selectedUserId) {
        setSelectedUser(users.find(u => u._id === selectedUserId));
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Send a message
  const sendMessage = async (messageData) => {
    try {
      const response = await axiosInstance.post('/messages', messageData);
      setMessages((prevMessages) => [...prevMessages, response.data]);
      socket.emit('new_message', response.data); // Emit new message to receiver
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Handle receiving messages
  useEffect(() => {
    if (!socket) return;

    socket.on('new_message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('new_message');
    };
  }, [socket]);

  return (
    <ChatContext.Provider value={{
      user,
      users: users || [],
      messages,
      loginUser,
      sendMessage,
      selectedUser,
      setSelectedUser,
      usersLoading,
      usersError
    }}>
      {children}
    </ChatContext.Provider>
  );
};

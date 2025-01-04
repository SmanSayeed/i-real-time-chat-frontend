'use client'
// src/components/Chat.jsx
import { useEffect, useState } from 'react';
import { useChat } from '../context/ChatContext';

const Chat = () => {
  const { user, selectedUser, messages, sendMessage, setSelectedUser } = useChat();
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage && selectedUser && selectedUser._id) {
      const messageData = {
        from_user_id: user._id,
        to_user_id: selectedUser._id,
        message: newMessage
      };
      sendMessage(messageData);
      setNewMessage('');
    } else {
      console.error('Selected user is not valid or not selected');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Welcome, {user?.email || user?.username}
        </h2>

        {selectedUser && (
          <div className="my-4">
            <h3 className="text-xl">Chatting with: {selectedUser.username} ({selectedUser.email})</h3>
          </div>
        )}

        <div className="bg-white p-4 rounded-lg shadow-lg h-72 overflow-y-scroll mb-4">
          {messages.map((msg) => (
            <div key={msg._id} className={`mb-2 ${msg.from_user_id === user._id ? 'text-right' : ''}`}>
              <strong className={`${msg.from_user_id === user._id ? 'text-blue-500' : 'text-green-500'}`}>
                {msg.from_user_id === user._id ? 'You' : msg.from_user_id}
              </strong>: {msg.message}
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <textarea 
            value={newMessage} 
            onChange={(e) => setNewMessage(e.target.value)} 
            placeholder="Type your message" 
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={handleSendMessage} 
            className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;

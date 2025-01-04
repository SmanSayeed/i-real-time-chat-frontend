'use client'
// src/app/page.jsx (or src/app/Home.jsx if your folder structure is different)
import Login from './components/Login';
import { useChat } from './context/ChatContext';
import Chat from './components/Chat';

const Home = () => {
  const { user } = useChat();

  return (
    <div className="h-screen">
      {user ? <Chat /> : <Login />}
    </div>
  );
};

export default Home;

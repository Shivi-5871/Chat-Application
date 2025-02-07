import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatPage from './pages/Chatpage';

const App = () => {
  return (
    <div className="App"> {/* You can wrap the routes here */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chats" element={<ChatPage />} /> Add your ChatPage route
        {/* Add more routes here as needed */}
      </Routes>
    </div>
  );
};

export default App;

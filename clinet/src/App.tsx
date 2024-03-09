import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import Error from "./pages/Error";
import Register from "./pages/Register";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chats" element={<Chat />} />
          <Route path="/error-page" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

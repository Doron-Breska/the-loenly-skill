import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { useContext } from "react";
import Profile from "./pages/Profile";
import ChatRoom from "./pages/ChatRoom";
import Error from "./pages/Error";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { AuthContextProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { SocketProvider } from "./context/SocketContext";
import ChatRoom2 from "./pages/ChatRoom2";

function App() {
  return (
    <div className="App">
      <AuthContextProvider>
        <SocketProvider>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/chats" element={<ChatRoom />} />
              <Route path="/chats2" element={<ChatRoom2 />} />
              <Route path="/error-page" element={<Error />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </BrowserRouter>
        </SocketProvider>
      </AuthContextProvider>
    </div>
  );
}

export default App;

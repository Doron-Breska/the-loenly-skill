import React from "react";

import { NavLink, useLocation } from "react-router-dom";

const Navbar = () => {
  const useActivePath = () => {
    const location = useLocation();
    return location.pathname;
  };

  const activePath = useActivePath();

  return (
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      <NavLink className={activePath === "/" ? "active" : ""} to="/">
        Home
      </NavLink>
      <NavLink
        className={activePath === "/profile" ? "active" : ""}
        to="/profile"
      >
        Profile
      </NavLink>
      <NavLink
        className={activePath === "/register" ? "active" : ""}
        to="/register"
      >
        Registration
      </NavLink>
      <NavLink className={activePath === "/chats" ? "active" : ""} to="/chats">
        Chats (all users)
      </NavLink>
      <NavLink
        className={activePath === "/chats2" ? "active" : ""}
        to="/chats2"
      >
        Chats (history)
      </NavLink>
      <NavLink className={activePath === "/login" ? "active" : ""} to="/login">
        Login
      </NavLink>
    </div>
  );
};

export default Navbar;

import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
// import { User } from "../types";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState<any | null>(null);

  const getAllUsers = async () => {
    if (!user) {
      return;
    }
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5005/api/users/all-users",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Assuming the token is stored in the user context
          },
        }
      );
      setUsers(response.data.users);
    } catch (error) {
      console.log(error);
    }
  };
  getAllUsers();

  return (
    <>
      <h1>Home page</h1>
      {user ? <h2>{user.username}</h2> : <h2>there is no user logged in</h2>}
      <hr />
      {users ? (
        users.map((us: any) => (
          <>
            <h2>{us.username}</h2>
            <h2>{us.email}</h2>
          </>
        ))
      ) : (
        <h2>no users</h2>
      )}
    </>
  );
};

export default Home;

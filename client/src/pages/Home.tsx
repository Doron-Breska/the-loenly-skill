import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
// import { User } from "../types";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState<any | null>(null);
  const token = localStorage.getItem("token");

  const getAllUsers = async () => {
    if (!user) {
      return;
    }
    try {
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

  useEffect(() => {
    getAllUsers();
  }, [user]);

  const blockUser = async (user_id: string) => {
    const response = await fetch(`/api/users/block/${user_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const message = `An error occurred: ${response.statusText}`;
      console.error(message);
      return;
    }

    const result = await response.json();
    console.log("User blocked:", result);
  };

  return (
    <>
      <h1>Home page</h1>
      {user ? <h2>{user.username}</h2> : <h2>there is no user logged in</h2>}
      <hr />
      <div style={{ display: "flex" }}>
        {users ? (
          users.map((singleUser: any) => (
            <div
              style={{
                border: "2px solid black",
              }}
            >
              <h2>{singleUser.username}</h2>
              <h2>{singleUser.email}</h2>
              <h2>this is the latitude : {singleUser.latitude}</h2>
              <h2>this is the longitude : {singleUser.longitude}</h2>
              <button
                onClick={() => {
                  blockUser(singleUser.user_id);
                }}
              >
                block
              </button>
            </div>
          ))
        ) : (
          <h2>no users</h2>
        )}
      </div>
    </>
  );
};

export default Home;

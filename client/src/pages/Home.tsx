import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import Map from "../components/Map";
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
            Authorization: `Bearer ${token}`,
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

  const blockUser = async (userId: string) => {
    try {
      const response = await axios.post(
        `http://localhost:5005/api/users/block`,
        { userIdToBlock: userId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("User blocked:", response.data);
      // You may want to call getAllUsers() here to refresh the user list
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("An error occurred:", error.message);
      } else {
        console.error("An error occurred:", error);
      }
    }
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
              key={singleUser._id}
              style={{
                border: "2px solid black",
              }}
            >
              <h2>{singleUser.username}</h2>
              <h2>{singleUser.email}</h2>
              <h2>this is the latitude : {singleUser.latitude}</h2>
              <h2>this is the longitude : {singleUser.longitude}</h2>
              <img
                src={singleUser.userImg}
                alt="dscs"
                style={{ width: "4rem" }}
              />
              <button
                onClick={() => {
                  blockUser(singleUser._id);
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
      <hr />
      <Map />
    </>
  );
};

export default Home;

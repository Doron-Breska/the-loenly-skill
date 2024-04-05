import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <h1>Home page</h1>
      {user ? <h2>{user.username}</h2> : <h2>there is no user logged in</h2>}
    </>
  );
};

export default Home;

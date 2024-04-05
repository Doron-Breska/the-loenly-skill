import axios from "axios";
import React, { FormEvent, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { user, Login, logout } = useContext(AuthContext);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailRef || !passwordRef) {
      alert("please fill out all the fields");
    } else {
      Login(emailRef.current!.value, passwordRef.current!.value);
    }
  };
  // const Login = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!emailRef || !passwordRef) {
  //     console.log("Please fill out all the fields");
  //     alert("Please fill out all the fields");
  //   }
  //   try {
  //     const response = await axios.post(
  //       `http://localhost:5005/api/users/login`,
  //       {
  //         email: emailRef.current?.value,
  //         password: passwordRef.current?.value,
  //       }
  //     );
  //     console.log("this is the results of the fetch", response);
  //     localStorage.setItem("token", response.data.token);
  //   } catch (error) {
  //     // First, assert the error is of the type AxiosError
  //     if (axios.isAxiosError(error)) {
  //       // Now we know it's an AxiosError, and we can access its properties, like response
  //       if (error.response) {
  //         // Now that we know error.response exists, we can safely check its status
  //         if (error.response.status === 404) {
  //           console.log("No user found");
  //         }
  //         if (error.response.status === 406) {
  //           console.log("password doesnot match");
  //         }
  //       }
  //     } else {
  //       console.log(
  //         "something went wrong, front end login func, catch clock, this is the error object -",
  //         error
  //       );
  //     }
  //   }
  // };

  return (
    <>
      <h1>Login Page</h1>
      {user ? <h2>{user.username}</h2> : <h2>there is no user logged in</h2>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="email" ref={emailRef} />
        <input type="text" placeholder="password" ref={passwordRef} />
        <button type="submit">Log-in</button>
      </form>
      <button onClick={logout}>Log-Out</button>
    </>
  );
};

export default Login;

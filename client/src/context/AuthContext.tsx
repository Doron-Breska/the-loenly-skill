import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "../types";
import axios from "axios";

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;

  Login: (email: string, password: string) => void;
  logout: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const initialAuth: AuthContextType = {
  user: null,
  setUser: () => {
    throw new Error("setUser function not implemented.");
  },

  // error: null,
  Login: () => {
    throw new Error("login function not implemented.");
  },
  logout: () => {
    throw new Error("logout function not implemented.");
  },
  loading: false,
  setLoading: function (loading: boolean): void {
    throw new Error("Function not implemented.");
  },
};
//////////

/////
export const AuthContext = createContext<AuthContextType>(initialAuth);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const Login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        `http://localhost:5005/api/users/login`,
        {
          email: email,
          password: password,
        }
      );
      console.log("this is the results of the fetch", response);
      setUser(response.data.user);
      localStorage.setItem("token", response.data.token);
      //Axios instances have a default behavior where any response
      //with a status code outside the range of 2xx causes the
      //promise to be rejected.This means that it automatically
      //enters the catch block if the HTTP status
      //code indicates an error(such as 404 or 406).
    } catch (error) {
      // First, assert the error is of the type AxiosError
      if (axios.isAxiosError(error)) {
        // Now we know it's an AxiosError, and we can access its properties, like response
        if (error.response) {
          // Now that we know error.response exists, we can safely check its status
          if (error.response.status === 404) {
            console.log("No user found");
          }
          if (error.response.status === 406) {
            console.log("password doesnot match");
          }
        }
      } else {
        console.log(
          "something went wrong, front end login func, catch clock, this is the error object -",
          error
        );
      }
    }
  };
  //   const login = async (email: string, password: string) => {
  //     const myHeaders = new Headers();
  //     myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  //     const urlencoded = new URLSearchParams();
  //     urlencoded.append("email", email);
  //     urlencoded.append("password", password);
  //     const requestOptions = {
  //       method: "POST",
  //       headers: myHeaders,
  //       body: urlencoded,
  //     };
  //     try {
  //       const response = await fetch(
  //         `${serverURL}/api/users/login`,
  //         requestOptions
  //       );
  //       if (!response.ok) {
  //         const errorData = await response.json(); // get the error message from the response
  //         setModalContent(errorData.error); // set the error message as modal content
  //         openModal();
  //         return;
  //       }
  //       const result = await response.json();
  //       if (result.user) {
  //         setUser(result.user);
  //         // console.log("test--- result.user :",result.user )
  //         localStorage.setItem("token", result.token);
  //         // localStorage.setItem("my name", "doron");
  //         setModalContent("");
  //       }
  //       // console.log(result);
  //     } catch (error) {
  //       console.log(error);
  //       setModalContent("Unexpected error occurred"); // a general error message when an unexpected error (like network error) occurs
  //       openModal();
  //     }
  //   };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  const checkForToken = useCallback(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchActiveUser(token);
    } else {
    }
  }, []);

  const fetchActiveUser = async (token: string) => {
    try {
      const response = await axios.get(
        "http://localhost:5005/api/users/active",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Assuming 'setUser' is a function that updates your user state
      setUser(response.data.activeUser);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkForToken();
  }, [checkForToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        Login,
        logout,
        // error,
        loading,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

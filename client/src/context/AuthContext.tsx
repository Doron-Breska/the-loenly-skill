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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      if (response.statusText !== "OK") {
        console.log("something went wrong with the context login function ");
        return;
      } else {
        setUser(response.data.user);
        console.log(
          "test for context function to set the user object after log in"
        );
      }
    } catch (error) {
      console.log("Something went wrong with the front end login function");
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

  //old version start
  // const checkForToken = () => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     console.log("There is a token")
  //   } else {
  //     console.log("There is no token")
  //   }
  // }

  //  useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     fetchActiveUser(token);
  //   }
  // }, []);

  // old version end

  const checkForToken = useCallback(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // console.log("There is a token");
      fetchActiveUser(token);
    } else {
      // console.log("There is no token");
    }
    //eslint-disable-next-line
  }, []);

  const fetchActiveUser = async (token: string) => {
    // const myHeaders = new Headers();
    // myHeaders.append("Authorization", `Bearer ${token}`);
    // const requestOptions = {
    //   method: "GET",
    //   headers: myHeaders,
    // };
    //     try {
    //       const response = await fetch(
    //         `${serverURL}/api/users/active`,
    //         requestOptions
    //       );
    //       if (!response.ok) {
    //         const errorData = await response.json();
    //         setModalContent(errorData.error);
    //         return;
    //       }
    //       const result = await response.json();
    //       // console.log("active user result:", result);
    //       setUser(result);
    //     } catch (error) {
    //       console.log(error);
    //     }
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
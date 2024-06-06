import {
  ReactNode,
  createContext,
  useCallback,
  // useContext,
  useEffect,
  useState,
} from "react";
import { User } from "../types";
import axios from "axios";

export interface AuthContextType {
  user: User | null;
  users: User[] | null;
  setUser: (user: User | null) => void;
  setUsers: (users: User[] | null) => void;
  Login: (email: string, password: string) => void;
  logout: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const initialAuth: AuthContextType = {
  user: null,
  users: null,
  setUser: () => {
    throw new Error("setUser function not implemented.");
  },
  setUsers: () => {
    throw new Error("setUsers function not implemented.");
  },
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

export const AuthContext = createContext<AuthContextType>(initialAuth);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[] | null>(null);
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
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 404) {
            console.log("No user found");
          }
          if (error.response.status === 406) {
            console.log("Password does not match");
          }
        }
      } else {
        console.log(
          "something went wrong, front end login func, catch block, this is the error object -",
          error
        );
      }
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  const checkForToken = useCallback(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchActiveUser(token);
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
      setUser(response.data.activeUser);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllUsers = async (token: string) => {
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
      console.log("Error fetching all users:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchActiveUser(token).then(() => {
        if (user) {
          fetchAllUsers(token);
        }
      });
    }
  }, [checkForToken, user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        setUser,
        setUsers,
        Login,
        logout,
        loading,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

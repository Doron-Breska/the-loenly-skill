import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { User } from "../types";

export interface AuthContextType {
  user: User | null;
  users: User[] | null;
  fetchActiveUser: () => void;
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
  fetchActiveUser: () => {},
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

  const fetchActiveUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (token) {
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
        console.log("fetchActiveUser results", response.data.activeUser);
      } catch (error) {
        console.log("Error fetching active user:", error);
      }
    }
  }, []);

  const Login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        `http://localhost:5005/api/users/login`,
        {
          email: email,
          password: password,
        }
      );
      console.log("results - login fetch :", response);
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

  const fetchAllUsers = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.get(
          "http://localhost:5005/api/users/all-users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("results - getAllUsers :", response.data.users);
        setUsers(response.data.users);
      } catch (error) {
        console.log("Error fetching all users:", error);
      }
    }
  }, []);

  useEffect(() => {
    fetchActiveUser();
  }, [fetchActiveUser]);

  useEffect(() => {
    fetchAllUsers();
  }, [user, fetchAllUsers]);

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        fetchActiveUser,
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

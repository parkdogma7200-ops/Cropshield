import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // =====================================
  // Get saved user
  // =====================================

  const [user, setUser] = useState(() => {
    const savedUser =
      localStorage.getItem("cropShieldUser") ||
      sessionStorage.getItem("cropShieldUser");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  // =====================================
  // Get saved token
  // =====================================

  const [token, setToken] = useState(() => {
    return (
      localStorage.getItem("cropShieldToken") ||
      sessionStorage.getItem("cropShieldToken") ||
      null
    );
  });

  const [loading, setLoading] = useState(true);

  // =====================================
  // Verify existing login when app starts
  // =====================================

  useEffect(() => {
    const verifyUser = async () => {
      const savedToken =
        localStorage.getItem("cropShieldToken") ||
        sessionStorage.getItem("cropShieldToken");

      // No token means there is no logged-in user
      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/me",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${savedToken}`,
            },
          }
        );

        const data = await response.json();

        // Token is valid
        if (response.ok) {
          setUser(data.user);
          setToken(savedToken);

          // Update the user in whichever storage contains the token
          if (localStorage.getItem("cropShieldToken")) {
            localStorage.setItem(
              "cropShieldUser",
              JSON.stringify(data.user)
            );
          } else {
            sessionStorage.setItem(
              "cropShieldUser",
              JSON.stringify(data.user)
            );
          }
        } else {
          // Token is invalid or expired
          setUser(null);
          setToken(null);

          localStorage.removeItem("cropShieldUser");
          localStorage.removeItem("cropShieldToken");

          sessionStorage.removeItem("cropShieldUser");
          sessionStorage.removeItem("cropShieldToken");
        }
      } catch (error) {
        console.error(
          "Authentication verification error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  // =====================================
  // Login
  // =====================================

  const login = (
    userData,
    authToken,
    rememberMe = false
  ) => {
    setUser(userData);
    setToken(authToken);

    // Clear any previous login
    localStorage.removeItem("cropShieldUser");
    localStorage.removeItem("cropShieldToken");

    sessionStorage.removeItem("cropShieldUser");
    sessionStorage.removeItem("cropShieldToken");

    // Remember Me checked
    if (rememberMe) {
      localStorage.setItem(
        "cropShieldUser",
        JSON.stringify(userData)
      );

      localStorage.setItem(
        "cropShieldToken",
        authToken
      );
    }

    // Remember Me unchecked
    else {
      sessionStorage.setItem(
        "cropShieldUser",
        JSON.stringify(userData)
      );

      sessionStorage.setItem(
        "cropShieldToken",
        authToken
      );
    }
  };

  // =====================================
  // Logout
  // =====================================

  const logout = () => {
    setUser(null);
    setToken(null);

    // Clear localStorage
    localStorage.removeItem("cropShieldUser");
    localStorage.removeItem("cropShieldToken");

    // Clear sessionStorage
    sessionStorage.removeItem("cropShieldUser");
    sessionStorage.removeItem("cropShieldToken");
  };

  // =====================================
  // Context
  // =====================================

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};
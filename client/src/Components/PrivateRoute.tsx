import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

import { URL } from "../App";

export default function PrivateRoute({
  children,
}: {
  children: React.JSX.Element;
}) {
  const [token, setToken] = useState<string | null>(null);
  const [previousPath, setPreviousePath] = useState<string | null>(null);

  useEffect(() => {
    // Need some logic to get previous path
    // const previousPath:any = navigate(-1);
    // setPreviousePath(previousPath);
    setPreviousePath(null);

    const getToken = async () => {
      const token = localStorage.getItem("token");

      // Check if token is valid or not
      if (!token) return setToken(null);
      const response = await axios.post(`${URL}/api/auth/find-user`, { token });
      const isValidToken = response.data.success;

      if (isValidToken) return setToken(token);
      setToken(null);
    };
    getToken();
  }, []);

  const currentPath = previousPath ? previousPath : "/";

  const visitingPath = window.location.pathname;

  // To avoid any erros during reloading
  if (visitingPath === currentPath) return children;

  if (visitingPath === "/" || visitingPath === "/signup") {
    return children;
  }
  return token ? children : <Navigate to="/" />;
}

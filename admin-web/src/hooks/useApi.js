import { useContext, useMemo, useCallback } from "react";
import { AuthContext } from "../App";

export default function useApi() {
  const { token } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

  const request = useCallback(
    async (method, endpoint, body = null) => {
      const options = {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${API_URL}${endpoint}`, options);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return response.json();
    },
    [token],
  );

  return useMemo(
    () => ({
      get: (endpoint) => request("GET", endpoint),
      post: (endpoint, body) => request("POST", endpoint, body),
      put: (endpoint, body) => request("PUT", endpoint, body),
    }),
    [request],
  );
}

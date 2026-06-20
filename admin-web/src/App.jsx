// import React, { useState } from "react";
// import Login from "./pages/Login";
// import ApprovalQueue from "./pages/ApprovalQueue";

// export const AuthContext = React.createContext();

// export default function App() {
//   const [token, setToken] = useState(localStorage.getItem("token") || null);

//   const handleLogin = (newToken) => {
//     localStorage.setItem("token", newToken);
//     setToken(newToken);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setToken(null);
//   };

//   return (
//     <AuthContext.Provider value={{ token }}>
//       <div style={{ fontFamily: "Arial, sans-serif" }}>
//         {!token ? (
//           <Login onLoginSuccess={handleLogin} />
//         ) : (
//           <div>
//             <div
//               style={{
//                 backgroundColor: "#5555e7",
//                 color: "#fff",
//                 padding: "15px 20px",
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}
//             >
//               <h2>Load Management</h2>
//               <button
//                 onClick={handleLogout}
//                 style={{
//                   padding: "8px 16px",
//                   backgroundColor: "#fff",
//                   color: "#5555e7",
//                   border: "none",
//                   borderRadius: "4px",
//                   cursor: "pointer",
//                   fontWeight: "bold",
//                 }}
//               >
//                 Logout
//               </button>
//             </div>
//             <ApprovalQueue />
//           </div>
//         )}
//       </div>
//     </AuthContext.Provider>
//   );
// }

import React, { useState } from "react";
import Login from "./pages/Login";
import ApprovalQueue from "./pages/ApprovalQueue";

export const AuthContext = React.createContext();

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const handleLogin = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token }}>
      <div style={{ fontFamily: "Arial, sans-serif" }}>
        {!token ? (
          <Login onLoginSuccess={handleLogin} />
        ) : (
          <ApprovalQueue onLogout={handleLogout} />
        )}
      </div>
    </AuthContext.Provider>
  );
}

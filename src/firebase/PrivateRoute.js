import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "./firebaseConfig";
import { getUserRole } from "./authService";

const PrivateRoute = ({ requiredRole }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth.currentUser) {
      getUserRole(auth.currentUser.uid).then((role) => {
        setRole(role);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <p>Loading...</p>;

  return role === requiredRole ? <Outlet /> : <Navigate to="/unauthorized" />;
};

export default PrivateRoute;

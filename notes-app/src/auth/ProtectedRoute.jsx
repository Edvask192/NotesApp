import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  const token = localStorage.getItem("token");

  if (!currentUser || !token) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;

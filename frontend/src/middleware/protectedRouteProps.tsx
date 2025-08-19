import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
// import { getUser } from "../redux/api_request/user_api";
import { useDispatch, useSelector } from "react-redux";
// import LoadingScreen from "../components/LoadingScreen";

interface ProtectedRouteProps {
  allowedRoles: string[]; // danh sách role được phép truy cập
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const user = useSelector((state: any) => state.auth.login.currentUser);
  console.log("User from App:", user);
  const userRole = user?.user_role;
  const isVerified = user?.isVerified;
  const phoneNumber = user?.phoneNumber;

  console.log("User role:", userRole);
  console.log("User isVerified:", isVerified);
  console.log("User phoneNumber:", phoneNumber);
  if (!isVerified && userRole !== "admin") {
    return <Navigate to={`/register/otp/${phoneNumber}`} replace />;
  }

  if (!allowedRoles.includes(userRole !== null ? userRole : "")) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
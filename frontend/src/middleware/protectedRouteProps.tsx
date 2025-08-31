import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
// import { getUser } from "../redux/api_request/user_api";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
// import LoadingScreen from "../components/LoadingScreen";

interface ProtectedRouteProps {
  allowedRoles: string[]; // danh sách role được phép truy cập
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const user = useSelector((state: any) => state.auth.login.currentUser);
  const userRole = user?.role;
 


  console.log("User role:", userRole);
 if(!userRole) {
    // toast.error('Bạn vui lòng đăng nhập!')
    return <Navigate to="/login" replace />;
  }
  if (!allowedRoles.includes(userRole !== null ? userRole : "")) {
    toast.error('Bạn không có quyền truy cập!')
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "src/redux/api/apiRequestAuth";

export default function Logout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
      console.log("Logging out...");
        logoutUser(dispatch, navigate);
        
    }
  return (
    <div onClick={handleLogout}>
         Đăng xuất
    </div>
  );
}

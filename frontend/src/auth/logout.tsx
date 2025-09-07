import { useState } from "react";
import { BiLogOut } from "react-icons/bi";
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
         <BiLogOut size={24} />
    </div>
  );
}

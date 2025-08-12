import { Outlet } from "react-router";

import { AuthProvider } from "~/context/authContext";

export default function rootLayout() {
  return (
 
  
          
          <Outlet />
          
  
 
  );
}

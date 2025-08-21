import { Outlet } from "react-router";
import Message from "../components/chat/MessageWidget";
import Sidebar from "../components/sidebar";
// import { AuthProvider } from "~/context/authContext";

export default function RootLayout() {
  return (
  //  <AuthProvider>
    <div className="flex h-screen realative"> 
      <Sidebar />
      <div className="flex flex-col flex-1">
       <Message/>
        <main className=" ml-[80px] flex-1 flex  justify-center ">
          
          <Outlet />
          
        </main>
      </div>
    </div>
  // </AuthProvider>
  );
}

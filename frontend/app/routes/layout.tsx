import { Outlet } from "react-router";
import Sidebar from "~/components/sidebar";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen ">
      <Sidebar />
      <div className="flex flex-col flex-1">
        {/* <Header /> */}
        <main className=" ml-[80px] flex-1 flex  justify-center ">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

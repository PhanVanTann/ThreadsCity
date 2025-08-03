import { Outlet } from "react-router";
import Sidebar from "~/components/sidebar";

export default function DashboardLayout() {
  return (
    <div className="flex ">
      <Sidebar />
      <div className="flex flex-col flex-1">
        {/* <Header /> */}
        <main className="p-4 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

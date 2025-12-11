import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";


function Layout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Child routes will be rendered here */}
        <Outlet />
      </main>
    </div>
  );
}
export default Layout;
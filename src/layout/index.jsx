import { Outlet } from "react-router-dom";
import  SideBarAndNavBar  from "../components/Organisms/SideBarAndNavBar";

export const MainLayout = () => {
  return (
    <div >
      <SideBarAndNavBar />
      <div className="p-4 lg:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
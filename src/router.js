import { createBrowserRouter } from "react-router-dom";
import Unauthorized from "./pages/Unauthorized.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import UserDashboard from "./pages/UserDashboard.jsx"; 
import withAuthorization from "./utils/withAuthorization";


const router = createBrowserRouter([
  { path: "/unauthorized", element: <Unauthorized /> },
  { path: "/admin", element: withAuthorization(AdminDashboard, "admin") },
  { path: "/dashboard", element: withAuthorization(UserDashboard, "user") }
]);

export { router };

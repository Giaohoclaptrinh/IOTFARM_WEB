import { createBrowserRouter, Navigate } from "react-router-dom";
import { MainLayout } from "../layout";
import Devices from "../pages/devices/Devices";
import DeviceSetup from "../pages/devices/DeviceSetup"
import Dashboard from "../pages/dashboards/dashboard";
import ListDashboards from "../pages/dashboards/listdashboard";
import Login from "../pages/login/Login";
import { AuthProvider } from '@/contexts/Auth'; //
import DateRangePicker from "@/components/Organisms/DatePicker";

function PrivateRoute({ children }) {
    const isLoggedIn = !!localStorage.getItem('authToken');
    return isLoggedIn ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
    const isLoggedIn = !!localStorage.getItem('authToken');
    return isLoggedIn ? <Navigate to="/dashboards" /> : children;
}

export const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <AuthProvider>
                <MainLayout />
            </AuthProvider>
        ),
        children: [
            {
                path: "/",
                element: <Navigate to="/login" />,
            },
            {
                path: "dashboards",
                element: (
                    <PrivateRoute>
                        <ListDashboards />
                    </PrivateRoute>
                ), 
            },
            {
                path: "dashboards/:id",
                element: (
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                ),
            },
            {
                path: "devices",
                element: (
                    <PrivateRoute>
                        <Devices />
                    </PrivateRoute>
                ),
            },
            {
                path: "devices/:deviceId/setup",
                element: (
                    <PrivateRoute>
                        <DeviceSetup />
                    </PrivateRoute>
                ),
            },
        ],
    },
    {
        path: "login",
        element: (
            <PublicRoute>
                <Login />
            </PublicRoute>
        ),
    },
    {
        path: "test",
        element: (
            <DateRangePicker />
        ),
    }
],
{
    future: {
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7_relativeSplatPath: true,
        v7_skipActionErrorRevalidation: true,
    },
});
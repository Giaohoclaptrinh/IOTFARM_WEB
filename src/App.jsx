// import { createRoot } from "react-dom/client";
import { router } from "./router";
import { RouterProvider } from "react-router-dom";
// import { MainLayout } from "./layout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Bảo vệ trang Admin */}
        <Route path="/admin" element={<PrivateRoute requiredRole="admin" />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App

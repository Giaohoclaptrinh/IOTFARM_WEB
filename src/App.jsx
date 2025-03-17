// import { createRoot } from "react-dom/client";
import { router } from "./router";
import { RouterProvider } from "react-router-dom";
// import { MainLayout } from "./layout";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/unauthorized" element={<Unauthorized />} />

//         {/* Bảo vệ trang Admin */}
//         <Route path="/admin" element={<PrivateRoute requiredRole="admin" />}>
//           <Route path="/admin/dashboard" element={<AdminDashboard />} />
//         </Route>
//       </Routes>
//     </Router>
//   );
// }

// const router = createBrowserRouter([
//   { path: "/unauthorized", element: <Unauthorized /> },
//   {
//     path: "/admin",
//     element: <PrivateRoute requiredRole="admin" />,
//     children: [
//       { path: "dashboard", element: <AdminDashboard /> },
//     ],
//   },
// ]);

// function App() {
//   return (
//     <RouterProvider router={router} future={{ v7_startTransition: true }}/>
//   )
// }

// export default App
function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged(setUser);
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
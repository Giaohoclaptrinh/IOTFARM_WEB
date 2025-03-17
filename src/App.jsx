// import { createRoot } from "react-dom/client";
import { router } from "./router";
import { RouterProvider } from "react-router-dom";
// import { MainLayout } from "./layout";

function App() {
  return (
    <RouterProvider router={router} future={{ v7_startTransition: true }}/>
  )
}

export default App

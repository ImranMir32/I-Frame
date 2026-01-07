import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import LogInForm from "./routes/LogInForm.jsx";
import Admin from "./routes/Admin.jsx"
import ErrorPage from "./error.page.jsx";

import { GlobalStateProvider } from "./Context/Global_Context.js";
import { GlobalMethodsProvider } from "./Context/GlobalMethodsContext.js";
import Home from "./routes/Home.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },

    {
    path: "/admin-panel",
    element: <Admin />,
    errorElement: <ErrorPage />,
  },
  
  {
    path: "/Login",
    element: <LogInForm />,
    errorElement: <ErrorPage />,
  },
]);

function App() {
  return (
    <GlobalStateProvider>
      <GlobalMethodsProvider>
        <RouterProvider router={router} />
      </GlobalMethodsProvider>
    </GlobalStateProvider>
  );
}

export default App;

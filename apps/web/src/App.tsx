import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/AuthPage";
import WorkflowEditorCanvas from "./pages/WorflowEditorCanvas";
import Credentials from "./pages/Credentials";
import LandingPage from "./pages/LandingPage";
import ExecutionDetailPage from "./pages/ExecutionDetailPage";

import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
import { Layout } from "./components/Layout";

import { userAuthStore } from "./store/authStore";
import { useEffect } from "react";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PublicRoute>
        <LandingPage />
      </PublicRoute>
    ),
  },
  {
    path: "/auth",
    element: (
      <PublicRoute>
        <AuthPage />
      </PublicRoute>
    ),
  },
  {
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/workflow/:id",
        element: <WorkflowEditorCanvas />,
      },
      {
        path: "/credentials",
        element: <Credentials />,
      },
      {
        path: "/workflows/:workflowId/executions/:executionId",
        element: <ExecutionDetailPage />,
      },
    ],
  },
]);

function App() {
  const { checkAuth } = userAuthStore();

  useEffect(() => {
    (async function () {
      await checkAuth();
    })();
  }, [checkAuth]);

  return <RouterProvider router={router} />;
}

export default App;

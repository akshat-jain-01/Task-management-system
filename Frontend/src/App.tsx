import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";

import ProtectedRoute from "./Components/protectedRoute";
import PublicRoute from "./Components/publicRoute";

function App() {

  return (

    <>
      <Toaster />

      <Routes>

        <Route
          path="/"
          element={
            <Navigate to="/login" />
          }
        />



        {/* PUBLIC ROUTES */}
        <Route
          path="/login"
          element={
            <PublicRoute>

              <Login />

            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>

              <Register />

            </PublicRoute>
          }
        />



        {/* PROTECTED ROUTE */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>

              <Dashboard />

            </ProtectedRoute>
          }
        />

      </Routes>
    </>
  );
}

export default App;
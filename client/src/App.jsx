import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";

import PrivateRoute from "./components/PrivateRoute";
import ProtectedRoute from "./routes/ProtectedRoute";

import Dashboard from "./pages/dashboard/Dashboard";
import ShareFund from "./pages/dashboard/ShareFund";
import ThriftFund from "./pages/dashboard/ThriftFund";
import MTLoan from "./pages/dashboard/MTLoan";
import OwnFund from "./pages/dashboard/OwnFund";

function App() {
  return (
      <Routes>

        {/* Public Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard (Protected) */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* -------- FUND ROUTES (Protected) -------- */}

        <Route
          path="/fund/share"
          element={
            <PrivateRoute>
              <ShareFund />
            </PrivateRoute>
          }
        />

        <Route
          path="/fund/thrift"
          element={
            <PrivateRoute>
              <ThriftFund />
            </PrivateRoute>
          }
        />

        <Route
          path="/fund/mtloan"
          element={
            <PrivateRoute>
              <MTLoan />
            </PrivateRoute>
          }
        />

        <Route
          path="/fund/own"
          element={
            <PrivateRoute>
              <OwnFund />
            </PrivateRoute>
          }
        />

        {/* Example future usage of ProtectedRoute */}
        {/* 
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        */}

      </Routes>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";  // For login protection
import ProtectedRoute from "./routes/ProtectedRoute";  // For future role-based pages
import Dashboard from "./pages/dashboard/Dashboard";

function App() {
  return (
    
      <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Private Dashboard */}
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Example future usage of ProtectedRoute */}
        {/* <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminPanel />
            </ProtectedRoute>
          }
        /> */}
      </Routes>
  );
}

export default App;

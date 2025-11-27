import React from "react";
import { Toaster } from 'react-hot-toast';
import {
  BrowserRouter,
  Routes,  
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
// import LoginPage from './pages/LoginPage';
import HRPortal from "./pages/HRPortal";
import ManagerPortal from "./pages/ManagerPortal";
// import ProtectedRoute from './components/auth/ProtectedRoute';
import "./index.css";
import Employee from "./pages/Employee";
import ITPortal from "./pages/ITPortal";
import FinancePortal from "./pages/FinancePortal";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Login from "./components/auth/Login";
import ForgotPassword from "./components/auth/ForgotPassword";
import MyProfile from "./components/hr/MyProfile";
import AdminUsers from "./pages/admin/AdminUsers";
import Sidebar from "./components/hr/Sidebar";

// Coming Soon Component with Back to Login button
const ComingSoonPortal = ({ title }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleBackToLogin = () => {
    // First logout the user, then navigate to login
    logout();
    navigate("/login");
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <p className="text-gray-600 mb-6">Coming Soon...</p>
      <button
        onClick={handleBackToLogin}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
      >
        Back to Login
      </button>
    </div>
  );
};

function App() {
  return (
    
    <AuthProvider>
      <BrowserRouter>
        <Toaster />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/hr-portal/*"
              element={
                <ProtectedRoute allowedRoles={["HR"]}>
                  <HRPortal />
                </ProtectedRoute>
              }
            />
            <Route path="/sidebar" element={<Sidebar />} />

            <Route path="/myprofile" element={<MyProfile />} />
            {/* <Route path="/adminUser" element={<AdminUsers />} /> */}

            <Route
              path="/manager-portal/*"
              element={
                <ProtectedRoute allowedRoles={["Manager"]}>
                  <ManagerPortal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/team-lead-portal/*"
              element={
                <ProtectedRoute allowedRoles={["Team Lead"]}>
                  <ComingSoonPortal title="Team Lead Portal" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/developer-portal/*"
              element={
                <ProtectedRoute allowedRoles={["Junior Developer"]}>
                  <ComingSoonPortal title="Developer Portal" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/it-portal/*"
              element={
                <ProtectedRoute allowedRoles={["IT Team Member"]}>
                  <ITPortal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee-portal/*"
              element={
                <ProtectedRoute allowedRoles={["Employee"]}>
                  <Employee />
                </ProtectedRoute>
              }
            />
            <Route
              path="/finance-portal/*"
              element={
                <ProtectedRoute allowedRoles={["Finance Team Member"]}>
                  {/* <ComingSoonPortal title="Finance Portal" /> */}
                  <FinancePortal />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

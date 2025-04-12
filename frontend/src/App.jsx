import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import Login from "./pages/auth/Login.jsx"
import Register from "./pages/auth/Register.jsx"
import Dashboard from "./pages/dashboard/Dashboard"
import {AuthProvider} from "@/context/AuthContext.jsx";
import {useAuth} from "@/hooks/useAuth.js";

const PublicRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    console.log(isAuthenticated);
    if (isAuthenticated) return <Navigate to="/dashboard" replace />;

    return children;
};

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) {2
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
  return (
      <AuthProvider>
          <Router>
              <Routes>
                  <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                  <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/" element={<Navigate to="/signin" replace />} />
              </Routes>
          </Router>
      </AuthProvider>
  )
}

export default App

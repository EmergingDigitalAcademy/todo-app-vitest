import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import useAuthStore from './stores/authStore';

function App() {
  const { user, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to="/tasks" replace /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/tasks" replace /> : <Register />} 
        />
        <Route 
          path="/tasks" 
          element={
            user ? (
              <Home />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route path="/" element={<Navigate to="/tasks" replace />} />
        {/* TODO: Add a route for the 404 page */}
        <Route path="*" element={
          <div className="d-flex flex-column align-items-center justify-content-center vh-100">
            <h1 className="display-1 fw-bold">404</h1>
            <p className="fs-3">Page Not Found</p>
            <p className="lead">The page you're looking for doesn't exist.</p>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;

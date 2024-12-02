import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
      </Routes>
    </Router>
  );
}

export default App;

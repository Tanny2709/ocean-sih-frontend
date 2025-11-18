import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import AnalystDashboard from './pages/AnalystDashboard';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<HomePage/>} />

        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/analyst-dashboard"
          element={
            <PrivateRoute role="analyst">
              <AnalystDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HouseProvider } from './context/HouseContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Houses from './pages/Houses';
import HouseDetail from './pages/HouseDetail';
import AddHouse from './pages/AddHouse';
import EditHouse from './pages/EditHouse';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <HouseProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/houses" element={<Houses />} />
              <Route path="/house/:id" element={<HouseDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/add-house" element={
                <ProtectedRoute><AddHouse /></ProtectedRoute>
              } />
              <Route path="/edit-house/:id" element={
                <ProtectedRoute><EditHouse /></ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute><Profile /></ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Layout>
        </HouseProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

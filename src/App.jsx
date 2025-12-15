import './App.css'
import Main_page from './main_page';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import ProtectEdit from './admin/components/ProtectEdit'
import AdminDashboard from './admin/page';
import AdminLogin from './admin/login/page';
import ProtectedRoute from './admin//components/ProtectedRoute';

function App() {
  return (
    <div>
      <ToastContainer position="top-center" autoClose={3000} />

      <Routes>
        <Route path="/" element={<Main_page />} />

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>

          }
        />
        
      </Routes>
    </div>
  )
}

export default App;

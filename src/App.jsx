import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/SideBar";
import Header from "./components/Header";
import Dashboard from "./sections/Dashboard";
import Users from "./sections/Users";
import Reports from "./sections/Reports";
import Login from "./auth/Login";
import Settings from "./sections/Settings";
import EbooksAdmin from "./sections/EbooksAdmin";
import AdminMessages from "./sections/MessageBoard";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("accessToken");
  const isLoginPage = window.location.pathname === "/login";
  // ✅ Allow login + 2FA to continue even without a token
  if (!token && !isLoginPage) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
export default function App() {
  const token = localStorage.getItem("accessToken");

  // Hide sidebar + header on the login page
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <div className="flex h-screen overflow-hidden bg-gray-950">
                <Sidebar />
                <div className="flex flex-col flex-1 overflow-y-auto">
                  <Header />
                  <main className="flex-1 p-6 bg-gray-900 mt-14 md:mt-0">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/users" element={<Users />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/admin-messages" element={<AdminMessages />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/ebooks" element={<EbooksAdmin />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
    </Router>
  );
}

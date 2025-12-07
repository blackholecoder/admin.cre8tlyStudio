import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Sidebar from "./components/SideBar";
import Header from "./components/Header";
import Dashboard from "./sections/Dashboard";
import Users from "./sections/Users";
import Reports from "./sections/Reports";
import Login from "./auth/Login";
import Settings from "./sections/Settings";
import AdminMessages from "./sections/MessageBoard";
import WebsiteAnalytics from "./sections/WebsiteAnalytics";
import AdminSinglePost from "./sections/AdminSinglePost";
import AdminTopicPosts from "./sections/AdminTopicPosts";
import AdminCommunityTopics from "./sections/AdminCommunityTopics";
import AdminCreatePostModal from "./sections/AdminCreatePostModal";
import Deliveries from "./sections/Deliveries";
import ReferralEmployeePage from "./sections/ReferralEmployeePage";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("accessToken");
  const isLoginPage = window.location.pathname === "/login";

  if (!token && !isLoginPage) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function ProtectedRoute({ children, allowedRoles = [] }) {
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If no specific role restriction, allow all logged-in users
  if (allowedRoles.length === 0) {
    return children;
  }

  // 🚫 If role not allowed, send them to dashboard
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}


export default function App() {
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

                      {/* 🔒 Admin-only routes */}
                      <Route
                        path="/users"
                        element={
                          <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                            <Users />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/reports"
                        element={
                          <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                            <Reports />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin-messages"
                        element={
                          <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                            <AdminMessages />
                          </ProtectedRoute>
                        }
                      />
                      {/* ✅ Shared routes */}
                      <Route
                        path="/settings"
                        element={
                          <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                            <Settings />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/website-analytics"
                        element={
                          <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                            <WebsiteAnalytics />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/community"
                        element={
                          <ProtectedRoute allowedRoles={["superadmin"]}>
                            <AdminCommunityTopics />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/community/topic/:topicId"
                        element={
                          <ProtectedRoute allowedRoles={["superadmin"]}>
                            <AdminTopicPosts />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/community/post/:postId"
                        element={
                          <ProtectedRoute allowedRoles={["superadmin"]}>
                            <AdminSinglePost />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                         path="/admin/community/create-post"
                        element={
                          <ProtectedRoute allowedRoles={["superadmin"]}>
                            <AdminCreatePostModal />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                         path="/deliveries"
                        element={
                          <ProtectedRoute allowedRoles={["superadmin"]}>
                            <Deliveries />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                         path="/employee-referrals"
                        element={
                          <ProtectedRoute allowedRoles={["superadmin"]}>
                            <ReferralEmployeePage />
                          </ProtectedRoute>
                        }
                      />
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

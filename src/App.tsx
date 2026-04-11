import { BrowserRouter, Routes, Route} from "react-router-dom";
import { SignupForm } from './pages/SignUpForm';
import { LoginForm } from './pages/LoginForm';
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { Blogs } from "./pages/Blogs";
import { Home } from "./pages/Home";
import { Properties } from "./pages/Properties";
import { Profile } from "./pages/Profile";
import { Sidebar } from "./components/layout/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";

function AppContent() {
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/sign-up" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Home />} />
          <Route path="properties" element={<Properties />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </div>
  );
}

export default function App() {
  return (
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
  );
}

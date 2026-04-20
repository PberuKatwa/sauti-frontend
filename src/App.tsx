import { BrowserRouter, Routes, Route} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Sidebar } from "./components/layout/Sidebar";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { Products } from "./pages/Products";
import Test from "./pages/Test";
import Home from "./pages/Home";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";

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
        <Route path="/test" element={<Test />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="home" element={<Home />}/>
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
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

import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faHome,
  faRightFromBracket,
  faUser,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { authService } from "../../services/auth.service";
import { faBox } from "@fortawesome/free-solid-svg-icons/faBox";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { path: "/dashboard/home", label: "Home", icon: faHome, end: false },
  { path: "/dashboard/users", label: "Users", icon: faUsers, adminOnly: true },
  { path: "/dashboard/products", label: "Products", icon: faBoxOpen, end: false },
  { path: "/dashboard/orders", label: "Orders", icon: faBox, end: false },
  { path: "/dashboard/profile", label: "Profile", icon: faUser, end: false },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
    } catch {
      // Continue with local cleanup even if API call fails
    } finally {
      navigate("/login");
    }
  };

  return (
    <aside
      className="sticky top-0 h-screen w-[220px] flex flex-col flex-shrink-0 font-[Poppins]
      bg-gradient-to-b from-slate-950 via-slate-900 to-blue-950"
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <img
            src="/logo/sauti-main.png"
            alt="Sauti-Cloud"
            className="h-10 w-auto object-contain"
          />
          <span className="font-['Poppins'] text-sm font-bold leading-tight">
            <span className="text-white">Sauti</span>
            <span className="text-[#F48120]"> Cloud</span>
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pt-4 space-y-0.5">
        <p className="px-3 pb-3 text-[9px] font-semibold uppercase tracking-widest text-white/25">
          Menu
        </p>

        {navItems
          .filter((item) => {
            if (item.adminOnly && user?.role !== "admin") return false;
            return true;
          })
          .map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                transition-all duration-150 border
                ${
                  isActive
                    ? "bg-white border-white text-black font-semibold"
                    : "border-transparent text-white/40 font-normal"
                }
                `
              }
            >
              <FontAwesomeIcon icon={item.icon} />
              <span>{item.label}</span>
            </NavLink>
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-4 border-t border-white/10" />

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 mx-3 my-4 px-3 py-2.5 rounded-lg text-sm
        text-white/40 hover:bg-white/5 hover:text-white/70
        transition-all duration-150 border border-transparent font-normal"
      >
        <FontAwesomeIcon
          icon={faRightFromBracket}
          className="w-3.5 h-3.5 flex-shrink-0"
        />
        <span>Logout</span>
      </button>
    </aside>
  );
};

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faCircleNotch,
  faUserPen,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { UsersService } from "../../services/users.service";
import type { UpdateUserDetailsPayload, UserProfile, UserStatus } from "../../types/user.types";
import type { UserRoles } from "../../types/authSession.types";

const initialState: UpdateUserDetailsPayload = {
  userId: 0,
  firstName: "",
  lastName: "",
  email: "",
  role: "basic",
  status: "pending",
};

interface UpdateUserModalProps {
  isOpen: boolean;
  user: UserProfile;
  onClose: () => void;
  onSuccess: () => void;
}

export const UpdateUserModal = function ({
  isOpen,
  user,
  onClose,
  onSuccess,
}: UpdateUserModalProps) {
  const [data, setData] = useState<UpdateUserDetailsPayload>(initialState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setData({
        userId: user.id,
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
        role: (user.role as UserRoles) || "basic",
        status: user.status || "pending",
      });
    }
  }, [user]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    if (name === "role") {
      setData((prev) => ({ ...prev, role: value as UserRoles }));
    } else if (name === "status") {
      setData((prev) => ({ ...prev, status: value as UserStatus }));
    } else {
      setData((prev) => ({ ...prev, [name]: value } as UpdateUserDetailsPayload));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      await UsersService.updateUser(data);
      toast.success("User updated successfully");
      onSuccess();
      onClose();
    } catch(error:any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Update failed. Please try again.";
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setData(initialState);
    onClose();
  };

  if (!isOpen || !user) return null;

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none bg-white focus:border-[#F48120] focus:ring-2 focus:ring-[#F48120]/20 transition-colors duration-150";

  const labelClass = "text-sm font-medium text-gray-700";

  const roleOptions: UserRoles[] = ["super_admin", "admin", "basic", "demo"];
  const statusOptions: UserStatus[] = ["active", "trash", "pending"];

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/30 p-4 sm:p-6 transition-opacity duration-200">
      <div className="relative z-[310] w-full max-w-[500px] max-h-[92vh] flex flex-col bg-white rounded-xl shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-orange-50 border border-orange-100">
              <FontAwesomeIcon icon={faUserPen} className="text-[#F48120] text-sm" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Update User</h3>
              <p className="text-xs text-gray-400">Edit user details and permissions</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="w-9 h-9 flex items-center justify-center rounded-lg
                       text-[#12245B]
                       hover:bg-[#12245B] hover:text-white
                       active:bg-[#020617]
                       transition-colors duration-150"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* SCROLLABLE FORM */}
        <form
          className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-5"
          onSubmit={handleSubmit}
        >
          {/* FIRST NAME & LAST NAME */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="update-firstName" className={labelClass}>First Name</label>
              <input
                id="update-firstName"
                type="text"
                name="firstName"
                value={data.firstName || ""}
                onChange={handleChange}
                placeholder="e.g. John"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="update-lastName" className={labelClass}>Last Name</label>
              <input
                id="update-lastName"
                type="text"
                name="lastName"
                value={data.lastName || ""}
                onChange={handleChange}
                placeholder="e.g. Doe"
                className={inputClass}
              />
            </div>
          </div>

          {/* EMAIL */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="update-email" className={labelClass}>Email</label>
            <input
              id="update-email"
              type="email"
              name="email"
              value={data.email || ""}
              onChange={handleChange}
              placeholder="e.g. john@example.com"
              className={inputClass}
            />
          </div>

          <hr className="border-gray-100" />

          {/* ROLE */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="update-role" className={labelClass}>Role</label>
            <select
              id="update-role"
              name="role"
              value={data.role || ""}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select a role</option>
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* STATUS */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="update-status" className={labelClass}>Status</label>
            <select
              id="update-status"
              name="status"
              value={data.status || ""}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select a status</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <hr className="border-gray-100" />

          {/* ACTIONS */}
          <div className="flex items-center gap-3 pb-1">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 border border-gray-200 text-gray-500 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors duration-150 hover:border-[#12245B] hover:bg-[#12245B] hover:text-white active:bg-[#020617] active:border-[#020617]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] flex items-center justify-center gap-2 bg-[#F48120] hover:bg-[#E57514] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />}
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const EditUserButton = function ({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="p-2 text-[#F48120] hover:bg-orange-50 rounded-md transition-colors"
      title="Edit User"
    >
      <FontAwesomeIcon icon={faEdit} />
    </button>
  );
};

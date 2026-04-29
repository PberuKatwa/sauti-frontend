import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import UserFilters from "../components/filters/users.filters";
import type { BaseUserFilters, UserProfile, UserStatus } from "../types/user.types";
import type { ColumnType } from "../components/tables/DataTable";
import DataTable from "../components/tables/DataTable";
import { UsersService } from "../services/users.service";
import { SautiCloudLoader } from "../components/spinners/sauti.loader";
import { UpdateUserModal, EditUserButton } from "../components/users/users.update";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const UserFallback: UserProfile[] = [
  {
    id: 0,
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    status: "active" as UserStatus,
    created_at: new Date(),
  },
];

export default function UserManagement() {
  const startFilters: BaseUserFilters = {
    firstName: "",
    lastName: "",
    email: "",
  };

  const [filters, setFilters] = useState<BaseUserFilters>(startFilters);
  const [users, setUsers] = useState<UserProfile[]>(UserFallback);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  const getAllUsers = async () => {
    try {
      setLoading(true);
      const response = await UsersService.getAllUsers(currentPage, limit, filters);
      if (!response.data) throw new Error("No data was found");
      setUsers(response.data.users);
      setCurrentPage(response.data.pagination.currentPage);
      setTotalPages(response.data.pagination.totalPages);
      toast.success(response.message);
    } catch (error) {
      console.error("Error in getting all users", error);
      toast.error("Error in fetching all users");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: BaseUserFilters) => {
    setFilters({
      firstName: newFilters.firstName || "",
      lastName: newFilters.lastName || "",
      email: newFilters.email || "",
    });
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilters(startFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
  };

  const handleEdit = (row: Record<string, unknown>) => {
    const user: UserProfile = {
      id: row.id as number,
      first_name: row.first_name as string,
      last_name: row.last_name as string,
      email: row.email as string,
      role: row.role as string,
      status: row.status as UserStatus,
      created_at: row.created_at as Date,
    };
    setSelectedUser(user);
    setIsUpdateModalOpen(true);
  };

  const handleDelete = async (userId: number) => {
    try {

      setLoading(true);

      const response = await UsersService.trashUser(userId);
      if (!response.success) throw new Error(`The user deletion failed`)

      toast.success(response.message)

      await getAllUsers()

    } catch (error) {

      console.error(`Error in deleting user`, error)
      toast.error(`Error in deleting user`)
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateSuccess = () => {
    getAllUsers();
  };

  const handleUpdateClose = () => {
    setIsUpdateModalOpen(false);
    setSelectedUser(null);
  };

  useEffect(() => {
    getAllUsers();
  }, [filters, currentPage, limit]);

  const formatDate = (dateInput: Date | string) => {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    return date.toLocaleDateString("en-KE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const userColumns: ColumnType[] = [
    {
      type: "text",
      key: "first_name",
      label: "First Name",
      cellClassName: "font-medium text-heading",
    },
    {
      type: "text",
      key: "last_name",
      label: "Last Name",
    },
    {
      type: "text",
      key: "email",
      label: "Email",
    },
    {
      type: "badge",
      key: "role",
      label: "Role",
      colorMap: {
        super_admin: "error",
        admin: "error",
        basic: "success",
        demo: "primary",
      },
    },
    {
      type: "badge",
      key: "status",
      label: "Status",
      colorMap: {
        active: "success",
        trash: "error",
        pending: "warning",
      },
    },
    {
      type: "custom",
      key: "created_at",
      label: "Created At",
      render: (value) => formatDate(String(value)),
    },
    {
      type: "custom",
      key: "actions",
      label: "Actions",
      render: (_value, row) => (
        <div className="flex items-center gap-2">

          <button
            className="p-2 text-[#F48120] hover:bg-orange-50 rounded-md transition-colors"
            title="Edit"
            onClick={() => handleEdit(row)}
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>

          <button
            className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
            title="Delete"
            onClick={() => handleDelete(( row.id as unknown as number))}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>

        </div>

      ),
    },
  ];

  if (loading && users.length === 0) {
    return <SautiCloudLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Poppins',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#12245B]">
            User Management
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            Manage system users, roles, and access
          </p>
        </div>

        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#12245B]">
              Filter Users
            </h2>
            <span className="text-sm text-gray-400">
              Refine your view
            </span>
          </div>
          <UserFilters
            initialFilters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />
        </section>

        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#12245B]">
              All Users
            </h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#F48120] animate-pulse"></div>
              <span className="text-sm text-gray-500">
                {users.length} user{users.length !== 1 ? "s" : ""} found
              </span>
            </div>
          </div>
          <DataTable
            columns={userColumns}
            data={users}
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={limit}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleLimitChange}
            isLoading={loading}
            emptyMessage="No users found matching your filters"
          />
        </section>
      </div>

      {selectedUser && (
        <UpdateUserModal
          isOpen={isUpdateModalOpen}
          user={selectedUser}
          onClose={handleUpdateClose}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
}

import { useEffect, useRef } from "react"
import DataTable, { type ColumnType } from "../components/tables/basic.table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faEye } from "@fortawesome/free-solid-svg-icons";

// fakeData.ts
export const fakeUsers = [
  {
    id: 1,
    user: { image: "/images/user/user-17.jpg", name: "John Kamau" },
    email: "john.kamau@example.com",
    status: "Active",
    role: "Admin",
    joinedDate: "2024-01-15",
  },
  {
    id: 2,
    user: { image: "/images/user/user-18.jpg", name: "Sarah Wanjiku" },
    email: "sarah.w@example.com",
    status: "Pending",
    role: "Manager",
    joinedDate: "2024-02-20",
  },
  {
    id: 3,
    user: { image: "/images/user/user-19.jpg", name: "Michael Ochieng" },
    email: "michael.o@example.com",
    status: "Active",
    role: "Sales",
    joinedDate: "2024-03-10",
  },
  {
    id: 4,
    user: { image: "/images/user/user-20.jpg", name: "Grace Achieng" },
    email: "grace.a@example.com",
    status: "Cancel",
    role: "Support",
    joinedDate: "2024-01-05",
  },
  {
    id: 5,
    user: { image: "/images/user/user-21.jpg", name: "David Mwangi" },
    email: "david.m@example.com",
    status: "Active",
    role: "Admin",
    joinedDate: "2024-04-12",
  },
  {
    id: 6,
    user: { image: "/images/user/user-22.jpg", name: "Faith Njeri" },
    email: "faith.n@example.com",
    status: "Pending",
    role: "Sales",
    joinedDate: "2024-03-25",
  },
  {
    id: 7,
    user: { image: "/images/user/user-23.jpg", name: "Peter Njoroge" },
    email: "peter.n@example.com",
    status: "Active",
    role: "Manager",
    joinedDate: "2024-02-14",
  },
  {
    id: 8,
    user: { image: "/images/user/user-24.jpg", name: "Lucy Wangari" },
    email: "lucy.w@example.com",
    status: "Cancel",
    role: "Support",
    joinedDate: "2024-01-30",
  },
];

export const fakeOrders = [
  {
    id: "ORD-001",
    customer: "John Kamau",
    product: "Premium Plan",
    amount: 25000,
    status: "delivered",
    orderDate: "2024-04-15",
  },
  {
    id: "ORD-002",
    customer: "Sarah Wanjiku",
    product: "Basic Plan",
    amount: 12000,
    status: "pending_delivery",
    orderDate: "2024-04-16",
  },
  {
    id: "ORD-003",
    customer: "Michael Ochieng",
    product: "Enterprise Plan",
    amount: 85000,
    status: "enroute",
    orderDate: "2024-04-17",
  },
  {
    id: "ORD-004",
    customer: "Grace Achieng",
    product: "Standard Plan",
    amount: 35000,
    status: "pending_location",
    orderDate: "2024-04-18",
  },
  {
    id: "ORD-005",
    customer: "David Mwangi",
    product: "Premium Plan",
    amount: 25000,
    status: "delivered",
    orderDate: "2024-04-19",
  },
];


export default function Test() {

  // let [number, setNumber] = useState(0);

  // const handleClick = () => {
  //   const newNum = number++
  //   setNumber(newNum)
  // }

  const ref = useRef(0)
  const inputRef = useRef<HTMLInputElement | null>(null);

  // const handleClick = () => {
  //   ref.current++
  //   console.log("refff", ref.current)
  //   console.log("inputtt", inputRef)
  // }

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.style.backgroundColor = "aqua"
    }
  }

  const userColumns: ColumnType[] = [
      {
        type: "image",
        key: "user",
        srcKey: "image",
        altKey: "name",
        label: "User",
        containerClassName: "w-12 h-12",
        imageClassName: "w-full h-full object-cover",
      },
      {
        type: "text",
        key: "user.name",
        label: "Name",
      },
      {
        type: "text",
        key: "email",
        label: "Email",
      },
      {
        type: "badge",
        key: "status",
        label: "Status",
        colorMap: {
          Active: "success",
          Pending: "warning",
          Cancel: "error",
        },
      },
      {
        type: "text",
        key: "role",
        label: "Role",
      },
      {
        type: "custom",
        key: "actions",
        label: "Actions",
        render: () => (
          <div className="flex gap-2">
            <button className="p-2 text-[#3B82F6] hover:bg-blue-50 rounded-md transition-colors">
              <FontAwesomeIcon icon={faEye} />
            </button>
            <button className="p-2 text-[#F48120] hover:bg-orange-50 rounded-md transition-colors">
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors">
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        ),
      },
    ];

  useEffect(
    () => { console.log("COMPONENTTTT MOUNTEDDDDD", ref.current) }
  )

  return (
    <div className="px-5 py-5">
      <button className="bg-indigo-600 ml-5 mt-5 px-5 py-5"  onClick={handleClick}>
        CLICK MEEEEE { ref.current}!!!!
      </button>
      <input ref={inputRef} />
      <h1 className="text-2xl font-bold text-[#12245B] mb-6">User Management</h1>

      <DataTable
        columns={userColumns}
        data={fakeUsers}
        itemsPerPage={5}
        showPagination={true}
        emptyMessage="No users found"
      />
    </div>
  )

}

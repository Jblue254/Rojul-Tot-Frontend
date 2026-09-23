import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { getUsers, deleteUser, updateUser } from "../../api/users";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    role: "",
    address: "",
    is_active: true,
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter]);

  const USERS_PER_PAGE = 10;
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Delete User Logic
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) {
      return;
    }

    try {
      await deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // Update User Logic
  const handleUpdate = async () => {
    try {
      await updateUser(editingUser.id, formData);
      loadUsers();
      setEditingUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  // Toggle Status Logic
  const handleToggleStatus = async (user) => {
    try {
      await updateUser(user.id, {
        is_active: !user.is_active,
      });

      loadUsers();
    } catch (error) {
      console.error(error);
    }
  };

  // Filtering Logic
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === "ALL" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Stats Logic
  const totalUsers = users.length;

  const totalAdmins = users.filter(
    (user) => user.role === "ADMIN"
  ).length;

  const totalStaff = users.filter(
    (user) =>
      user.role === "STAFF" ||
      user.role === "MANAGER" ||
      user.role === "EQUIPMENT_MANAGER" ||
      user.role === "ARCHITECTURAL_MANAGER"
  ).length;

  const totalCustomers = users.filter(
    (user) => user.role === "CUSTOMER"
  ).length;

  // Pagination Logic
  const totalPages = Math.ceil(
    filteredUsers.length / USERS_PER_PAGE
  );

  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const endIndex = startIndex + USERS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);



  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-6">
          Users Management
        </h1>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-gray-500">Total Users</h3>
            <p className="text-3xl font-bold">{totalUsers}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-gray-500">Admins</h3>
            <p className="text-3xl font-bold">{totalAdmins}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-gray-500">Staff</h3>
            <p className="text-3xl font-bold">{totalStaff}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-gray-500">Customers</h3>
            <p className="text-3xl font-bold">{totalCustomers}</p>
          </div>
        </div>

        {/* Search Bar & Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1495CC]"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border rounded-xl px-4 py-3 min-w-[220px] focus:outline-none focus:ring-2 focus:ring-[#1495CC]"
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="MANAGER">Manager</option>
            <option value="EQUIPMENT_MANAGER">Equipment Manager</option>
            <option value="ARCHITECTURAL_MANAGER">Architectural Manager</option>
            <option value="STAFF">Staff</option>
            <option value="CUSTOMER">Customer</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#1495CC] text-white">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#1495CC] text-white flex items-center justify-center font-semibold">
                        {user.full_name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{user.full_name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.role}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${user.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                    >
                      {user.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2 items-center">
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm"
                        onClick={() => {
                          setEditingUser(user);
                          setFormData({
                            full_name: user.full_name || "",
                            phone: user.phone || "",
                            role: user.role || "",
                            address: user.address || "",
                            is_active: user.is_active,
                          });
                        }}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          const action = user.is_active
                            ? "deactivate"
                            : "activate";

                          if (
                            window.confirm(
                              `Are you sure you want to ${action} ${user.full_name}?`
                            )
                          ) {
                            handleToggleStatus(user);
                          }
                        }}
                      >
                        {user.is_active ? "Deactivate" : "Activate"}
                      </button>

                      <button
                        className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between p-4 border-t">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-4 py-2 rounded-lg border disabled:opacity-50"
            >
              Previous
            </button>

            <span>
              Page {currentPage} of {totalPages || 1}
            </span>

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-2 rounded-lg border disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {/* Edit User Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Edit User</h2>

              <input
                className="w-full border p-3 rounded mb-3"
                placeholder="Full Name"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    full_name: e.target.value,
                  })
                }
              />

              <input
                className="w-full border p-3 rounded mb-3"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value,
                  })
                }
              />

              <select
                className="w-full border p-3 rounded mb-3"
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value,
                  })
                }
              >
                <option value="CUSTOMER">Customer</option>
                <option value="STAFF">Staff</option>
                <option value="EQUIPMENT_MANAGER">Equipment Manager</option>
                <option value="ARCHITECTURAL_MANAGER">Architectural Manager</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
              </select>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleUpdate}
                  className="bg-[#1495CC] text-white px-4 py-2 rounded-lg"
                >
                  Save
                </button>

                <button
                  onClick={() => setEditingUser(null)}
                  className="bg-gray-300 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default UsersPage;
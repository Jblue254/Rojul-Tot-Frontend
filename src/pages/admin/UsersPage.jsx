import { useEffect, useState } from "react";
import { getUsers, deleteUser, updateUser } from "../../api/users";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({

    full_name: "",
    phone: "",
    role: "",
    address: "",
    is_active: true,
  });

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

  const handleUpdate = async () => {
    try {
      await updateUser(
        editingUser.id,
        formData
      );

      loadUsers();

      setEditingUser(null);
    } catch (error) {
      console.error(error);
    }
  };

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
            <p className="text-3xl font-bold">{users.length}</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#1495CC] text-white">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="p-4">{user.full_name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.role}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded-lg"
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
                        className="px-3 py-1 bg-red-500 text-white rounded-lg"
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
          {editingUser && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md">

                <h2 className="text-2xl font-bold mb-4">
                  Edit User
                </h2>

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
                  <option value="EQUIPMENT_MANAGER">
                    Equipment Manager
                  </option>
                  <option value="ARCHITECTURAL_MANAGER">
                    Architectural Manager
                  </option>
                  <option value="MANAGER">
                    Manager
                  </option>
                  <option value="ADMIN">
                    Admin
                  </option>
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
      </div>
    </>
  );
}

export default UsersPage;
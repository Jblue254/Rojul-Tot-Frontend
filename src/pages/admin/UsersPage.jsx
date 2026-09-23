import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../../api/users";

function UsersPage() {
  const [users, setUsers] = useState([]);

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
                        onClick={() => alert(`Edit user ${user.id}`)}
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
        </div>
      </div>
    </>
  );
}

export default UsersPage;
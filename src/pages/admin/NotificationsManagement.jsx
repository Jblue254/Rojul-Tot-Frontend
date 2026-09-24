import { useEffect, useState } from "react";
import {
    Bell,
    Search,
} from "lucide-react";
import { getUsers } from "../../api/users";
import {
    getNotifications,
    createNotification,
    updateNotification,
    deleteNotification,
} from "../../api/notifications";

function NotificationsManagement() {
    const [users, setUsers] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        recipient: "",
        title: "",
        message: "",
        notification_type: "SYSTEM",
    });

    useEffect(() => {
        loadNotifications();
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

    const loadNotifications = async () => {
        try {
            const response = await getNotifications();
            setNotifications(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const unreadCount = notifications.filter(
        (n) => !n.is_read
    ).length;

    const readCount = notifications.filter(
        (n) => n.is_read
    ).length;

    const filteredNotifications = notifications.filter(
        (notification) =>
            notification.title
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||
            notification.message
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||
            notification.recipient_name
                ?.toLowerCase()
                .includes(search.toLowerCase())
    );

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await createNotification(formData);
            loadNotifications();
            setShowModal(false);
            setFormData({
                recipient: "",
                title: "",
                message: "",
                notification_type: "SYSTEM",
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleToggleRead = async (notification) => {
        try {
            await updateNotification(
                notification.id,
                {
                    is_read: !notification.is_read,
                }
            );
            loadNotifications();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this notification?")) {
            return;
        }

        try {
            await deleteNotification(id);
            loadNotifications();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-3 m-0">
                    <Bell />
                    Notifications Management
                </h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-[#1495CC] text-white px-4 py-2 rounded-lg"
                >
                    Create Notification
                </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6 pt-2">
                <div className="bg-white p-6 rounded-2xl shadow">
                    <h3 className="text-gray-500">Total Notifications</h3>
                    <p className="text-3xl font-bold">{notifications.length}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow">
                    <h3 className="text-gray-500">Unread</h3>
                    <p className="text-3xl font-bold text-red-500">{unreadCount}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow">
                    <h3 className="text-gray-500">Read</h3>
                    <p className="text-3xl font-bold text-green-500">{readCount}</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow mb-6">
                <div className="relative">
                    <Search
                        size={18}
                        className="absolute left-3 top-3 text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Search notifications..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left p-4">Title</th>
                            <th className="text-left p-4">Recipient</th>
                            <th className="text-left p-4">Type</th>
                            <th className="text-left p-4">Status</th>
                            <th className="text-left p-4">Date</th>
                            <th className="text-left p-4">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredNotifications.map((notification) => (
                            <tr
                                key={notification.id}
                                className="border-t hover:bg-gray-50"
                            >
                                <td className="p-4">
                                    <div className="font-semibold">
                                        {notification.title}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {notification.message}
                                    </div>
                                </td>

                                <td className="p-4">
                                    <div>{notification.recipient_name}</div>
                                    <div className="text-xs text-gray-500">
                                        {notification.recipient_email}
                                    </div>
                                </td>

                                <td className="p-4">
                                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                                        {notification.notification_type}
                                    </span>
                                </td>

                                <td className="p-4">
                                    {notification.is_read ? (
                                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                                            Read
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">
                                            Unread
                                        </span>
                                    )}
                                </td>

                                <td className="p-4">
                                    {new Date(
                                        notification.created_at
                                    ).toLocaleDateString()}
                                </td>

                                <td className="p-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleToggleRead(notification)}
                                            className="bg-blue-500 text-white px-3 py-1 rounded"
                                        >
                                            {notification.is_read ? "Unread" : "Read"}
                                        </button>

                                        <button
                                            onClick={() => handleDelete(notification.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded"
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

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
                        <h2 className="text-xl font-bold mb-4">
                            Create Notification
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <select
                                value={formData.recipient}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        recipient: e.target.value,
                                    })
                                }
                                className="w-full border p-2 rounded"
                                required
                            >
                                <option value="">
                                    Select Recipient
                                </option>

                                {users.map((user) => (
                                    <option
                                        key={user.id}
                                        value={user.id}
                                    >
                                        {user.full_name}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="text"
                                placeholder="Title"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        title: e.target.value,
                                    })
                                }
                                className="w-full border p-2 rounded"
                                required
                            />

                            <textarea
                                placeholder="Message"
                                value={formData.message}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        message: e.target.value,
                                    })
                                }
                                className="w-full border p-2 rounded"
                                rows="4"
                                required
                            />

                            <select
                                value={formData.notification_type}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        notification_type: e.target.value,
                                    })
                                }
                                className="w-full border p-2 rounded"
                            >
                                <option value="SYSTEM">System</option>
                                <option value="PROJECT">Project</option>
                                <option value="RENTAL">Rental</option>
                                <option value="ORDER">Order</option>
                                <option value="MAINTENANCE">Maintenance</option>
                            </select>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="bg-[#1495CC] text-white px-4 py-2 rounded"
                                >
                                    Save
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="bg-gray-300 px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NotificationsManagement;
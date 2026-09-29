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

    // FIX: this used setUnreadCount (never defined) and never filled the
    // notifications list, so the table stayed empty. unreadCount is already
    // worked out below from the notifications list.
    const loadNotifications = async () => {
        try {

            const response =
                await getNotifications();

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
    const getTypeStyle = (type) => {

        switch (type) {

            case "PROJECT":
                return "bg-green-100 text-green-700";

            case "SYSTEM":
                return "bg-blue-100 text-blue-700";

            case "RENTAL":
                return "bg-purple-100 text-purple-700";

            case "ORDER":
                return "bg-orange-100 text-orange-700";

            case "MAINTENANCE":
                return "bg-red-100 text-red-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };
    const markAllRead = async () => {

    try {

        const unread =
            notifications.filter(
                n => !n.is_read
            );

        await Promise.all(
            unread.map(
                n =>
                updateNotification(
                    n.id,
                    {
                        is_read: true
                    }
                )
            )
        );

        loadNotifications();

    } catch(error){

        console.error(error);

    }
};
const deleteRead = async () => {

    try {

        const read =
            notifications.filter(
                n => n.is_read
            );

        await Promise.all(
            read.map(
                n =>
                deleteNotification(
                    n.id
                )
            )
        );

        loadNotifications();

    } catch(error){

        console.error(error);

    }
};

    return (
        <div>
            {/* Header: title on the left, all actions grouped on the right */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-3 m-0">
                    <Bell />
                    Notifications Management
                </h1>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative mr-2">

                        <Bell size={22} />

                        {unreadCount > 0 && (
                            <span
                                className="
            absolute
            -top-2
            -right-2
            bg-red-500
            text-white
            text-xs
            min-w-[18px]
            h-[18px]
            rounded-full
            flex
            items-center
            justify-center
            "
                            >
                                {unreadCount}
                            </span>
                        )}

                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-[#1495CC] text-white px-4 py-2 rounded-lg"
                    >
                        Create Notification
                    </button>
                    {/* Moved here from inside the table card */}
                    <button
                        onClick={markAllRead}
                        className="
    bg-green-500
    text-white
    px-4
    py-2
    rounded-lg
    "
                    >
                        Mark All Read
                    </button>
                    <button
                        onClick={deleteRead}
                        className="
    bg-red-500
    text-white
    px-4
    py-2
    rounded-lg
    "
                    >
                        Delete Read
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6 pt-2">
                <div className="bg-white p-4 rounded-2xl shadow">
                    <h3 className="text-gray-500">Total Notifications</h3>
                    <p className="text-3xl font-bold">{notifications.length}</p>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow">
                    <h3 className="text-gray-500">Unread</h3>
                    <p className="text-3xl font-bold text-red-500">{unreadCount}</p>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow">
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
                {/* table-fixed + widths (30+20+12+10+12+16 = 100%) so it fits the page without scrolling */}
                <table className="w-full table-fixed text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left p-3 w-[30%]">Title</th>
                            <th className="text-left p-3 w-[20%]">Recipient</th>
                            <th className="text-left p-3 w-[12%]">Type</th>
                            <th className="text-left p-3 w-[10%]">Status</th>
                            <th className="text-left p-3 w-[12%]">Date</th>
                            <th className="text-left p-3 w-[16%]">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredNotifications.map((notification) => (
                            <tr
                                key={notification.id}
                                className={
                                    notification.is_read
                                        ? "border-t hover:bg-gray-50 align-top"
                                        : "border-t bg-blue-50 hover:bg-blue-100 align-top"
                                }
                            >
                                <td className="p-3">
                                    <div className="font-semibold truncate">
                                        {notification.title}
                                    </div>
                                    <div className="text-xs text-gray-500 truncate">
                                        {notification.message}
                                    </div>
                                </td>

                                <td className="p-3">
                                    <div className="truncate">{notification.recipient_name}</div>
                                    <div className="text-xs text-gray-500 truncate">
                                        {notification.recipient_email}
                                    </div>
                                </td>

                                {/* FIX: the badge was empty, so the type never showed */}
                                <td className="p-3">
                                    <span
                                        className={
                                            `px-2.5 py-0.5 rounded-full text-xs ${getTypeStyle(
                                                notification.notification_type
                                            )
                                            }`
                                        }
                                    >
                                        {notification.notification_type}
                                    </span>
                                </td>

                                <td className="p-3">
                                    {notification.is_read ? (
                                        <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">
                                            Read
                                        </span>
                                    ) : (
                                        <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs">
                                            Unread
                                        </span>
                                    )}
                                </td>

                                <td className="p-3 text-xs">
                                    {new Date(
                                        notification.created_at
                                    ).toLocaleDateString()}
                                </td>

                                <td className="p-3">
                                    <div className="flex flex-wrap gap-1">
                                        <button
                                            onClick={() => handleToggleRead(notification)}
                                            className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                                        >
                                            {notification.is_read ? "Unread" : "Read"}
                                        </button>

                                        <button
                                            onClick={() => handleDelete(notification.id)}
                                            className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {/* Empty state */}
                        {filteredNotifications.length === 0 && (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="p-8 text-center text-gray-500"
                                >
                                    No notifications found.
                                </td>
                            </tr>
                        )}
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

                                {/* Falls back to email/username if full_name is empty */}
                                {users.map((user) => (
                                    <option
                                        key={user.id}
                                        value={user.id}
                                    >
                                        {user.full_name || user.email || user.username}
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
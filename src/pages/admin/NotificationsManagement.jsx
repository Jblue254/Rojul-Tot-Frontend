import { useEffect, useState } from "react";

import {
  getNotifications,
  createNotification,
  deleteNotification,
} from "../../api/customerNotifications";

import { getUsers } from "../../api/users";

function NotificationsManagement() {
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const [formData, setFormData] = useState({
    recipient: "",
    title: "",
    message: "",
    notification_type: "SYSTEM",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [notificationsRes, usersRes] =
        await Promise.all([
          getNotifications(),
          getUsers(),
        ]);

      setNotifications(notificationsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createNotification(formData);

      setFormData({
        recipient: "",
        title: "",
        message: "",
        notification_type: "SYSTEM",
      });

      loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to create notification");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this notification?"
    );

    if (!confirmed) return;

    try {
      await deleteNotification(id);
      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "RENTAL":
        return "bg-blue-100 text-blue-700";

      case "ORDER":
        return "bg-green-100 text-green-700";

      case "PROJECT":
        return "bg-purple-100 text-purple-700";

      case "MAINTENANCE":
        return "bg-orange-100 text-orange-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredNotifications =
    notifications.filter((notification) => {
      const matchesSearch =
        notification.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        notification.message
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesType =
        typeFilter === "ALL" ||
        notification.notification_type ===
          typeFilter;

      return matchesSearch && matchesType;
    });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Notifications Management
        </h1>

        <p className="text-gray-500 mt-2">
          Create and manage notifications.
        </p>
      </div>

      {/* Stats */}

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">
            Total Notifications
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {notifications.length}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">
            Unread Notifications
          </p>

          <h2 className="text-3xl font-bold text-blue-600 mt-2">
            {
              notifications.filter(
                (n) => !n.is_read
              ).length
            }
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">
            Read Notifications
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {
              notifications.filter(
                (n) => n.is_read
              ).length
            }
          </h2>
        </div>
      </div>

      {/* Create Notification */}

      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Create Notification
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-4"
        >
          <select
            name="recipient"
            value={formData.recipient}
            onChange={handleChange}
            required
            className="border rounded-lg p-3"
          >
            <option value="">
              Select User
            </option>

            {users.map((user) => (
              <option
                key={user.id}
                value={user.id}
              >
                {user.first_name}{" "}
                {user.last_name}
                {" - "}
                {user.email}
                {" ("}
                {user.role}
                {")"}
              </option>
            ))}
          </select>

          <select
            name="notification_type"
            value={formData.notification_type}
            onChange={handleChange}
            className="border rounded-lg p-3"
          >
            <option value="SYSTEM">
              System
            </option>

            <option value="RENTAL">
              Rental
            </option>

            <option value="ORDER">
              Order
            </option>

            <option value="PROJECT">
              Project
            </option>

            <option value="MAINTENANCE">
              Maintenance
            </option>
          </select>

          <input
            type="text"
            name="title"
            placeholder="Notification Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="border rounded-lg p-3 md:col-span-2"
          />

          <textarea
            rows="4"
            name="message"
            placeholder="Notification Message"
            value={formData.message}
            onChange={handleChange}
            required
            className="border rounded-lg p-3 md:col-span-2"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
          >
            Create Notification
          </button>
        </form>
      </div>

      {/* Filters */}

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search notifications..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="border rounded-lg p-3 flex-1"
        />

        <select
          value={typeFilter}
          onChange={(e) =>
            setTypeFilter(e.target.value)
          }
          className="border rounded-lg p-3"
        >
          <option value="ALL">
            All Types
          </option>

          <option value="SYSTEM">
            System
          </option>

          <option value="RENTAL">
            Rental
          </option>

          <option value="ORDER">
            Order
          </option>

          <option value="PROJECT">
            Project
          </option>

          <option value="MAINTENANCE">
            Maintenance
          </option>
        </select>
      </div>

      {/* Notification List */}

      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(
            (notification) => (
              <div
                key={notification.id}
                className="bg-white rounded-2xl shadow p-5"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg">
                        {notification.title}
                      </h3>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                          notification.notification_type
                        )}`}
                      >
                        {
                          notification.notification_type
                        }
                      </span>
                    </div>

                    <p className="text-gray-600">
                      {notification.message}
                    </p>

                    <div className="mt-3 text-sm text-gray-500">
                      <p>
                        Recipient:{" "}
                        {
                          notification.recipient_name
                        }
                      </p>

                      <p>
                        {
                          notification.recipient_email
                        }
                      </p>

                      <p>
                        Status:{" "}
                        {notification.is_read
                          ? "Read"
                          : "Unread"}
                      </p>

                      <p>
                        {new Date(
                          notification.created_at
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleDelete(
                        notification.id
                      )
                    }
                    className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          )
        ) : (
          <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-500">
            No notifications found.
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationsManagement;
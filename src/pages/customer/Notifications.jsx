import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CheckCircle,
  Trash2,
  Search,
  Filter,
  MailOpen,
  Mail,
} from "lucide-react";

import {
  getNotifications,
  updateNotification,
  deleteNotification,
} from "../../api/customerNotifications";

function Notifications() {
  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [typeFilter, setTypeFilter] =
    useState("ALL");

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const response =
        await getNotifications();

      setNotifications(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await updateNotification(id, {
        is_read: true,
      });

      loadNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const markAllRead = async () => {
    try {
      const unread =
        notifications.filter(
          (n) => !n.is_read
        );

      await Promise.all(
        unread.map((notification) =>
          updateNotification(
            notification.id,
            {
              is_read: true,
            }
          )
        )
      );

      loadNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const removeNotification = async (
    id
  ) => {
    if (
      !window.confirm(
        "Delete this notification?"
      )
    )
      return;

    try {
      await deleteNotification(id);

      loadNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const unreadCount =
    notifications.filter(
      (n) => !n.is_read
    ).length;

  const filteredNotifications =
    useMemo(() => {
      return notifications.filter(
        (notification) => {
          const matchesSearch =
            notification.title
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            notification.message
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesType =
            typeFilter === "ALL"
              ? true
              : notification.notification_type ===
                typeFilter;

          return (
            matchesSearch &&
            matchesType
          );
        }
      );
    }, [
      notifications,
      search,
      typeFilter,
    ]);

  const getTypeColor = (type) => {
    switch (type) {
      case "PROJECT":
        return "bg-blue-100 text-blue-700";

      case "RENTAL":
        return "bg-green-100 text-green-700";

      case "ORDER":
        return "bg-purple-100 text-purple-700";

      case "MAINTENANCE":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const created =
      new Date(date);

    const diff =
      Math.floor(
        (now - created) / 1000
      );

    if (diff < 60)
      return "Just now";

    if (diff < 3600)
      return `${Math.floor(
        diff / 60
      )} mins ago`;

    if (diff < 86400)
      return `${Math.floor(
        diff / 3600
      )} hrs ago`;

    return `${Math.floor(
      diff / 86400
    )} days ago`;
  };

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading notifications...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">

        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Bell size={32} />
            Notifications
          </h1>

          <p className="text-gray-500 mt-2">
            View all updates from
            rentals, projects,
            orders and system
            activities.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-medium"
          >
            Mark All Read
          </button>
        )}
      </div>

      {/* Stats */}

      <div className="grid md:grid-cols-3 gap-5">

        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-gray-500">
            Total Notifications
          </h3>

          <p className="text-3xl font-bold mt-2">
            {
              notifications.length
            }
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-gray-500">
            Unread
          </h3>

          <p className="text-3xl font-bold text-blue-600 mt-2">
            {unreadCount}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-gray-500">
            Read
          </h3>

          <p className="text-3xl font-bold text-green-600 mt-2">
            {
              notifications.length -
              unreadCount
            }
          </p>
        </div>

      </div>

      {/* Search + Filter */}

      <div className="bg-white rounded-2xl shadow p-4 flex flex-col md:flex-row gap-4">

        <div className="relative flex-1">

          <Search
            size={18}
            className="absolute left-3 top-3 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search notifications..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="w-full border rounded-xl pl-10 pr-4 py-3"
          />

        </div>

        <div className="relative">

          <Filter
            size={18}
            className="absolute left-3 top-3 text-gray-400"
          />

          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(
                e.target.value
              )
            }
            className="border rounded-xl pl-10 pr-4 py-3"
          >
            <option value="ALL">
              All Types
            </option>

            <option value="RENTAL">
              Rental
            </option>

            <option value="PROJECT">
              Project
            </option>

            <option value="ORDER">
              Order
            </option>

            <option value="MAINTENANCE">
              Maintenance
            </option>

            <option value="SYSTEM">
              System
            </option>
          </select>

        </div>

      </div>

      {/* Notifications */}

      {filteredNotifications.length ===
      0 ? (
        <div className="bg-white rounded-3xl shadow p-16 text-center">

          <Bell
            size={60}
            className="mx-auto text-gray-300 mb-4"
          />

          <h2 className="text-2xl font-bold">
            No Notifications Found
          </h2>

          <p className="text-gray-500 mt-2">
            New notifications will
            appear here.
          </p>

        </div>
      ) : (
        <div className="space-y-4">

          {filteredNotifications.map(
            (notification) => (
              <div
                key={
                  notification.id
                }
                className={`bg-white rounded-2xl shadow-md p-5 transition hover:shadow-lg border-l-4 ${
                  notification.is_read
                    ? "border-gray-300"
                    : "border-blue-500"
                }`}
              >
                <div className="flex justify-between items-start gap-4">

                  <div className="flex-1">

                    <div className="flex items-center gap-3 mb-2">

                      {notification.is_read ? (
                        <MailOpen
                          size={18}
                        />
                      ) : (
                        <Mail
                          size={18}
                        />
                      )}

                      <h3 className="font-bold text-lg">
                        {
                          notification.title
                        }
                      </h3>

                      {!notification.is_read && (
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                          NEW
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600">
                      {
                        notification.message
                      }
                    </p>

                    <div className="flex items-center gap-3 mt-4 flex-wrap">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(
                          notification.notification_type
                        )}`}
                      >
                        {
                          notification.notification_type
                        }
                      </span>

                      <span className="text-xs text-gray-400">
                        {getTimeAgo(
                          notification.created_at
                        )}
                      </span>

                    </div>

                  </div>

                  <div className="flex gap-2">

                    {!notification.is_read && (
                      <button
                        onClick={() =>
                          markAsRead(
                            notification.id
                          )
                        }
                        className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg"
                      >
                        <CheckCircle
                          size={18}
                        />
                      </button>
                    )}

                    <button
                      onClick={() =>
                        removeNotification(
                          notification.id
                        )
                      }
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg"
                    >
                      <Trash2
                        size={18}
                      />
                    </button>

                  </div>

                </div>
              </div>
            )
          )}

        </div>
      )}
    </div>
  );
}

export default Notifications;
import { useEffect, useState } from "react";
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
    const confirmed =
      window.confirm(
        "Delete this notification?"
      );

    if (!confirmed) return;

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

  const getTypeColor = (type) => {
    switch (type) {
      case "PROJECT":
        return "bg-blue-100 text-blue-700";

      case "RENTAL":
        return "bg-green-100 text-green-700";

      case "MAINTENANCE":
        return "bg-yellow-100 text-yellow-700";

      case "ORDER":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading notifications...
      </div>
    );
  }

  return (
    <div>

      {/* Header */}

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            Notifications
          </h1>

          <p className="text-gray-500 mt-2">
            Stay updated with your
            latest activities.
          </p>
        </div>

        <div className="flex items-center gap-3">

          <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
            {unreadCount} Unread
          </span>

          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Mark All Read
            </button>
          )}

        </div>

      </div>

      {/* Empty State */}

      {notifications.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow text-center">

          <div className="text-5xl mb-4">
            🔔
          </div>

          <h2 className="text-xl font-semibold mb-2">
            No Notifications
          </h2>

          <p className="text-gray-500">
            Notifications will appear
            here when activities occur.
          </p>

        </div>
      ) : (
        <div className="space-y-4">

          {notifications.map(
            (notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-2xl shadow-md p-5 border-l-4 transition ${
                  notification.is_read
                    ? "border-gray-300"
                    : "border-blue-500"
                }`}
              >
                <div className="flex justify-between items-start">

                  <div className="flex-1">

                    <div className="flex items-center gap-3 mb-2">

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

                    <div className="flex items-center gap-3 mt-3 flex-wrap">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                          notification.notification_type
                        )}`}
                      >
                        {
                          notification.notification_type
                        }
                      </span>

                      <span className="text-xs text-gray-400">
                        {new Date(
                          notification.created_at
                        ).toLocaleString()}
                      </span>

                    </div>

                  </div>

                  <div className="flex gap-2 ml-4">

                    {!notification.is_read && (
                      <button
                        onClick={() =>
                          markAsRead(
                            notification.id
                          )
                        }
                        className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
                      >
                        Read
                      </button>
                    )}

                    <button
                      onClick={() =>
                        removeNotification(
                          notification.id
                        )
                      }
                      className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700"
                    >
                      Delete
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
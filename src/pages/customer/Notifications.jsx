import { useEffect, useState } from "react";
import {
  getNotifications,
  updateNotification,
  deleteNotification,
} from "../../api/customerNotifications";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await getNotifications();
      setNotifications(response.data);
    } catch (error) {
      console.error(error);
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

  const removeNotification = async (id) => {
    try {
      await deleteNotification(id);
      loadNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Notifications
      </h1>

      {notifications.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow text-center">
          No notifications yet.
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-5 rounded-2xl shadow bg-white border-l-4 ${
                notification.is_read
                  ? "border-gray-300"
                  : "border-blue-500"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">
                    {notification.title}
                  </h3>

                  <p className="text-gray-600 mt-1">
                    {notification.message}
                  </p>

                  <p className="text-xs text-gray-400 mt-2">
                    {notification.notification_type}
                  </p>
                </div>

                <div className="flex gap-2">
                  {!notification.is_read && (
                    <button
                      onClick={() =>
                        markAsRead(notification.id)
                      }
                      className="bg-green-500 text-white px-3 py-1 rounded-lg"
                    >
                      Read
                    </button>
                  )}

                  <button
                    onClick={() =>
                      removeNotification(notification.id)
                    }
                    className="bg-red-500 text-white px-3 py-1 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

import { getNotifications } from "../../api/notifications";

function NotificationsManagement() {
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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <Bell />
        Notifications Management
      </h1>

      <div className="bg-white rounded-2xl shadow p-6">
        Total Notifications: {notifications.length}
      </div>
    </div>
  );
}

export default NotificationsManagement;
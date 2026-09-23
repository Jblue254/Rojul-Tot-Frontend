import { useEffect, useState } from "react";
import {
  Users,
  Wrench,
  FolderKanban,
  ShoppingCart,
  Star,
} from "lucide-react";

import { getAdminDashboard } from "../../api/analytics";

function AnalyticsManagement() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response =
        await getAdminDashboard();

      setStats(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!stats) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="grid md:grid-cols-5 gap-6 mb-8">

  <div className="bg-white p-6 rounded-2xl shadow">
    <Users className="mb-2 text-blue-500" />
    <p>Total Users</p>
    <h2 className="text-3xl font-bold">
      {stats.users}
    </h2>
  </div>

  <div className="bg-white p-6 rounded-2xl shadow">
    <Wrench className="mb-2 text-green-500" />
    <p>Machines</p>
    <h2 className="text-3xl font-bold">
      {stats.machinery}
    </h2>
  </div>

  <div className="bg-white p-6 rounded-2xl shadow">
    <FolderKanban className="mb-2 text-purple-500" />
    <p>Projects</p>
    <h2 className="text-3xl font-bold">
      {stats.projects}
    </h2>
  </div>

  <div className="bg-white p-6 rounded-2xl shadow">
    <ShoppingCart className="mb-2 text-orange-500" />
    <p>Orders</p>
    <h2 className="text-3xl font-bold">
      {stats.orders}
    </h2>
  </div>

  <div className="bg-white p-6 rounded-2xl shadow">
    <Star className="mb-2 text-yellow-500" />
    <p>Average Rating</p>
    <h2 className="text-3xl font-bold">
      {Number(stats.average_rating).toFixed(1)}
    </h2>
  </div>

</div>
    </div>
  );
}

export default AnalyticsManagement;
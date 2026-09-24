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
      <div className="grid md:grid-cols-4 gap-6">

  <div className="bg-white p-6 rounded-2xl shadow">
    <p>Available Machines</p>
    <h2 className="text-3xl font-bold">
      {stats.available_machinery}
    </h2>
  </div>

  <div className="bg-white p-6 rounded-2xl shadow">
    <p>Active Projects</p>
    <h2 className="text-3xl font-bold">
      {stats.active_projects}
    </h2>
  </div>

  <div className="bg-white p-6 rounded-2xl shadow">
    <p>Maintenance</p>
    <h2 className="text-3xl font-bold">
      {stats.maintenance}
    </h2>
  </div>

  <div className="bg-white p-6 rounded-2xl shadow">
    <p>Revenue</p>
    <h2 className="text-3xl font-bold">
      KES {Number(stats.order_revenue).toLocaleString()}
    </h2>
  </div>

</div>
    </div>
  );
}

export default AnalyticsManagement;
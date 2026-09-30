import { useEffect, useState } from "react";

import {
  Wrench,
  CheckCircle,
  AlertTriangle,
  ClipboardList,
  DollarSign,
  Settings,
} from "lucide-react";

import { getEquipmentDashboard } from "../../api/analytics";

function EquipmentDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response =
        await getEquipmentDashboard();

      setStats(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!stats) {
    return (
      <div className="p-6">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>

      <h1 className="text-3xl font-bold mb-8">
        Equipment Dashboard
      </h1>

      {/* Stats Cards */}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <div className="bg-white p-6 rounded-2xl shadow">
          <Wrench className="text-blue-500 mb-2" />

          <p className="text-gray-500 text-sm">
            Total Machines
          </p>

          <h2 className="text-3xl font-bold">
            {stats.total_machines}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <CheckCircle className="text-green-500 mb-2" />

          <p className="text-gray-500 text-sm">
            Available Machines
          </p>

          <h2 className="text-3xl font-bold">
            {stats.available_machines}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <ClipboardList className="text-orange-500 mb-2" />

          <p className="text-gray-500 text-sm">
            Rented Machines
          </p>

          <h2 className="text-3xl font-bold">
            {stats.rented_machines}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <Settings className="text-red-500 mb-2" />

          <p className="text-gray-500 text-sm">
            Maintenance
          </p>

          <h2 className="text-3xl font-bold">
            {stats.maintenance_machines}
          </h2>
        </div>

      </div>

      {/* Rental Statistics */}

      <div className="grid md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white p-6 rounded-2xl shadow">
          <ClipboardList className="text-blue-500 mb-2" />

          <p className="text-gray-500 text-sm">
            Active Rentals
          </p>

          <h2 className="text-3xl font-bold">
            {stats.active_rentals}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <AlertTriangle className="text-yellow-500 mb-2" />

          <p className="text-gray-500 text-sm">
            Pending Rentals
          </p>

          <h2 className="text-3xl font-bold">
            {stats.pending_rentals}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <CheckCircle className="text-green-500 mb-2" />

          <p className="text-gray-500 text-sm">
            Completed Rentals
          </p>

          <h2 className="text-3xl font-bold">
            {stats.completed_rentals}
          </h2>
        </div>

      </div>

      {/* Revenue & Maintenance */}

      <div className="grid md:grid-cols-2 gap-6 mb-8">

        <div className="bg-white p-6 rounded-2xl shadow">
          <DollarSign className="text-emerald-500 mb-2" />

          <p className="text-gray-500 text-sm">
            Rental Revenue
          </p>

          <h2 className="text-3xl font-bold">
            KES{" "}
            {Number(
              stats.rental_revenue || 0
            ).toLocaleString()}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <Settings className="text-purple-500 mb-2" />

          <p className="text-gray-500 text-sm">
            Maintenance Records
          </p>

          <h2 className="text-3xl font-bold">
            {stats.maintenance_records}
          </h2>
        </div>

      </div>

      {/* Operational Summary */}

      <div className="bg-white p-6 rounded-2xl shadow">

        <h2 className="text-xl font-bold mb-4">
          Equipment Summary
        </h2>

        <div className="space-y-3">

          <div className="flex justify-between border-b pb-2">
            <span>Total Machines</span>
            <span className="font-semibold">
              {stats.total_machines}
            </span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span>Available</span>
            <span className="font-semibold text-green-600">
              {stats.available_machines}
            </span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span>Currently Rented</span>
            <span className="font-semibold text-orange-600">
              {stats.rented_machines}
            </span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span>In Maintenance</span>
            <span className="font-semibold text-red-600">
              {stats.maintenance_machines}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Total Revenue</span>
            <span className="font-semibold text-emerald-600">
              KES{" "}
              {Number(
                stats.rental_revenue || 0
              ).toLocaleString()}
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default EquipmentDashboard;
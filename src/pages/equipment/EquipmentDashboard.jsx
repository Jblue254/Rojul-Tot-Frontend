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
      <div>
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Equipment Dashboard
      </h1>

      {/* Stats Cards */}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-[#1495CC] hover:shadow-md transition-shadow">
          <Wrench className="mb-4 p-2.5 rounded-xl bg-blue-50 text-blue-500 box-content" />

          <p className="text-gray-500 text-sm font-medium">
            Total Machines
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-1">
            {stats.total_machines}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-[#1495CC] hover:shadow-md transition-shadow">
          <CheckCircle className="mb-4 p-2.5 rounded-xl bg-green-50 text-green-500 box-content" />

          <p className="text-gray-500 text-sm font-medium">
            Available Machines
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-1">
            {stats.available_machines}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-[#1495CC] hover:shadow-md transition-shadow">
          <ClipboardList className="mb-4 p-2.5 rounded-xl bg-orange-50 text-orange-500 box-content" />

          <p className="text-gray-500 text-sm font-medium">
            Rented Machines
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-1">
            {stats.rented_machines}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-[#1495CC] hover:shadow-md transition-shadow">
          <Settings className="mb-4 p-2.5 rounded-xl bg-red-50 text-red-500 box-content" />

          <p className="text-gray-500 text-sm font-medium">
            Maintenance
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-1">
            {stats.maintenance_machines}
          </h2>
        </div>

      </div>

      {/* Rental Statistics */}

      <div className="grid sm:grid-cols-3 gap-4 mb-6">

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-[#1495CC] hover:shadow-md transition-shadow">
          <ClipboardList className="mb-4 p-2.5 rounded-xl bg-blue-50 text-blue-500 box-content" />

          <p className="text-gray-500 text-sm font-medium">
            Active Rentals
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-1">
            {stats.active_rentals}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-[#1495CC] hover:shadow-md transition-shadow">
          <AlertTriangle className="mb-4 p-2.5 rounded-xl bg-yellow-50 text-yellow-500 box-content" />

          <p className="text-gray-500 text-sm font-medium">
            Pending Rentals
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-1">
            {stats.pending_rentals}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-[#1495CC] hover:shadow-md transition-shadow">
          <CheckCircle className="mb-4 p-2.5 rounded-xl bg-green-50 text-green-500 box-content" />

          <p className="text-gray-500 text-sm font-medium">
            Completed Rentals
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-1">
            {stats.completed_rentals}
          </h2>
        </div>

      </div>

      {/* Revenue & Maintenance */}

      <div className="grid sm:grid-cols-2 gap-4 mb-6">

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-[#1495CC] hover:shadow-md transition-shadow">
          <DollarSign className="mb-4 p-2.5 rounded-xl bg-emerald-50 text-emerald-500 box-content" />

          <p className="text-gray-500 text-sm font-medium">
            Rental Revenue
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-1">
            KES{" "}
            {Number(
              stats.rental_revenue || 0
            ).toLocaleString()}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-[#1495CC] hover:shadow-md transition-shadow">
          <Settings className="mb-4 p-2.5 rounded-xl bg-purple-50 text-purple-500 box-content" />

          <p className="text-gray-500 text-sm font-medium">
            Maintenance Records
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-1">
            {stats.maintenance_records}
          </h2>
        </div>

      </div>

      {/* Operational Summary */}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">

        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Equipment Summary
        </h2>

        <div className="space-y-3 text-gray-700">

          <div className="flex justify-between border-b border-gray-100 pb-3">
            <span>Total Machines</span>
            <span className="font-semibold text-gray-900">
              {stats.total_machines}
            </span>
          </div>

          <div className="flex justify-between border-b border-gray-100 pb-3">
            <span>Available</span>
            <span className="font-semibold text-green-600">
              {stats.available_machines}
            </span>
          </div>

          <div className="flex justify-between border-b border-gray-100 pb-3">
            <span>Currently Rented</span>
            <span className="font-semibold text-orange-600">
              {stats.rented_machines}
            </span>
          </div>

          <div className="flex justify-between border-b border-gray-100 pb-3">
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
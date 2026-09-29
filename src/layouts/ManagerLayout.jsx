import { useEffect, useState } from "react";

import {
  FolderKanban,
  CheckCircle,
  Users,
  Wrench,
  DollarSign,
  Bell,
} from "lucide-react";

import { getManagerDashboard } from "../../api/analytics";

function ManagerDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response =
        await getManagerDashboard();

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

  const budgetUsage =
    stats.total_budget > 0
      ? (
          (stats.total_expenses /
            stats.total_budget) *
          100
        ).toFixed(1)
      : 0;

  return (
    <div>

      <h1 className="text-3xl font-bold mb-8">
        Manager Dashboard
      </h1>

      {/* Main Stats */}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

        <div className="bg-white p-6 rounded-2xl shadow">
          <FolderKanban className="text-blue-500 mb-2" />

          <p className="text-gray-500 text-sm">
            Total Projects
          </p>

          <h2 className="text-3xl font-bold">
            {stats.projects}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <CheckCircle className="text-green-500 mb-2" />

          <p className="text-gray-500 text-sm">
            Active Projects
          </p>

          <h2 className="text-3xl font-bold">
            {stats.active_projects}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <CheckCircle className="text-purple-500 mb-2" />

          <p className="text-gray-500 text-sm">
            Completed Projects
          </p>

          <h2 className="text-3xl font-bold">
            {stats.completed_projects}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <Users className="text-indigo-500 mb-2" />

          <p className="text-gray-500 text-sm">
            Team Members
          </p>

          <h2 className="text-3xl font-bold">
            {stats.members}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <Wrench className="text-orange-500 mb-2" />

          <p className="text-gray-500 text-sm">
            Assigned Machines
          </p>

          <h2 className="text-3xl font-bold">
            {stats.assigned_machines}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <Bell className="text-yellow-500 mb-2" />

          <p className="text-gray-500 text-sm">
            Notifications
          </p>

          <h2 className="text-3xl font-bold">
            {stats.notifications}
          </h2>
        </div>

      </div>

      {/* Financial Summary */}

      <div className="grid md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white p-6 rounded-2xl shadow">
          <DollarSign className="text-green-600 mb-2" />

          <p className="text-gray-500 text-sm">
            Total Budget
          </p>

          <h2 className="text-2xl font-bold">
            KES{" "}
            {Number(
              stats.total_budget || 0
            ).toLocaleString()}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <DollarSign className="text-red-500 mb-2" />

          <p className="text-gray-500 text-sm">
            Total Expenses
          </p>

          <h2 className="text-2xl font-bold">
            KES{" "}
            {Number(
              stats.total_expenses || 0
            ).toLocaleString()}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <DollarSign className="text-blue-500 mb-2" />

          <p className="text-gray-500 text-sm">
            Remaining Budget
          </p>

          <h2 className="text-2xl font-bold">
            KES{" "}
            {Number(
              stats.remaining_budget || 0
            ).toLocaleString()}
          </h2>
        </div>

      </div>

      {/* Budget Progress */}

      <div className="bg-white p-6 rounded-2xl shadow mb-8">

        <div className="flex justify-between mb-3">
          <h2 className="font-semibold">
            Budget Usage
          </h2>

          <span>
            {budgetUsage}%
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-4">

          <div
            className="bg-green-600 h-4 rounded-full"
            style={{
              width: `${Math.min(
                budgetUsage,
                100
              )}%`,
            }}
          />

        </div>

      </div>

      {/* Alerts */}

      {budgetUsage >= 80 &&
        budgetUsage < 100 && (
          <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-4 rounded-xl mb-8">
            Warning: Budget usage is above
            80%.
          </div>
        )}

      {budgetUsage >= 100 && (
        <div className="bg-red-100 border border-red-300 text-red-800 p-4 rounded-xl mb-8">
          Budget exceeded.
        </div>
      )}

      {/* Upcoming Milestones */}

      <div className="bg-white p-6 rounded-2xl shadow">

        <h2 className="text-xl font-bold mb-4">
          Upcoming Milestones
        </h2>

        {stats.upcoming_milestones?.length >
        0 ? (
          <div className="space-y-4">

            {stats.upcoming_milestones.map(
              (milestone) => (
                <div
                  key={milestone.id}
                  className="border-b pb-3"
                >
                  <h3 className="font-semibold">
                    {milestone.title}
                  </h3>

                  <p className="text-sm text-gray-500">
                    Project:{" "}
                    {milestone.project}
                  </p>

                  <p className="text-sm text-gray-500">
                    Due:{" "}
                    {milestone.due_date}
                  </p>
                </div>
              )
            )}

          </div>
        ) : (
          <p className="text-gray-500">
            No upcoming milestones.
          </p>
        )}

      </div>

    </div>
  );
}

export default ManagerDashboard;
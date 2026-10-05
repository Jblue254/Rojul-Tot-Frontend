import { useEffect, useState } from "react";
import {
  FolderKanban,
  Users,
  Wrench,
  DollarSign,
  CheckCircle,
  Clock,
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
      <div className="text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Manager Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Project overview and performance.
        </p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 border-l-4 border-l-[#1495CC] rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow">
          <FolderKanban className="mb-4 p-2.5 rounded-xl bg-blue-50 text-[#1495CC] box-content" />
          <p className="text-sm font-medium text-gray-500">
            Total Projects
          </p>
          <h2 className="text-3xl font-bold text-gray-900 mt-1">
            {stats.projects}
          </h2>
        </div>

        <div className="bg-white border border-gray-100 border-l-4 border-l-[#1495CC] rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow">
          <Clock className="mb-4 p-2.5 rounded-xl bg-orange-50 text-orange-500 box-content" />
          <p className="text-sm font-medium text-gray-500">
            Active Projects
          </p>
          <h2 className="text-3xl font-bold text-gray-900 mt-1">
            {stats.active_projects}
          </h2>
        </div>

        <div className="bg-white border border-gray-100 border-l-4 border-l-[#1495CC] rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow">
          <CheckCircle className="mb-4 p-2.5 rounded-xl bg-green-50 text-green-500 box-content" />
          <p className="text-sm font-medium text-gray-500">
            Completed Projects
          </p>
          <h2 className="text-3xl font-bold text-gray-900 mt-1">
            {stats.completed_projects}
          </h2>
        </div>

        <div className="bg-white border border-gray-100 border-l-4 border-l-[#1495CC] rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow">
          <Users className="mb-4 p-2.5 rounded-xl bg-purple-50 text-purple-500 box-content" />
          <p className="text-sm font-medium text-gray-500">
            Team Members
          </p>
          <h2 className="text-3xl font-bold text-gray-900 mt-1">
            {stats.members}
          </h2>
        </div>
      </div>

      {/* Budget */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-100 border-l-4 border-l-[#1495CC] rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow">
          <DollarSign className="mb-4 p-2.5 rounded-xl bg-blue-50 text-[#1495CC] box-content" />
          <p className="text-sm font-medium text-gray-500">
            Total Budget
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-1">
            ${stats.total_budget}
          </h2>
        </div>

        <div className="bg-white border border-gray-100 border-l-4 border-l-[#1495CC] rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow">
          <DollarSign className="mb-4 p-2.5 rounded-xl bg-red-50 text-red-500 box-content" />
          <p className="text-sm font-medium text-gray-500">
            Expenses
          </p>

          <h2 className="text-2xl font-bold text-red-600 mt-1">
            ${stats.total_expenses}
          </h2>
        </div>

        <div className="bg-white border border-gray-100 border-l-4 border-l-[#1495CC] rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow">
          <DollarSign className="mb-4 p-2.5 rounded-xl bg-green-50 text-green-500 box-content" />
          <p className="text-sm font-medium text-gray-500">
            Remaining Budget
          </p>

          <h2 className="text-2xl font-bold text-green-600 mt-1">
            ${stats.remaining_budget}
          </h2>
        </div>
      </div>

      {/* Machines */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
        <div className="flex items-center gap-3 mb-3">
          <Wrench className="p-2.5 rounded-xl bg-blue-50 text-[#1495CC] box-content" />
          <h2 className="text-xl font-bold text-gray-900">
            Assigned Machines
          </h2>
        </div>

        <p className="text-3xl font-bold text-gray-900">
          {stats.assigned_machines}
        </p>
      </div>

      {/* Upcoming Milestones */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Upcoming Milestones
        </h2>

        {stats.upcoming_milestones?.length >
        0 ? (
          <div className="space-y-3">
            {stats.upcoming_milestones.map(
              (milestone) => (
                <div
                  key={milestone.id}
                  className="bg-[#F8FAFC] border border-gray-100 rounded-xl p-4"
                >
                  <h3 className="font-semibold text-gray-900">
                    {milestone.title}
                  </h3>

                  <p className="text-sm text-gray-500">
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
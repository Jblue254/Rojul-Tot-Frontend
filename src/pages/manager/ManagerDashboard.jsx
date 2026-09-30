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
      <div className="p-6">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Manager Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Project overview and performance.
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-5">
        <div className="bg-white border rounded-xl p-5">
          <FolderKanban className="mb-3" />
          <p className="text-gray-500">
            Total Projects
          </p>
          <h2 className="text-3xl font-bold">
            {stats.projects}
          </h2>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <Clock className="mb-3" />
          <p className="text-gray-500">
            Active Projects
          </p>
          <h2 className="text-3xl font-bold">
            {stats.active_projects}
          </h2>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <CheckCircle className="mb-3" />
          <p className="text-gray-500">
            Completed Projects
          </p>
          <h2 className="text-3xl font-bold">
            {stats.completed_projects}
          </h2>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <Users className="mb-3" />
          <p className="text-gray-500">
            Team Members
          </p>
          <h2 className="text-3xl font-bold">
            {stats.members}
          </h2>
        </div>
      </div>

      {/* Budget */}
      <div className="grid md:grid-cols-3 gap-5">
        <div className="bg-white border rounded-xl p-5">
          <DollarSign className="mb-3" />
          <p className="text-gray-500">
            Total Budget
          </p>

          <h2 className="text-2xl font-bold">
            ${stats.total_budget}
          </h2>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <DollarSign className="mb-3" />
          <p className="text-gray-500">
            Expenses
          </p>

          <h2 className="text-2xl font-bold text-red-600">
            ${stats.total_expenses}
          </h2>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <DollarSign className="mb-3" />
          <p className="text-gray-500">
            Remaining Budget
          </p>

          <h2 className="text-2xl font-bold text-green-600">
            ${stats.remaining_budget}
          </h2>
        </div>
      </div>

      {/* Machines */}
      <div className="bg-white border rounded-xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <Wrench />
          <h2 className="text-xl font-semibold">
            Assigned Machines
          </h2>
        </div>

        <p className="text-3xl font-bold">
          {stats.assigned_machines}
        </p>
      </div>

      {/* Upcoming Milestones */}
      <div className="bg-white border rounded-xl p-5">
        <h2 className="text-xl font-semibold mb-4">
          Upcoming Milestones
        </h2>

        {stats.upcoming_milestones?.length >
        0 ? (
          <div className="space-y-3">
            {stats.upcoming_milestones.map(
              (milestone) => (
                <div
                  key={milestone.id}
                  className="border rounded-lg p-3"
                >
                  <h3 className="font-semibold">
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
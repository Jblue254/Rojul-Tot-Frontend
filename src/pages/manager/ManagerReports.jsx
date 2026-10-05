import { useEffect, useState } from "react";
import { getManagerDashboard } from "../../api/analytics";

function ManagerReports() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response =
        await getManagerDashboard();

      setStats(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!stats) {
    return <p className="text-gray-500">Loading reports...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Manager Reports
        </h1>

        <p className="text-gray-500 mt-2">
          Project performance summary.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-[#1495CC] hover:shadow-md transition-shadow">
          <p className="text-sm text-gray-500">Total Projects</p>

          <h2 className="text-3xl font-bold text-gray-900 mt-1">
            {stats.projects}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-[#1495CC] hover:shadow-md transition-shadow">
          <p className="text-sm text-gray-500">Active Projects</p>

          <h2 className="text-3xl font-bold text-gray-900 mt-1">
            {stats.active_projects}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-[#1495CC] hover:shadow-md transition-shadow">
          <p className="text-sm text-gray-500">Completed Projects</p>

          <h2 className="text-3xl font-bold text-gray-900 mt-1">
            {stats.completed_projects}
          </h2>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-[#1495CC] hover:shadow-md transition-shadow">
          <p className="text-sm text-gray-500">Total Budget</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-1">
            ${stats.total_budget}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-[#1495CC] hover:shadow-md transition-shadow">
          <p className="text-sm text-gray-500">Total Expenses</p>

          <h2 className="text-2xl font-bold text-red-600 mt-1">
            ${stats.total_expenses}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-[#1495CC] hover:shadow-md transition-shadow">
          <p className="text-sm text-gray-500">Remaining Budget</p>

          <h2 className="text-2xl font-bold text-green-600 mt-1">
            ${stats.remaining_budget}
          </h2>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
        <h2 className="font-bold text-xl text-gray-900 mb-4">
          Upcoming Milestones
        </h2>

        {stats.upcoming_milestones?.length >
        0 ? (
          <div className="space-y-3">
            {stats.upcoming_milestones.map(
              (milestone) => (
                <div
                  key={milestone.id}
                  className="bg-[#F8FAFC] border border-gray-100 p-4 rounded-xl"
                >
                  <p className="font-semibold text-gray-900">
                    {milestone.title}
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
          <p className="text-gray-500">No upcoming milestones.</p>
        )}
      </div>
    </div>
  );
}

export default ManagerReports;
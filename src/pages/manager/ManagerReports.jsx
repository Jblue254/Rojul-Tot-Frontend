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
    return <p>Loading reports...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Manager Reports
        </h1>

        <p className="text-gray-500">
          Project performance summary.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border">
          <p>Total Projects</p>

          <h2 className="text-3xl font-bold">
            {stats.projects}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl border">
          <p>Active Projects</p>

          <h2 className="text-3xl font-bold">
            {stats.active_projects}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl border">
          <p>Completed Projects</p>

          <h2 className="text-3xl font-bold">
            {stats.completed_projects}
          </h2>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border">
          <p>Total Budget</p>

          <h2 className="text-2xl font-bold">
            ${stats.total_budget}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl border">
          <p>Total Expenses</p>

          <h2 className="text-2xl font-bold text-red-600">
            ${stats.total_expenses}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl border">
          <p>Remaining Budget</p>

          <h2 className="text-2xl font-bold text-green-600">
            ${stats.remaining_budget}
          </h2>
        </div>
      </div>

      <div className="bg-white border rounded-xl p-5">
        <h2 className="font-semibold text-lg mb-4">
          Upcoming Milestones
        </h2>

        {stats.upcoming_milestones?.length >
        0 ? (
          <div className="space-y-3">
            {stats.upcoming_milestones.map(
              (milestone) => (
                <div
                  key={milestone.id}
                  className="border p-3 rounded-lg"
                >
                  <p className="font-semibold">
                    {milestone.title}
                  </p>

                  <p className="text-gray-500">
                    Due:{" "}
                    {milestone.due_date}
                  </p>
                </div>
              )
            )}
          </div>
        ) : (
          <p>No upcoming milestones.</p>
        )}
      </div>
    </div>
  );
}

export default ManagerReports;
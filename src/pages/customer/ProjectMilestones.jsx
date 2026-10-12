
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

export default function ProjectMilestones() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMilestones = async () => {
      try {
        const response = await api.get("/projects/milestones/");
        const all = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];

        setMilestones(
          all.filter((item) => String(item.project) === String(id))
        );
      } catch (err) {
        console.error(err);
        setError("Could not load project milestones.");
      } finally {
        setLoading(false);
      }
    };

    loadMilestones();
  }, [id]);

  const completed = milestones.filter((item) => item.completed).length;
  const progress = milestones.length
    ? Math.round((completed / milestones.length) * 100)
    : 0;

  return (
    <div className="p-6">
      <button
        onClick={() => navigate("/customer/projects")}
        className="mb-5 text-[#1495CC] font-medium"
      >
        ← Back to My Projects
      </button>

      <h1 className="text-3xl font-bold mb-2">Project Milestones</h1>
      <p className="text-gray-500 mb-6">
        Track important stages of your project.
      </p>

      {loading ? (
        <p>Loading milestones...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow p-5 mb-6">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Overall milestone progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {completed} of {milestones.length} milestones completed
            </p>
          </div>

          {milestones.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow">
              No milestones have been added to this project yet.
            </div>
          ) : (
            <div className="space-y-4">
              {milestones.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow p-5"
                >
                  <div className="flex flex-wrap justify-between gap-3">
                    <h2 className="font-bold text-lg">{item.title}</h2>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        item.completed
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.completed ? "Completed" : "Pending"}
                    </span>
                  </div>

                  <p className="text-gray-600 my-3">
                    {item.description || "No description provided."}
                  </p>
                  <p className="text-sm text-gray-500">
                    Due date: {item.due_date || "Not set"}
                  </p>
                  {item.completed_at && (
                    <p className="text-sm text-green-700 mt-1">
                      Completed:{" "}
                      {new Date(item.completed_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}


import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProjects } from "../../api/customerProjects";

export default function ProjectGallery() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProject = async () => {
      try {
        const response = await getProjects();
        const projects = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];

        const selected = projects.find(
          (item) => String(item.id) === String(id)
        );

        if (!selected) {
          setError("Project not found or access is unavailable.");
        } else {
          setProject(selected);
        }
      } catch (err) {
        console.error(err);
        setError("Could not load the project gallery.");
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  return (
    <div className="p-6">
      <button
        onClick={() => navigate("/customer/projects")}
        className="mb-5 text-[#1495CC] font-medium"
      >
        ← Back to My Projects
      </button>

      <h1 className="text-3xl font-bold mb-2">Project Gallery</h1>
      <p className="text-gray-500 mb-6">
        Photos and visual updates for your project.
      </p>

      {loading ? (
        <p>Loading gallery...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="font-bold text-xl mb-4">{project.name}</h2>

          {project.image ? (
            <img
              src={project.image}
              alt={project.name}
              className="w-full max-h-[600px] object-cover rounded-xl"
            />
          ) : (
            <div className="bg-gray-100 rounded-xl p-12 text-center text-gray-500">
              No project photo has been uploaded yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

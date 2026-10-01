import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FolderKanban } from "lucide-react";
import { getPublicProjects } from "../../api/projects";

const PLACEHOLDER = "/images/project-placeholder.jpg";

function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await getPublicProjects();

      // Handles both a plain array and a paginated { results: [...] } response
      const list = response.data?.results ?? response.data ?? [];

      const featuredProjects = list
        .filter((project) => project.featured)
        .slice(0, 6);

      setProjects(featuredProjects);
    } catch (error) {
      console.error("Failed to load projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-700";

      case "ACTIVE":
        return "bg-blue-100 text-blue-700";

      case "PLANNING":
        return "bg-yellow-100 text-yellow-700";

      case "ON_HOLD":
        return "bg-orange-100 text-orange-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-500">Loading projects...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="uppercase tracking-[0.25em] text-sm text-[#1495CC] font-semibold">
            Portfolio
          </span>

          <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-3">
            Featured Projects
          </h2>

          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Explore some of our completed and ongoing construction
            projects delivered with quality, innovation, and
            professionalism.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 shadow-sm text-center">
            <FolderKanban
              size={40}
              className="mx-auto mb-3 text-[#1495CC]"
              aria-hidden="true"
            />

            <h3 className="text-xl font-bold mb-1">
              Projects Coming Soon
            </h3>

            <p className="text-sm text-gray-500">
              Featured projects will appear here once published.
            </p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300"
                >
                  {/* Image */}
                  <div className="overflow-hidden">
                    <img
                      src={project.image || PLACEHOLDER}
                      alt={project.name}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null; // avoid a loop if the placeholder is missing too
                        e.currentTarget.src = PLACEHOLDER;
                      }}
                      className="w-full h-56 object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs text-gray-500">
                        {project.location}
                      </span>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(
                          project.status
                        )}`}
                      >
                        {(project.status || "").replace("_", " ")}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold mb-2 text-gray-900">
                      {project.name}
                    </h3>

                    <p className="text-gray-600 text-sm leading-5 mb-1 line-clamp-3">
                      {project.description ||
                        "No description available."}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm rounded-xl bg-[#1495CC] text-white font-semibold hover:bg-[#1185B5] transition"
              >
                View All Projects
                <ArrowRight size={16} />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default ProjectsSection;
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { getPublicProjects } from "../../api/projects";
import MainLayout from "../../layouts/MainLayout";

const PLACEHOLDER = "/images/project-placeholder.jpg";

const FILTERS = [
  { value: "ALL", label: "All" },
  { value: "COMPLETED", label: "Completed" },
  { value: "ACTIVE", label: "Active" },
  { value: "PLANNING", label: "Planning" },
];

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await getPublicProjects();

      // Handles both a plain array and a paginated { results: [...] } response
      const list = response.data?.results ?? response.data ?? [];

      setProjects(list);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Derived from state, so the list can never get out of sync with the filter
  const filteredProjects =
    activeFilter === "ALL"
      ? projects
      : projects.filter((project) => project.status === activeFilter);

  return (
    <MainLayout>
      <div className="bg-[#F8FAFC] min-h-screen">
        {/* Hero */}

        <section className="bg-gradient-to-r from-[#0F172A] to-[#1495CC] text-white py-16">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <span className="uppercase tracking-[0.25em] text-sm text-blue-200 font-semibold">
              Portfolio
            </span>

            <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-4">
              Our Projects Gallery
            </h1>

            <p className="max-w-3xl mx-auto text-sm md:text-base text-blue-100">
              Explore completed and ongoing construction
              projects delivered with quality,
              innovation and professionalism.
            </p>
          </div>
        </section>

        {/* Filters */}

        <section className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {FILTERS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setActiveFilter(value)}
                className={`px-4 py-1.5 text-sm rounded-full border transition ${
                  activeFilter === value
                    ? "bg-[#1495CC] text-white border-[#1495CC]"
                    : "bg-white text-gray-700 hover:border-[#1495CC] hover:text-[#1495CC]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Gallery */}

        <section className="max-w-7xl mx-auto px-6 pb-14">
          {loading ? (
            <p className="text-sm text-gray-500 text-center py-12">
              Loading projects...
            </p>
          ) : filteredProjects.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center shadow-sm">
              <h3 className="text-xl font-bold mb-1">
                No Projects Found
              </h3>

              <p className="text-sm text-gray-500">
                Projects will appear here once published.
              </p>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 break-inside-avoid"
                >
                  <div className="relative">
                    <img
                      src={project.image || PLACEHOLDER}
                      alt={project.name}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = PLACEHOLDER;
                      }}
                      className="w-full object-cover"
                    />

                    {project.featured && (
                      <span className="absolute top-3 left-3 bg-[#1495CC] text-white text-xs px-2.5 py-0.5 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                      <MapPin size={14} />
                      {project.location}
                    </div>

                    <h3 className="text-lg font-bold mb-2">
                      {project.name}
                    </h3>

                    <p className="text-gray-600 text-sm leading-5 mb-3 line-clamp-3">
                      {project.description || "No description available."}
                    </p>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#1495CC] font-semibold">
                        {(project.status || "").replace("_", " ")}
                      </span>

                      <Link
                        to={`/projects/${project.id}`}
                        className="inline-flex items-center gap-1.5 text-sm text-[#1495CC] font-semibold hover:gap-2.5 transition-all"
                      >
                        View Project
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
}

export default ProjectsPage;
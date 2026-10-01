import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { getPublicProjects } from "../../api/projects";
import MainLayout from "../../layouts/MainLayout";
function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const response = await getPublicProjects();

            const list =
                response.data?.results ??
                response.data ??
                [];

            setProjects(list);
            setFilteredProjects(list);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filterProjects = (status) => {
        if (status === "ALL") {
            setFilteredProjects(projects);
            return;
        }

        setFilteredProjects(
            projects.filter(
                (project) => project.status === status
            )
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <p className="text-gray-500">
                    Loading projects...
                </p>
            </div>
        );
    }

    return (
        <MainLayout>
            <div className="bg-[#F8FAFC] min-h-screen">
                {/* Hero */}

                <section className="bg-gradient-to-r from-[#1495CC] to-[#0D6E99] text-white py-24">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <span className="uppercase tracking-[0.25em] text-white/80">
                            Portfolio
                        </span>

                        <h1 className="text-5xl font-bold mt-4 mb-6">
                            Our Projects Gallery
                        </h1>

                        <p className="max-w-3xl mx-auto text-lg text-white/90">
                            Explore completed and ongoing construction
                            projects delivered with quality,
                            innovation and professionalism.
                        </p>
                    </div>
                </section>

                {/* Filters */}

                <section className="max-w-7xl mx-auto px-6 py-10">
                    <div className="flex flex-wrap gap-3 justify-center">
                        <button
                            onClick={() => filterProjects("ALL")}
                            className="px-5 py-2 rounded-full bg-[#1495CC] text-white"
                        >
                            All
                        </button>

                        <button
                            onClick={() => filterProjects("COMPLETED")}
                            className="px-5 py-2 rounded-full bg-white border"
                        >
                            Completed
                        </button>

                        <button
                            onClick={() => filterProjects("ACTIVE")}
                            className="px-5 py-2 rounded-full bg-white border"
                        >
                            Active
                        </button>

                        <button
                            onClick={() => filterProjects("PLANNING")}
                            className="px-5 py-2 rounded-full bg-white border"
                        >
                            Planning
                        </button>
                    </div>
                </section>

                {/* Gallery */}

                <section className="max-w-7xl mx-auto px-6 pb-24">
                    {filteredProjects.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 text-center shadow">
                            <h3 className="text-2xl font-bold mb-3">
                                No Projects Found
                            </h3>

                            <p className="text-gray-500">
                                Projects will appear here once published.
                            </p>
                        </div>
                    ) : (
                        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                            {filteredProjects.map((project) => (
                                <div
                                    key={project.id}
                                    className="bg-white rounded-3xl overflow-hidden shadow hover:shadow-xl transition duration-300 break-inside-avoid"
                                >
                                    <div className="relative">
                                        <img
                                            src={
                                                project.image ||
                                                "https://placehold.co/800x600"
                                            }
                                            alt={project.name}
                                            className="w-full object-cover"
                                        />

                                        {project.featured && (
                                            <span className="absolute top-4 left-4 bg-[#1495CC] text-white text-xs px-3 py-1 rounded-full">
                                                Featured
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-6">
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                            <MapPin size={16} />
                                            {project.location}
                                        </div>

                                        <h3 className="text-xl font-bold mb-3">
                                            {project.name}
                                        </h3>

                                        <p className="text-gray-600 text-sm leading-6 mb-4">
                                            {project.description?.slice(0, 140)}
                                            ...
                                        </p>

                                        <div className="flex justify-between items-center">
                                            <span className="text-[#1495CC] font-semibold">
                                                {project.status}
                                            </span>
                                            <Link
                                                to={`/projects/${project.id}`}
                                                className="flex items-center gap-2 text-[#1495CC] font-semibold hover:gap-3 transition-all"
                                            >
                                                View Project
                                                <ArrowRight size={18} />
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
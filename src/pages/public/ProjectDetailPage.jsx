import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Wallet,
  User,
} from "lucide-react";

import { getProject } from "../../api/projects";
import MainLayout from "../../layouts/MainLayout";

function ProjectDetailPage() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadProject = async () => {
    setLoading(true);

    try {
      const response = await getProject(id);
      setProject(response.data);
    } catch (error) {
      console.error(error);
      setProject(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
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
      <MainLayout>
        <div className="min-h-[60vh] flex justify-center items-center text-sm text-gray-500">
          Loading project...
        </div>
      </MainLayout>
    );
  }

  if (!project) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold mb-3">
            Project Not Found
          </h2>

          <Link
            to="/projects"
            className="text-sm font-semibold text-[#1495CC] hover:underline"
          >
            Back to Projects
          </Link>
        </div>
      </MainLayout>
    );
  }

  const details = [
    { icon: MapPin, label: "Location", value: project.location },
    {
      icon: Wallet,
      label: "Budget",
      value: `KSh ${Number(project.budget || 0).toLocaleString()}`,
    },
    { icon: Calendar, label: "Start Date", value: project.start_date },
    {
      icon: Calendar,
      label: "Expected Completion",
      value: project.expected_end_date,
    },
    {
      icon: User,
      label: "Project Manager",
      value:
        project.manager_name ||
        project.manager_email ||
        "Not Available",
    },
  ];

  return (
    <MainLayout>
      <div className="bg-[#F8FAFC] min-h-screen">

        {/* Hero */}

        <section className="relative h-72 md:h-80 overflow-hidden bg-gradient-to-r from-[#0F172A] to-[#1495CC]">

          {project.image && (
            <img
              src={project.image}
              alt={project.name}
              className="w-full h-full object-cover"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/85 to-[#1495CC]/60" />

          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-6 w-full text-white">

              <Link
                to="/projects"
                className="inline-flex items-center gap-2 mb-4 text-sm hover:underline"
              >
                <ArrowLeft size={16} />
                Back to Projects
              </Link>

              <div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    project.status
                  )}`}
                >
                  {(project.status || "").replace("_", " ")}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mt-4 max-w-4xl">
                {project.name}
              </h1>

            </div>
          </div>
        </section>

        {/* Content */}

        <section className="max-w-7xl mx-auto px-6 py-10">

          <div className="grid lg:grid-cols-3 gap-6">

            {/* Main Content */}

            <div className="lg:col-span-2">

              <div className="bg-white rounded-3xl p-6 shadow-sm">

                <h2 className="text-xl font-bold mb-4">
                  Project Overview
                </h2>

                <p className="text-sm text-gray-600 leading-7">
                  {project.description || "No description available."}
                </p>

              </div>

              {/* Additional Image */}

              {project.image && (
                <div className="bg-white rounded-3xl p-3 shadow-sm mt-6">

                  <img
                    src={project.image}
                    alt={project.name}
                    loading="lazy"
                    className="w-full rounded-2xl"
                  />

                </div>
              )}
            </div>

            {/* Sidebar */}

            <div>

              <div className="bg-white rounded-3xl p-6 shadow-sm sticky top-24">

                <h3 className="text-lg font-bold mb-4">
                  Project Details
                </h3>

                <div className="space-y-4">

                  {details.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3">
                      <Icon
                        className="text-[#1495CC] shrink-0 mt-0.5"
                        size={18}
                      />

                      <div>
                        <p className="text-gray-500 text-xs">
                          {label}
                        </p>

                        <p className="text-sm font-semibold">
                          {value}
                        </p>
                      </div>
                    </div>
                  ))}

                </div>

                <div className="mt-6">

                  <Link
                    to="/contact"
                    className="block text-center text-sm bg-[#1495CC] text-white py-3 rounded-xl font-semibold hover:bg-[#1185B5] transition"
                  >
                    Request Similar Project
                  </Link>

                </div>

              </div>

            </div>

          </div>

        </section>
      </div>
    </MainLayout>
  );
}

export default ProjectDetailPage;
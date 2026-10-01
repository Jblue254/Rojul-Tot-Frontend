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

function ProjectDetailPage() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      const response = await getProject(id);
      setProject(response.data);
    } catch (error) {
      console.error(error);
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
      <div className="min-h-screen flex justify-center items-center">
        Loading project...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h2 className="text-3xl font-bold mb-4">
          Project Not Found
        </h2>

        <Link
          to="/projects"
          className="text-[#1495CC]"
        >
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen">

      {/* Hero */}

      <section className="relative h-[500px] overflow-hidden">

        <img
          src={project.image}
          alt={project.name}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-6 text-white">

            <Link
              to="/projects"
              className="inline-flex items-center gap-2 mb-6"
            >
              <ArrowLeft size={18} />
              Back to Projects
            </Link>

            <span
              className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                project.status
              )}`}
            >
              {project.status}
            </span>

            <h1 className="text-5xl md:text-6xl font-bold mt-6 max-w-4xl">
              {project.name}
            </h1>

          </div>
        </div>
      </section>

      {/* Content */}

      <section className="max-w-7xl mx-auto px-6 py-20">

        <div className="grid lg:grid-cols-3 gap-10">

          {/* Main Content */}

          <div className="lg:col-span-2">

            <div className="bg-white rounded-3xl p-8 shadow-sm">

              <h2 className="text-3xl font-bold mb-6">
                Project Overview
              </h2>

              <p className="text-gray-600 leading-8">
                {project.description}
              </p>

            </div>

            {/* Additional Image */}

            {project.image && (
              <div className="bg-white rounded-3xl p-4 shadow-sm mt-8">

                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full rounded-2xl"
                />

              </div>
            )}
          </div>

          {/* Sidebar */}

          <div>

            <div className="bg-white rounded-3xl p-8 shadow-sm sticky top-24">

              <h3 className="text-2xl font-bold mb-6">
                Project Details
              </h3>

              <div className="space-y-6">

                <div className="flex items-start gap-4">
                  <MapPin
                    className="text-[#1495CC]"
                    size={20}
                  />

                  <div>
                    <p className="text-gray-500 text-sm">
                      Location
                    </p>

                    <p className="font-semibold">
                      {project.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Wallet
                    className="text-[#1495CC]"
                    size={20}
                  />

                  <div>
                    <p className="text-gray-500 text-sm">
                      Budget
                    </p>

                    <p className="font-semibold">
                      KSh{" "}
                      {Number(
                        project.budget
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Calendar
                    className="text-[#1495CC]"
                    size={20}
                  />

                  <div>
                    <p className="text-gray-500 text-sm">
                      Start Date
                    </p>

                    <p className="font-semibold">
                      {project.start_date}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Calendar
                    className="text-[#1495CC]"
                    size={20}
                  />

                  <div>
                    <p className="text-gray-500 text-sm">
                      Expected Completion
                    </p>

                    <p className="font-semibold">
                      {project.expected_end_date}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <User
                    className="text-[#1495CC]"
                    size={20}
                  />

                  <div>
                    <p className="text-gray-500 text-sm">
                      Project Manager
                    </p>

                    <p className="font-semibold">
                      {project.manager_email ||
                        "Not Available"}
                    </p>
                  </div>
                </div>

              </div>

              <div className="mt-10">

                <Link
                  to="/contact"
                  className="block text-center bg-[#1495CC] text-white py-4 rounded-xl font-semibold hover:bg-[#1185B5]"
                >
                  Request Similar Project
                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>
    </div>
  );
}

export default ProjectDetailPage;
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Wrench } from "lucide-react";
import { getMachines } from "../../api/machines";

const PLACEHOLDER = "/images/placeholder-machine.jpg";

function FeaturedMachines() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMachines();
  }, []);

const loadMachines = async () => {
  try {
    const response = await getMachines();

    console.log("Response:", response.data);

    const list = response.data?.results ?? response.data ?? [];

    console.log("List:", list);

    const featuredMachines = list
      .filter((machine) => machine.status === "AVAILABLE")
      .slice(0, 3);

    console.log("Featured:", featuredMachines);

    setMachines(featuredMachines);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  const getStatusStyle = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-700";

      case "RENTED":
        return "bg-blue-100 text-blue-700";

      case "MAINTENANCE":
        return "bg-yellow-100 text-yellow-700";

      case "UNAVAILABLE":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-500">
            Loading machines...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <span className="uppercase tracking-[0.25em] text-sm text-[#1495CC] font-semibold">
              Equipment
            </span>

            <h2 className="text-3xl md:text-4xl font-bold mt-3">
              Featured Machines
            </h2>
          </div>

          <Link
            to="/machines"
            className="mt-3 md:mt-0 inline-flex items-center gap-1 text-sm text-[#1495CC] font-semibold hover:underline"
          >
            View All
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Empty State */}

        {machines.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 shadow-sm text-center">
            <Wrench
              size={40}
              className="mx-auto mb-3 text-[#1495CC]"
              aria-hidden="true"
            />

            <h3 className="text-xl font-bold mb-1">
              Machines Coming Soon
            </h3>

            <p className="text-sm text-gray-500">
              Available equipment will appear here once published.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {machines.map((machine) => (
              <div
                key={machine.id}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300"
              >
                {/* Image */}

                <div className="overflow-hidden">
                  <img
                    src={machine.image || PLACEHOLDER}
                    alt={machine.name}
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
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500">
                      {machine.location}
                    </span>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(
                        machine.status
                      )}`}
                    >
                      {machine.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold mb-2">
                    {machine.name}
                  </h3>

                  <p className="text-gray-600 text-sm leading-5 mb-3 line-clamp-3">
                    {machine.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-[#1495CC] font-bold text-base">
                      KES {Number(machine.price_per_day).toLocaleString()}/day
                    </span>

                    <Link
                      to={`/machines/${machine.id}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-[#1495CC] hover:underline"
                    >
                      View
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedMachines;
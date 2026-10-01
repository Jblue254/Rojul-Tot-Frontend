import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search, Wrench } from "lucide-react";
import { getPublicMachines } from "../../api/machines";
import MainLayout from "../../layouts/MainLayout";

const PLACEHOLDER = "/images/placeholder-machine.jpg";

const STATUS_STYLES = {
  AVAILABLE: "bg-green-100 text-green-700",
  RENTED: "bg-blue-100 text-blue-700",
  MAINTENANCE: "bg-yellow-100 text-yellow-700",
  UNAVAILABLE: "bg-red-100 text-red-700",
};

function MachinesPage() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  useEffect(() => {
    loadMachines();
  }, []);

  const loadMachines = async () => {
    try {
      const response = await getPublicMachines();

      // Handles both a plain array and a paginated { results: [...] } response
      const list = response.data?.results ?? response.data ?? [];
      setMachines(list);
    } catch (err) {
      console.error(err);
      setError("We couldn't load the machines right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const q = search.trim().toLowerCase();

  const filteredMachines = machines.filter((machine) => {
    const matchesSearch =
      (machine.name || "").toLowerCase().includes(q) ||
      (machine.description || "").toLowerCase().includes(q) ||
      (machine.location || "").toLowerCase().includes(q);

    const matchesStatus = status === "ALL" || machine.status === status;

    return matchesSearch && matchesStatus;
  });

  const resetFilters = () => {
    setSearch("");
    setStatus("ALL");
  };

  return (
    <MainLayout>
      <div className="bg-[#F8FAFC] min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-r from-[#0F172A] to-[#1495CC] text-white py-16">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <span className="uppercase tracking-[0.3em] text-sm text-blue-200 font-semibold">
              Equipment
            </span>

            <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-4">
              Our Machines
            </h1>

            <p className="max-w-3xl mx-auto text-sm md:text-base text-blue-100">
              Browse reliable construction machinery available for rent,
              from excavators and loaders to compactors and more.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Filters */}
          <div className="bg-white rounded-3xl shadow-lg p-4 mb-8 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <input
                type="text"
                placeholder="Search machines..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1495CC]"
              />
            </div>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full md:w-64 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1495CC]"
            >
              <option value="ALL">All Statuses</option>
              <option value="AVAILABLE">Available</option>
              <option value="RENTED">Rented</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="UNAVAILABLE">Unavailable</option>
            </select>
          </div>

          {loading ? (
            <p className="text-sm text-gray-500 text-center py-12">
              Loading machines...
            </p>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl p-6 text-center">
              {error}
            </div>
          ) : filteredMachines.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center shadow-sm">
              <Wrench
                size={40}
                className="mx-auto mb-3 text-[#1495CC]"
                aria-hidden="true"
              />

              <h3 className="text-xl font-bold mb-1">No machines found</h3>

              <p className="text-sm text-gray-500 mb-4">
                Try a different search or filter.
              </p>

              {(search || status !== "ALL") && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-5 py-2.5 text-sm rounded-xl bg-[#1495CC] text-white font-semibold hover:bg-[#1185B5] transition"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">
                Showing {filteredMachines.length} of {machines.length} machines
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMachines.map((machine) => (
                  <div
                    key={machine.id}
                    className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="overflow-hidden">
                      <img
                        src={machine.image || PLACEHOLDER}
                        alt={machine.name}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
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
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            STATUS_STYLES[machine.status] ||
                            "bg-gray-100 text-gray-700"
                          }`}
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
                          KES{" "}
                          {Number(machine.price_per_day).toLocaleString()}/day
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
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default MachinesPage;
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicDrawings } from "../../api/drawings";
import MainLayout from "../../layouts/MainLayout";

const PLACEHOLDER = "/images/placeholder-drawing.jpg";

function DrawingsPage() {
  const [drawings, setDrawings] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDrawings();
  }, []);

  const loadDrawings = async () => {
    try {
      const response = await getPublicDrawings();

      // Handles both a plain array and a paginated { results: [...] } response
      const list = response.data?.results ?? response.data ?? [];

      setDrawings(list);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Derived from state, so no extra effect is needed.
  // (title / description may be null, so default them to "")
  const q = search.trim().toLowerCase();

  const filteredDrawings = drawings.filter(
    (drawing) =>
      (drawing.title || "").toLowerCase().includes(q) ||
      (drawing.description || "").toLowerCase().includes(q)
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-700";

      case "SOLD_OUT":
        return "bg-red-100 text-red-700";

      case "INACTIVE":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <MainLayout>
      <div className="bg-[#F8FAFC] min-h-screen">

        {/* Hero */}

        <section className="bg-gradient-to-r from-[#0F172A] to-[#1495CC] text-white py-16">
          <div className="max-w-7xl mx-auto px-6 text-center">

            <span className="uppercase tracking-[0.3em] text-sm text-blue-200 font-semibold">
              Architectural Plans
            </span>

            <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-4">
              Building Drawings
            </h1>

            <p className="max-w-3xl mx-auto text-sm md:text-base text-blue-100">
              Browse professionally designed architectural drawings,
              house plans, apartment layouts and commercial designs.
            </p>

          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-10">

          {/* Search */}

          <div className="bg-white rounded-3xl shadow-lg p-4 mb-8">
            <input
              type="text"
              placeholder="Search drawings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1495CC]"
            />
          </div>

          {loading ? (
            <div className="text-center text-sm text-gray-500 py-12">
              Loading drawings...
            </div>
          ) : filteredDrawings.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center shadow-sm">

              <div className="text-4xl mb-3">
                📐
              </div>

              <h3 className="text-xl font-bold mb-1">
                No Drawings Available
              </h3>

              <p className="text-sm text-gray-500">
                No drawings match your search.
              </p>

            </div>
          ) : (
            <>
              {/* Grid */}

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                {filteredDrawings.map((drawing) => (
                  <div
                    key={drawing.id}
                    className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition"
                  >

                    <img
                      src={drawing.preview_image || PLACEHOLDER}
                      alt={drawing.title}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = PLACEHOLDER;
                      }}
                      className="w-full h-52 object-cover"
                    />

                    <div className="p-5">

                      <div className="flex justify-between items-center mb-3">

                        <span className="text-xs text-gray-500">
                          {drawing.category_name || "Drawing"}
                        </span>

                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusStyle(
                            drawing.status
                          )}`}
                        >
                          {drawing.status}
                        </span>

                      </div>

                      <h3 className="text-lg font-bold mb-2">
                        {drawing.title}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {drawing.description}
                      </p>

                      <div className="flex justify-between items-center">

                        <div>
                          <span className="text-xl font-bold text-[#1495CC]">
                            KSh{" "}
                            {Number(drawing.price).toLocaleString()}
                          </span>
                        </div>

                        {drawing.drawing_file ? (
                          <a
                            href={drawing.drawing_file}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2.5 text-sm bg-[#1495CC] text-white rounded-xl hover:bg-[#1185B5] transition"
                          >
                            View Plan
                          </a>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="px-4 py-2.5 text-sm bg-gray-300 text-gray-600 rounded-xl cursor-not-allowed"
                          >
                            Unavailable
                          </button>
                        )}

                      </div>

                    </div>

                  </div>
                ))}

              </div>

              {/* CTA */}

              <section className="mt-14">
                <div className="bg-[#1495CC] rounded-3xl p-8 text-center text-white">

                  <h2 className="text-2xl md:text-3xl font-bold mb-3">
                    Need Custom Architectural Drawings?
                  </h2>

                  <p className="max-w-2xl mx-auto mb-6 text-sm text-blue-100">
                    Our architects can design custom residential,
                    commercial and industrial plans tailored to your
                    project requirements.
                  </p>

                  <Link
                    to="/contact"
                    className="inline-flex items-center px-6 py-3 text-sm rounded-xl bg-white text-[#1495CC] font-semibold hover:bg-gray-100 transition"
                  >
                    Contact Us
                  </Link>

                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default DrawingsPage;
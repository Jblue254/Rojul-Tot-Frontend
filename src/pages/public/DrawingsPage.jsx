
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicDrawings } from "../../api/drawings";
import MainLayout from "../../layouts/MainLayout";

const PLACEHOLDER = "/images/placeholder-drawing.jpg";

function DrawingsPage() {
  const [drawings, setDrawings] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadDrawings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getPublicDrawings();
        const data = response.data;
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
          ? data.results
          : [];

        if (mounted) {
          setDrawings(list);
        }
      } catch (err) {
        console.error("Failed to load public drawings:", err);

        if (mounted) {
          setError(
            "We couldn't load the drawings right now. Please try again."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDrawings();

    return () => {
      mounted = false;
    };
  }, []);

  const query = search.trim().toLowerCase();

  const filteredDrawings = drawings.filter((drawing) => {
    const title = (drawing.title || "").toLowerCase();
    const description = (drawing.description || "").toLowerCase();
    const category = (drawing.category_name || "").toLowerCase();

    return (
      title.includes(query) ||
      description.includes(query) ||
      category.includes(query)
    );
  });

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

  const formatPrice = (price) => {
    const amount = Number(price);

    return Number.isFinite(amount)
      ? amount.toLocaleString("en-KE")
      : "Contact us";
  };

  return (
    <MainLayout>
      <main className="min-h-screen bg-[#F8FAFC]">
        {/* Hero */}
        <section className="bg-gradient-to-r from-[#0F172A] to-[#1495CC] py-14 md:py-20 text-white">
          <div className="mx-auto max-w-7xl px-5 text-center md:px-6">
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-200">
              Architectural Plans
            </span>

            <h1 className="mt-4 text-3xl font-bold md:text-5xl">
              Building Drawings
            </h1>

            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-blue-100 md:text-base">
              Explore professionally designed house plans, residential
              layouts, apartment designs, and commercial architectural
              drawings for your next construction project.
            </p>

            <a
              href="#available-drawings"
              className="mt-7 inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#0F172A] transition hover:bg-blue-50"
            >
              Explore Drawings
            </a>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-5 py-10 md:px-6 md:py-14">
          {/* Search and results count */}
          <section
            id="available-drawings"
            className="mb-8 rounded-2xl bg-white p-4 shadow-sm md:p-5"
          >
            <label
              htmlFor="drawing-search"
              className="mb-2 block text-sm font-semibold text-gray-800"
            >
              Find your drawing
            </label>

            <input
              id="drawing-search"
              type="search"
              placeholder="Search by title, category, or description..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#1495CC] focus:ring-2 focus:ring-[#1495CC]/20"
            />

            {!loading && !error && (
              <p className="mt-3 text-sm text-gray-500">
                {filteredDrawings.length}{" "}
                {filteredDrawings.length === 1 ? "drawing" : "drawings"} found
              </p>
            )}
          </section>

          {/* Loading */}
          {loading && (
            <div
              className="py-16 text-center"
              role="status"
              aria-live="polite"
            >
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#1495CC]" />
              <p className="mt-4 text-sm text-gray-500">
                Loading architectural drawings...
              </p>
            </div>
          )}

          {/* API error */}
          {!loading && error && (
            <div className="rounded-2xl bg-white px-6 py-12 text-center shadow-sm">
              <div className="mb-3 text-4xl">⚠️</div>

              <h2 className="text-xl font-bold text-gray-900">
                Unable to Load Drawings
              </h2>

              <p className="mx-auto mt-2 max-w-lg text-sm text-gray-500">
                {error}
              </p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-5 rounded-xl bg-[#1495CC] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1185B5]"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && filteredDrawings.length === 0 && (
            <div className="rounded-3xl bg-white px-6 py-14 text-center shadow-sm">
              <div className="mb-4 text-5xl">📐</div>

              <h2 className="text-xl font-bold text-gray-900">
                {drawings.length === 0
                  ? "No Drawings Available"
                  : "No Matching Drawings"}
              </h2>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-500">
                {drawings.length === 0
                  ? "Architectural drawings will appear here when they become available."
                  : "Try another search term to find the drawing you're looking for."}
              </p>

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mt-5 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}

          {/* Drawing cards */}
          {!loading && !error && filteredDrawings.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDrawings.map((drawing) => {
                const status = drawing.status || "UNKNOWN";

                return (
                  <article
                    key={drawing.id}
                    className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    {/* Preview image */}
                    <Link
                      to={`/drawings/${drawing.id}`}
                      aria-label={`View details for ${drawing.title || "drawing"}`}
                      className="relative block h-52 overflow-hidden bg-gray-100 sm:h-56"
                    >
                      <img
                        src={drawing.preview_image || PLACEHOLDER}
                        alt={drawing.title || "Architectural drawing preview"}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = PLACEHOLDER;
                        }}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#0F172A] shadow-sm">
                        {drawing.category_name || "Architectural Plan"}
                      </span>
                    </Link>

                    {/* Card content */}
                    <div className="flex flex-1 flex-col p-5 md:p-6">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                            status
                          )}`}
                        >
                          {status.replaceAll("_", " ")}
                        </span>

                        <span className="text-xs text-gray-400">
                          Ref. #{drawing.id}
                        </span>
                      </div>

                      <h2 className="text-lg font-bold leading-snug text-[#0F172A] transition group-hover:text-[#1495CC]">
                        {drawing.title || "Untitled Drawing"}
                      </h2>

                      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-gray-600">
                        {drawing.description ||
                          "View this architectural plan to learn more about its details."}
                      </p>

                      <div className="mt-5 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
                        <div>
                          <p className="text-xs text-gray-500">Price</p>

                          <p className="mt-1 text-lg font-bold text-[#1495CC]">
                            KSh {formatPrice(drawing.price)}
                          </p>
                        </div>

                        <Link
                          to={`/drawings/${drawing.id}`}
                          className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#1495CC] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1185B5] focus:outline-none focus:ring-2 focus:ring-[#1495CC] focus:ring-offset-2"
                        >
                          View Drawing
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Custom drawings CTA */}
          <section className="mt-14 md:mt-20">
            <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#0F172A] to-[#1495CC] px-6 py-10 text-center text-white md:px-12 md:py-14">
              <span className="text-sm font-semibold uppercase tracking-widest text-blue-200">
                Built Around Your Vision
              </span>

              <h2 className="mt-3 text-2xl font-bold md:text-3xl">
                Need Custom Architectural Drawings?
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-blue-100 md:text-base">
                Tell us about your construction project and let our team
                help you explore custom residential, commercial, and
                industrial design options.
              </p>

              <Link
                to="/contact"
                className="mt-7 inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold text-[#0F172A] transition hover:bg-blue-50"
              >
                Contact Our Team
              </Link>
            </div>
          </section>
        </div>
      </main>
    </MainLayout>
  );
}

export default DrawingsPage;

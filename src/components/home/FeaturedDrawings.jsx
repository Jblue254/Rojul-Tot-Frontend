import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Ruler } from "lucide-react";
import { getPublicDrawings } from "../../api/drawings";

const PLACEHOLDER = "/images/placeholder-drawing.jpg";

function FeaturedDrawings() {
  const [drawings, setDrawings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDrawings();
  }, []);

  const loadDrawings = async () => {
    try {
      const response = await getPublicDrawings();

      // Handles both a plain array and a paginated { results: [...] } response
      const list = response.data?.results ?? response.data ?? [];

      const availableDrawings = list
        .filter((drawing) => drawing.status === "AVAILABLE")
        .slice(0, 6);

      setDrawings(availableDrawings);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-500">
            Loading drawings...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-3">
          <div>
            <span className="uppercase tracking-[0.25em] text-sm text-[#1495CC] font-semibold">
              Architectural Plans
            </span>

            <h2 className="text-3xl md:text-4xl font-bold mt-3">
              Featured Drawings
            </h2>
          </div>

          <Link
            to="/drawings"
            className="inline-flex items-center gap-1 text-sm text-[#1495CC] font-semibold hover:underline"
          >
            View All
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Empty State */}

        {drawings.length === 0 ? (
          <div className="bg-gray-50 rounded-3xl p-8 text-center">
            <Ruler
              size={40}
              className="mx-auto mb-3 text-[#1495CC]"
              aria-hidden="true"
            />

            <h3 className="text-xl font-bold mb-1">
              Drawings Coming Soon
            </h3>

            <p className="text-sm text-gray-500">
              Architectural plans will appear here once published.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drawings.map((drawing) => (
              <div
                key={drawing.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
              >
                {/* Drawing Image */}

                <img
                  src={drawing.preview_image || PLACEHOLDER}
                  alt={drawing.title}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null; // avoid a loop if the placeholder is missing too
                    e.currentTarget.src = PLACEHOLDER;
                  }}
                  className="w-full h-52 object-cover"
                />

                {/* Content */}

                <div className="p-5">
                  <h3 className="text-lg font-bold mb-2">
                    {drawing.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {drawing.description}
                  </p>

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[#1495CC] font-bold text-base">
                      KSh{" "}
                      {Number(drawing.price).toLocaleString()}
                    </span>

                    <span className="px-2.5 py-0.5 rounded-full text-xs bg-green-100 text-green-700">
                      {drawing.status}
                    </span>
                  </div>

                  <Link
                    to={`/drawings/${drawing.id}`}
                    className="block w-full text-center text-sm bg-[#1495CC] text-white py-2.5 rounded-lg hover:bg-[#1185B5] transition"
                  >
                    View Drawing
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedDrawings;
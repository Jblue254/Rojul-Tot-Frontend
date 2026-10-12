import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { getReviews } from "../../api/reviews";

function ManagerReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const response = await getReviews();
      setReviews(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (sum, review) => sum + review.rating,
            0
          ) / reviews.length
        ).toFixed(1)
      : 0;

  // Newest first (copy the array so state is not mutated)
  const sortedReviews = [...reviews].sort(
    (a, b) =>
      (Date.parse(b.created_at) || 0) -
      (Date.parse(a.created_at) || 0)
  );

  if (loading) {
    return <p className="text-gray-500">Loading reviews...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Manager Reviews
        </h1>

        <p className="text-gray-500 mt-2">
          Customer feedback overview.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-[#1495CC]">
          <p className="text-sm text-gray-500">
            Total Reviews
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-1">
            {reviews.length}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-[#1495CC]">
          <p className="text-sm text-gray-500">
            Average Rating
          </p>

          <h2 className="flex items-center gap-2 text-3xl font-bold text-gray-900 mt-1">
            <Star
              size={26}
              className="text-yellow-500 fill-yellow-500"
              aria-hidden="true"
            />
            {averageRating}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-[#1495CC]">
          <p className="text-sm text-gray-500">
            5-Star Reviews
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-1">
            {
              reviews.filter(
                (r) => r.rating === 5
              ).length
            }
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#1495CC] text-white">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">
                Rating
              </th>

              <th className="px-4 py-3 text-left font-semibold">
                Comment
              </th>

              <th className="px-4 py-3 text-left font-semibold">
                Machine
              </th>

              <th className="px-4 py-3 text-left font-semibold">
                Drawing
              </th>

              <th className="px-4 py-3 text-left font-semibold">
                Date
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedReviews.map((review) => (
              <tr
                key={review.id}
                className="border-t border-gray-100 hover:bg-blue-50/40 transition-colors"
              >
                <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                  <span className="inline-flex items-center gap-1.5">
                    <Star
                      size={16}
                      className="text-yellow-500 fill-yellow-500"
                      aria-hidden="true"
                    />
                    {review.rating}
                  </span>
                </td>

                <td className="px-4 py-3 text-gray-700">
                  {review.comment}
                </td>

                <td className="px-4 py-3 text-gray-700">
                  {review.machine || "-"}
                </td>

                <td className="px-4 py-3 text-gray-700">
                  {review.drawing || "-"}
                </td>

                <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                  {new Date(
                    review.created_at
                  ).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

export default ManagerReviews;
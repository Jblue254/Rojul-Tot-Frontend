import { useEffect, useState } from "react";
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

  if (loading) {
    return <p>Loading reviews...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Manager Reviews
        </h1>

        <p className="text-gray-500">
          Customer feedback overview.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border">
          <p className="text-gray-500">
            Total Reviews
          </p>

          <h2 className="text-3xl font-bold">
            {reviews.length}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl border">
          <p className="text-gray-500">
            Average Rating
          </p>

          <h2 className="text-3xl font-bold">
            ⭐ {averageRating}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl border">
          <p className="text-gray-500">
            5-Star Reviews
          </p>

          <h2 className="text-3xl font-bold">
            {
              reviews.filter(
                (r) => r.rating === 5
              ).length
            }
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">
                Rating
              </th>

              <th className="p-3 text-left">
                Comment
              </th>

              <th className="p-3 text-left">
                Machine
              </th>

              <th className="p-3 text-left">
                Drawing
              </th>

              <th className="p-3 text-left">
                Date
              </th>
            </tr>
          </thead>

          <tbody>
            {reviews.map((review) => (
              <tr
                key={review.id}
                className="border-t"
              >
                <td className="p-3">
                  ⭐ {review.rating}
                </td>

                <td className="p-3">
                  {review.comment}
                </td>

                <td className="p-3">
                  {review.machine || "-"}
                </td>

                <td className="p-3">
                  {review.drawing || "-"}
                </td>

                <td className="p-3">
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
  );
}

export default ManagerReviews;
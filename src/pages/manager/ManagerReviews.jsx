
import { useCallback, useEffect, useState } from "react";
import { Star, MessageSquare, RefreshCw, AlertCircle } from "lucide-react";
import { getReviews } from "../../api/reviews";

function ManagerReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReviews = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getReviews();

      // Support either a plain array or Django REST Framework pagination.
      const data = response.data;
      const reviewList = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
          ? data.results
          : null;

      if (!reviewList) {
        throw new Error("The server returned an unexpected reviews response.");
      }

      setReviews(reviewList);
    } catch (err) {
      console.error("Failed to load manager reviews:", err);
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          err.message ||
          "Unable to load reviews. Please try again."
      );
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const sortedReviews = [...reviews].sort((a, b) => {
    const dateA = Date.parse(a.created_at) || 0;
    const dateB = Date.parse(b.created_at) || 0;
    return dateB - dateA;
  });

  const totalReviews = reviews.length;

  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce(
            (sum, review) => sum + (Number(review.rating) || 0),
            0
          ) / totalReviews
        ).toFixed(1)
      : "0.0";

  const fiveStarReviews = reviews.filter(
    (review) => Number(review.rating) === 5
  ).length;

  const formatDate = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating) => {
    const value = Math.min(5, Math.max(0, Number(rating) || 0));

    return (
      <span
        className="inline-flex items-center gap-1.5 whitespace-nowrap"
        aria-label={`${value} out of 5 stars`}
      >
        <span className="inline-flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={14}
              className={
                star <= value
                  ? "fill-yellow-400 text-yellow-500"
                  : "text-gray-300"
              }
              aria-hidden="true"
            />
          ))}
        </span>
        <span className="font-semibold text-gray-900">{value}/5</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Manager Reviews
          </h1>

          <p className="mt-2 text-gray-500">
            Review customer feedback for machinery and drawings.
          </p>
        </div>

        <button
          type="button"
          onClick={loadReviews}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1495CC] px-4 py-2.5 font-semibold text-white transition hover:bg-[#107eae] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
            aria-hidden="true"
          />
          {loading ? "Refreshing..." : "Refresh Reviews"}
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <AlertCircle
              size={21}
              className="mt-0.5 shrink-0 text-red-600"
              aria-hidden="true"
            />
            <div>
              <p className="font-semibold text-red-800">
                Could not load reviews
              </p>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={loadReviews}
            className="shrink-0 rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
          >
            Try again
          </button>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 border-l-4 border-l-[#1495CC] bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Reviews</p>
          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            {loading && reviews.length === 0 ? "—" : totalReviews}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Customer feedback received
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 border-l-4 border-l-yellow-400 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Average Rating</p>
          <h2 className="mt-2 flex items-center gap-2 text-3xl font-bold text-gray-900">
            <Star
              size={27}
              className="fill-yellow-400 text-yellow-500"
              aria-hidden="true"
            />
            {loading && reviews.length === 0 ? "—" : averageRating}
            <span className="text-sm font-normal text-gray-500">/ 5</span>
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Across all loaded reviews
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 border-l-4 border-l-green-500 bg-white p-5 shadow-sm sm:col-span-2 xl:col-span-1">
          <p className="text-sm font-medium text-gray-500">5-Star Reviews</p>
          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            {loading && reviews.length === 0 ? "—" : fiveStarReviews}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {totalReviews > 0
              ? `${Math.round((fiveStarReviews / totalReviews) * 100)}% of loaded reviews`
              : "No reviews available yet"}
          </p>
        </div>
      </div>

      {/* Reviews table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-1 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-gray-900">Customer Feedback</h2>
            <p className="mt-1 text-sm text-gray-500">
              Latest reviews appear first.
            </p>
          </div>

          {!loading && !error && (
            <span className="text-sm text-gray-500">
              {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
            </span>
          )}
        </div>

        {loading && reviews.length === 0 ? (
          <div className="flex items-center justify-center gap-3 px-5 py-12 text-gray-500">
            <RefreshCw size={20} className="animate-spin" aria-hidden="true" />
            Loading customer reviews...
          </div>
        ) : error && reviews.length === 0 ? (
          <div className="px-5 py-12 text-center text-gray-500">
            <MessageSquare
              size={34}
              className="mx-auto mb-3 text-gray-300"
              aria-hidden="true"
            />
            <p>Reviews could not be displayed.</p>
            <p className="mt-1 text-sm">Use Refresh Reviews to try again.</p>
          </div>
        ) : sortedReviews.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <MessageSquare
              size={38}
              className="mx-auto mb-3 text-gray-300"
              aria-hidden="true"
            />
            <h3 className="font-semibold text-gray-800">
              No customer reviews yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Reviews will appear here when they are returned by the reviews
              API.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-[#1495CC] text-white">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Rating
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Comment
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Machine
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Drawing
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {sortedReviews.map((review) => (
                  <tr
                    key={review.id}
                    className="transition-colors hover:bg-blue-50/40"
                  >
                    <td className="whitespace-nowrap px-4 py-4 align-top">
                      {renderStars(review.rating)}
                    </td>

                    <td className="max-w-sm whitespace-pre-wrap break-words px-4 py-4 text-gray-700">
                      {review.comment?.trim() || (
                        <span className="italic text-gray-400">
                          No comment provided
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4 text-gray-700">
                      {review.machine_name ||
                        (review.machine ? `Machine #${review.machine}` : "—")}
                    </td>

                    <td className="px-4 py-4 text-gray-700">
                      {review.drawing_title ||
                        (review.drawing ? `Drawing #${review.drawing}` : "—")}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                      {formatDate(review.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManagerReviews;

import { useEffect, useState } from "react";
import {
  Search,
  Star,
  MessageSquare,
  Trash2,
} from "lucide-react";

import {
  getReviews,
  deleteReview,
} from "../../api/reviews";

export default function ArchitectReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    rating: "",
  });

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const { data } = await getReviews();

      // Architectural side focuses on drawing reviews
      const drawingReviews = data.filter(
        (review) => review.drawing
      );

      setReviews(drawingReviews);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this review?"
    );

    if (!confirmed) return;

    try {
      await deleteReview(id);
      loadReviews();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredReviews = reviews.filter(
    (review) => {
      const matchesSearch =
        !filters.search ||
        review.comment
          ?.toLowerCase()
          .includes(
            filters.search.toLowerCase()
          );

      const matchesRating =
        !filters.rating ||
        String(review.rating) ===
          filters.rating;

      return (
        matchesSearch &&
        matchesRating
      );
    }
  );

  const averageRating =
    filteredReviews.length > 0
      ? (
          filteredReviews.reduce(
            (sum, review) =>
              sum + review.rating,
            0
          ) / filteredReviews.length
        ).toFixed(1)
      : 0;

  if (loading) {
    return (
      <div className="p-6">
        Loading reviews...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Drawing Reviews
        </h1>

        <p className="text-gray-500 mt-2">
          Customer feedback for
          architectural drawings.
        </p>
      </div>

      {/* Summary */}
      <div className="grid md:grid-cols-3 gap-5">
        <div className="bg-white border rounded-xl p-5">
          <p className="text-gray-500">
            Total Reviews
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {filteredReviews.length}
          </h2>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <p className="text-gray-500">
            Average Rating
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {averageRating}
          </h2>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <p className="text-gray-500">
            Five Star Reviews
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {
              filteredReviews.filter(
                (r) => r.rating === 5
              ).length
            }
          </h2>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border rounded-xl p-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-3 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search comments..."
              value={filters.search}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  search: e.target.value,
                })
              }
              className="w-full border rounded-lg pl-10 p-2"
            />
          </div>

          <select
            value={filters.rating}
            onChange={(e) =>
              setFilters({
                ...filters,
                rating: e.target.value,
              })
            }
            className="border rounded-lg p-2"
          >
            <option value="">
              All Ratings
            </option>

            <option value="5">
              5 Stars
            </option>

            <option value="4">
              4 Stars
            </option>

            <option value="3">
              3 Stars
            </option>

            <option value="2">
              2 Stars
            </option>

            <option value="1">
              1 Star
            </option>
          </select>
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {filteredReviews.map(
          (review) => (
            <div
              key={review.id}
              className="bg-white border rounded-xl p-5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Star
                      size={18}
                      className="text-yellow-500"
                    />

                    <span className="font-semibold">
                      {review.rating}/5
                    </span>
                  </div>

                  <p className="text-sm text-gray-500">
                    Review ID #
                    {review.id}
                  </p>
                </div>

                <button
                  onClick={() =>
                    handleDelete(
                      review.id
                    )
                  }
                  className="p-2 border rounded-lg hover:bg-red-50"
                >
                  <Trash2
                    size={16}
                  />
                </button>
              </div>

              <div className="mt-4 flex items-start gap-3">
                <MessageSquare
                  size={18}
                  className="text-gray-500 mt-1"
                />

                <p>
                  {review.comment ||
                    "No comment provided."}
                </p>
              </div>

              <div className="mt-4 text-sm text-gray-500">
                Created:{" "}
                {new Date(
                  review.created_at
                ).toLocaleDateString()}
              </div>
            </div>
          )
        )}

        {!filteredReviews.length && (
          <div className="bg-white border rounded-xl p-10 text-center text-gray-500">
            No reviews found.
          </div>
        )}
      </div>
    </div>
  );
}
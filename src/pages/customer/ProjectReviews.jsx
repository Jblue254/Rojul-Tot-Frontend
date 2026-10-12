
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

export default function ProjectReviews() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadReviews = async () => {
    try {
      const response = await api.get("/projects/reviews/");
      const all = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];

      setReviews(
        all.filter((review) => String(review.project) === String(id))
      );
    } catch (err) {
      console.error(err);
      setError("Could not load reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await api.post("/projects/reviews/", {
        project: Number(id),
        rating: Number(rating),
        comment,
      });

      setComment("");
      setRating("5");
      setSuccess("Your review was submitted successfully.");
      await loadReviews();
    } catch (err) {
      console.error(err);
      const data = err.response?.data;
      setError(
        data?.detail ||
          data?.project?.[0] ||
          data?.rating?.[0] ||
          "Could not submit your review. Please check your input and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <button
        onClick={() => navigate("/customer/projects")}
        className="mb-5 text-[#1495CC] font-medium"
      >
        ← Back to My Projects
      </button>

      <h1 className="text-3xl font-bold mb-2">Project Reviews</h1>
      <p className="text-gray-500 mb-6">
        Share feedback about your project.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow p-6 mb-8 space-y-4"
      >
        <h2 className="text-xl font-bold">Write a Review</h2>

        <div>
          <label className="block font-medium mb-2" htmlFor="rating">
            Rating
          </label>
          <select
            id="rating"
            value={rating}
            onChange={(event) => setRating(event.target.value)}
            className="w-full border rounded-xl p-3"
          >
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Very Good</option>
            <option value="3">3 - Good</option>
            <option value="2">2 - Fair</option>
            <option value="1">1 - Poor</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-2" htmlFor="comment">
            Comment
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            rows={4}
            placeholder="Share your experience..."
            className="w-full border rounded-xl p-3"
          />
        </div>

        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-700">{success}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="bg-[#1495CC] hover:bg-[#0E7AA8] disabled:opacity-60 text-white px-6 py-3 rounded-xl font-semibold"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>

      <h2 className="text-xl font-bold mb-4">Reviews for This Project</h2>

      {loading ? (
        <p>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-6 text-gray-500">
          No reviews have been submitted for this project yet.
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl shadow p-5"
            >
              <p className="text-yellow-500 text-lg">
                {"★".repeat(Number(review.rating))}
                {"☆".repeat(5 - Number(review.rating))}
              </p>
              <p className="text-gray-700 my-3">
                {review.comment || "No comment provided."}
              </p>
              <p className="text-sm text-gray-500">
                {review.created_at
                  ? new Date(review.created_at).toLocaleDateString()
                  : ""}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

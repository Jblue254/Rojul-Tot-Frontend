
import { useCallback, useEffect, useState } from "react";
import {
  Star,
  Pencil,
  Trash2,
  MessageSquare,
  RefreshCw,
  AlertCircle,
  X,
} from "lucide-react";

import {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../../api/reviews";

import { getMachines } from "../../api/machinery";
import { getDrawings } from "../../api/drawings";

const extractList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
};

const getErrorMessage = (error) => {
  const data = error?.response?.data;

  if (typeof data === "string") return data;

  if (data && typeof data === "object") {
    return Object.entries(data)
      .map(([field, value]) => {
        const message = Array.isArray(value)
          ? value.join(", ")
          : typeof value === "string"
            ? value
            : JSON.stringify(value);

        return `${field}: ${message}`;
      })
      .join("\n");
  }

  return error?.message || "Something went wrong. Please try again.";
};

function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [machines, setMachines] = useState([]);
  const [drawings, setDrawings] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    reviewType: "machine",
    machine: "",
    drawing: "",
    rating: 5,
    comment: "",
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [reviewsRes, machinesRes, drawingsRes] =
        await Promise.all([
          getReviews(),
          getMachines(),
          getDrawings(),
        ]);

      setReviews(extractList(reviewsRes.data));
      setMachines(extractList(machinesRes.data));
      setDrawings(extractList(drawingsRes.data));
    } catch (err) {
      console.error("Failed to load customer review data:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      setError(
        `Unable to load reviews or review options. ${getErrorMessage(err)}`
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const resetForm = () => {
    setEditingId(null);

    setFormData({
      reviewType: "machine",
      machine: "",
      drawing: "",
      rating: 5,
      comment: "",
    });
  };

  const handleTypeChange = (type) => {
    setFormData((previous) => ({
      ...previous,
      reviewType: type,
      machine: "",
      drawing: "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (
      formData.reviewType === "machine" &&
      !formData.machine
    ) {
      setError("Please select a machine to review.");
      return;
    }

    if (
      formData.reviewType === "drawing" &&
      !formData.drawing
    ) {
      setError("Please select a drawing to review.");
      return;
    }

    const payload = {
      rating: Number(formData.rating),
      comment: formData.comment.trim(),
      ...(formData.reviewType === "machine"
        ? { machine: Number(formData.machine) }
        : { drawing: Number(formData.drawing) }),
    };

    setSaving(true);

    try {
      let response;

      if (editingId !== null) {
        response = await updateReview(editingId, payload);
      } else {
        response = await createReview(payload);
      }

      console.log("Review API response:", {
        status: response.status,
        data: response.data,
      });

      const wasEditing = editingId !== null;

      resetForm();
      setSuccess(
        wasEditing
          ? "Your review was updated successfully."
          : "Your review was submitted successfully."
      );

      await loadData();
    } catch (err) {
      console.error("Review submission failed:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      setError(
        `Failed to save your review. ${getErrorMessage(err)}`
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (review) => {
    setError("");
    setSuccess("");
    setEditingId(review.id);

    setFormData({
      reviewType: review.machine ? "machine" : "drawing",
      machine: review.machine ? String(review.machine) : "",
      drawing: review.drawing ? String(review.drawing) : "",
      rating: Number(review.rating) || 5,
      comment: review.comment || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");
    setDeletingId(id);

    try {
      await deleteReview(id);

      setReviews((previous) =>
        previous.filter((review) => review.id !== id)
      );

      if (editingId === id) {
        resetForm();
      }

      setSuccess("Your review was deleted successfully.");
    } catch (err) {
      console.error("Review deletion failed:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      setError(
        `Failed to delete your review. ${getErrorMessage(err)}`
      );
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (value) => {
    if (!value) return "Date unavailable";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating) => {
    const value = Math.min(
      5,
      Math.max(0, Number(rating) || 0)
    );

    return (
      <div
        className="flex items-center gap-1"
        aria-label={`${value} out of 5 stars`}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={18}
            className={
              star <= value
                ? "fill-yellow-400 text-yellow-500"
                : "text-gray-300"
            }
            aria-hidden="true"
          />
        ))}
        <span className="ml-1 text-sm font-medium text-gray-600">
          {value}/5
        </span>
      </div>
    );
  };

  const getReviewTitle = (review) => {
    if (review.machine_name) return review.machine_name;

    if (review.drawing_title) return review.drawing_title;

    if (review.machine) return `Machine #${review.machine}`;

    if (review.drawing) return `Drawing #${review.drawing}`;

    return "Customer Review";
  };

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            My Reviews
          </h1>

          <p className="mt-2 text-gray-500">
            Share your experience with machinery and construction drawings.
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
            aria-hidden="true"
          />
          Refresh
        </button>
      </div>

      {/* Feedback messages */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800"
        >
          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0"
            aria-hidden="true"
          />

          <div className="min-w-0 flex-1">
            <p className="font-semibold">Something went wrong</p>
            <p className="mt-1 whitespace-pre-wrap break-words text-sm">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
            className="rounded-lg p-1 hover:bg-red-100"
          >
            <X size={17} aria-hidden="true" />
          </button>
        </div>
      )}

      {success && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800"
        >
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{success}</p>
          </div>

          <button
            type="button"
            onClick={() => setSuccess("")}
            aria-label="Dismiss message"
            className="rounded-lg p-1 hover:bg-green-100"
          >
            <X size={17} aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Review form */}
      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {editingId !== null ? "Update Review" : "Write a Review"}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Select an item, rate your experience, and leave a comment.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Review type */}
          <div>
            <label
              htmlFor="reviewType"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Review Type
            </label>

            <select
              id="reviewType"
              value={formData.reviewType}
              onChange={(event) =>
                handleTypeChange(event.target.value)
              }
              className="w-full rounded-xl border border-gray-200 bg-white p-3 outline-none transition focus:border-[#1495CC] focus:ring-2 focus:ring-[#1495CC]/20"
            >
              <option value="machine">Machinery Review</option>
              <option value="drawing">Drawing Review</option>
            </select>
          </div>

          {/* Machine selection */}
          {formData.reviewType === "machine" && (
            <div>
              <label
                htmlFor="reviewMachine"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Select Machine
              </label>

              <select
                id="reviewMachine"
                value={formData.machine}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    machine: event.target.value,
                  }))
                }
                required
                className="w-full rounded-xl border border-gray-200 bg-white p-3 outline-none transition focus:border-[#1495CC] focus:ring-2 focus:ring-[#1495CC]/20"
              >
                <option value="">Choose a machine</option>

                {machines.map((machine) => (
                  <option key={machine.id} value={machine.id}>
                    {machine.name}
                  </option>
                ))}
              </select>

              {machines.length === 0 && !loading && (
                <p className="mt-2 text-sm text-amber-700">
                  No machines are available. Refresh or check the machinery API.
                </p>
              )}
            </div>
          )}

          {/* Drawing selection */}
          {formData.reviewType === "drawing" && (
            <div>
              <label
                htmlFor="reviewDrawing"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Select Drawing
              </label>

              <select
                id="reviewDrawing"
                value={formData.drawing}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    drawing: event.target.value,
                  }))
                }
                required
                className="w-full rounded-xl border border-gray-200 bg-white p-3 outline-none transition focus:border-[#1495CC] focus:ring-2 focus:ring-[#1495CC]/20"
              >
                <option value="">Choose a drawing</option>

                {drawings.map((drawing) => (
                  <option key={drawing.id} value={drawing.id}>
                    {drawing.title}
                  </option>
                ))}
              </select>

              {drawings.length === 0 && !loading && (
                <p className="mt-2 text-sm text-amber-700">
                  No drawings are available. Refresh or check the drawings API.
                </p>
              )}
            </div>
          )}

          {/* Rating */}
          <div>
            <label
              htmlFor="reviewRating"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Your Rating
            </label>

            <select
              id="reviewRating"
              value={formData.rating}
              onChange={(event) =>
                setFormData((previous) => ({
                  ...previous,
                  rating: Number(event.target.value),
                }))
              }
              className="w-full rounded-xl border border-gray-200 bg-white p-3 outline-none transition focus:border-[#1495CC] focus:ring-2 focus:ring-[#1495CC]/20"
            >
              <option value={5}>★★★★★ — Excellent (5)</option>
              <option value={4}>★★★★☆ — Very Good (4)</option>
              <option value={3}>★★★☆☆ — Good (3)</option>
              <option value={2}>★★☆☆☆ — Fair (2)</option>
              <option value={1}>★☆☆☆☆ — Poor (1)</option>
            </select>
          </div>

          {/* Comment */}
          <div>
            <label
              htmlFor="reviewComment"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Comment
              <span className="ml-1 font-normal text-gray-400">
                (optional)
              </span>
            </label>

            <textarea
              id="reviewComment"
              rows={4}
              maxLength={2000}
              placeholder="Tell us about your experience..."
              value={formData.comment}
              onChange={(event) =>
                setFormData((previous) => ({
                  ...previous,
                  comment: event.target.value,
                }))
              }
              className="w-full resize-y rounded-xl border border-gray-200 p-3 outline-none transition focus:border-[#1495CC] focus:ring-2 focus:ring-[#1495CC]/20"
            />

            <p className="mt-1 text-right text-xs text-gray-400">
              {formData.comment.length}/2000
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving || loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1495CC] px-6 py-3 font-semibold text-white transition hover:bg-[#107eae] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving && (
                <RefreshCw
                  size={17}
                  className="animate-spin"
                  aria-hidden="true"
                />
              )}

              {saving
                ? "Saving..."
                : editingId !== null
                  ? "Update Review"
                  : "Submit Review"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                disabled={saving}
                onClick={resetForm}
                className="rounded-xl bg-gray-100 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-200 disabled:opacity-60"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Customer's reviews */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            My Submitted Reviews
          </h2>

          {!loading && (
            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-[#1495CC]">
              {reviews.length}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 rounded-2xl bg-white p-10 text-gray-500 shadow-sm">
            <RefreshCw
              size={20}
              className="animate-spin"
              aria-hidden="true"
            />
            Loading your reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <MessageSquare
              size={40}
              className="mx-auto mb-3 text-gray-300"
              aria-hidden="true"
            />

            <h3 className="font-semibold text-gray-800">
              No reviews found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Submit your first review using the form above.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="break-words text-lg font-bold text-gray-900">
                        {getReviewTitle(review)}
                      </h3>

                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#1495CC]">
                        {review.machine
                          ? "Machinery"
                          : review.drawing
                            ? "Drawing"
                            : "General"}
                      </span>
                    </div>

                    <div className="mt-2">
                      {renderStars(review.rating)}
                    </div>

                    <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">
                      {review.comment?.trim() || "No comment provided."}
                    </p>

                    <p className="mt-4 text-xs text-gray-500">
                      Submitted {formatDate(review.created_at)}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(review)}
                      disabled={saving || deletingId !== null}
                      aria-label="Edit review"
                      title="Edit review"
                      className="rounded-lg bg-gray-100 p-2.5 text-gray-700 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Pencil size={17} aria-hidden="true" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(review.id)}
                      disabled={
                        saving ||
                        deletingId !== null ||
                        editingId === review.id
                      }
                      aria-label="Delete review"
                      title="Delete review"
                      className="rounded-lg bg-red-50 p-2.5 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === review.id ? (
                        <RefreshCw
                          size={17}
                          className="animate-spin"
                          aria-hidden="true"
                        />
                      ) : (
                        <Trash2 size={17} aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default CustomerReviews;

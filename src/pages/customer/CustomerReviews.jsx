import { useEffect, useState } from "react";
import {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../../api/reviews";

import { getMachines } from "../../api/machinery";
import { getDrawings } from "../../api/drawings";

import { Star, Pencil, Trash2 } from "lucide-react";

function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [machines, setMachines] = useState([]);
  const [drawings, setDrawings] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    reviewType: "machine",
    machine: "",
    drawing: "",
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [reviewsRes, machinesRes, drawingsRes] =
        await Promise.all([
          getReviews(),
          getMachines(),
          getDrawings(),
        ]);

      setReviews(reviewsRes.data);
      setMachines(machinesRes.data);
      setDrawings(drawingsRes.data);
    } catch (error) {
      console.error(error);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        rating: formData.rating,
        comment: formData.comment,
      };

      if (formData.reviewType === "machine") {
        payload.machine = formData.machine;
      } else {
        payload.drawing = formData.drawing;
      }

      if (editingId) {
        await updateReview(editingId, payload);
      } else {
        await createReview(payload);
      }

      resetForm();
      loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to save review");
    }
  };

  const handleEdit = (review) => {
    setEditingId(review.id);

    setFormData({
      reviewType: review.machine
        ? "machine"
        : "drawing",

      machine: review.machine || "",
      drawing: review.drawing || "",

      rating: review.rating,
      comment: review.comment || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete review?")) return;

    try {
      await deleteReview(id);
      loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to delete review");
    }
  };

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold">
          My Reviews
        </h1>

        <p className="text-gray-500 mt-2">
          Review machines and drawings you
          have used or purchased.
        </p>
      </div>

      {/* Form */}

      <div className="bg-white p-6 rounded-2xl shadow">

        <h2 className="text-xl font-semibold mb-4">
          {editingId
            ? "Update Review"
            : "Create Review"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* Review Type */}

          <select
            value={formData.reviewType}
            onChange={(e) =>
              setFormData({
                ...formData,
                reviewType: e.target.value,
                machine: "",
                drawing: "",
              })
            }
            className="w-full border p-3 rounded-xl"
          >
            <option value="machine">
              Machine Review
            </option>

            <option value="drawing">
              Drawing Review
            </option>
          </select>

          {/* Machine */}

          {formData.reviewType === "machine" && (
            <select
              value={formData.machine}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  machine: e.target.value,
                })
              }
              required
              className="w-full border p-3 rounded-xl"
            >
              <option value="">
                Select Machine
              </option>

              {machines.map((machine) => (
                <option
                  key={machine.id}
                  value={machine.id}
                >
                  {machine.name}
                </option>
              ))}
            </select>
          )}

          {/* Drawing */}

          {formData.reviewType === "drawing" && (
            <select
              value={formData.drawing}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  drawing: e.target.value,
                })
              }
              required
              className="w-full border p-3 rounded-xl"
            >
              <option value="">
                Select Drawing
              </option>

              {drawings.map((drawing) => (
                <option
                  key={drawing.id}
                  value={drawing.id}
                >
                  {drawing.title}
                </option>
              ))}
            </select>
          )}

          {/* Rating */}

          <select
            value={formData.rating}
            onChange={(e) =>
              setFormData({
                ...formData,
                rating: Number(
                  e.target.value
                ),
              })
            }
            className="w-full border p-3 rounded-xl"
          >
            <option value={5}>
              ⭐⭐⭐⭐⭐ (5)
            </option>

            <option value={4}>
              ⭐⭐⭐⭐ (4)
            </option>

            <option value={3}>
              ⭐⭐⭐ (3)
            </option>

            <option value={2}>
              ⭐⭐ (2)
            </option>

            <option value={1}>
              ⭐ (1)
            </option>
          </select>

          {/* Comment */}

          <textarea
            rows="4"
            placeholder="Write your review..."
            value={formData.comment}
            onChange={(e) =>
              setFormData({
                ...formData,
                comment: e.target.value,
              })
            }
            className="w-full border p-3 rounded-xl"
          />

          <div className="flex gap-3">

            <button
              type="submit"
              className="bg-[#1495CC] text-white px-6 py-3 rounded-xl"
            >
              {editingId
                ? "Update Review"
                : "Submit Review"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 px-6 py-3 rounded-xl"
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </div>

      {/* Reviews List */}

      <div className="grid gap-4">

        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white p-6 rounded-2xl shadow"
          >

            <div className="flex justify-between">

              <div>

                <h3 className="font-bold text-lg">

                  {review.machine_name ||
                    review.drawing_title ||
                    "Review"}

                </h3>

                <div className="flex mt-2">

                  {[...Array(review.rating)].map(
                    (_, index) => (
                      <Star
                        key={index}
                        size={18}
                        fill="gold"
                      />
                    )
                  )}

                </div>

                <p className="mt-3 text-gray-700">
                  {review.comment}
                </p>

                <p className="text-xs text-gray-500 mt-3">
                  {new Date(
                    review.created_at
                  ).toLocaleDateString()}
                </p>

              </div>

              <div className="flex gap-2">

                <button
                  onClick={() =>
                    handleEdit(review)
                  }
                  className="bg-gray-100 p-2 rounded-lg"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() =>
                    handleDelete(review.id)
                  }
                  className="bg-red-100 text-red-600 p-2 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>

              </div>

            </div>

          </div>
        ))}

        {reviews.length === 0 && (
          <div className="bg-white rounded-2xl p-8 shadow text-center text-gray-500">
            No reviews found.
          </div>
        )}

      </div>

    </div>
  );
}

export default CustomerReviews;
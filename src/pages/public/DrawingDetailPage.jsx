import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { getDrawing } from "../../api/drawings";

function DrawingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [drawing, setDrawing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDrawing();
  }, [id]);

  const loadDrawing = async () => {
    try {
      const response = await getDrawing(id);
      setDrawing(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const token = localStorage.getItem("access");

    if (!token) {
      navigate("/login");
      return;
    }

    if (drawing?.drawing_file) {
      window.open(drawing.drawing_file, "_blank");
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading drawing...</p>
      </div>
    );
  }

  if (!drawing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Drawing not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Back Button */}

        <Link
          to="/drawings"
          className="inline-flex items-center gap-2 text-[#1495CC] font-medium mb-8"
        >
          <ArrowLeft size={18} />
          Back to Drawings
        </Link>

        <div className="bg-white rounded-3xl overflow-hidden shadow-lg">

          {/* Image */}

          <div className="h-[500px] overflow-hidden">
            <img
              src={
                drawing.preview_image ||
                "https://via.placeholder.com/1200x700?text=Drawing"
              }
              alt={drawing.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}

          <div className="p-8 lg:p-12">

            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">

              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle(
                  drawing.status
                )}`}
              >
                {drawing.status.replace("_", " ")}
              </span>

              <span className="text-3xl font-bold text-[#1495CC]">
                KSh {Number(drawing.price).toLocaleString()}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              {drawing.title}
            </h1>

            {drawing.category_name && (
              <div className="mb-6">
                <span className="bg-blue-50 text-[#1495CC] px-4 py-2 rounded-lg text-sm font-medium">
                  {drawing.category_name}
                </span>
              </div>
            )}

            <div className="prose max-w-none text-gray-600 leading-8 mb-10">
              <p>{drawing.description}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">

              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Status
                </h3>

                <p>{drawing.status.replace("_", " ")}</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Price
                </h3>

                <p>KSh {Number(drawing.price).toLocaleString()}</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Category
                </h3>

                <p>{drawing.category_name || "General"}</p>
              </div>

            </div>

            {drawing.status === "AVAILABLE" ? (
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-[#1495CC] text-white font-semibold hover:bg-[#1185B5] transition"
              >
                <Download size={20} />
                Download Drawing
              </button>
            ) : (
              <button
                disabled
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gray-300 text-gray-600 font-semibold cursor-not-allowed"
              >
                <FileText size={20} />
                Not Available
              </button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default DrawingDetailPage;
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import {
  getDrawings,
  getOrders,
  getCart,
  addToCart,
  deleteCartItem,
  checkoutCart,
  getDrawingCategories,
  downloadDrawing,
} from "../../api/customerDrawings";
import {
  initiatePayment,
  getPaymentStatus,
} from "../../api/payments";

const BASE_URL = "https://rojul-tot.onrender.com";

function getListData(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

function getImageUrl(imagePath) {
  if (!imagePath || typeof imagePath !== "string") return "";

  try {
    // Works with both absolute URLs and relative Django media paths.
    return new URL(imagePath, `${BASE_URL}/`).href;
  } catch {
    return "";
  }
}

function Drawings() {
  const [drawings, setDrawings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [expandedOrders, setExpandedOrders] = useState({});
  const [loadingDrawings, setLoadingDrawings] = useState(true);
  const [loadingCustomerData, setLoadingCustomerData] = useState(true);
  const [busyDrawingId, setBusyDrawingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // M-Pesa payment state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        const response = await getDrawingCategories();

        if (!cancelled) {
          setCategories(getListData(response.data));
        }
      } catch (error) {
        console.error(
          "Failed to load drawing categories:",
          error.response?.data || error
        );
      }
    }

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadDrawings() {
      try {
        setLoadingDrawings(true);
        setErrorMessage("");

        const response = await getDrawings({
          search: search.trim(),
          category,
        });

        if (!cancelled) {
          setDrawings(getListData(response.data));
        }
      } catch (error) {
        console.error(
          "Failed to load drawings:",
          error.response?.data || error
        );

        if (!cancelled) {
          setDrawings([]);
          setErrorMessage(
            "Unable to load drawings. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingDrawings(false);
        }
      }
    }

    loadDrawings();

    return () => {
      cancelled = true;
    };
  }, [search, category]);

  const loadCustomerData = async () => {
    setLoadingCustomerData(true);

    try {
      const [ordersResponse, cartResponse] = await Promise.all([
        getOrders(),
        getCart(),
      ]);

      setOrders(getListData(ordersResponse.data));
      setCart(cartResponse.data);
    } catch (error) {
      console.error(
        "Failed to load cart or orders:",
        error.response?.data || error
      );
    } finally {
      setLoadingCustomerData(false);
    }
  };

  useEffect(() => {
    loadCustomerData();
  }, []);

  // Poll payment status every 4 seconds (up to 90 attempts = 6 minutes)
  useEffect(() => {
    if (
      !paymentId ||
      paymentStatus === "SUCCESS" ||
      paymentStatus === "FAILED"
    ) {
      return;
    }

    let attempts = 0;
    let timer;
    let cancelled = false;

    const checkStatus = async () => {
      try {
        const response = await getPaymentStatus(paymentId);
        const result = response.data;

        if (cancelled) return;

        setPaymentStatus(result.status);

        if (result.status === "SUCCESS") {
          setPaymentMessage(
            `Payment successful. Receipt: ${
              result.receipt_number || "confirmed"
            }`
          );
          await loadCustomerData();
          return;
        }

        if (result.status === "FAILED") {
          setPaymentMessage(
            result.result_description ||
              "Payment failed. Please try again."
          );
          return;
        }

        setPaymentMessage(
          "Waiting for M-Pesa confirmation. Complete the prompt on your phone."
        );
      } catch (error) {
        console.error("Payment status check failed:", error);
      }

      if (cancelled) return;

      attempts += 1;

      if (attempts < 90) {
        timer = setTimeout(checkStatus, 4000);
      } else {
        setPaymentMessage(
          "Still awaiting confirmation. Check My Orders before retrying payment."
        );
      }
    };

    timer = setTimeout(checkStatus, 4000);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [paymentId, paymentStatus]);

  const handleAddToCart = async (drawing) => {
    try {
      setBusyDrawingId(drawing.id);

      await addToCart({
        drawing: drawing.id,
        quantity: 1,
      });

      await loadCustomerData();
      alert("Drawing added to cart.");
    } catch (error) {
      console.error(
        "Failed to add drawing to cart:",
        error.response?.data || error
      );
      alert(
        error.response?.data?.detail ||
          "Failed to add drawing to cart."
      );
    } finally {
      setBusyDrawingId(null);
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    try {
      setActionLoading(true);

      await deleteCartItem(itemId);
      await loadCustomerData();
    } catch (error) {
      console.error(
        "Failed to remove cart item:",
        error.response?.data || error
      );
      alert("Failed to remove item from cart.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckout = async () => {
    try {
      setActionLoading(true);
      setPaymentMessage("");

      const response = await checkoutCart();
      const order = response.data;

      await loadCustomerData();

      setSelectedOrderId(order.id);
      setPaymentId(null); // reset any previous payment attempt
      setPaymentStatus("READY");
      setPaymentMessage(
        `Order #${order.id} created. Enter your M-Pesa number to pay KES ${order.total_amount}.`
      );
    } catch (error) {
      console.error(
        "Checkout failed:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.detail ||
          "Checkout failed. Please try again."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleMpesaPayment = async (orderId) => {
    if (!phoneNumber.trim()) {
      setPaymentMessage("Enter your M-Pesa phone number.");
      return;
    }

    try {
      setPaymentLoading(true);
      setPaymentMessage("");

      const response = await initiatePayment({
        payment_type: "order",
        item_id: orderId,
        phone_number: phoneNumber.trim(),
      });

      setPaymentId(response.data.payment_id);
      setPaymentStatus(response.data.status);
      setPaymentMessage(
        response.data.message ||
          "Check your phone and complete the M-Pesa prompt."
      );
    } catch (error) {
      console.error(
        "M-Pesa initiation failed:",
        error.response?.data || error
      );

      setPaymentMessage(
        error.response?.data?.detail ||
          "Could not start M-Pesa payment. Please try again."
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrders((previous) => ({
      ...previous,
      [orderId]: !previous[orderId],
    }));
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "PAID":
        return "bg-green-100 text-green-700";
      case "PROCESSING":
        return "bg-blue-100 text-blue-700";
      case "COMPLETED":
        return "bg-purple-100 text-purple-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Architectural Drawings
        </h1>
        <p className="mt-2 text-gray-600">
          Browse architectural plans and add drawings to your cart.
        </p>
      </div>

      {/* Search and category filters */}
      <div className="grid gap-4 md:grid-cols-2">
        <input
          type="text"
          placeholder="Search drawings..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-[#1495CC]"
        />

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="rounded-xl border bg-white p-3 focus:outline-none focus:ring-2 focus:ring-[#1495CC]"
        >
          <option value="">All Categories</option>

          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Drawings */}
      {loadingDrawings ? (
        <p className="py-8 text-center text-gray-500">
          Loading drawings...
        </p>
      ) : errorMessage ? (
        <div className="rounded-xl bg-red-50 p-6 text-center text-red-700">
          {errorMessage}
        </div>
      ) : drawings.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center shadow">
          No drawings found.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {drawings.map((drawing) => {
            const imageUrl = getImageUrl(drawing.preview_image);

            return (
              <div
                key={drawing.id}
                className="flex flex-col justify-between overflow-hidden rounded-2xl bg-white shadow"
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={drawing.title || "Architectural drawing"}
                    loading="lazy"
                    onError={(event) => {
                      console.error(
                        "Drawing image failed to load:",
                        {
                          imagePath: drawing.preview_image,
                          imageUrl: event.currentTarget.src,
                        }
                      );

                      event.currentTarget.style.display = "none";
                      event.currentTarget.nextElementSibling?.classList.remove(
                        "hidden"
                      );
                    }}
                    className="h-56 w-full object-cover"
                  />
                ) : null}

                <div
                  className={`flex h-56 w-full items-center justify-center bg-gray-100 text-sm text-gray-500 ${
                    imageUrl ? "hidden" : ""
                  }`}
                >
                  Preview image unavailable
                </div>

                <div className="flex flex-grow flex-col justify-between p-6">
                  <div>
                    <h2 className="text-xl font-bold">
                      {drawing.title}
                    </h2>

                    <p className="mt-2 text-sm text-gray-600">
                      {drawing.description}
                    </p>

                    <p className="mt-3 font-semibold text-gray-800">
                      KES {drawing.price}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={busyDrawingId === drawing.id}
                    onClick={() => handleAddToCart(drawing)}
                    className="mt-4 w-full rounded-xl bg-[#1495CC] py-2 font-medium text-white transition-colors hover:bg-[#1182b3] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {busyDrawingId === drawing.id
                      ? "Adding..."
                      : "Add To Cart"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Shopping cart */}
      <section>
        <h2 className="mb-4 text-2xl font-bold">My Cart</h2>

        <div className="rounded-2xl bg-white p-6 shadow">
          {loadingCustomerData && !cart ? (
            <p className="text-gray-500">Loading cart...</p>
          ) : !cart?.items?.length ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <>
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 border-b pb-4"
                  >
                    <div>
                      <h3 className="font-semibold">
                        {item.drawing_title}
                      </h3>

                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>

                      <p className="font-medium text-gray-700">
                        KES {item.subtotal}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-60"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t pt-4">
                <h3 className="text-xl font-bold">
                  Total: KES {cart.total_amount}
                </h3>

                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleCheckout}
                  className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-60"
                >
                  {actionLoading ? "Processing..." : "Checkout"}
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* M-Pesa payment */}
      {selectedOrderId && paymentStatus !== "SUCCESS" && (
        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-2xl font-bold">Pay with M-Pesa</h2>

          <p className="mt-2 text-gray-600">
            Order #{selectedOrderId}
          </p>

          <label className="mt-4 block text-sm font-medium">
            M-Pesa phone number
          </label>

          <input
            type="tel"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
            placeholder="0712345678"
            className="mt-2 w-full rounded-xl border p-3"
          />

          <button
            type="button"
            disabled={paymentLoading || paymentStatus === "PENDING"}
            onClick={() => handleMpesaPayment(selectedOrderId)}
            className="mt-4 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-60"
          >
            {paymentLoading
              ? "Starting payment..."
              : paymentStatus === "PENDING"
                ? "Waiting for payment..."
                : "Send M-Pesa Prompt"}
          </button>

          {paymentMessage && (
            <p className="mt-4 text-sm text-gray-700" role="status">
              {paymentMessage}
            </p>
          )}
        </section>
      )}

      {/* Customer orders */}
      <section>
        <h2 className="mb-4 text-2xl font-bold">My Orders</h2>

        {loadingCustomerData && orders.length === 0 ? (
          <p className="text-gray-500">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow">
            No orders found.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isExpanded = expandedOrders[order.id];

              return (
                <div
                  key={order.id}
                  className="rounded-2xl bg-white p-6 shadow"
                >
                  <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <h3 className="text-lg font-bold">
                        Order #{order.id}
                      </h3>

                      <p className="text-sm text-gray-500">
                        Date:{" "}
                        {order.created_at
                          ? new Date(
                              order.created_at
                            ).toLocaleDateString()
                          : "Not available"}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <p className="font-bold text-gray-800">
                        KES {order.total_amount}
                      </p>

                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>

                      {order.status === "PENDING" && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOrderId(order.id);
                            setPaymentStatus("READY");
                            setPaymentId(null);
                            setPaymentMessage(
                              `Pay for order #${order.id} using M-Pesa.`
                            );
                          }}
                          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                        >
                          Pay Now
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => toggleOrderExpand(order.id)}
                        className="ml-2 flex items-center gap-1 text-sm font-medium text-[#1495CC] hover:underline"
                      >
                        {isExpanded ? "Hide Items" : "View Items"}

                        {isExpanded ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Purchased Drawings
                      </p>

                      {order.items?.length ? (
                        order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-4 rounded-xl bg-gray-50 p-3 text-sm"
                          >
                            <span className="font-medium text-gray-700">
                              {item.drawing_title}
                            </span>

                            <div className="flex flex-wrap items-center justify-end gap-4">
                              <span className="text-gray-500">
                                Qty: {item.quantity} × KES{" "}
                                {item.unit_price}
                              </span>

                              <button
                                type="button"
                                onClick={() => downloadDrawing(item.id)}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                              >
                                Download File
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">
                          No item details available.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default Drawings;
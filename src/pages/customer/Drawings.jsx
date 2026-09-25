import { useEffect, useState } from "react";
import {
  getDrawings,
  getOrders,
  getCart,
  addToCart,
  deleteCartItem,
  checkoutCart,
} from "../../api/customerDrawings";

function Drawings() {
  const [drawings, setDrawings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    loadData();
  }, [search, category]);

  const loadData = async () => {
    try {
      const drawingsResponse = await getDrawings({
        search,
        category,
      });

      const ordersResponse = await getOrders();
      const cartResponse = await getCart();

      setCart(cartResponse.data);
      setDrawings(drawingsResponse.data);
      setOrders(ordersResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToCart = async (drawing) => {
    try {
      await addToCart({
        drawing: drawing.id,
        quantity: 1,
      });

      alert("Added to cart");
      await loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to add to cart");
    }
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
      </div>

      {/* Filters */}
      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Search drawings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-3 rounded-xl"
        />

        <input
          type="number"
          placeholder="Category ID"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-3 rounded-xl"
        />
      </div>

      {/* Drawings */}
      <div className="grid md:grid-cols-3 gap-6">
        {drawings.map((drawing) => (
          <div
            key={drawing.id}
            className="bg-white rounded-2xl shadow overflow-hidden flex flex-col justify-between"
          >
            {drawing.preview_image && (
              <img
                src={drawing.preview_image}
                alt={drawing.title}
                className="w-full h-56 object-cover"
              />
            )}

            <div className="p-6 flex flex-col justify-between flex-grow">
              <div>
                <h2 className="text-xl font-bold">
                  {drawing.title}
                </h2>

                <p className="text-gray-600 mt-2 text-sm">
                  {drawing.description}
                </p>

                <p className="font-semibold mt-3 text-gray-800">
                  KES {drawing.price}
                </p>
              </div>

              <button
                onClick={() => handleAddToCart(drawing)}
                className="mt-4 w-full bg-[#1495CC] text-white py-2 rounded-xl font-medium hover:bg-[#1182b3] transition-colors"
              >
                Add To Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {drawings.length === 0 && (
        <div className="bg-white p-8 rounded-2xl shadow text-center">
          No drawings found.
        </div>
      )}

      {/* My Cart */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          My Cart
        </h2>

        <div className="bg-white rounded-2xl shadow p-6">
          {!cart?.items?.length ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <>
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border-b pb-4"
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
                      onClick={async () => {
                        try {
                          await deleteCartItem(item.id);
                          loadData();
                        } catch (error) {
                          console.error(error);
                        }
                      }}
                      className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-between items-center pt-4 border-t">
                <h3 className="text-xl font-bold">
                  Total: KES {cart.total_amount}
                </h3>

                <button
                  onClick={async () => {
                    try {
                      await checkoutCart();
                      alert("Order created successfully");
                      loadData();
                    } catch (error) {
                      console.error(error);
                      alert("Failed to checkout cart");
                    }
                  }}
                  className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                >
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Orders */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          My Orders
        </h2>

        <div className="overflow-x-auto bg-white rounded-2xl shadow">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Order ID</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-t">
                    <td className="p-4 font-medium">
                      #{order.id}
                    </td>

                    <td className="p-4">
                      KES {order.total_amount}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="p-4 text-gray-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Drawings;
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getCart, updateCart, removeCartItem } from "../../api/auth";
import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchCart = async () => {
      try {
        const data = await getCart(token);
        if (data.status === "success") {
          const normalizedCart = data.cart.map((item) => ({
            ...item,
            quantity: Number(item.quantity),
            price: Number(item.price),
            subtotal: Number(item.subtotal),
          }));
          setCart(normalizedCart);
          setCartTotal(Number(data.total));
        } else {
          setCart([]);
          setCartTotal(0);
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [token, navigate]);

  const handleQuantityChange = async (cart_id, change) => {
    try {
      const res = await updateCart(cart_id, change, token);
      if (res.status === "success") {
        setCart((prev) =>
          prev.map((item) =>
            item.cart_id === cart_id
              ? {
                  ...item,
                  quantity: item.quantity + change,
                  subtotal: (item.quantity + change) * item.price,
                }
              : item
          )
        );
        setCartTotal((prev) =>
          prev + change * cart.find((i) => i.cart_id === cart_id).price
        );
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const handleRemoveItem = async (cart_id) => {
    try {
      const res = await removeCartItem(cart_id, token);
      if (res.status === "success") {
        const itemToRemove = cart.find((i) => i.cart_id === cart_id);
        setCart((prev) => prev.filter((i) => i.cart_id !== cart_id));
        setCartTotal((prev) => prev - itemToRemove.subtotal);
      }
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  if (loading)
    return (
      <div className="text-center py-10 text-gray-500 text-lg">
        Loading your cart...
      </div>
    );

  if (cart.length === 0)
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">
          Your cart is empty
        </h2>
        <button
          onClick={() => navigate("/")}
          className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition"
        >
          Shop Now
        </button>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* LEFT SECTION — Cart Items */}
      <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
          Shopping Cart
        </h1>

        {cart.map((item) => (
          <div
            key={item.cart_id}
            className="flex flex-col sm:flex-row items-center sm:items-start justify-between border-b py-4 gap-4"
          >
            {/* Product Image */}
            <img
              src={item.image || "/placeholder.jpg"}
              alt={item.name}
              className="w-28 h-28 object-cover rounded-md border"
            />

            {/* Product Details */}
            <div className="flex-1 sm:ml-4 w-full">
              <h3 className="text-lg font-semibold text-gray-800">
                {item.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Price: <span className="font-medium">${item.price}</span>
              </p>

              {/* Quantity controls */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center border rounded-md px-2 py-1">
                  <button
                    onClick={() => handleQuantityChange(item.cart_id, -1)}
                    className="p-1 hover:text-indigo-600"
                  >
                    <FiMinus />
                  </button>
                  <span className="px-3">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.cart_id, 1)}
                    className="p-1 hover:text-indigo-600"
                  >
                    <FiPlus />
                  </button>
                </div>

                <button
                  onClick={() => handleRemoveItem(item.cart_id)}
                  className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  <FiTrash2 /> Remove
                </button>
              </div>
            </div>

            {/* Subtotal */}
            <div className="text-right min-w-[80px]">
              <p className="text-md font-semibold text-gray-800">
                ${item.subtotal.toFixed(2)}
              </p>
            </div>
          </div>
        ))}

        <div className="text-right mt-4 font-semibold text-lg text-gray-800">
          Subtotal ({cart.length} items):{" "}
          <span className="text-indigo-600">${cartTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* RIGHT SECTION — Order Summary */}
      <div className="bg-white rounded-lg shadow p-6 h-fit sticky top-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">$5.00</span>
        </div>
        <div className="flex justify-between border-t pt-2 font-semibold text-gray-800">
          <span>Total</span>
          <span>${(cartTotal + 5).toFixed(2)}</span>
        </div>

        <button className="w-full mt-5 bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600 transition">
          Proceed to Checkout
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full mt-3 border border-indigo-500 text-indigo-500 py-2 rounded hover:bg-indigo-50 transition"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default Cart;

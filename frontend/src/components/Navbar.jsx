import React, { useState } from "react";
import { ShoppingCart, User, Search, MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { FaCaretDown } from "react-icons/fa";
import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { getCart, updateCart, removeCartItem } from "../api/cart";

const Navbar = ({ location }) => {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  const categories = [
    "Electronics",
    "Clothing",
    "Books",
    "Home & Kitchen",
    "Sports",
    "Toys",
  ];

  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch cart
  const handleCartClick = async () => {
    setShowCartDropdown(!showCartDropdown);
    if (!showCartDropdown && token) {
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
        console.error(err);
        setCart([]);
        setCartTotal(0);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Increment / Decrement
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
      } else {
        console.log(res.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Remove item
  const handleRemoveItem = async (cart_id) => {
    try {
      const res = await removeCartItem(cart_id, token);
      if (res.status === "success") {
        const itemToRemove = cart.find((i) => i.cart_id === cart_id);
        setCart((prev) => prev.filter((i) => i.cart_id !== cart_id));
        setCartTotal((prev) => prev - itemToRemove.subtotal);
      } else {
        console.log(res.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className="bg-white shadow-md px-6 py-2 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 cursor-pointer transition-transform duration-300 hover:scale-95"
        >
          <img src="/favicon.ico" alt="Logo" className="w-7 h-7" />
          <span className="text-indigo-800 font-semibold text-2xl hover:text-indigo-500">
            GoCart
          </span>
        </Link>

        {/* Search + Categories */}
        <div className="flex flex-1 max-w-2xl mx-6 items-center gap-0">
          <div className="relative">
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="flex items-center border border-gray-300 rounded-l px-4 py-2 bg-white hover:bg-gray-100 transition"
            >
              All Categories
              <FaCaretDown
                className={`ml-1 transition-transform ${
                  showCategoryDropdown ? "rotate-180" : ""
                }`}
              />
            </button>
            {showCategoryDropdown && (
              <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-gray-300 rounded shadow z-50">
                {categories.map((cat) => (
                  <div
                    key={cat}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      console.log(`Selected category: ${cat}`);
                      setShowCategoryDropdown(false);
                    }}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-r-md rounded-l-md px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 placeholder-gray-700"
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 bg-indigo-500 rounded-r-md px-2 py-2 cursor-pointer flex items-center justify-center hover:bg-indigo-600 transition-colors">
              <Search className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Right: Cart + Account */}
        <div className="flex items-center gap-4">
          {/* Cart */}
          <div className="relative">
            <div
              onClick={handleCartClick}
              className="flex items-center gap-1 cursor-pointer px-3 py-2 rounded-md hover:bg-indigo-50 transition transform hover:scale-105 shadow-sm"
            >
              <ShoppingCart className="w-6 h-6 text-indigo-600" />
              <span className="font-medium text-gray-700 hover:text-indigo-600 transition-colors">
                My Carts
              </span>
              <FaCaretDown
                className={`ml-1 w-3.5 h-3.5 text-gray-600 ${
                  showCartDropdown ? "rotate-180" : ""
                }`}
              />
            </div>

            {showCartDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <div className="flex flex-col max-h-60 overflow-y-auto">
                  {cart.length > 0 ? (
                    cart.map((item) => (
                      <div
                        key={item.cart_id}
                        className="px-4 py-2 border-b last:border-none"
                      >
                        {/* Product Name & Quantity */}
                        <span className="text-sm block font-bold hover:underline cursor-pointer">
                          {item.name} 
                        </span>

                        <div className="flex items-center gap-2 mt-1">
                          {/* Decrement */}
                          <FiMinus
                            className="w-4 h-4 hover:text-indigo-600 cursor-pointer"
                            onClick={() => handleQuantityChange(item.cart_id, -1)}
                          />

                          {/* Quantity */}
                          <span className="px-2">{item.quantity}</span>

                          {/* Increment */}
                          <FiPlus
                            className="w-4 h-4 hover:text-indigo-600 cursor-pointer"
                            onClick={() => handleQuantityChange(item.cart_id, 1)}
                          />

                          {/* Delete */}
                          <FiTrash2
                            className="w-4 h-4 text-red-500 hover:text-red-700 cursor-pointer"
                            onClick={() => handleRemoveItem(item.cart_id)}
                          />
                        </div>

                        {/* Price on next line */}
                        <span className="text-sm block mt-1">
                          ${item.subtotal}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      Cart is empty
                    </div>
                  )}
                  {cart.length > 0 && (
                    <div className="px-4 py-2 font-semibold flex justify-between border-t">
                      <span>Total:</span>
                      <span>${cartTotal}</span>
                    </div>
                  )}
                </div>

                {/* Go to Cart button */}
                {cart.length > 0 && (
                  <Link
                    to="/cart"
                    className="block text-center bg-indigo-500 text-white font-medium py-2 rounded-b-md hover:bg-indigo-600 transition-colors"
                  >
                    Go to Cart
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Account */}
          <div className="relative">
            {user ? (
              <>
                <div
                  className="flex items-center gap-1 cursor-pointer px-3 py-2 rounded-md hover:bg-indigo-50 transition transform hover:scale-105 shadow-sm"
                  onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                >
                  <User className="w-6 h-6 text-indigo-600" />
                  <span className="font-medium text-gray-700 hover:text-indigo-600">
                    {user.name}
                  </span>
                  <FaCaretDown
                    className={`ml-1 w-3.5 h-3.5 text-gray-600 ${
                      showAccountDropdown ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {showAccountDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <button
                      className="px-4 py-2 hover:bg-gray-100 text-left"
                      onClick={() => console.log("My Orders")}
                    >
                      My Orders
                    </button>
                    <button
                      className="px-4 py-2 hover:bg-gray-100 text-left"
                      onClick={() => console.log("My Profile")}
                    >
                      My Profile
                    </button>
                    <button
                      className="px-4 py-2 hover:bg-gray-100 text-left"
                      onClick={() => console.log("Settings")}
                    >
                      Settings
                    </button>
                    <button
                      className="px-4 py-2 hover:bg-gray-100 text-left"
                      onClick={() => console.log("Wishlist")}
                    >
                      Wishlist
                    </button>
                    <button
                      className="px-4 py-2 hover:bg-gray-100 text-left text-red-500"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Bottom Navbar */}
      <div className="bg-indigo-50 px-6 py-1 flex items-center justify-between">
        <ul className="flex items-center gap-6 overflow-x-auto">
        {[
          "Home",
          "Electronics",
          "Books",
          "Best Sellers",
          "Clothing",
          "Home & Kitchen",
          "Toys",
        ].map((item) =>
          item === "Home" ? (
            // ✅ Wrap "Home" inside a Link to navigate to "/"
            <li
              key={item}
              className="cursor-pointer text-gray-700 hover:text-indigo-600 font-medium whitespace-nowrap text-sm"
            >
              <Link to="/" className="block w-full h-full">
                {item}
              </Link>
            </li>
          ) : (
            // Other menu items (can later be turned into links too)
            <li
              key={item}
              className="cursor-pointer text-gray-700 hover:text-indigo-600 font-medium whitespace-nowrap text-sm"
            >
              <Link to="/electronics" className="block w-full h-full">
                {item}
              </Link>
            </li>
          )
        )}
      </ul>

        {/* Address */}
        <div className="flex items-center gap-1 cursor-pointer px-2 py-1 rounded-md hover:bg-indigo-100 transition transform hover:scale-105 shadow-sm">
          <MapPin className="w-5 h-5 text-indigo-600" />
          <div className="flex items-center gap-1 text-gray-700 font-medium hover:text-indigo-600">
            {location ? (
              <div className="flex flex-col leading-tight">
                <span className="text-sm">{location.city}</span>
                <span className="text-[11px] text-gray-500">
                  {location.state_district}
                </span>
              </div>
            ) : (
              <span className="text-sm">Add Address</span>
            )}
            <FaCaretDown className="w-3.5 h-3.5 text-gray-600 mt-[1px]" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;

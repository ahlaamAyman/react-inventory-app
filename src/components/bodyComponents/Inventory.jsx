import axios from "axios";
import React, { useEffect, useState } from "react";
import { loadData, saveData } from "../../utils/localStorageUtils";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    title: "",
    brand: "",
    stock: "",
    price: "",
    thumbnail: "",
  });

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const fetchInventory = async () => {
    try {
      const response = await axios.get(
        "https://dummyjson.com/products?limit=12",
      );
      const data = response.data.products;
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();

    const productToSave = {
      id: Date.now(),
      title: newItem.title,
      brand: newItem.brand,
      stock: Number(newItem.stock) || 0,
      price: Number(newItem.price) || 0,
      thumbnail: newItem.thumbnail || "https://via.placeholder.com/80",
    };

    setProducts([productToSave, ...products]);
    setIsModalOpen(false);
    setNewItem({ title: "", brand: "", stock: "", price: "", thumbnail: "" });
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  useEffect(() => {
    const savedProducts = loadData("my-inventory");
    if (savedProducts) {
      setProducts(savedProducts);
      setLoading(false);
    } else {
      fetchInventory();
    }
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      saveData("my-inventory", products);
    }
  }, [products]);

  if (loading) {
    return (
      <div className="p-10 text-center text-xl font-bold text-blue-600">
        Loading Inventory...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
        <div className="relative max-w-md mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-12 pr-4 py-3 bg-white border-0 rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-blue-50 transition-all duration-200 text-gray-900"
          />
          {searchTerm && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <button
                onClick={() => setSearchTerm("")}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Inventory Management (Live API)
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-sm"
        >
          <svg
            className="-ml-1 mr-2 h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add New Product
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <tbody className="divide-y divide-gray-100 ">
            <tr className="bg-gray-50 border-b border-gray-100">
              <td className="px-6 py-4 font-semibold text-gray-600">Product</td>
              <td className="px-6 py-4 font-semibold text-gray-600">Brand</td>
              <td className="px-6 py-4 font-semibold text-gray-600">Stock</td>
              <td className="px-6 py-4 font-semibold text-gray-600">Price</td>
              <td className="px-6 py-4 font-semibold text-gray-600">Actions</td>
            </tr>
            {filteredProducts.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No products match your search.
                </td>
              </tr>
            ) : (
              filteredProducts.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-10 h-10 rounded shadow-sm object-cover mx-4"
                    />
                    <span className="text-gray-800 font-medium">
                      {item.title}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-500">{item.brand}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${item.stock > 10 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {item.stock} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700 font-bold">
                    ${Number(item.price || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDeleteProduct(item.id)}
                      className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md transition-colors duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.093A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.907L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">
                Add New Product
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl "
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-md  mb-1">
                  Product Title
                </label>
                <input
                  required
                  type="text"
                  name="title"
                  value={newItem.title}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="e.g. iphone 15"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-md  mb-1">
                  Brand
                </label>
                <input
                  required
                  type="text"
                  name="brand"
                  value={newItem.brand}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Apple, Samsung, etc."
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-md  mb-1">
                  Stock
                </label>
                <input
                  required
                  type="number"
                  name="stock"
                  value={newItem.stock}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="999"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-md  mb-1">
                  Price ($)
                </label>
                <input
                  required
                  type="number"
                  name="price"
                  value={newItem.price}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="0.00"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;

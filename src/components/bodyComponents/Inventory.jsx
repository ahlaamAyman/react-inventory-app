import axios from "axios";
import { useEffect, useState } from "react";
import { loadData, saveData } from "../../utils/localStorageUtils";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";
import { exportToExcel } from "../../utils/exportUtils";
import ProductCart from "./ProductCart";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, addProduct, updateProduct, deleteProduct, setProducts } from '../../store/inventorySlice';


const Inventory = () => {
  const { darkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [newItem, setNewItem] = useState({
    title: "",
    brand: "",
    stock: "",
    price: "",
    thumbnail: "",
  });

  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.inventory);

  const filteredProducts = items.filter((item) => {
  if (selectedCategory === "All") return true;

  return item.category?.toLowerCase() === selectedCategory.toLowerCase();
});

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

const categories = ["All", ...new Set(items.map(p => p.category))];


  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();

    if (isEditing) {
      // Update existing product
      const updatedProduct = {
        ...items.find(p => p.id === editingId),
        title: newItem.title,
        brand: newItem.brand,
        stock: Number(newItem.stock) || 0,
        price: Number(newItem.price) || 0,
        thumbnail: newItem.thumbnail || "https://via.placeholder.com/80",
      };
      dispatch(updateProduct(updatedProduct));
      toast.success('Product updated successfully', {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        }
      });
    } else {
      // Add new product
      const productToSave = {
        id: Date.now(),
        title: newItem.title,
        brand: newItem.brand,
        stock: Number(newItem.stock) || 0,
        price: Number(newItem.price) || 0,
        thumbnail: newItem.thumbnail || "https://via.placeholder.com/80",
      };
      dispatch(addProduct(productToSave));
      toast.success('Product added successfully');
    }

    setIsModalOpen(false);
    setIsEditing(false);
    setEditingId(null);
    setNewItem({ title: "", brand: "", stock: "", price: "", thumbnail: "" });
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteProduct(id));
      toast.error('Product removed successfully');
    }
  };

  const handleEditProduct = (product) => {
    setIsEditing(true);
    setEditingId(product.id);
    setNewItem({
      title: product.title,
      brand: product.brand,
      stock: product.stock,
      price: product.price,
      thumbnail: product.thumbnail,
    });
    setIsModalOpen(true);
  };



  const handleImageUpload = (e)=>{
    const file = e.target.files[0];
    if(file){
      const reader = new FileReader();
      reader.onloadend = ()=>{
        setNewItem(prev=>({...prev, thumbnail: reader.result}));
      }
      reader.readAsDataURL(file);
    }

  }





  const handleExport = () => {
    const dataToExport = items.map(({ id, title, brand, stock, price }) => ({ id, title, brand, stock, price }));
    exportToExcel(dataToExport, "My-Inventory-Report");
  }

  useEffect(() => {
    const savedProducts = localStorage.getItem("my-inventory");
    if (savedProducts) {
      dispatch(setProducts(JSON.parse(savedProducts)));
      setLoading(false);
    } else {
      dispatch(fetchProducts()).then(() => setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    if (items.length > 0) {
      saveData("my-inventory", items);
    }
  }, [items]);


  if (loading) {
    return (
      <div className="p-10 text-center text-xl font-bold text-blue-600">
        Loading Inventory...
      </div>
    );
  }

  return (
 <div className="space-y-8 p-4">
    <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 transition-all">
      <div className="flex flex-col items-center space-y-6">
        
        <div className="relative w-full max-w-2xl group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <i className="fas fa-search text-indigo-400 group-focus-within:text-indigo-600 transition-colors" />
          </div>
          
          <input
            type="text"
            placeholder="Search products by name or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-14 pr-12 py-4 bg-gray-50 dark:bg-slate-700/50 border-none rounded-2xl shadow-inner focus:ring-2 focus:ring-indigo-500 transition-all duration-300 text-gray-900 dark:text-white dark:placeholder-gray-500 text-lg"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-indigo-600 transition-colors"
            >
              <i className="fas fa-times-circle text-lg" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-3 justify-center">
          {['All', 'Beauty', 'Fragrances', 'Furniture', 'Other'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 transform active:scale-95
                ${selectedCategory === cat 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 dark:shadow-none scale-105' 
                  : 'bg-white dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600 border border-gray-100 dark:border-gray-600'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
          {searchTerm && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <button
                onClick={() => setSearchTerm("")}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label="Clear search"
              >
                <i className="fas fa-times text-sm" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Inventory Management (Live API)
        </h2>

        <button onClick={handleExport} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 shadow-sm">
          <i className="fas fa-file-excel mr-2" aria-hidden="true" />
          Export Data
        </button>






        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-sm"
        >
          <i className="fas fa-plus -ml-1 mr-2" aria-hidden="true" />
          Add New Product
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.length===0?(
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No products match your search.</p>
            </div>
          ):(
            filteredProducts.map((item) => (
              <ProductCart
                key={item.id} 
                product={item} 
                onEdit={handleEditProduct} 
                onDelete={handleDeleteProduct} 
              />
            ))
          )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                {isEditing ? "Edit Product" : "Add New Product"}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setIsEditing(false);
                  setEditingId(null);
                  setNewItem({ title: "", brand: "", stock: "", price: "", thumbnail: "" });
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl "
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-md  mb-1 dark:text-gray-300">
                  Product Title
                </label>
                <input
                  required
                  type="text"
                  name="title"
                  value={newItem.title}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  placeholder="e.g. iphone 15"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-md  mb-1 dark:text-gray-300">
                  Brand
                </label>
                <input
                  required
                  type="text"
                  name="brand"
                  value={newItem.brand}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  placeholder="Apple, Samsung, etc."
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-md  mb-1 dark:text-gray-300">
                  Stock
                </label>
                <input
                  required
                  type="number"
                  name="stock"
                  value={newItem.stock}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  placeholder="999"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-md  mb-1 dark:text-gray-300">
                  Price ($)
                </label>
                <input
                  required
                  type="number"
                  name="price"
                  value={newItem.price}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  placeholder="0.00"
                />
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-md  mb-1 dark:text-gray-300">Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4  file:rounded-xl file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                    />
                  {newItem.thumbnail && (
                    <img src={newItem.thumbnail} alt="Preview" className="w-24 h-24 object-cover rounded-xl border border-indigo-500 p-1" />
                  )}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsEditing(false);
                    setEditingId(null);
                    setNewItem({ title: "", brand: "", stock: "", price: "", thumbnail: "" });
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition"
                >
                  {isEditing ? "Update Product" : "Save Product"}
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

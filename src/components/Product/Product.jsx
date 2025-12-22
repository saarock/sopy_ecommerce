import React, { useEffect, useState } from 'react';
import './Product.css';
import { FaCheckCircle, FaTimesCircle, FaTrashAlt, FaToggleOn, FaToggleOff, FaEdit } from 'react-icons/fa';
import { X, Tag, AlertTriangle } from 'lucide-react';
import ProductDetailModal from './ProductDetailModal';
import { categoryOptions } from '../../constant';

const Product = ({ product, handleDeleteProduct, handleToggleAvailability, user, handleFormSubmit, addToCart, setTotalItem }) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    category: product.category,
    lowStockThreshold: product.lowStockThreshold || 5,
    id: product._id
  });

  const [isDetailModalOpen, setDetailModalOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };


  useEffect(() => {
    setProductDetails({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      lowStockThreshold: product.lowStockThreshold || 5,
      id: product._id,
    })
  }, [product]);

  const handleForm = (e) => {
    setEditModalOpen(false);
    handleFormSubmit(productDetails);
  };

  const handleProductClick = () => {
    setDetailModalOpen(true);  // Open the product detail modal
  };

  return (
    <>
      <tr className="group hover:bg-[#f8fafc] transition-all duration-300 cursor-pointer" onClick={handleProductClick}>
        <td className="px-8 py-5">
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-500 group-hover:scale-110">
            <img
              className="w-full h-full object-cover"
              src={product?.imageUrl || 'https://via.placeholder.com/80'}
              alt={product.name}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </td>
        <td className="px-8 py-5">
          <div className="space-y-1">
            <p className="text-sm font-black text-[#101540]">{product.name}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{product.category}</p>
          </div>
        </td>
        <td className="px-8 py-5 text-center">
          {product.isAvailable ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black uppercase tracking-tighter shadow-sm">
              <FaCheckCircle className="w-3 h-3" /> Available
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-black uppercase tracking-tighter shadow-sm">
              <FaTimesCircle className="w-3 h-3" /> Unavailable
            </span>
          )}
        </td>
        <td className="px-8 py-5">
          <p className="text-sm font-medium text-gray-500 line-clamp-1 max-w-[200px]">
            {product.description || 'No description provided.'}
          </p>
        </td>
        <td className="px-8 py-5">
          <p className="text-sm font-black text-[#101540]">RS {product.price.toLocaleString()}</p>
        </td>
        <td className="px-8 py-5">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-black ${product.stock <= (product.lowStockThreshold || 5) ? 'text-rose-600 animate-pulse' : 'text-gray-900'}`}>
              {product.stock}
            </span>
            <div className="w-16 bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${product.stock <= (product.lowStockThreshold || 5) ? 'bg-rose-500' : 'bg-[#101540]'}`}
                style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}
              />
            </div>
          </div>
        </td>
        {user?.role === 'admin' ? (
          <td className="px-8 py-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-end gap-2">
              <button
                className={`p-2.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md ${product.isAvailable ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                onClick={() => handleToggleAvailability(product._id)}
                title={product.isAvailable ? 'Disable' : 'Enable'}
              >
                {product.isAvailable ? <FaToggleOff className='size-5' /> : <FaToggleOn className='size-5' />}
              </button>

              <button
                className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all duration-300 shadow-sm hover:shadow-md"
                onClick={() => setEditModalOpen(true)}
                title="Edit"
              >
                <FaEdit className='size-5' />
              </button>

              <button
                className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-all duration-300 shadow-sm hover:shadow-md"
                onClick={() => handleDeleteProduct(product._id)}
                title="Delete"
              >
                <FaTrashAlt className='size-4' />
              </button>
            </div>
          </td>
        ) : (
          <td className="px-8 py-5" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={(e) => addToCart(e, user._id, product._id, product.name, product.price, product.imageUrl)} className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={product.stock}
                onChange={(e) => setTotalItem(e.target.value)}
                className="w-16 px-3 py-2 bg-gray-50 border-2 border-transparent rounded-lg focus:border-[#101540] focus:bg-white text-sm font-bold transition-all"
                placeholder="Qty"
                defaultValue={1}
                required
              />
              <button type="submit" className="px-4 py-2 bg-[#101540] text-white text-xs font-black uppercase tracking-widest rounded-lg hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50" disabled={product.stock === 0}>
                {product.stock === 0 ? 'Out' : 'Add'}
              </button>
            </form>
          </td>
        )}
      </tr>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#101540]/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-300">
            <div className="bg-[#101540] p-8 text-white flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black">Edit Asset</h2>
                <p className="text-xs font-bold text-white/50 uppercase tracking-widest mt-1">Ref ID: {product._id.slice(-6)}</p>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleForm} className="p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Asset Name</label>
                    <input
                      name="name"
                      value={productDetails.name}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-[#101540] focus:bg-white transition-all font-bold text-[#101540]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Department</label>
                    <select
                      name="category"
                      value={productDetails.category}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-[#101540] focus:bg-white transition-all font-bold text-[#101540]"
                    >
                      {categoryOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Resource Description</label>
                  <textarea
                    name="description"
                    value={productDetails.description}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-[#101540] focus:bg-white transition-all font-bold text-[#101540] min-h-[100px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Value (RS)</label>
                    <input
                      type="number"
                      name="price"
                      value={productDetails.price}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-[#101540] focus:bg-white transition-all font-bold text-[#101540]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">In Stock</label>
                    <input
                      type="number"
                      name="stock"
                      value={productDetails.stock}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-[#101540] focus:bg-white transition-all font-bold text-[#101540]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Alert Floor</label>
                    <input
                      type="number"
                      name="lowStockThreshold"
                      value={productDetails.lowStockThreshold}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-orange-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all font-bold text-orange-700"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="flex-1 px-8 py-4 bg-gray-100 rounded-2xl font-black text-gray-400 hover:bg-gray-200 transition-all"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="flex-1 px-8 py-4 bg-[#101540] text-white rounded-2xl font-black shadow-lg shadow-[#101540]/30 hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  Update Records
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ProductDetailModal
        product={product}
        isOpen={isDetailModalOpen}
        onClose={() => setDetailModalOpen(false)}
      />
    </>
  );
};

export default Product;

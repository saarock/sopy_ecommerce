import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { categoryOptions } from '../../constant';

const ProductDetailModal = ({ product, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-[#101540]/60 backdrop-blur-md p-4 animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-8 duration-500"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex flex-col md:flex-row min-h-[500px]">
                    {/* Product Image Side */}
                    <div className="md:w-5/12 relative bg-gray-950 flex items-center justify-center p-8 overflow-hidden group/modal">
                        <img
                            className="relative z-10 w-full aspect-square object-cover rounded-[2rem] shadow-2xl transition-all duration-700 group-hover/modal:scale-105"
                            src={product?.imageUrl || "https://via.placeholder.com/400"}
                            alt={product.name}
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-[#101540] to-black opacity-60" />
                        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
                    </div>

                    {/* Info Side */}
                    <div className="md:w-7/12 p-10 md:p-14 space-y-10 relative">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <span className="inline-block px-4 py-1.5 bg-[#101540]/5 text-[#101540] text-[10px] font-black uppercase tracking-widest rounded-full">
                                    {categoryOptions.find(opt => opt.value === product.category)?.label || product.category}
                                </span>
                                <h2 className="text-4xl font-black text-[#101540] tracking-tight">{product.name}</h2>
                            </div>
                            <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-2xl transition-all">
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Description</p>
                            <p className="text-gray-600 font-medium leading-relaxed italic border-l-4 border-[#101540]/10 pl-6">
                                "{product.description || "No official description recorded for this asset."}"
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Market Value</p>
                                <p className="text-2xl font-black text-[#101540]">RS {product.price?.toLocaleString()}</p>
                            </div>
                            <div className="p-6 bg-[#f8fafc] rounded-[2rem] border border-gray-100">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Inventory Unit</p>
                                <p className={`text-2xl font-black ${product.stock <= (product.lowStockThreshold || 5) ? 'text-rose-500' : 'text-emerald-500'}`}>
                                    {product.stock} Units
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 pt-4">
                            <div className="flex-1 p-6 bg-orange-50/50 rounded-[2rem] border border-orange-100">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="p-2 bg-orange-500 text-white rounded-lg">
                                        <AlertTriangle className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Alert Threshold</p>
                                        <p className="text-xl font-black text-orange-700">{product.lowStockThreshold || 5} Units</p>
                                    </div>
                                </div>
                            </div>

                            <div className={`flex-1 p-6 rounded-[2rem] border ${product.isAvailable ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className={`p-2 rounded-lg ${product.isAvailable ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                                        {product.isAvailable ? <FaCheckCircle className="w-4 h-4" /> : <FaTimesCircle className="w-4 h-4" />}
                                    </div>
                                    <div>
                                        <p className={`text-[10px] font-black uppercase tracking-widest ${product.isAvailable ? 'text-emerald-400' : 'text-rose-400'}`}>Status</p>
                                        <p className={`text-xl font-black ${product.isAvailable ? 'text-emerald-700' : 'text-rose-700'}`}>
                                            {product.isAvailable ? 'Available' : 'Restricted'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailModal;

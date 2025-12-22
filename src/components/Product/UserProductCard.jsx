import React, { useState } from 'react';
import { ShoppingCart, Eye, Star, ShieldCheck, Zap } from 'lucide-react';
import ProductDetailModal from './ProductDetailModal';

const UserProductCard = ({ product, user, addToCart, setTotalItem }) => {
    const [qty, setQty] = useState(1);
    const [isDetailModalOpen, setDetailModalOpen] = useState(false);
    const isLowStock = product.stock > 0 && product.stock <= (product.lowStockThreshold || 5);
    const isOutOfStock = product.stock === 0;

    const handleAddToCart = (e) => {
        e.preventDefault();
        setTotalItem(qty);
        addToCart(e, user?._id, product._id, product.name, product.price, product.imageUrl);
    };

    return (
        <>
            <div className="group relative bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(16,21,64,0.1)] transition-all duration-500 overflow-hidden flex flex-col h-full">
                {/* Badge Container */}
                <div className="absolute top-5 left-5 z-20 flex flex-col gap-2">
                    {isLowStock && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg animate-pulse">
                            <Zap className="w-3 h-3" /> Only {product.stock} Left
                        </div>
                    )}
                    {product.isAvailable ? (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                            <ShieldCheck className="w-3 h-3" /> Certified
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                            Restricted
                        </div>
                    )}
                </div>

                {/* Image Section */}
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 flex items-center justify-center group/img">
                    <img
                        src={product.imageUrl || 'https://via.placeholder.com/400'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101540]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Quick View Button */}
                    <button
                        onClick={() => setDetailModalOpen(true)}
                        className="absolute bottom-6 left-1/2 -translate-x-1/2 translate-y-12 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 flex items-center gap-2 px-6 py-3 bg-white text-[#101540] rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl transition-all duration-500 hover:bg-[#101540] hover:text-white"
                    >
                        <Eye className="w-4 h-4" /> Quick Look
                    </button>
                </div>

                {/* Content Section */}
                <div className="p-8 flex flex-col flex-1 gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                {product.category}
                            </span>
                            <div className="flex items-center text-amber-400">
                                <Star className="w-3 h-3 fill-current" />
                                <span className="text-[10px] font-black ml-1 text-gray-400">4.8</span>
                            </div>
                        </div>
                        <h3 className="text-xl font-black text-[#101540] tracking-tight hover:text-[#1a2060] transition-colors cursor-pointer" onClick={() => setDetailModalOpen(true)}>
                            {product.name}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2 font-medium leading-relaxed mt-2">
                            {product.description || 'Premium asset with specialized specifications.'}
                        </p>
                    </div>

                    <div className="mt-auto pt-4 flex flex-col gap-6">
                        <div className="flex items-baseline justify-between">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price Point</span>
                                <span className="text-2xl font-black text-[#101540]">RS {product.price?.toLocaleString()}</span>
                            </div>
                            {!isOutOfStock && (
                                <div className="flex items-center bg-gray-100 rounded-xl p-1 border border-gray-200 shadow-inner">
                                    <button
                                        onClick={() => setQty(Math.max(1, qty - 1))}
                                        className="w-8 h-8 flex items-center justify-center font-black text-gray-500 hover:text-[#101540] transition-colors"
                                    >-</button>
                                    <span className="w-8 text-center text-xs font-black text-[#101540]">{qty}</span>
                                    <button
                                        onClick={() => setQty(Math.min(product.stock, qty + 1))}
                                        className="w-8 h-8 flex items-center justify-center font-black text-gray-500 hover:text-[#101540] transition-colors"
                                    >+</button>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={isOutOfStock || !product.isAvailable}
                            className={`group/btn w-full py-4 rounded-2xl flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] shadow-xl transition-all duration-300 active:scale-95 ${isOutOfStock || !product.isAvailable
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed grayscale shadow-none'
                                : 'bg-gradient-to-br from-[#101540] to-[#1a2060] text-white shadow-[#101540]/20 hover:shadow-[#101540]/40 hover:-translate-y-1'
                                }`}
                        >
                            {isOutOfStock ? (
                                'Sold Out'
                            ) : !product.isAvailable ? (
                                'Restricted'
                            ) : (
                                <>
                                    <ShoppingCart className="w-4 h-4 transition-transform group-hover/btn:-rotate-12" />
                                    Reserve Now
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <ProductDetailModal
                product={product}
                isOpen={isDetailModalOpen}
                onClose={() => setDetailModalOpen(false)}
            />
        </>
    );
};

export default UserProductCard;

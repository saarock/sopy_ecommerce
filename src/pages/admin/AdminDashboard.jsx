import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Users, Package, ShoppingCart, IndianRupee, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import userService from '../../services/userService';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import './AdminPages.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await userService.getAdminStats();
                console.log(response.data);
                
                setStats(response.data);
            } catch (error) {
                toast.error(error.message);
                console.error("Failed to fetch admin stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <LoadingSpinner />
            </div>
        );
    }

    if (!stats) return null;

    const statCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: <Users className="w-6 h-6 text-white" />,
            sub: `${stats.activeUsers} active now`,
            color: "from-blue-600 to-indigo-700"
        },
        {
            title: 'Inventory Items',
            value: stats.totalProducts,
            icon: <Package className="w-6 h-6 text-white" />,
            sub: `${stats.outOfStockProducts} out of stock`,
            color: "from-purple-600 to-pink-700"
        },
        {
            title: 'Total Revenue',
            value: `RS ${stats.totalRevenue.toLocaleString()}`,
            icon: <IndianRupee className="w-6 h-6 text-white" />,
            sub: 'From completed orders',
            color: "from-emerald-600 to-teal-700"
        },
        {
            title: 'Pending Orders',
            value: stats.pendingBookings,
            icon: <Clock className="w-6 h-6 text-white" />,
            sub: 'Awaiting action',
            color: "from-amber-500 to-orange-600"
        },
        {
            title: 'Low Stock Alerts',
            value: stats.lowStockProducts,
            icon: <AlertTriangle className="w-6 h-6 text-white" />,
            sub: 'Reaching threshold',
            color: "from-rose-600 to-red-700"
        },
        {
            title: 'Categories',
            value: stats.categoryStats.length,
            icon: <TrendingUp className="w-6 h-6 text-white" />,
            sub: 'Active categories',
            color: "from-indigo-600 to-blue-700"
        },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-extrabold text-[#101540] tracking-tight">Admin Insights</h1>
                        <p className="text-gray-500 font-medium">Monitoring your inventory and operations in real-time.</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm font-bold text-[#101540]">Live System Tracking</span>
                    </div>
                </div>

                {/* Stats Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {statCards.map((card, index) => (
                        <div key={index} className="group relative bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:-translate-y-1 overflow-hidden">
                            <div className="flex items-center justify-between relative z-10">
                                <div className="space-y-2">
                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{card.title}</p>
                                    <h3 className="text-3xl font-black text-[#101540]">{card.value}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 group-hover:bg-[#101540] group-hover:text-white transition-colors duration-300">
                                            {card.sub}
                                        </span>
                                    </div>
                                </div>
                                <div className={`p-4 rounded-2xl bg-gradient-to-br ${card.color} shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                                    {card.icon}
                                </div>
                            </div>
                            {/* Background Pattern */}
                            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gray-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700" />
                        </div>
                    ))}
                </div>

                {/* Content Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Bookings - 2 columns on desktop */}
                    <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gradient-to-r from-gray-50/50 to-transparent">
                            <h2 className="text-xl font-black text-[#101540] flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <ShoppingCart className="w-5 h-5 text-blue-600" />
                                </div>
                                Recent Activity
                            </h2>
                            <button className="px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                                View History
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Customer</th>
                                        <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Product</th>
                                        <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Date</th>
                                        <th className="px-8 py-4 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Value</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {stats.recentBookings?.data?.map((booking) => (
                                        <tr key={booking._id} className="group hover:bg-[#f8fafc] transition-all duration-300">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-white shadow-sm flex items-center justify-center text-[#101540] font-bold overflow-hidden">
                                                        {booking.user?.avatar ? (
                                                            <img src={booking.user.avatar} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            booking.user?.fullName?.[0] || 'U'
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-[#101540] leading-none mb-1">{booking.user?.fullName || 'Anonymous'}</p>
                                                        <p className="text-xs text-gray-400 font-medium">@{booking.user?.userName || 'unknown'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="text-sm font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-lg group-hover:bg-white transition-colors">
                                                    {booking.product?.name || 'Item Removed'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <p className="text-sm font-bold text-gray-400">
                                                    {new Date(booking.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </p>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <span className="text-sm font-black text-[#101540]">RS {booking.price.toLocaleString()}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {stats.recentBookings.data.length === 0 && (
                            <div className="py-20 text-center space-y-4">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                                    <ShoppingCart className="w-8 h-8 text-gray-200" />
                                </div>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No active bookings</p>
                            </div>
                        )}
                    </div>

                    {/* Categories Breakdown */}
                    <div className="bg-[#101540] rounded-[2rem] shadow-xl p-8 text-white relative overflow-hidden">
                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/10 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-xl font-bold">Category Reach</h2>
                            </div>

                            <div className="space-y-6">
                                {stats.categoryStats.map((cat, index) => {
                                    const percentage = stats.totalProducts > 0 ? (cat.count / stats.totalProducts) * 100 : 0;
                                    return (
                                        <div key={index} className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-bold opacity-80">{cat._id}</span>
                                                <span className="font-black text-rose-400">{cat.count} items</span>
                                            </div>
                                            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                                                <div
                                                    className="bg-gradient-to-r from-blue-400 to-indigo-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(96,165,250,0.5)]"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                                {stats.categoryStats.length === 0 && (
                                    <p className="text-center py-10 opacity-40 font-bold uppercase tracking-widest text-xs">Awaiting Inventory Data</p>
                                )}
                            </div>

                            {/* <div className="pt-6 border-t border-white/10">
                                <div className="p-4 bg-white/5 rounded-2xl flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg">
                                        <TrendingUp className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold opacity-60">System Growth</p>
                                        <p className="text-lg font-black text-green-400">+12.5% vs Last Week</p>
                                    </div>
                                </div>
                            </div> */}
                        </div>

                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mb-32" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

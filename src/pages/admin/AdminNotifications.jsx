import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import userService from "../../services/userService"
import useUser from "../../hooks/useUser"
import notification from "../../services/notification"
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner"
import { Bell, Check, X, Shield, ChevronLeft, ChevronRight } from "lucide-react"

const AdminNotifications = () => {
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const notificationsPerPage = 7
    const { user } = useUser()
    const [isRead, setIsRead] = useState(false)
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoading(true)
                if (!user._id) {
                    toast.error("No user id found")
                    return
                }
                const data = await userService.getNotifications(currentPage, notificationsPerPage, isRead, user?._id)
                console.log("Admin notifications:", data)
                setNotifications(data.data.notifications)
                setTotalPages(data.data.totalPages)
            } catch (error) {
                toast.error(error.message || "Something went wrong")
                console.error("Failed to fetch notifications:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchNotifications()
    }, [currentPage, isRead, user, refresh])

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleIsReadChange = () => {
        setIsRead((prev) => !prev)
    }

    const handelMarkAsReadAndUnRead = async (notificationId, status) => {
        await notification.changeStatusOfMarkAsReadAndUnRead(notificationId, status)
        setRefresh((prev) => !prev)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#1a2250] to-[#2a3570] rounded-2xl shadow-xl p-6 md:p-8 mb-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                                <Shield className="w-6 h-6 md:w-8 md:h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">Admin Notifications</h1>
                                <p className="text-white/70 text-sm mt-1">Manage system and user notifications</p>
                            </div>
                        </div>

                        <button
                            onClick={() => handleIsReadChange()}
                            className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        >
                            {isRead ? "Show Unread" : "Show Read"}
                        </button>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <LoadingSpinner />
                        </div>
                    ) : notifications?.length > 0 ? (
                        <>
                            <ul className="divide-y divide-gray-100">
                                {[...notifications].reverse().map((notification) => (
                                    <li
                                        key={notification._id}
                                        className={`group transition-all duration-300 hover:bg-gray-50 ${notification.isRead ? "bg-white" : "bg-blue-50/50"
                                            }`}
                                    >
                                        <div className="p-4 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex items-start gap-4 flex-1 min-w-0">
                                                <div className="flex-shrink-0 mt-1">
                                                    {notification.isRead ? (
                                                        <div className="w-3 h-3 rounded-full bg-gray-300" />
                                                    ) : (
                                                        <div className="w-3 h-3 rounded-full bg-[#1a2250] animate-pulse" />
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <p
                                                        className={`text-sm md:text-base leading-relaxed break-words ${notification.isRead ? "text-gray-600" : "text-gray-900 font-medium"
                                                            }`}
                                                    >
                                                        {notification.message}
                                                    </p>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <p className="text-xs md:text-sm text-gray-400">
                                                            {new Date(notification.createdAt).toLocaleString()}
                                                        </p>
                                                        {notification.type && (
                                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                                                {notification.type}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex-shrink-0 sm:ml-4">
                                                {notification.isRead ? (
                                                    <button
                                                        onClick={() => handelMarkAsReadAndUnRead(notification._id, 0)}
                                                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-[#1a2250] text-gray-700 hover:text-white rounded-lg transition-all duration-300 text-sm font-medium whitespace-nowrap group-hover:shadow-md"
                                                    >
                                                        <X className="w-4 h-4" />
                                                        Mark as unread
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handelMarkAsReadAndUnRead(notification._id, 1)}
                                                        className="flex items-center gap-2 px-4 py-2 bg-[#1a2250] hover:bg-[#2a3570] text-white rounded-lg transition-all duration-300 text-sm font-medium whitespace-nowrap hover:shadow-lg hover:scale-105"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                        Mark as read
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            {/* Pagination Section */}
                            {totalPages > 1 && (
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-12 bg-gray-50 p-8 rounded-[2.5rem] border-t border-gray-100 transition-all duration-300">
                                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest hidden sm:block">
                                        Showing <span className="text-[#1a2250]">{notifications.length}</span> items
                                    </p>

                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="group flex items-center gap-3 px-8 py-4 bg-white text-[#1a2250] rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm ring-1 ring-gray-100 hover:bg-[#1a2250] hover:text-white disabled:opacity-30 disabled:grayscale transition-all duration-300"
                                        >
                                            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                                            Prev
                                        </button>

                                        <div className="flex items-center gap-2 px-6 py-4 bg-[#1a2250] rounded-2xl text-white font-black shadow-2xl shadow-[#1a2250]/20">
                                            <span className="opacity-40 text-[10px] uppercase tracking-widest mr-1">Page</span>
                                            <span className="text-sm">{currentPage}</span>
                                            <span className="opacity-20 font-medium mx-1">/</span>
                                            <span className="text-sm">{totalPages}</span>
                                        </div>

                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="group flex items-center gap-3 px-8 py-4 bg-white text-[#1a2250] rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm ring-1 ring-gray-100 hover:bg-[#1a2250] hover:text-white disabled:opacity-30 disabled:grayscale transition-all duration-300"
                                        >
                                            Next
                                            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        /* Empty state */
                        <div className="flex flex-col items-center justify-center py-20 px-4">
                            <div className="bg-gray-100 p-6 rounded-full mb-4">
                                <Bell className="w-12 h-12 text-gray-400" />
                            </div>
                            <p className="text-lg text-gray-500 font-medium">No notifications found</p>
                            <p className="text-sm text-gray-400 mt-2">Check back later for updates</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminNotifications

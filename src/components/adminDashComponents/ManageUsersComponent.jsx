import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import userService from "../../services/userService"
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaTimesCircle,
  FaToggleOn,
  FaToggleOff,
  FaUserShield,
  FaUserMinus,
  FaSearch,
} from "react-icons/fa"
import { ChevronLeft, ChevronRight } from "lucide-react"
import useUser from "../../hooks/useUser"

const ManageUsersComponent = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [users, setUsers] = useState([])
  const { user } = useUser()
  const usersPerPage = 10
  const [loadingStatus, setLoadingStatus] = useState({})
  const [loadingRole, setLoadingRole] = useState({})
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function getUsers() {
      try {
        const usersData = await userService.getAllUsers(usersPerPage, currentPage, searchQuery)
        setUsers(usersData.data.users)
        setTotalPages(usersData.data.totalPages)
      } catch (error) {
        toast.error(error.message || "Something went wrong while fetching the users")
      }
    }
    getUsers()
  }, [currentPage, searchQuery])

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1)
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1)
  }

  // Toggle user active status
  const handleToggleStatus = async (userId, currentStatus) => {
    setLoadingStatus((prev) => ({ ...prev, [userId]: true }))
    try {
      const updatedStatus = !currentStatus
      await userService.updateUserStatus(userId, updatedStatus)
      setUsers(users.map((user) => (user._id === userId ? { ...user, isActive: updatedStatus } : user)))
      toast.success(`User account ${updatedStatus ? "enabled" : "disabled"} successfully`)
    } catch (error) {
      toast.error(error.message || "Failed to update user status")
    } finally {
      setLoadingStatus((prev) => ({ ...prev, [userId]: false }))
    }
  }

  const handleToggleAdminRole = async (userId, currentRole) => {
    setLoadingRole((prev) => ({ ...prev, [userId]: true }))
    try {
      const newRole = currentRole === "admin" ? "user" : "admin"
      await userService.updateUserRole(userId, newRole)
      setUsers(users.map((user) => (user._id === userId ? { ...user, role: newRole } : user)))
      toast.success(`User role updated to ${newRole} successfully`)
    } catch (error) {
      toast.error(error.message || "Failed to update user role")
    } finally {
      setLoadingRole((prev) => ({ ...prev, [userId]: false }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 md:p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#101540]/5 to-transparent rounded-full blur-3xl -z-0" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#101540]/5 to-transparent rounded-full blur-3xl -z-0" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#101540] to-[#101540]/70 bg-clip-text text-transparent mb-2 animate-fade-in">
                User Management
              </h1>
              <p className="text-gray-600 text-sm md:text-base">Manage user accounts, permissions, and access control</p>
            </div>

            {/* Search Bar */}
            <div className="relative group w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 group-focus-within:text-[#101540] transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search by name, email or username..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1) // Reset to first page on search
                }}
                className="block w-full pl-11 pr-4 py-3.5 bg-white border-2 border-gray-100 rounded-2xl text-sm placeholder-gray-400 focus:outline-none focus:border-[#101540] focus:ring-4 focus:ring-[#101540]/5 transition-all shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 animate-fade-in-up">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#101540] to-[#101540]/90">
                  <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users && users.length > 0 ? (
                  users.map((_user, index) => (
                    <tr
                      key={_user._id}
                      className="hover:bg-gradient-to-r hover:from-[rgba(16,21,64,0.02)] hover:to-transparent transition-all duration-300 group"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-gray-600 font-mono">
                        {_user._id.slice(0, 8)}...
                      </td>
                      <td className="px-4 md:px-6 py-4 text-xs md:text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#101540] to-[#101540]/70 flex items-center justify-center text-white text-xs font-semibold">
                            {_user.fullName?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-800">{_user.fullName}</span>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-gray-600">{_user.email}</td>
                      <td className="px-4 md:px-6 py-4 text-xs md:text-sm">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${_user.role === "admin"
                            ? "bg-gradient-to-r from-[#101540] to-[#101540]/80 text-white"
                            : "bg-gray-100 text-gray-700"
                            }`}
                        >
                          {_user.role === "admin" && <FaUserShield className="text-xs" />}
                          {_user.role}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-gray-600">{_user.phoneNumber}</td>
                      <td className="px-4 md:px-6 py-4 text-xs md:text-sm">
                        {_user.isActive ? (
                          <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                            <FaCheckCircle className="text-sm" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-600 font-medium">
                            <FaTimesCircle className="text-sm" /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {/* Toggle Status Button */}
                          <button
                            onClick={() => handleToggleStatus(_user._id, _user.isActive)}
                            disabled={user?._id === _user._id || loadingStatus[_user._id]}
                            className={`group/btn relative inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg shadow-md transition-all duration-300 ${_user.isActive
                              ? "bg-red-500 hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/30"
                              : "bg-green-500 hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/30"
                              } text-white ${user?._id === _user._id || loadingStatus[_user._id]
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:scale-105"
                              }`}
                          >
                            {loadingStatus[_user._id] ? (
                              <>
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Loading...</span>
                              </>
                            ) : (
                              <>
                                {_user.isActive ? (
                                  <FaToggleOff className="text-sm" />
                                ) : (
                                  <FaToggleOn className="text-sm" />
                                )}
                                <span className="hidden sm:inline">{_user.isActive ? "Disable" : "Enable"}</span>
                              </>
                            )}
                          </button>

                          {/* Toggle Admin Role Button */}
                          <button
                            onClick={() => handleToggleAdminRole(_user._id, _user.role)}
                            disabled={user?._id === _user._id || loadingRole[_user._id]}
                            className={`group/btn relative inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg shadow-md transition-all duration-300 ${_user.role === "admin"
                              ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 hover:shadow-lg hover:shadow-orange-500/30"
                              : "bg-gradient-to-r from-[#101540] to-[#101540]/80 hover:shadow-lg hover:shadow-[#101540]/30"
                              } text-white ${user?._id === _user._id || loadingRole[_user._id]
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:scale-105"
                              }`}
                            title={user?._id === _user._id ? "You cannot change your own role" : ""}
                          >
                            {loadingRole[_user._id] ? (
                              <>
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Loading...</span>
                              </>
                            ) : (
                              <>
                                {_user.role === "admin" ? (
                                  <FaUserMinus className="text-sm" />
                                ) : (
                                  <FaUserShield className="text-sm" />
                                )}
                                <span className="hidden sm:inline">
                                  {_user.role === "admin" ? "Remove Admin" : "Make Admin"}
                                </span>
                              </>
                            )}
                          </button>

                          {/* View Profile Button */}
                          <Link
                            to={`/admin/dashboard/user-profile/${_user._id}`}
                            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg shadow-md bg-[#1a2250] text-white hover:bg-[#233166] transition-all duration-300 hover:scale-105"
                            title="View user profile"
                          >
                            <FaSearch className="text-sm" />
                            <span className="hidden sm:inline">View Profile</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-4 text-gray-500">
                        <FaSearch className="text-4xl opacity-20" />
                        <p className="font-medium">No users found matching your criteria</p>
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery("")}
                            className="text-[#101540] text-sm font-semibold hover:underline"
                          >
                            Clear search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-12 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all duration-300">
          <p className="text-sm font-black text-gray-400 uppercase tracking-widest">
            Showing <span className="text-[#101540]">{users.length}</span> items of <span className="text-[#101540]">{currentPage * usersPerPage}</span>
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="group flex items-center gap-3 px-8 py-4 bg-white text-[#101540] rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm ring-1 ring-gray-100 hover:bg-[#101540] hover:text-white disabled:opacity-30 disabled:grayscale transition-all duration-300"
            >
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Prev
            </button>

            <div className="flex items-center gap-2 px-6 py-4 bg-[#101540] rounded-2xl text-white font-black shadow-2xl shadow-[#101540]/20">
              <span className="opacity-40 text-[10px] uppercase tracking-widest mr-1">Page</span>
              <span className="text-sm">{currentPage}</span>
              <span className="opacity-20 font-medium mx-1">/</span>
              <span className="text-sm">{totalPages}</span>
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="group flex items-center gap-3 px-8 py-4 bg-white text-[#101540] rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm ring-1 ring-gray-100 hover:bg-[#101540] hover:text-white disabled:opacity-30 disabled:grayscale transition-all duration-300"
            >
              Next
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageUsersComponent

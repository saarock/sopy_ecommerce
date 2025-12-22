import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  FiEdit3,
  FiCheck,
  FiMail,
  FiPhone,
  FiCheckCircle,
  FiCalendar,
  FiMapPin,
  FiUser,
  FiType,
  FiImage,
} from "react-icons/fi";
import userService from "../../services/userService";
import { toast } from "react-toastify";

const Profile = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const { user: currentUser, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileUser, setProfileUser] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    location: "",
    gender: "",
    bio: "",
    avatar: "",
  });

  const isOwnProfile = !userId || userId === currentUser?._id;
  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await userService.getProfile(userId || "");
        if (response.success) {
          setProfileUser(response.data);
          setFormData({
            fullName: response.data.fullName || "",
            email: response.data.email || "",
            phoneNumber: response.data.phoneNumber || "",
            location: response.data.location || "",
            gender: response.data.gender || "",
            bio: response.data.bio || "",
            avatar: response.data.avatar || "",
          });
        }
      } catch (error) {
        toast.error(error.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchProfile();
    }
  }, [userId, isAuthenticated, currentUser?._id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#1a2250] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <p className="text-gray-600 text-lg mb-4">Please log in to view profile.</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await userService.updateProfile(formData);
      if (response.success) {
        toast.success("Profile updated successfully");
        setProfileUser(response.data);
        setIsEditing(false);
        // If it's own profile, we might need to update global state
        // But for now, we just update local state
      }
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#1a2250]/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full border-4 border-[#1a2250]/10 overflow-hidden bg-gray-100 flex items-center justify-center">
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <FiUser className="w-10 h-10 text-gray-400" />
                )}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {isOwnProfile ? "My Profile" : `${profileUser?.fullName}'s Profile`}
                </h1>
                <p className="text-gray-500 flex items-center gap-1 mt-1">
                  <span className={`w-2 h-2 rounded-full ${profileUser?.isActive ? "bg-green-500" : "bg-red-500"}`}></span>
                  {profileUser?.role === "admin" ? "Administrator" : "User Account"} • {profileUser?.isActive ? "Active" : "Disabled"}
                </p>
              </div>
            </div>

            {isOwnProfile && (
              <button
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                disabled={saving}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                style={{
                  backgroundColor: isEditing ? "#10b981" : "#1a2250",
                  color: "white",
                }}
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : isEditing ? (
                  <>
                    <FiCheck className="w-5 h-5" />
                    <span>Save Changes</span>
                  </>
                ) : (
                  <>
                    <FiEdit3 className="w-5 h-5" />
                    <span>Edit Profile</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Essential Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-800">Basic Information</h2>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                    <FiUser className="text-[#1a2250]" /> Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    disabled={!isEditing}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1a2250] focus:border-transparent transition-all outline-none disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                      <FiMail className="text-[#1a2250]" /> Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled={true}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 outline-none"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                      <FiPhone className="text-[#1a2250]" /> Phone Number
                    </label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      disabled={!isEditing}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1a2250] focus:border-transparent transition-all outline-none disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                    <FiType className="text-[#1a2250]" /> Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    disabled={!isEditing}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1a2250] focus:border-transparent transition-all outline-none disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                    placeholder="Tell us something about yourself..."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Secondary Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-800">Additional Details</h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Location */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                    <FiMapPin className="text-[#1a2250]" /> Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    disabled={!isEditing}
                    onChange={handleChange}
                    className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#1a2250] outline-none disabled:bg-gray-50"
                    placeholder="e.g. Kathmandu, Nepal"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                    <FiUser className="text-[#1a2250]" /> Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    disabled={!isEditing}
                    onChange={handleChange}
                    className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#1a2250] outline-none disabled:bg-gray-50"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>

                {/* Avatar URL */}
                {isEditing && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                      <FiImage className="text-[#1a2250]" /> Avatar URL
                    </label>
                    <input
                      type="text"
                      name="avatar"
                      value={formData.avatar}
                      onChange={handleChange}
                      className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#1a2250] outline-none"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                )}

                {/* Metadata */}
                <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Member Since:</span>
                    <span className="text-gray-600 font-medium">{new Date(profileUser?.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Last Active:</span>
                    <span className="text-gray-600 font-medium">{new Date(profileUser?.updatedAt).toLocaleDateString()}</span>
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

export default Profile;

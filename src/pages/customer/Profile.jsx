import { useEffect, useState } from "react";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "../../api/profile";

function Profile() {
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    profile_image: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);

  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const BASE_URL = "https://rojul-tot.onrender.com";

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("full_name", profile.full_name);
      formData.append("phone", profile.phone || "");
      formData.append("address", profile.address || "");

      if (selectedImage) {
        formData.append("profile_image", selectedImage);
      }

      await updateProfile(formData);
      await loadProfile();
      setSelectedImage(null);
      alert("Profile updated successfully");
    } catch (error) {
      console.error(error);

      if (error.response?.data) {
        const message = Object.values(error.response.data)
          .flat()
          .join("\n");
        alert(message);
      } else {
        alert("Failed to update profile");
      }
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.new_password !== passwordData.confirm_password) {
      alert("Passwords do not match");
      return;
    }

    try {
      await changePassword({
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
      });

      alert("Password changed successfully");

      setPasswordData({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error) {
      console.error(error);

      if (error.response?.data) {
        const message = Object.values(error.response.data)
          .flat()
          .join("\n");
        alert(message);
      } else {
        alert("Failed to change password");
      }
    }
  };

  // Resolve profile image source safely
  const getProfileImageSrc = () => {
    if (selectedImage) {
      return URL.createObjectURL(selectedImage);
    }
    if (profile.profile_image) {
      return profile.profile_image.startsWith("http")
        ? profile.profile_image
        : `${BASE_URL}${profile.profile_image}`;
    }
    return "https://via.placeholder.com/150";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Profile Settings</h1>

      {/* Profile Image Section */}
      <div className="flex flex-col items-center mb-6">
        <img
          src={getProfileImageSrc()}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-[#1495CC] shadow-md"
        />

        <input
          type="file"
          accept="image/*"
          className="mt-4 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-[#1495CC] hover:file:bg-sky-100"
          onChange={(e) => setSelectedImage(e.target.files[0])}
        />
      </div>

      {/* Profile Form */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>

        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Full Name"
              value={profile.full_name || ""}
              onChange={(e) =>
                setProfile({ ...profile, full_name: e.target.value })
              }
              className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1495CC]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email (Read-only)
            </label>
            <input
              type="email"
              value={profile.email || ""}
              disabled
              className="w-full border p-3 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              placeholder="Phone"
              value={profile.phone || ""}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
              className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1495CC]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              placeholder="Address"
              value={profile.address || ""}
              onChange={(e) =>
                setProfile({ ...profile, address: e.target.value })
              }
              className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1495CC]"
              rows="3"
            />
          </div>

          <button
            type="submit"
            className="bg-[#1495CC] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1182b3] transition-colors"
          >
            Save Changes
          </button>
        </form>
      </div>

      {/* Password Form */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              placeholder="Current Password"
              value={passwordData.old_password}
              onChange={(e) =>
                setPasswordData({ ...passwordData, old_password: e.target.value })
              }
              className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1495CC]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              placeholder="New Password"
              value={passwordData.new_password}
              onChange={(e) =>
                setPasswordData({ ...passwordData, new_password: e.target.value })
              }
              className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1495CC]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="Confirm Password"
              value={passwordData.confirm_password}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirm_password: e.target.value,
                })
              }
              className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1495CC]"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
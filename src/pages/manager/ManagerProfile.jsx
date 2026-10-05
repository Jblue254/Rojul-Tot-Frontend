import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Save,
} from "lucide-react";

import {
  getProfile,
  updateProfile,
} from "../../api/auth";

function ManagerProfile() {
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    role: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await getProfile();

      setFormData({
        full_name:
          response.data.full_name || "",
        email:
          response.data.email || "",
        phone:
          response.data.phone || "",
        address:
          response.data.address || "",
        role:
          response.data.role || "",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateProfile(formData);

      alert(
        "Profile updated successfully."
      );
    } catch (error) {
      console.error(error);
      alert(
        "Failed to update profile."
      );
    }
  };

  if (loading) {
    return (
      <div className="text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900">
          My Profile
        </h1>

        <p className="text-gray-500 mt-2">
          Manage your account details.
        </p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 md:p-8">
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Name */}

          <div>
            <label className="block mb-2 font-medium text-gray-900">
              Full Name
            </label>

            <div className="relative">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 outline-none transition-colors focus:border-[#1495CC] focus:ring-2 focus:ring-[#1495CC]/30"
              />
            </div>
          </div>

          {/* Email */}

          <div>
            <label className="block mb-2 font-medium text-gray-900">
              Email
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-3 bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Phone */}

          <div>
            <label className="block mb-2 font-medium text-gray-900">
              Phone
            </label>

            <div className="relative">
              <Phone
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 outline-none transition-colors focus:border-[#1495CC] focus:ring-2 focus:ring-[#1495CC]/30"
              />
            </div>
          </div>

          {/* Address */}

          <div>
            <label className="block mb-2 font-medium text-gray-900">
              Address
            </label>

            <div className="relative">
              <MapPin
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 outline-none transition-colors focus:border-[#1495CC] focus:ring-2 focus:ring-[#1495CC]/30"
              />
            </div>
          </div>

          {/* Role */}

          <div>
            <label className="block mb-2 font-medium text-gray-900">
              Role
            </label>

            <div className="relative">
              <Shield
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={formData.role}
                disabled
                className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-3 bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Save */}

          <button
            type="submit"
            className="flex items-center gap-2 bg-[#1495CC] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#0E7AA8] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1495CC]/50 focus-visible:ring-offset-2"
          >
            <Save size={18} />
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default ManagerProfile;
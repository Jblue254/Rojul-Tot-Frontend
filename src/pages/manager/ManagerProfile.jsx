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
      <div className="p-6">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          My Profile
        </h1>

        <p className="text-gray-500 mt-2">
          Manage your account details.
        </p>
      </div>

      <div className="bg-white border rounded-xl p-6">
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Name */}

          <div>
            <label className="block mb-2 font-medium">
              Full Name
            </label>

            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-3 text-gray-400"
              />

              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full border rounded-lg pl-10 p-3"
              />
            </div>
          </div>

          {/* Email */}

          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-3 text-gray-400"
              />

              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full border rounded-lg pl-10 p-3 bg-gray-100"
              />
            </div>
          </div>

          {/* Phone */}

          <div>
            <label className="block mb-2 font-medium">
              Phone
            </label>

            <div className="relative">
              <Phone
                size={18}
                className="absolute left-3 top-3 text-gray-400"
              />

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded-lg pl-10 p-3"
              />
            </div>
          </div>

          {/* Address */}

          <div>
            <label className="block mb-2 font-medium">
              Address
            </label>

            <div className="relative">
              <MapPin
                size={18}
                className="absolute left-3 top-3 text-gray-400"
              />

              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border rounded-lg pl-10 p-3"
              />
            </div>
          </div>

          {/* Role */}

          <div>
            <label className="block mb-2 font-medium">
              Role
            </label>

            <div className="relative">
              <Shield
                size={18}
                className="absolute left-3 top-3 text-gray-400"
              />

              <input
                type="text"
                value={formData.role}
                disabled
                className="w-full border rounded-lg pl-10 p-3 bg-gray-100"
              />
            </div>
          </div>

          {/* Save */}

          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
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
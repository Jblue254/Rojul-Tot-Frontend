import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Save,
} from "lucide-react";

import {
  getProfile,
  updateProfile,
} from "../../api/auth";

export default function ArchitectProfile() {
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    role: "",
    profile_image: null,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data } = await getProfile();

      setForm({
        full_name: data.full_name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        role: data.role || "",
        profile_image:
          data.profile_image || null,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateProfile(form);

      alert(
        "Profile updated successfully."
      );
    } catch (error) {
      console.error(error);
      alert("Failed to update profile.");
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
          Manage your account information.
        </p>
      </div>

      <div className="bg-white border rounded-xl p-6">
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
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
                value={form.full_name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    full_name:
                      e.target.value,
                  })
                }
                className="w-full border rounded-lg pl-10 p-2"
              />
            </div>
          </div>

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
                value={form.email}
                disabled
                className="w-full border rounded-lg pl-10 p-2 bg-gray-50"
              />
            </div>
          </div>

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
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone:
                      e.target.value,
                  })
                }
                className="w-full border rounded-lg pl-10 p-2"
              />
            </div>
          </div>

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
                value={form.address}
                onChange={(e) =>
                  setForm({
                    ...form,
                    address:
                      e.target.value,
                  })
                }
                className="w-full border rounded-lg pl-10 p-2"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Role
            </label>

            <input
              value={form.role}
              disabled
              className="w-full border rounded-lg p-2 bg-gray-50"
            />
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            <Save size={18} />
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
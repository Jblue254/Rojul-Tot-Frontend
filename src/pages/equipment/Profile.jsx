import { useEffect, useState } from "react";

import { getProfile, updateProfile } from "../../api/profile";

function EquipmentProfile() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await getProfile();

      setFormData({
        first_name:
          response.data.first_name || "",
        last_name:
          response.data.last_name || "",
        email:
          response.data.email || "",
        phone_number:
          response.data.phone_number || "",
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
        "Profile updated successfully"
      );
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
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
    <div>

      <h1 className="text-3xl font-bold mb-6">
        My Profile
      </h1>

      <div className="bg-white rounded-2xl shadow p-6 max-w-3xl">

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-4"
        >

          <div>
            <label className="block mb-2 font-medium">
              First Name
            </label>

            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Last Name
            </label>

            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Phone Number
            </label>

            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div className="md:col-span-2">

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              Update Profile
            </button>

          </div>

        </form>

      </div>

      <div className="bg-white rounded-2xl shadow p-6 mt-6 max-w-3xl">

        <h2 className="text-xl font-semibold mb-4">
          Account Information
        </h2>

        <div className="space-y-3">

          <div className="flex justify-between border-b pb-2">
            <span>Role</span>
            <span className="font-medium">
              Equipment Manager
            </span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span>Email</span>
            <span className="font-medium">
              {formData.email}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Account Status</span>
            <span className="text-green-600 font-medium">
              Active
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default EquipmentProfile;
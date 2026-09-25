// src/pages/customer/Profile.jsx

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
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getProfile();
      setProfile(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    try {
      await updateProfile(profile);
      alert("Profile updated successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile.");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    try {
      await changePassword(passwordData);

      alert("Password changed successfully.");

      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.current_password ||
        "Failed to change password."
      );
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">
        My Profile
      </h1>

      {/* Profile Card */}

      <div className="bg-white p-6 rounded-2xl shadow">
        <form
          onSubmit={handleProfileUpdate}
          className="space-y-4"
        >
          <div>
            <label className="block mb-1">
              Full Name
            </label>

            <input
              type="text"
              value={profile.full_name}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  full_name: e.target.value,
                })
              }
              className="w-full border p-3 rounded-xl"
            />
          </div>

          <div>
            <label className="block mb-1">
              Email
            </label>

            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full border p-3 rounded-xl bg-gray-100"
            />
          </div>

          <div>
            <label className="block mb-1">
              Phone
            </label>

            <input
              type="text"
              value={profile.phone || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  phone: e.target.value,
                })
              }
              className="w-full border p-3 rounded-xl"
            />
          </div>

          <div>
            <label className="block mb-1">
              Address
            </label>

            <textarea
              value={profile.address || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  address: e.target.value,
                })
              }
              className="w-full border p-3 rounded-xl"
              rows="3"
            />
          </div>

          <button
            type="submit"
            className="bg-[#1495CC] text-white px-6 py-3 rounded-xl"
          >
            Update Profile
          </button>
        </form>
      </div>

      {/* Change Password */}

      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold mb-4">
          Change Password
        </h2>

        <form
          onSubmit={handlePasswordChange}
          className="space-y-4"
        >
          <input
            type="password"
            placeholder="Current Password"
            value={passwordData.current_password}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                current_password: e.target.value,
              })
            }
            className="w-full border p-3 rounded-xl"
          />

          <input
            type="password"
            placeholder="New Password"
            value={passwordData.new_password}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                new_password: e.target.value,
              })
            }
            className="w-full border p-3 rounded-xl"
          />

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
            className="w-full border p-3 rounded-xl"
          />

          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-3 rounded-xl"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
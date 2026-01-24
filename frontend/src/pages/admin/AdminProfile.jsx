import { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../../App";
import {
  getMyProfile,
  updateProfile,
  changePassword,
} from "../../api/userApi";

export default function AdminProfile() {
  const { theme } = useContext(ThemeContext);

  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await getMyProfile();
      setProfile(res.data);
      setEmail(res.data.email);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await updateProfile({ email });
      setMessage("Profile updated successfully.");
      setTimeout(() => setMessage(""), 2500);
    } catch {
      setMessage("Failed to update profile.");
    }
  };

  const handleChangePassword = async () => {
    try {
      await changePassword(passwords);
      setMessage("Password changed successfully.");
      setPasswords({ oldPassword: "", newPassword: "" });
      setShowPasswordModal(false);
      setTimeout(() => setMessage(""), 2500);
    } catch {
      setMessage("Password change failed.");
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-gray-400">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">

      {/* SUCCESS TOAST */}
      {message && (
        <div className="fixed top-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {message}
        </div>
      )}

      {/* PROFILE CARD */}
      <div
        className={`rounded-2xl shadow-xl p-8 transition-all
        ${
          theme === "dark"
            ? "bg-slate-800 text-white"
            : "bg-white"
        }`}
      >
        <h2 className="text-2xl font-bold mb-6">Admin Profile</h2>

        <div className="space-y-5">

          {/* USERNAME */}
          <ProfileField
            label="Username"
            value={profile.username}
            theme={theme}
          />

          {/* ROLE */}
          <ProfileField
            label="Role"
            value={profile.role}
            theme={theme}
          />

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 rounded border transition
              ${
                theme === "dark"
                  ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                  : "bg-white"
              }`}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleUpdateProfile}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Save Changes
            </button>

            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className={`w-96 rounded-xl p-6 shadow-lg
            ${
              theme === "dark"
                ? "bg-slate-800 text-white"
                : "bg-white"
            }`}
          >
            <h3 className="text-xl font-semibold mb-4">
              Change Password
            </h3>

            {/* OLD PASSWORD */}
            <input
              type="password"
              placeholder="Old password"
              value={passwords.oldPassword}
              onChange={(e) =>
                setPasswords({
                  ...passwords,
                  oldPassword: e.target.value,
                })
              }
              className={`w-full mb-3 px-4 py-2 rounded border transition
                ${
                  theme === "dark"
                    ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                    : "bg-white text-gray-800"
                }`}
            />

            {/* NEW PASSWORD */}
            <input
              type="password"
              placeholder="New password"
              value={passwords.newPassword}
              onChange={(e) =>
                setPasswords({
                  ...passwords,
                  newPassword: e.target.value,
                })
              }
              className={`w-full mb-4 px-4 py-2 rounded border transition
                ${
                  theme === "dark"
                    ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                    : "bg-white text-gray-800"
                }`}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- FIXED COMPONENT ---------------- */

function ProfileField({ label, value, theme }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1">
        {label}
      </label>
      <input
        disabled
        value={value}
        className={`w-full px-4 py-2 rounded border cursor-not-allowed
        ${
          theme === "dark"
            ? "bg-slate-700 border-slate-600 text-gray-200"
            : "bg-gray-100 text-gray-700"
        }`}
      />
    </div>
  );
}

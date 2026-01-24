import { useState } from "react";
import api from "../../api/axios";

export default function ChangePasswordModal({ onClose }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = async () => {
    try {
      await api.put("/staff/change-password", {
        oldPassword,
        newPassword,
      });
      setSuccess("Password changed successfully ✅");
      setTimeout(onClose, 2000);
    } catch {
      alert("Password change failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">Change Password</h3>

        {success && (
          <div className="mb-3 p-2 bg-green-100 text-green-700 rounded">
            {success}
          </div>
        )}

        <input
          type="password"
          placeholder="Current Password"
          className="w-full mb-3 p-2 rounded bg-gray-100 dark:bg-slate-700"
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          className="w-full mb-4 p-2 rounded bg-gray-100 dark:bg-slate-700"
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded">
            Cancel
          </button>
          <button onClick={handleChange} className="px-4 py-2 bg-blue-600 text-white rounded">
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

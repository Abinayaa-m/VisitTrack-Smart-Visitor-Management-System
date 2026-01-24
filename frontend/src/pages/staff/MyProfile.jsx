import { useEffect, useState, useContext } from "react";
import api from "../../api/axios";
import { ThemeContext } from "../../App";
import ChangePasswordModal from "./ChangePasswordModal";
import { FaUserTie, FaBuilding, FaPhoneAlt } from "react-icons/fa";

export default function MyProfile() {
  const { theme } = useContext(ThemeContext);

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get("/staff/me");
      setProfile(res.data);
      setForm(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      await api.put("/staff/update", {
        fullName: form.fullName,
        department: form.department,
        designation: form.designation,
        phone: form.phone,
      });

      setSuccess("Profile updated successfully ✅");
      setEditMode(false);
      loadProfile();

      setTimeout(() => setSuccess(""), 3000);
    } catch {
      alert("Update failed");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex justify-center mt-10">
      <div
        className={`w-full max-w-4xl rounded-2xl shadow-xl p-8
        ${theme === "dark" ? "bg-slate-800 text-white" : "bg-white"}`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
              {profile.fullName?.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold">{profile.fullName}</h2>
              <p className="text-gray-400">{profile.designation}</p>
            </div>
          </div>

          <div className="flex gap-3">
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setForm(profile);
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* SUCCESS MESSAGE */}
        {success && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-700">
            {success}
          </div>
        )}

        {/* DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Username" value={profile.username} />
          <Field label="Staff Code" value={profile.staffCode} />

          <EditableField
            label="Full Name"
            name="fullName"
            value={form.fullName}
            editMode={editMode}
            onChange={handleChange}
          />

          <EditableField
            label="Department"
            name="department"
            value={form.department}
            icon={<FaBuilding />}
            editMode={editMode}
            onChange={handleChange}
          />

          <EditableField
            label="Designation"
            name="designation"
            value={form.designation}
            icon={<FaUserTie />}
            editMode={editMode}
            onChange={handleChange}
          />

          <EditableField
            label="Phone"
            name="phone"
            value={form.phone}
            icon={<FaPhoneAlt />}
            editMode={editMode}
            onChange={handleChange}
          />
        </div>

        {/* CHANGE PASSWORD */}
        <div className="mt-8 text-right">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="text-blue-600 font-medium"
          >
            Change Password
          </button>
        </div>
      </div>

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
}

/* ------------------ Components ------------------ */

function Field({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <div className="px-4 py-2 rounded bg-gray-100 dark:bg-slate-700">
        {value}
      </div>
    </div>
  );
}

function EditableField({ label, value, name, icon, editMode, onChange }) {
  return (
    <div>
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      {editMode ? (
        <input
          name={name}
          value={value || ""}
          onChange={onChange}
          className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-slate-700"
        />
      ) : (
        <div className="px-4 py-2 rounded bg-gray-100 dark:bg-slate-700 flex items-center gap-2">
          {icon} {value}
        </div>
      )}
    </div>
  );
}

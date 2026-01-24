import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function SetupProfile() {
  const [fullName, setFullName] = useState("");
  const [staffCode, setStaffCode] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [phone, setPhone] = useState("");

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await api.post("/staff/create", {
        fullName,
        staffCode,
        department,
        designation,
        phone,
      });

      console.log("Profile Created:", response.data);
      setMessage("Profile created successfully!");

      setTimeout(() => navigate("/staff/dashboard"), 1500);
    } catch (error) {
      setMessage("Failed! Staff code may already exist.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-[420px]"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-purple-600">
          Complete Staff Profile
        </h2>

        {message && (
          <p className="text-center text-sm mb-3 font-medium text-red-600">
            {message}
          </p>
        )}

        <input
          type="text"
          placeholder="Full Name"
          className="w-full border p-2 rounded mb-3"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Staff Code"
          className="w-full border p-2 rounded mb-3"
          value={staffCode}
          onChange={(e) => setStaffCode(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Department"
          className="w-full border p-2 rounded mb-3"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Designation"
          className="w-full border p-2 rounded mb-3"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Phone Number"
          className="w-full border p-2 rounded mb-4"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <button className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700">
          Save Profile
        </button>
      </form>
    </div>
  );
}

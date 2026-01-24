import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { addVisitor } from "../../api/visitorApi";
import { searchStaff } from "../../api/staffApi";
import { ThemeContext } from "../../App";

export default function AddVisitor() {
  const { theme } = useContext(ThemeContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    purpose: "",
    staffId: "",
    staffSearch: ""
  });

  const [staffSuggestions, setStaffSuggestions] = useState([]);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "staffSearch") {
      value.length >= 2 ? loadStaff(value) : setStaffSuggestions([]);
    }
  };

  const loadStaff = async (q) => {
    try {
      const res = await searchStaff(q);
      setStaffSuggestions(res.data.content || res.data);
    } catch (error) {
      console.error("Staff search failed", error);
    }
  };

  const selectStaff = (st) => {
    setForm({
      ...form,
      staffId: st.id,
      staffSearch: `${st.fullName} (${st.staffCode})`
    });
    setStaffSuggestions([]);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.staffId) {
      setMessage("⚠ Please select a staff from suggestions");
      return;
    }

    try {
      await addVisitor({
        name: form.name,
        email: form.email,
        phone: form.phone,
        purpose: form.purpose,
        staffId: form.staffId
      });

      setMessage("✔ Visitor Added Successfully!");
      setForm({ name: "", email: "", phone: "", purpose: "", staffId: "", staffSearch: "" });
      setStaffSuggestions([]);
    } catch (error) {
      setMessage("❌ Failed! Check input details");
    }
  };

  return (
    <div className={`min-h-screen flex justify-center items-center p-6 transition-all duration-500
      ${theme === "dark" ? "bg-transparent" : "bg-gray-100"}
    `}>
      <form
        onSubmit={handleSave}
        className={`
          rounded-2xl shadow-2xl p-10 w-full max-w-lg transition-all duration-500
          ${theme === "dark"
            ? "bg-white/10 backdrop-blur-xl border border-white/20 text-white"
            : "bg-white border border-gray-200"
          }
        `}
      >
        <h2
          className="text-3xl font-bold text-center mb-6 flex items-center justify-center gap-2
          text-purple-700 dark:text-purple-300"
        >
          Add Visitor 👤
        </h2>

        {message && (
          <p className="text-center text-red-600 dark:text-red-300 mb-4">{message}</p>
        )}

        {/* INPUTS */}
        <div className="space-y-4">
          <input name="name" placeholder="Visitor Name" className="input-field" value={form.name} onChange={handleChange} required />

          <input name="email" placeholder="Visitor Email" className="input-field" value={form.email} onChange={handleChange} required />

          <input name="phone" placeholder="Visitor Phone" className="input-field" value={form.phone} onChange={handleChange} required />

          <input name="purpose" placeholder="Purpose of Visit" className="input-field" value={form.purpose} onChange={handleChange} required />

          <input name="staffSearch" placeholder="Search Staff..." className="input-field" value={form.staffSearch} onChange={handleChange} required />
        </div>

        {/* STAFF DROPDOWN */}
        {staffSuggestions.length > 0 && (
          <ul className={`mt-3 rounded-lg border shadow-lg max-h-40 overflow-y-auto
            ${theme === "dark" ? "bg-white/10 border-white/20 text-white" : "bg-white"}
          `}>
            {staffSuggestions.map((st) => (
              <li
                key={st.id}
                onClick={() => selectStaff(st)}
                className={`px-3 py-2 cursor-pointer flex justify-between text-sm
                  ${theme === "dark" ? "hover:bg-white/20" : "hover:bg-gray-100"}
                `}
              >
                <span className="font-semibold">{st.fullName}</span>
                <span className="text-blue-600">{st.staffCode}</span>
              </li>
            ))}
          </ul>
        )}

        {/* SUBMIT BUTTON */}
        <button
          className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg font-semibold
            transition-all duration-300 shadow-md hover:shadow-xl"
        >
          Save Visitor
        </button>

        <Link
          to="/security/dashboard"
          className="block text-center mt-4 text-blue-600 dark:text-blue-300 hover:underline"
        >
          ⬅ Back
        </Link>
      </form>
    </div>
  );
}

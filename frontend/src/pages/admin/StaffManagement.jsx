import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  // ✅ SUCCESS MESSAGE
  const [successMsg, setSuccessMsg] = useState("");

  // DELETE MODAL
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // EDIT MODAL
  const [showEditModal, setShowEditModal] = useState(false);
  const [editStaff, setEditStaff] = useState(null);

  const size = 10;

  // 🔄 Fetch staff
  const fetchStaff = async (pageNumber = page) => {
    try {
      setLoading(true);
      const res = await api.get("/staff/all", {
        params: { page: pageNumber, size, search },
      });

      setStaff(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error("Failed to load staff", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff(page);
  }, [page]);

  // 🔍 Search
  const handleSearch = () => {
    setPage(0);
    fetchStaff(0);
  };

  // 🟡 EDIT
  const openEditModal = (staff) => {
    setEditStaff({ ...staff });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setEditStaff(null);
    setShowEditModal(false);
  };

  const handleEditChange = (e) => {
    setEditStaff({ ...editStaff, [e.target.name]: e.target.value });
  };

  const saveEdit = async () => {
    try {
      await api.put(`/staff/${editStaff.id}`, {
        fullName: editStaff.fullName,
        department: editStaff.department,
        designation: editStaff.designation,
        phone: editStaff.phone,
      });

      closeEditModal();
      fetchStaff(page);

      setSuccessMsg("Staff details updated successfully.");
      setTimeout(() => setSuccessMsg(""), 2500);
    } catch {
      alert("Failed to update staff");
    }
  };

  // 🔴 DELETE
  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteId(null);
    setShowDeleteModal(false);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/staff/${deleteId}`);
      closeDeleteModal();
      fetchStaff(page);
    } catch {
      alert("Failed to delete staff");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 relative transition-colors">

      {/* ✅ SUCCESS TOAST */}
      {successMsg && (
        <div className="fixed top-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {successMsg}
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Staff Management
      </h2>

      {/* SEARCH */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or staff code"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            border rounded px-4 py-2 w-80
            bg-white dark:bg-slate-700
            border-gray-300 dark:border-slate-600
            text-gray-800 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-400
          "
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 dark:border-slate-700 rounded">
          <thead className="bg-gray-100 dark:bg-slate-700">
            <tr>
              {[
                "Name",
                "Username",
                "Staff Code",
                "Department",
                "Designation",
                "Phone",
                "Action",
              ].map((h) => (
                <th
                  key={h}
                  className="border px-3 py-2 text-left text-gray-800 dark:text-gray-200"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500 dark:text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : staff.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No staff found
                </td>
              </tr>
            ) : (
              staff.map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                >
                  <td className="border px-3 py-2 text-gray-800 dark:text-gray-200">{s.fullName}</td>
                  <td className="border px-3 py-2 text-gray-800 dark:text-gray-200">{s.username}</td>
                  <td className="border px-3 py-2 text-gray-800 dark:text-gray-200">{s.staffCode}</td>
                  <td className="border px-3 py-2 text-gray-800 dark:text-gray-200">{s.department}</td>
                  <td className="border px-3 py-2 text-gray-800 dark:text-gray-200">{s.designation}</td>
                  <td className="border px-3 py-2 text-gray-800 dark:text-gray-200">{s.phone}</td>
                  <td className="border px-3 py-2 flex gap-2">
                    <button
                      onClick={() => openEditModal(s)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(s.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-6">
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
          className={`px-4 py-2 rounded ${
            page === 0
              ? "bg-gray-300 dark:bg-slate-600 cursor-not-allowed"
              : "bg-gray-700 text-white hover:bg-gray-800"
          }`}
        >
          Previous
        </button>

        <span className="font-semibold text-gray-800 dark:text-gray-200">
          Page {page + 1} of {totalPages}
        </span>

        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className={`px-4 py-2 rounded ${
            page + 1 >= totalPages
              ? "bg-gray-300 dark:bg-slate-600 cursor-not-allowed"
              : "bg-gray-700 text-white hover:bg-gray-800"
          }`}
        >
          Next
        </button>
      </div>

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 w-96">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Edit Staff
            </h3>

            {["fullName", "department", "designation", "phone"].map((field) => (
              <input
                key={field}
                name={field}
                value={editStaff[field] || ""}
                onChange={handleEditChange}
                placeholder={field}
                className="
                  w-full border px-3 py-2 rounded mb-3
                  bg-white dark:bg-slate-700
                  border-gray-300 dark:border-slate-600
                  text-gray-800 dark:text-white
                "
              />
            ))}

            <div className="flex justify-end gap-3">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 border rounded text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 w-96">
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this staff member and their login?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 border rounded text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

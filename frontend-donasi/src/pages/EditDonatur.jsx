import { useState, useEffect } from "react";
import api from "../axios";

function EditDonatur({ selectedDonatur, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    nama: "",
    email: "",
    no_hp: "",
    alamat: "",
  });

  useEffect(() => {
    if (selectedDonatur) {
      setForm({
        nama: selectedDonatur.nama || "",
        email: selectedDonatur.email || "",
        no_hp: selectedDonatur.no_hp || "",
        alamat: selectedDonatur.alamat || "",
      });
    }
  }, [selectedDonatur]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDonatur || !selectedDonatur.id) {
      alert("Donatur tidak valid (ID tidak ditemukan)");
      return;
    }

    try {
      await api.put(`/donatur/${selectedDonatur.id}`, form);
      onSuccess();
    } catch (err) {
      console.error("❌ Gagal update:", err);
      alert("Gagal mengupdate data");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 border rounded shadow mb-6">
      <h3 className="text-lg font-bold mb-2">Edit Donatur</h3>
      <input
        name="nama"
        placeholder="Nama"
        className="border p-2 w-full mb-2"
        value={form.nama}
        onChange={handleChange}
      />
      <input
        name="email"
        placeholder="Email"
        className="border p-2 w-full mb-2"
        value={form.email}
        onChange={handleChange}
      />
      <input
        name="no_hp"
        placeholder="No HP"
        className="border p-2 w-full mb-2"
        value={form.no_hp}
        onChange={handleChange}
      />
      <textarea
        name="alamat"
        placeholder="Alamat"
        className="border p-2 w-full mb-2"
        value={form.alamat}
        onChange={handleChange}
      />
      <div className="space-x-2 mt-2">
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Simpan
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
        >
          Batal
        </button>
      </div>
    </form>
  );
}

export default EditDonatur;

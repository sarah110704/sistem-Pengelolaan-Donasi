import { useState } from "react";
import api from "../axios";

function AddDonatur({ onSuccess }) {
  const [form, setForm] = useState({
    nama: "",
    email: "",
    no_hp: "",
    alamat: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/donatur", form);
      alert("✅ Donatur berhasil ditambahkan");
      setForm({ nama: "", email: "", no_hp: "", alamat: "" });
      onSuccess(); // refresh list
    } catch (err) {
      alert("❌ Gagal menambahkan donatur");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 shadow rounded mb-4">
      <h2 className="text-lg font-bold">Tambah Donatur</h2>
      <input name="nama" value={form.nama} onChange={handleChange} placeholder="Nama" className="border p-2 w-full" />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-2 w-full" />
      <input name="no_hp" value={form.no_hp} onChange={handleChange} placeholder="No HP" className="border p-2 w-full" />
      <input name="alamat" value={form.alamat} onChange={handleChange} placeholder="Alamat" className="border p-2 w-full" />
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Simpan</button>
    </form>
  );
}

export default AddDonatur;

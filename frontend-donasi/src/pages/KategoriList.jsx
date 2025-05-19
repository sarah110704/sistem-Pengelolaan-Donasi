import { useEffect, useState } from "react";
import api from "../axios";

function KategoriList() {
  const [kategori, setKategori] = useState([]);
  const [form, setForm] = useState({
    nama: "",
    deskripsi: ""
  });

  const fetchData = async () => {
    try {
      const res = await api.get("/kategori");
      setKategori(res.data);
    } catch (err) {
      console.error("❌ Gagal mengambil data kategori:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/kategori", form);
      alert("✅ Kategori berhasil ditambahkan");
      setForm({ nama: "", deskripsi: "" });
      fetchData(); // refresh data
    } catch (err) {
      alert("❌ Gagal menambahkan kategori");
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="bg-white shadow-md rounded p-4">
        <h2 className="text-xl font-bold mb-4">Form Tambah Kategori</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="nama"
            value={form.nama}
            onChange={handleChange}
            placeholder="Nama Kategori"
            className="border p-2 w-full"
            required
          />
          <textarea
            name="deskripsi"
            value={form.deskripsi}
            onChange={handleChange}
            placeholder="Deskripsi"
            className="border p-2 w-full"
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Simpan
          </button>
        </form>
      </div>

      <div className="bg-white shadow-md rounded p-4">
        <h2 className="text-xl font-bold mb-4">Daftar Kategori</h2>
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">No</th>
              <th className="border p-2">Nama</th>
              <th className="border p-2">Deskripsi</th>
            </tr>
          </thead>
          <tbody>
            {kategori.map((item, i) => (
              <tr key={item._id || i}>
                <td className="border p-2 text-center">{i + 1}</td>
                <td className="border p-2">{item.nama}</td>
                <td className="border p-2">{item.deskripsi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default KategoriList;
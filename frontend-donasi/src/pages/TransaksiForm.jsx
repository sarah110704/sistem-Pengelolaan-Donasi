import { useState, useEffect } from "react";
import api from "../axios";

function TransaksiForm({ onSuccess, editData }) {
  const [form, setForm] = useState({
    donatur_id: "",
    jumlah: "",
    jenis: "masuk",
    keterangan: "",
    kategori_id: "",
  });

  const [donaturList, setDonaturList] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kategoriRes, donaturRes] = await Promise.all([
          api.get("/kategori"),
          api.get("/donatur"),
        ]);
        setKategoriList(kategoriRes.data);
        setDonaturList(donaturRes.data);
      } catch (err) {
        console.error("❌ Gagal mengambil data:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (editData) {
      setForm({
        donatur_id: editData.donatur_id || "",
        jumlah: editData.jumlah || "",
        jenis: editData.jenis || "masuk",
        keterangan: editData.keterangan || "",
        kategori_id: editData.kategori_id || "",
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { donatur_id, kategori_id, jumlah, keterangan } = form;

    if (!donatur_id || !kategori_id || !jumlah || !keterangan) {
      setError("⚠️ Semua field wajib diisi!");
      return;
    }

    if (parseInt(jumlah) <= 0) {
      setError("⚠️ Jumlah harus lebih dari 0");
      return;
    }

    setLoading(true);
    try {
      if (editData && editData._id) {
        await api.put(`/transaksi/${editData._id}`, {
          ...form,
          jumlah: parseInt(jumlah),
        });
      } else {
        await api.post("/transaksi", {
          ...form,
          jumlah: parseInt(jumlah),
        });
      }

      alert(editData ? "✅ Transaksi berhasil diupdate" : "✅ Transaksi berhasil ditambahkan");
      setForm({
        donatur_id: "",
        jumlah: "",
        jenis: "masuk",
        keterangan: "",
        kategori_id: "",
      });
      onSuccess();
    } catch (err) {
      console.error("❌ Gagal menyimpan transaksi:", err);
      alert("❌ Gagal menyimpan transaksi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white rounded shadow mb-4">
      <h2 className="text-xl font-bold">
        {editData ? "Edit Transaksi" : "Tambah Transaksi"}
      </h2>

      {error && <p className="text-red-600">{error}</p>}

      <select name="donatur_id" value={form.donatur_id} onChange={handleChange} className="border p-2 w-full">
        <option value="">-- Pilih Donatur --</option>
        {donaturList.map((d) => (
          <option key={d._id} value={d._id}>
            {d.nama}
          </option>
        ))}
      </select>

      <input
        name="jumlah"
        type="number"
        value={form.jumlah}
        onChange={handleChange}
        placeholder="Jumlah (Rp)"
        className="border p-2 w-full"
      />

      <select name="jenis" value={form.jenis} onChange={handleChange} className="border p-2 w-full">
        <option value="masuk">Masuk</option>
        <option value="keluar">Keluar</option>
      </select>

      <select name="kategori_id" value={form.kategori_id} onChange={handleChange} className="border p-2 w-full">
        <option value="">-- Pilih Kategori --</option>
        {kategoriList.map((kat) => (
          <option key={kat._id} value={kat._id}>
            {kat.nama}
          </option>
        ))}
      </select>

      <textarea
        name="keterangan"
        value={form.keterangan}
        onChange={handleChange}
        placeholder="Keterangan"
        className="border p-2 w-full"
      />

      <button type="submit" disabled={loading} className="bg-green-500 text-white px-4 py-2 rounded">
        {loading ? "Menyimpan..." : editData ? "Simpan Perubahan" : "Simpan"}
      </button>
    </form>
  );
}

export default TransaksiForm;

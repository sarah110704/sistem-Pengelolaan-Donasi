import { useEffect, useState } from "react";
import api from "../axios";
import TransaksiForm from "./TransaksiForm";

function TransaksiList() {
  const [data, setData] = useState([]);
  const [kategoriMap, setKategoriMap] = useState({});
  const [donaturMap, setDonaturMap] = useState({});
  const [editData, setEditData] = useState(null);

  const fetchData = async () => {
    try {
      const [transaksiRes, kategoriRes, donaturRes] = await Promise.all([
        api.get("/transaksi"),
        api.get("/kategori"),
        api.get("/donatur"),
      ]);

      setData(transaksiRes.data);

      const kMap = {};
      kategoriRes.data.forEach((k) => (kMap[k._id] = k.nama));
      setKategoriMap(kMap);

      const dMap = {};
      donaturRes.data.forEach((d) => (dMap[d._id] = d.nama));
      setDonaturMap(dMap);
    } catch (err) {
      console.error("❌ Gagal mengambil data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Yakin ingin menghapus transaksi ini?")) {
      try {
        await api.delete(`/transaksi/${id}`);
        alert("✅ Transaksi berhasil dihapus");
        fetchData();
      } catch (err) {
        console.error("❌ Gagal menghapus:", err);
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Data Transaksi</h2>

      <TransaksiForm
        onSuccess={() => {
          setEditData(null);     // ✅ Reset edit setelah simpan
          fetchData();           // ✅ Refresh list
        }}
        editData={editData}
      />

      <table className="w-full border text-sm mt-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">No</th>
            <th className="border p-2">Donatur</th>
            <th className="border p-2">Kategori</th>
            <th className="border p-2">Jumlah</th>
            <th className="border p-2">Jenis</th>
            <th className="border p-2">Keterangan</th>
            <th className="border p-2">Tanggal</th>
            <th className="border p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((t, i) => (
            <tr key={t._id || i}>
              <td className="border p-2 text-center">{i + 1}</td>
              <td className="border p-2">{donaturMap[t.donatur_id] || "-"}</td>
              <td className="border p-2">{kategoriMap[t.kategori_id] || "-"}</td>
              <td className="border p-2">Rp {t.jumlah?.toLocaleString()}</td>
              <td className="border p-2 capitalize">{t.jenis}</td>
              <td className="border p-2">{t.keterangan}</td>
              <td className="border p-2">{new Date(t.tanggal).toLocaleString()}</td>
              <td className="border p-2 space-x-2 text-center">
                <button
                  onClick={() => setEditData(t)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t._id)}
                  className="text-red-600 hover:underline"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransaksiList;

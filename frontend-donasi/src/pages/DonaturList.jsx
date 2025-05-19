import { useEffect, useState } from "react";
import api from "../axios";
import EditDonatur from "./EditDonatur";
import AddDonatur from "./AddDonatur"; // ✅ Tambahkan ini
import DetailButton from "../components/atoms/DetailButton";
import EditButton from "../components/atoms/EditButton";
import HapusButton from "../components/atoms/HapusButton";

function DonaturList() {
  const [donaturs, setDonaturs] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedDonatur, setSelectedDonatur] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false); // ✅ toggle form

  const fetchDonaturs = async () => {
    try {
      console.log("📦 Fetching donatur data...");
      const res = await api.get("/donatur");
      console.log("✅ Data berhasil diambil:", res.data);
      setDonaturs(res.data);
    } catch (err) {
      console.error("❌ Gagal ambil data donatur:", err);
    }
  };

  useEffect(() => {
    fetchDonaturs();
  }, []);

  const deleteDonatur = async (id) => {
    if (confirm("Yakin ingin menghapus donatur ini?")) {
      try {
        await api.delete(`/donatur/${id}`);
        alert("✅ Donatur berhasil dihapus!");
        fetchDonaturs();
      } catch (err) {
        console.error("❌ Gagal menghapus donatur:", err);
      }
    }
  };

  return (
    <div className="bg-white shadow-md rounded p-4">
      <h2 className="text-xl font-semibold mb-4">Data Donatur</h2>

      {/* ✅ Tombol toggle tambah */}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        {showAddForm ? "Tutup Form" : "Tambah Donatur"}
      </button>

      {/* ✅ Form tambah donatur */}
      {showAddForm && (
        <AddDonatur
          onSuccess={() => {
            setShowAddForm(false);
            fetchDonaturs();
          }}
        />
      )}

      {editMode ? (
        <EditDonatur
          selectedDonatur={selectedDonatur}
          onSuccess={() => {
            setEditMode(false);
            fetchDonaturs();
          }}
          onCancel={() => setEditMode(false)}
        />
      ) : (
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">No</th>
              <th className="border px-3 py-2">ID Donatur</th>
              <th className="border px-3 py-2">Nama</th>
              <th className="border px-3 py-2">Email</th>
              <th className="border px-3 py-2">No HP</th>
              <th className="border px-3 py-2">Alamat</th>
              <th className="border px-3 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {donaturs.length > 0 ? (
              donaturs.map((d, i) => (
                <tr key={d._id || d.id || i} className="hover:bg-gray-50">
                  <td className="border px-3 py-2 text-center">{i + 1}</td>
                  <td className="border px-3 py-2 text-xs">{d._id || d.id || "?"}</td>
                  <td className="border px-3 py-2">{d.nama}</td>
                  <td className="border px-3 py-2">{d.email}</td>
                  <td className="border px-3 py-2">{d.no_hp}</td>
                  <td className="border px-3 py-2">{d.alamat}</td>
                  <td className="border px-3 py-2 text-center space-x-2">
                    <DetailButton onClick={() => alert(JSON.stringify(d, null, 2))} />
                    <EditButton onClick={() => {
                      setSelectedDonatur(d);
                      setEditMode(true);
                    }} />
                    <HapusButton onClick={() => deleteDonatur(d._id || d.id)} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 py-4">
                  Tidak ada data donatur
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DonaturList;

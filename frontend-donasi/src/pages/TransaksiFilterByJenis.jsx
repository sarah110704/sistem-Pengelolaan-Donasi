import { useEffect, useState } from "react";
import api from "../../axios";

function TransaksiFilterByJenis() {
  const [jenis, setJenis] = useState("masuk");
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await api.get(`/transaksi/jenis/${jenis}`);
      setData(res.data);
    } catch (err) {
      console.error("Gagal fetch data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [jenis]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Filter Transaksi per Jenis</h2>
      <select value={jenis} onChange={(e) => setJenis(e.target.value)} className="border p-2 my-2">
        <option value="masuk">Masuk</option>
        <option value="keluar">Keluar</option>
      </select>
      <ul className="list-disc pl-6">
        {data.map((t, i) => (
          <li key={i}>
            {t.keterangan} - Rp {t.jumlah.toLocaleString()} ({new Date(t.tanggal).toLocaleString()})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TransaksiFilterByJenis;
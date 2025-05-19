import { useEffect, useState } from "react";
import api from "../axios";

function LaporanSaldo() {
  const [masuk, setMasuk] = useState(0);
  const [keluar, setKeluar] = useState(0);

  const fetchLaporan = async () => {
    try {
      const res = await api.get("/transaksi");
      const all = res.data || [];
      let totalMasuk = 0, totalKeluar = 0;

      all.forEach((t) => {
        if (t.jenis === "masuk") totalMasuk += t.jumlah;
        if (t.jenis === "keluar") totalKeluar += t.jumlah;
      });

      setMasuk(totalMasuk);
      setKeluar(totalKeluar);
    } catch (err) {
      console.error("Gagal ambil data laporan", err);
    }
  };

  useEffect(() => {
    fetchLaporan();
  }, []);

  return (
    <div className="p-6 mt-4 border-t">
      <h2 className="text-xl font-bold mb-2">Laporan Saldo</h2>
      <p>Total Masuk: <strong>Rp {masuk.toLocaleString()}</strong></p>
      <p>Total Keluar: <strong>Rp {keluar.toLocaleString()}</strong></p>
      <p>Saldo Akhir: <strong>Rp {(masuk - keluar).toLocaleString()}</strong></p>
    </div>
  );
}

export default LaporanSaldo;
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import DonaturList from "../../pages/DonaturList";
import TransaksiForm from "../../pages/TransaksiForm";
import TransaksiList from "../../pages/TransaksiList";
import LaporanSaldo from "../../pages/LaporanSaldo";
import KategoriList from "../../pages/KategoriList";

function App() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green-600">Pengelolaan Donasi</h1>

      <nav className="space-x-4 mb-6">
        <Link to="/">Donatur</Link>
        <Link to="/transaksi">Transaksi</Link>
        <Link to="/laporan">Laporan</Link>
        <Link to="/kategori">Kategori</Link>
      </nav>

      <Routes>
        <Route path="/" element={<DonaturList />} />
        <Route
          path="/transaksi"
          element={
            <>
              <TransaksiForm />
              <TransaksiList />
            </>
          }
        />
        <Route path="/laporan" element={<LaporanSaldo />} />
        <Route path="/kategori" element={<KategoriList />} />
      </Routes>
    </div>
  );
}

export default App;

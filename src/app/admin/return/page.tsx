"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import {
  BookOpen,
  User,
  BookMarked,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Search,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  TrendingUp
} from "lucide-react";

interface Borrow {
  id: number;
  nama: string;
  judul_buku: string;
  tanggal_pinjam: string;
  tanggal_kembali: string;
  status: string;
}

export default function ReturnPage() {
  const [data, setData] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const DENDA_PER_HARI = 1000;

  useEffect(() => {
    getBorrows();
  }, []);

  async function getBorrows() {
    setLoading(true);

    const { data, error } = await supabase
      .from("borrow")
      .select("*")
      .eq("status", "Dipinjam")
      .order("id", { ascending: false });

    if (error) {
      console.error(error.message);
      alert("Gagal mengambil data pengembalian");
    } else {
      setData(data || []);
    }

    setLoading(false);
  }

  function hitungDenda(tanggalKembali: string) {
    const today = new Date();
    const dueDate = new Date(tanggalKembali);

    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    if (today <= dueDate) {
      return 0;
    }

    const diffTime = today.getTime() - dueDate.getTime();
    const hariTerlambat = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return hariTerlambat * DENDA_PER_HARI;
  }

  async function handleReturn(borrow: Borrow) {
    const denda = hitungDenda(borrow.tanggal_kembali);

    const konfirmasi = window.confirm(
      `Denda yang harus dibayar:\nRp ${denda.toLocaleString("id-ID")}\n\nLanjutkan pengembalian buku?`
    );

    if (!konfirmasi) return;

    const { error } = await supabase
      .from("borrow")
      .update({
        status: "Dikembalikan",
        denda,
        tanggal_dikembalikan: new Date().toISOString().split("T")[0],
      })
      .eq("id", borrow.id);

    if (error) {
      alert(error.message);
      return;
    }

    // Update status buku menjadi tersedia
    await supabase
      .from("books")
      .update({ status: "Tersedia" })
      .eq("judul", borrow.judul_buku);

    alert("Buku berhasil dikembalikan");
    getBorrows();
  }

  const filteredData = data.filter((item) => {
    const keyword = search.toLowerCase();
    return (
      (item.nama || "").toLowerCase().includes(keyword) ||
      (item.judul_buku || "").toLowerCase().includes(keyword)
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const totalDenda = data.reduce((sum, item) => {
    return sum + hitungDenda(item.tanggal_kembali);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-cyan-400" />
            Pengembalian Buku
          </h1>
          <p className="text-cyan-200/80 text-sm mt-1">
            Proses pengembalian buku yang dipinjam
          </p>
        </div>

        <button
          onClick={getBorrows}
          className="flex items-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-100 px-4 py-2.5 rounded-2xl font-semibold transition-all duration-200 border border-cyan-400/20"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-5 border border-cyan-400/20 shadow-lg shadow-cyan-500/5">
          <p className="text-sm text-cyan-300 uppercase tracking-wide">Perlu Dikembalikan</p>
          <p className="text-3xl font-bold text-cyan-100 mt-3">{data.length}</p>
        </div>
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-5 border border-cyan-400/20 shadow-lg shadow-cyan-500/5">
          <p className="text-sm text-cyan-300 uppercase tracking-wide">Total Denda</p>
          <p className="text-3xl font-bold text-cyan-100 mt-3">
            Rp {totalDenda.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-5 border border-cyan-400/20 shadow-lg shadow-cyan-500/5">
          <p className="text-sm text-cyan-300 uppercase tracking-wide">Rata-rata Denda</p>
          <p className="text-3xl font-bold text-cyan-100 mt-3">
            Rp {data.length > 0 ? Math.round(totalDenda / data.length).toLocaleString("id-ID") : "0"}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-4 border border-cyan-400/20">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama atau judul buku..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-700/30 border border-cyan-400/30 rounded-2xl p-3.5 pl-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400/50 transition-all duration-200"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setCurrentPage(1);
              }}
              title="Hapus pencarian"
              aria-label="Hapus pencarian"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-300 hover:text-cyan-100 transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl border border-cyan-400/20 overflow-hidden shadow-xl shadow-cyan-500/5">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center gap-3 text-cyan-300 font-semibold">
              <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              Memuat data...
            </div>
          </div>
        ) : currentData.length === 0 ? (
          <div className="p-12 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="p-4 bg-cyan-500/10 rounded-full">
                <CheckCircle className="w-12 h-12 text-cyan-400" />
              </div>
              <p className="text-cyan-100 font-semibold">Tidak ada buku yang perlu dikembalikan</p>
              <p className="text-sm text-cyan-300/70">Semua buku sudah dikembalikan</p>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/30">
                  <tr>
                    <th className="px-4 py-4 text-center text-xs font-bold text-cyan-300 uppercase tracking-widest">No</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-cyan-300 uppercase tracking-widest">Nama</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-cyan-300 uppercase tracking-widest">Buku</th>
                    <th className="px-4 py-4 text-center text-xs font-bold text-cyan-300 uppercase tracking-widest">Tanggal Pinjam</th>
                    <th className="px-4 py-4 text-center text-xs font-bold text-cyan-300 uppercase tracking-widest">Tanggal Kembali</th>
                    <th className="px-4 py-4 text-center text-xs font-bold text-cyan-300 uppercase tracking-widest">Denda</th>
                    <th className="px-4 py-4 text-center text-xs font-bold text-cyan-300 uppercase tracking-widest">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-400/10">
                  {currentData.map((item, index) => {
                    const denda = hitungDenda(item.tanggal_kembali);
                    const isLate = denda > 0;

                    return (
                      <tr key={item.id} className="hover:bg-cyan-500/10 transition-colors duration-200">
                        <td className="px-4 py-4 text-center text-sm text-cyan-200">
                          {startIndex + index + 1}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-cyan-400" />
                            <span className="text-white font-medium">{item.nama}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <BookMarked className="w-4 h-4 text-cyan-300" />
                            <span className="text-cyan-100">{item.judul_buku}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-1.5 text-gray-300 text-sm">
                            <Calendar className="w-3.5 h-3.5 text-gray-500" />
                            {item.tanggal_pinjam}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-1.5 text-gray-300 text-sm">
                            <Calendar className="w-3.5 h-3.5 text-gray-500" />
                            {item.tanggal_kembali}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-center">
                            <span
                              className={`flex items-center gap-1 font-semibold ${
                                isLate ? "text-orange-300" : "text-cyan-300"
                              }`}
                            >
                              <DollarSign className="w-3.5 h-3.5" />
                              Rp {denda.toLocaleString("id-ID")}
                              {isLate && (
                                <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full ml-1">
                                  Terlambat
                                </span>
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-center">
                            <button
                              onClick={() => handleReturn(item)}
                              className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Kembalikan
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredData.length > 0 && (
              <div className="px-6 py-4 border-t border-cyan-400/20 flex flex-col sm:flex-row justify-between items-center gap-4 bg-cyan-500/5">
                <p className="text-sm text-cyan-100 font-semibold">
                  Menampilkan {startIndex + 1} - {Math.min(endIndex, filteredData.length)} dari {filteredData.length} peminjaman
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    title="Halaman sebelumnya"
                    aria-label="Halaman sebelumnya"
                    className="p-2 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-cyan-400/20"
                  >
                    <ChevronLeft className="w-4 h-4 text-cyan-400" />
                  </button>
                  <span className="text-sm text-cyan-200 px-3 py-1 bg-cyan-500/10 rounded-lg border border-cyan-400/20">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    title="Halaman berikutnya"
                    aria-label="Halaman berikutnya"
                    className="p-2 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-cyan-400/20"
                  >
                    <ChevronRight className="w-4 h-4 text-cyan-400" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-4 border border-cyan-400/20 shadow-lg shadow-cyan-500/5">
        <h4 className="text-sm font-semibold text-cyan-100 mb-2">💡 Informasi Pengembalian:</h4>
        <ul className="text-sm text-cyan-300/80 space-y-1">
          <li>• Denda dihitung otomatis berdasarkan keterlambatan</li>
          <li>• Denda per hari: Rp {DENDA_PER_HARI.toLocaleString("id-ID")}</li>
          <li>• Status buku akan otomatis berubah menjadi "Tersedia"</li>
          <li>• Pastikan buku dalam kondisi baik saat dikembalikan</li>
        </ul>
      </div>
    </div>
  );
}
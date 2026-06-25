"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import {
  BookOpen,
  User,
  BookMarked,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  TrendingUp,
  DollarSign,
  RotateCcw
} from "lucide-react";

interface Borrow {
  id: number;
  nama: string;
  judul_buku: string;
  tanggal_pinjam: string;
  tanggal_kembali: string;
  status: string;
  denda: number;
  tanggal_dikembalikan?: string;
}

export default function BorrowPage() {
  const router = useRouter();

  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Denda per hari
  const DENDA_PER_HARI = 1000;

  // Hitung denda otomatis
  function hitungDenda(tanggalKembali: string) {
    const today = new Date();
    const dueDate = new Date(tanggalKembali);

    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    if (today <= dueDate) {
      return 0;
    }

    const diffTime = today.getTime() - dueDate.getTime();
    const terlambat = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return terlambat * DENDA_PER_HARI;
  }

  // Status otomatis
  function getStatus(tanggalKembali: string) {
    const today = new Date();
    const dueDate = new Date(tanggalKembali);

    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    return today > dueDate ? "Terlambat" : "Dipinjam";
  }

  async function getBorrows() {
    setLoading(true);

    const { data, error } = await supabase
      .from("borrow")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error(error.message);
      alert("Gagal mengambil data peminjaman");
    } else {
      setBorrows(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    getBorrows();
  }, []);

  async function deleteBorrow(id: number) {
    const confirmDelete = window.confirm("Yakin ingin menghapus data peminjaman?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("borrow")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setBorrows((prev) => prev.filter((item) => item.id !== id));
    alert("Data berhasil dihapus");
  }

  const filteredBorrows = borrows.filter((item) => {
    const keyword = search.toLowerCase();
    return (
      (item.nama || "").toLowerCase().includes(keyword) ||
      (item.judul_buku || "").toLowerCase().includes(keyword)
    );
  });

  const totalPages = Math.ceil(filteredBorrows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBorrows = filteredBorrows.slice(startIndex, endIndex);

  const totalDenda = borrows.reduce((sum, item) => {
    const denda = hitungDenda(item.tanggal_kembali);
    return sum + denda;
  }, 0);

  const totalTerlambat = borrows.filter((item) => {
    const status = getStatus(item.tanggal_kembali);
    return status === "Terlambat";
  }).length;

  const totalDikembalikan = borrows.filter((item) => item.status === "Dikembalikan").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-cyan-400" />
            Data Peminjaman
          </h1>
          <p className="text-cyan-200/80 text-sm mt-1">
            Kelola data peminjaman buku
          </p>
        </div>

        <button
          onClick={() => router.push("/admin/borrow/add")}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-5 py-2.5 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30"
        >
          <Plus className="w-5 h-5" />
          Tambah Peminjaman
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-5 border border-cyan-400/20 shadow-lg shadow-cyan-500/5">
          <p className="text-sm text-cyan-300 uppercase tracking-wide">Total Peminjaman</p>
          <p className="text-3xl font-bold text-cyan-100 mt-3">{borrows.length}</p>
        </div>
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-5 border border-cyan-400/20 shadow-lg shadow-cyan-500/5">
          <p className="text-sm text-cyan-300 uppercase tracking-wide">Terlambat</p>
          <p className="text-3xl font-bold text-orange-300 mt-3">{totalTerlambat}</p>
        </div>
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-5 border border-cyan-400/20 shadow-lg shadow-cyan-500/5">
          <p className="text-sm text-cyan-300 uppercase tracking-wide">Total Denda</p>
          <p className="text-3xl font-bold text-cyan-100 mt-3">
            Rp {totalDenda.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-5 border border-cyan-400/20 shadow-lg shadow-cyan-500/5">
          <p className="text-sm text-cyan-300 uppercase tracking-wide">Dikembalikan</p>
          <p className="text-3xl font-bold text-emerald-300 mt-3">{totalDikembalikan}</p>
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
              className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-300 hover:text-cyan-100 transition-colors"
              title="Bersihkan pencarian"
              aria-label="Bersihkan pencarian"
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
        ) : currentBorrows.length === 0 ? (
          <div className="p-12 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="p-4 bg-cyan-500/10 rounded-full">
                <BookOpen className="w-12 h-12 text-cyan-400" />
              </div>
              <p className="text-cyan-100 font-semibold">Belum ada data peminjaman</p>
              <p className="text-sm text-cyan-300/70">Tambahkan peminjaman baru untuk memulai</p>
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
                    <th className="px-4 py-4 text-center text-xs font-bold text-cyan-300 uppercase tracking-widest">Tanggal Dikembalikan</th>
                    <th className="px-4 py-4 text-center text-xs font-bold text-cyan-300 uppercase tracking-widest">Status</th>
                    <th className="px-4 py-4 text-center text-xs font-bold text-cyan-300 uppercase tracking-widest">Denda</th>
                    <th className="px-4 py-4 text-center text-xs font-bold text-cyan-300 uppercase tracking-widest">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-400/10">
                  {currentBorrows.map((borrow, index) => {
                    const status = getStatus(borrow.tanggal_kembali);
                    const denda = hitungDenda(borrow.tanggal_kembali);
                    const isReturned = borrow.status === "Dikembalikan";

                    return (
                      <tr key={borrow.id} className="hover:bg-white/5 transition-colors duration-200">
                        <td className="px-4 py-4 text-center text-sm text-gray-400">
                          {startIndex + index + 1}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-cyan-400" />
                            <span className="text-white font-medium">{borrow.nama}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <BookMarked className="w-4 h-4 text-cyan-300" />
                            <span className="text-cyan-100">{borrow.judul_buku}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-1.5 text-gray-300 text-sm">
                            <Calendar className="w-3.5 h-3.5 text-gray-500" />
                            {borrow.tanggal_pinjam}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-1.5 text-gray-300 text-sm">
                            <Calendar className="w-3.5 h-3.5 text-gray-500" />
                            {borrow.tanggal_kembali}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-1.5 text-gray-300 text-sm">
                            {borrow.tanggal_dikembalikan ? (
                              <>
                                <RotateCcw className="w-3.5 h-3.5 text-green-400" />
                                <span className="text-green-400">{borrow.tanggal_dikembalikan}</span>
                              </>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-center">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                                isReturned
                                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/20"
                                  : status === "Terlambat"
                                  ? "bg-orange-500/20 text-orange-300 border border-orange-400/20"
                                  : "bg-cyan-500/20 text-cyan-300 border border-cyan-400/20"
                              }`}
                            >
                              {isReturned ? (
                                <CheckCircle className="w-3.5 h-3.5" />
                              ) : status === "Terlambat" ? (
                                <AlertCircle className="w-3.5 h-3.5" />
                              ) : (
                                <Clock className="w-3.5 h-3.5" />
                              )}
                              {isReturned ? "Dikembalikan" : status}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-center">
                            <span
                              className={`font-semibold ${
                                isReturned 
                                  ? "text-cyan-300" 
                                  : denda > 0 
                                  ? "text-orange-300" 
                                  : "text-cyan-300"
                              }`}
                            >
                              {denda > 0 ? (
                                <div className="flex items-center gap-1">
                                  <DollarSign className="w-3.5 h-3.5" />
                                  Rp {denda.toLocaleString("id-ID")}
                                </div>
                              ) : (
                                "Rp 0"
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-center">
                            {!isReturned && (
                              <button
                                onClick={() => deleteBorrow(borrow.id)}
                                className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 hover:scale-105"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Hapus
                              </button>
                            )}
                            {isReturned && (
                              <span className="text-xs text-gray-500">Selesai</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredBorrows.length > 0 && (
              <div className="px-6 py-4 border-t border-cyan-400/20 flex flex-col sm:flex-row justify-between items-center gap-4 bg-cyan-500/5">
                <p className="text-sm text-cyan-100 font-semibold">
                  Menampilkan {startIndex + 1} - {Math.min(endIndex, filteredBorrows.length)} dari {filteredBorrows.length} peminjaman
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Previous page"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-cyan-400/20"
                  >
                    <ChevronLeft className="w-4 h-4 text-cyan-400" />
                  </button>
                  <span className="text-sm text-cyan-200 px-3 py-1 bg-cyan-500/10 rounded-lg border border-cyan-400/20">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    type="button"
                    aria-label="Next page"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
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
    </div>
  );
}
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  BookOpen,
  BookMarked,
  MapPin,
  AlertCircle,
  CheckCircle,
  XCircle,
  Lightbulb,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface Book {
  id: number;
  kode_buku: string;
  judul: string;
  rack_code: string;
  status: string;
}

export default function BooksPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getBooks = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("books")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.log(error);
    } else {
      setBooks(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    getBooks();
  }, []);

  const filteredBooks = books.filter((book) =>
    book.judul.toLowerCase().includes(search.toLowerCase()) ||
    book.kode_buku.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBooks = filteredBooks.slice(startIndex, endIndex);

  const deleteBook = async (id: number) => {
    if (!confirm("Yakin ingin menghapus buku ini?")) return;

    const { error } = await supabase
      .from("books")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Data berhasil dihapus");
    getBooks();
  };

  function editBook(id: number) {
    router.push(`/admin/books/edit/${id}`);
  }

  function turnOnLed(rack_code: string): void {
    (async () => {
      try {
        const resp = await fetch(`/api/led`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rack_code }),
        });

        if (!resp.ok) {
          const text = await resp.text();
          alert("Gagal menyalakan LED: " + text);
          return;
        }

        alert("Permintaan menyalakan LED dikirim.");
      } catch (err: any) {
        alert("Terjadi kesalahan: " + (err?.message || err));
      }
    })();
  }

  return (
    <div className="space-y-6 max-w-7xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg">
              <BookOpen className="w-6 h-6 text-cyan-400" />
            </div>
            Data Buku
          </h1>
          <p className="text-slate-400 text-sm mt-1 ml-11">
            Kelola koleksi buku perpustakaan
          </p>
        </div>

        <button
          onClick={() => router.push("/admin/books/add")}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 active:scale-[0.97] text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
        >
          <Plus className="w-5 h-5" />
          Tambah Buku
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-gradient-to-r from-slate-900/80 to-slate-900/50 backdrop-blur-sm rounded-2xl p-4 border border-cyan-500/20 shadow-lg">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan judul atau kode buku..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-800/50 border border-cyan-400/20 rounded-xl p-3.5 pl-12 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all duration-200"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setCurrentPage(1);
              }}
              aria-label="Hapus pencarian"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
            >
              <XCircle className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-cyan-500/20 overflow-hidden shadow-lg shadow-cyan-500/10">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-3 border-slate-700 border-t-cyan-400 rounded-full animate-spin"></div>
              <p className="text-cyan-400 font-semibold">Memuat data buku...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50 border-b border-slate-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-cyan-300 uppercase tracking-widest">No</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-cyan-300 uppercase tracking-widest">Kode Buku</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-cyan-300 uppercase tracking-widest">Judul</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-cyan-300 uppercase tracking-widest">Rak</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-cyan-300 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-cyan-300 uppercase tracking-widest">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/30">
                  {currentBooks.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                            <BookMarked className="w-12 h-12 text-cyan-400/60" />
                          </div>
                          <p className="text-slate-300 font-semibold">Tidak ada data buku</p>
                          <p className="text-sm text-slate-500">Tambahkan buku baru untuk memulai</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentBooks.map((book, index) => (
                      <tr key={book.id} className="hover:bg-cyan-500/5 transition-colors duration-150">
                        <td className="px-6 py-4 text-sm text-slate-300 font-semibold">
                          {startIndex + index + 1}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 px-3 py-1.5 rounded-lg text-xs font-mono border border-cyan-400/30">
                            {book.kode_buku}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-cyan-400" />
                            <span className="text-white font-medium">{book.judul}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-cyan-400/20">
                              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                              <span className="text-sm font-mono text-cyan-100">{book.rack_code}</span>
                            </div>
                            <button
                              onClick={() => turnOnLed(book.rack_code)}
                              className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 active:scale-[0.95] text-cyan-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border border-cyan-400/30"
                              title="Nyalakan LED untuk mencari buku"
                            >
                              <Lightbulb className="w-3.5 h-3.5" />
                              Cari
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-200 ${
                              book.status === "Tersedia"
                                ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-400/30"
                                : "bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-300 border-red-400/30"
                            }`}
                          >
                            {book.status === "Tersedia" ? (
                              <CheckCircle className="w-3.5 h-3.5" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5" />
                            )}
                            {book.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => editBook(book.id)}
                              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 active:scale-[0.95] text-amber-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border border-amber-400/30"
                              title="Edit buku"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              Edit
                            </button>
                            <button
                              onClick={() => deleteBook(book.id)}
                              className="flex items-center gap-1.5 bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 active:scale-[0.95] text-red-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border border-red-400/30"
                              title="Hapus buku"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredBooks.length > 0 && (
              <div className="px-6 py-4 border-t border-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-800/30">
                <p className="text-sm text-cyan-300 font-medium">
                  Menampilkan <span className="font-semibold">{startIndex + 1}</span> - <span className="font-semibold">{Math.min(endIndex, filteredBooks.length)}</span> dari <span className="font-semibold">{filteredBooks.length}</span> buku
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    aria-label="Halaman sebelumnya"
                    className="p-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <ChevronLeft className="w-4 h-4 text-cyan-400" />
                  </button>
                  <span className="text-sm text-cyan-200 px-4 py-2 bg-cyan-500/10 rounded-lg border border-cyan-400/20 font-semibold">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    aria-label="Halaman berikutnya"
                    className="p-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <ChevronRight className="w-4 h-4 text-cyan-400" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/20 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-cyan-300 font-bold uppercase tracking-wider">Total Buku</p>
              <p className="text-3xl font-bold text-white mt-3">{books.length}</p>
            </div>
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
              <BookOpen className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/20 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-cyan-300 font-bold uppercase tracking-wider">Tersedia</p>
              <p className="text-3xl font-bold text-cyan-100 mt-3">
                {books.filter(b => b.status === "Tersedia").length}
              </p>
            </div>
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/20 shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-orange-300 font-bold uppercase tracking-wider">Dipinjam</p>
              <p className="text-3xl font-bold text-orange-100 mt-3">
                {books.filter(b => b.status === "Dipinjam").length}
              </p>
            </div>
            <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <BookMarked className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

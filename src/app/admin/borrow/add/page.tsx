"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import {
  User,
  BookOpen,
  Calendar,
  Save,
  ArrowLeft,
  XCircle,
  CheckCircle,
  AlertCircle,
  Users,
  BookMarked,
  CalendarDays,
  PlusCircle
} from "lucide-react";

interface student {
  id: number;
  nama: string;
}

interface Book {
  id: number;
  judul: string;
  status: string;
}

export default function AddBorrowPage() {
  const router = useRouter();

  const [students, setStudents] = useState<student[]>([]);
  const [books, setBooks] = useState<Book[]>([]);

  const [studentId, setStudentId] = useState("");
  const [selectedBooks, setSelectedBooks] = useState<number[]>([]);
  const [tanggalKembali, setTanggalKembali] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getStudents();
    getBooks();
  }, []);

  async function getStudents() {
    const { data, error } = await supabase
      .from("students")
      .select("id,nama")
      .order("nama");

    if (!error) {
      setStudents(data || []);
    }
  }

  async function getBooks() {
    const { data, error } = await supabase
      .from("books")
      .select("id,judul,status")
      .eq("status", "Tersedia")
      .order("judul");

    if (!error) {
      setBooks(data || []);
    }
  }

  function toggleBook(id: number) {
    if (selectedBooks.includes(id)) {
      setSelectedBooks(selectedBooks.filter((item) => item !== id));
    } else {
      setSelectedBooks([...selectedBooks, id]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!studentId) {
      setError("Pilih anggota terlebih dahulu");
      return;
    }

    if (selectedBooks.length === 0) {
      setError("Pilih minimal 1 buku");
      return;
    }

    setLoading(true);

    try {
      const today = new Date().toISOString().split("T")[0];

      const selectedStudent = students.find((s) => s.id === Number(studentId));

      const selectedBookTitles = books
        .filter((book) => selectedBooks.includes(book.id))
        .map((book) => book.judul)
        .join(", ");

      const { data: borrowData, error } = await supabase
        .from("borrow")
        .insert([
          {
            member_id: Number(studentId),
            nama: selectedStudent?.nama,
            judul_buku: selectedBookTitles,
            tanggal_pinjam: today,
            tanggal_kembali: tanggalKembali,
            status: "Dipinjam",
            denda: 0,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      const detailData = selectedBooks.map((bookId) => ({
        borrow_id: borrowData.id,
        book_id: bookId,
      }));

      const { error: detailError } = await supabase
        .from("borrow_details")
        .insert(detailData);

      if (detailError) {
        throw detailError;
      }

      const { error: updateBookError } = await supabase
        .from("books")
        .update({ status: "Dipinjam" })
        .in("id", selectedBooks);

      if (updateBookError) {
        throw updateBookError;
      }

      alert("Peminjaman berhasil ditambahkan");
      router.push("/admin/borrow");
    } catch (error: any) {
      setError(error.message || "Terjadi kesalahan");
    }

    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          title="Kembali"
          aria-label="Kembali"
          onClick={() => router.push("/admin/borrow")}
          className="p-2 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-2xl transition-colors border border-cyan-400/20"
        >
          <ArrowLeft className="w-5 h-5 text-cyan-400" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <PlusCircle className="w-8 h-8 text-cyan-400" />
            Tambah Peminjaman
          </h1>
          <p className="text-cyan-200/80 text-sm mt-1">
            Tambahkan peminjaman buku baru
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-cyan-400/20 shadow-xl shadow-cyan-500/5">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-300 font-medium">Terjadi kesalahan</p>
                <p className="text-red-200/80 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Pilih Anggota */}
          <div>
            <label htmlFor="studentId" className="block text-sm font-medium text-cyan-100 mb-2">
              Pilih Anggota
            </label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
              <select
                id="studentId"
                title="Pilih Anggota"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full bg-slate-700/30 border border-cyan-400/30 rounded-2xl p-3.5 pl-12 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400/50 transition-all duration-200 appearance-none cursor-pointer"
                required
              >
                <option value="" className="bg-slate-800 text-gray-400">
                  Pilih Anggota
                </option>
                {students.map((student) => (
                  <option key={student.id} value={student.id} className="bg-slate-800 text-white">
                    {student.nama}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <User className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {students.length} anggota tersedia
            </p>
          </div>

          {/* Tanggal Kembali */}
          <div>
            <label htmlFor="tanggalKembali" className="block text-sm font-medium text-cyan-100 mb-2">
              Tanggal Kembali
            </label>
            <div className="relative">
              <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
              <input
                id="tanggalKembali"
                title="Tanggal Kembali"
                placeholder="Tanggal Kembali"
                type="date"
                value={tanggalKembali}
                onChange={(e) => setTanggalKembali(e.target.value)}
                className="w-full bg-slate-700/30 border border-cyan-400/30 rounded-2xl p-3.5 pl-12 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400/50 transition-all duration-200"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Batas waktu pengembalian buku</p>
          </div>

          {/* Pilih Buku */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Pilih Buku
            </label>
            <div className="bg-slate-900/80 border border-cyan-400/20 rounded-3xl p-4">
              <div className="grid md:grid-cols-2 gap-3">
                {books.length === 0 ? (
                  <div className="col-span-2 text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <BookOpen className="w-12 h-12 text-cyan-300" />
                      <p className="text-cyan-100">Tidak ada buku tersedia</p>
                      <p className="text-sm text-cyan-300/70">Semua buku sedang dipinjam</p>
                    </div>
                  </div>
                ) : (
                  books.map((book) => (
                    <label
                      key={book.id}
                      className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-200 border ${
                        selectedBooks.includes(book.id)
                          ? "bg-cyan-500/20 border-cyan-400/40"
                          : "bg-slate-800/60 border-cyan-400/15 hover:bg-slate-800/80"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedBooks.includes(book.id)}
                        onChange={() => toggleBook(book.id)}
                        className="w-4 h-4 accent-cyan-500 cursor-pointer"
                      />
                      <BookMarked className="w-4 h-4 text-cyan-300" />
                      <span className="text-sm text-cyan-100">{book.judul}</span>
                      {selectedBooks.includes(book.id) && (
                        <CheckCircle className="w-4 h-4 text-cyan-400 ml-auto" />
                      )}
                    </label>
                  ))
                )}
              </div>
              <p className="text-xs text-cyan-300/70 mt-3">
                {selectedBooks.length} buku dipilih dari {books.length} tersedia
              </p>
            </div>
          </div>

          {/* Summary */}
          {selectedBooks.length > 0 && studentId && (
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-400/20 rounded-3xl p-4 shadow-lg shadow-cyan-500/5">
              <h4 className="text-sm font-semibold text-cyan-100 mb-2">📋 Ringkasan Peminjaman</h4>
              <div className="space-y-1 text-sm">
                <p className="text-cyan-200">
                  <span className="text-cyan-300">Anggota:</span>{" "}
                  {students.find((m) => m.id === Number(studentId))?.nama || "-"}
                </p>
                <p className="text-cyan-200">
                  <span className="text-cyan-300">Jumlah Buku:</span> {selectedBooks.length}
                </p>
                <p className="text-cyan-200">
                  <span className="text-cyan-300">Tanggal Kembali:</span>{" "}
                  {tanggalKembali ? new Date(tanggalKembali).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  }) : "-"}
                </p>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3.5 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Simpan Peminjaman
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/borrow")}
              className="flex-1 bg-slate-700/30 hover:bg-slate-700/50 text-cyan-100 px-6 py-3.5 rounded-2xl font-medium transition-all duration-200 border border-cyan-400/20 flex items-center justify-center gap-2"
            >
              <XCircle className="w-5 h-5" />
              Batal
            </button>
          </div>
        </form>
      </div>

      {/* Info Card */}
      <div className="mt-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-3xl p-4 border border-cyan-400/20 shadow-lg shadow-cyan-500/5">
        <h4 className="text-sm font-semibold text-cyan-100 mb-2">💡 Informasi:</h4>
        <ul className="text-sm text-cyan-300/80 space-y-1">
          <li>• Pilih anggota yang akan meminjam buku</li>
          <li>• Pilih satu atau lebih buku yang tersedia</li>
          <li>• Tentukan tanggal pengembalian buku</li>
          <li>• Denda akan dihitung otomatis jika terlambat</li>
        </ul>
      </div>
    </div>
  );
}
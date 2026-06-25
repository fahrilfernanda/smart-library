"use client";

import QRCode from "react-qr-code";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import {
  Search,
  Plus,
  RefreshCw,
  Edit,
  Trash2,
  Users,
  User,
  GraduationCap,
  Mail,
  Phone,
  QrCode as QrIcon,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  XCircle,
  AlertCircle
} from "lucide-react";

interface Student {
  id: number;
  nama: string;
  nim: string;
  jurusan: string;
  email: string;
  no_hp: string;
  qr_code: string;
}

export default function StudentPage() {
  const router = useRouter();

  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    getStudents();
  }, []);

  async function getStudents() {
    setLoading(true);

    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("nama", { ascending: true });

    if (error) {
      console.log(error.message);
      alert("Gagal mengambil data student");
      setStudents([]);
    } else {
      setStudents(data || []);
    }

    setLoading(false);
  }

  async function deleteStudent(id: number) {
    const confirmDelete = window.confirm("Yakin ingin menghapus student?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("students")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Student berhasil dihapus");
    getStudents();
  }

  function editStudent(id: number) {
    router.push(`/admin/student/edit?id=${id}`);
  }

  const filteredStudents = students.filter((item) => {
    const keyword = search.toLowerCase();
    return (
      item.nama.toLowerCase().includes(keyword) ||
      item.nim.toLowerCase().includes(keyword) ||
      item.jurusan.toLowerCase().includes(keyword) ||
      item.email.toLowerCase().includes(keyword)
    );
  });

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <Users className="w-8 h-8 text-cyan-400" />
            Data Student
          </h1>
          <p className="text-cyan-200/80 text-sm mt-1">
            Kelola data anggota perpustakaan
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={getStudents}
            className="flex items-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-100 px-4 py-2.5 rounded-2xl font-semibold transition-all duration-200 border border-cyan-400/20"
          >
            <RefreshCw className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => router.push("/admin/student/add")}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-5 py-2.5 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30"
          >
            <UserPlus className="w-5 h-5" />
            Tambah Student
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-4 border border-cyan-400/20">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, NIM, jurusan, atau email..."
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
              title="Clear search"
              aria-label="Clear search"
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
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/30">
                  <tr>
                    <th className="px-4 py-4 text-center text-xs font-bold text-cyan-300 uppercase tracking-widest">No</th>
                    <th className="px-4 py-4 text-center text-xs font-bold text-cyan-300 uppercase tracking-widest">QR Code</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-cyan-300 uppercase tracking-widest">NIM</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-cyan-300 uppercase tracking-widest">Nama</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-cyan-300 uppercase tracking-widest">Jurusan</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-cyan-300 uppercase tracking-widest">Email</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-cyan-300 uppercase tracking-widest">No HP</th>
                    <th className="px-4 py-4 text-center text-xs font-bold text-cyan-300 uppercase tracking-widest">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-400/10">
                  {currentStudents.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="p-4 bg-cyan-500/10 rounded-full">
                            <Users className="w-12 h-12 text-cyan-400" />
                          </div>
                          <p className="text-cyan-100 font-semibold">Tidak ada data student</p>
                          <p className="text-sm text-cyan-300/70">Tambahkan student baru untuk memulai</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentStudents.map((item, index) => (
                      <tr key={item.id} className="hover:bg-white/5 transition-colors duration-200">
                        <td className="px-4 py-4 text-center text-sm text-cyan-200">
                          {startIndex + index + 1}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-center">
                            <div className="bg-slate-900/90 rounded-2xl p-1.5 shadow-lg shadow-cyan-500/10">
                              <QRCode value={item.qr_code || ""} size={50} />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-1.5 bg-cyan-500/20 text-cyan-200 px-2.5 py-1 rounded-2xl text-xs font-mono border border-cyan-400/20">
                            <GraduationCap className="w-3 h-3 text-cyan-300" />
                            {item.nim}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-cyan-400" />
                            <span className="text-white font-medium">{item.nama}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-cyan-100 text-sm">{item.jurusan}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5 text-cyan-100 text-sm">
                            <Mail className="w-3.5 h-3.5 text-cyan-400" />
                            {item.email}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5 text-cyan-100 text-sm">
                            <Phone className="w-3.5 h-3.5 text-cyan-400" />
                            {item.no_hp || "-"}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => editStudent(item.id)}
                              className="flex items-center gap-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 hover:scale-105"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              Edit
                            </button>
                            <button
                              onClick={() => deleteStudent(item.id)}
                              className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 hover:scale-105"
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
            {filteredStudents.length > 0 && (
              <div className="px-6 py-4 border-t border-cyan-400/20 flex flex-col sm:flex-row justify-between items-center gap-4 bg-cyan-500/5">
                <p className="text-sm text-cyan-100 font-semibold">
                  Menampilkan {startIndex + 1} - {Math.min(endIndex, filteredStudents.length)} dari {filteredStudents.length} student
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    title="Previous page"
                    aria-label="Previous page"
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
                    title="Next page"
                    aria-label="Next page"
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-5 border border-cyan-400/20 shadow-lg shadow-cyan-500/5">
          <p className="text-sm text-cyan-300 uppercase tracking-wide">Total Student</p>
          <p className="text-3xl font-bold text-cyan-100 mt-3">{students.length}</p>
        </div>
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-5 border border-cyan-400/20 shadow-lg shadow-cyan-500/5">
          <p className="text-sm text-cyan-300 uppercase tracking-wide">Dengan QR Code</p>
          <p className="text-3xl font-bold text-cyan-100 mt-3">
            {students.filter(s => s.qr_code).length}
          </p>
        </div>
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-5 border border-cyan-400/20 shadow-lg shadow-cyan-500/5">
          <p className="text-sm text-cyan-300 uppercase tracking-wide">Tanpa QR Code</p>
          <p className="text-3xl font-bold text-cyan-100 mt-3">
            {students.filter(s => !s.qr_code).length}
          </p>
        </div>
      </div>
    </div>
  );
}

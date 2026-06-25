"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import { supabase } from "../../../lib/supabase";
import { 
  LogOut, 
  User, 
  Mail, 
  GraduationCap, 
  BookOpen, 
  Library,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  UserCircle,
  QrCode as QrIcon,
  BookMarked,
  BookX,
} from "lucide-react";

interface Student {
  id: string;
  nama: string;
  nim: string;
  jurusan: string;
  email: string;
  qr_code: string;
}

interface Borrow {
  id: number;
  judul_buku: string;
  tanggal_pinjam: string;
  tanggal_kembali: string;
  status: string;
}

export default function StudentDashboard() {
  const router = useRouter();

  const [student, setStudent] = useState<Student | null>(null);
  const [borrow, setBorrow] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    checkLogin();
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  async function checkLogin() {
    const email = localStorage.getItem("student_email");

    if (!email) {
      router.replace("/login");
      return;
    }

    await loadStudent(email);
  }

  async function loadStudent(email: string) {
    try {
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .select("*")
        .eq("email", email)
        .single();

      if (studentError || !studentData) {
        localStorage.removeItem("student_email");
        router.replace("/login");
        return;
      }

      setStudent(studentData);

      const { data: borrowData, error: borrowError } = await supabase
        .from("borrow")
        .select("*")
        .eq("nama", studentData.nama)
        .eq("status", "Dipinjam")
        .order("id", { ascending: false });

      if (borrowError) {
        console.log(borrowError.message);
        setBorrow([]);
      } else {
        setBorrow(borrowData || []);
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  }

  async function handleLogout() {
    localStorage.removeItem("student_email");
    await supabase.auth.signOut();
    router.replace("/login");
  }

  function calculateFine(tanggal_kembali: string): number {
    const today = new Date();
    const returnDate = new Date(tanggal_kembali);
    const diffTime = today.getTime() - returnDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays * 1000 : 0;
  }

  function isOverdue(tanggal_kembali: string): boolean {
    const today = new Date();
    const returnDate = new Date(tanggal_kembali);
    return today > returnDate;
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111827] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-600 border-t-white rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-gray-400">Memuat...</p>
      </div>
    );
  }

  const overdueCount = borrow.filter((b) => isOverdue(b.tanggal_kembali)).length;
  const totalFine = borrow.reduce((total, item) => total + calculateFine(item.tanggal_kembali), 0);

  return (
    <div className="min-h-screen bg-[#111827]">
      
      {/* Navbar */}
      <nav className="bg-[#1f2937]/80 border-b border-gray-700/50 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-blue-500/10 rounded-lg">
                <Library className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-sm font-bold text-white">Smart Library</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-1.5 text-gray-400 text-xs">
                <Clock className="w-3 h-3" />
                <span className="font-mono">
                  {currentTime.toLocaleDateString("id-ID", { 
                    weekday: "short", day: "numeric", month: "short", year: "numeric" 
                  })}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
              >
                <LogOut className="w-3 h-3" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Welcome */}
        <div className="mb-8">
          <p className="text-gray-500 text-xs mb-0.5">Selamat Datang</p>
          <h2 className="text-xl font-bold text-white">{student?.nama}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-400">{student?.nim}</span>
            <span className="w-0.5 h-0.5 bg-gray-600 rounded-full"></span>
            <span className="text-xs text-gray-400">{student?.jurusan}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-[#1f2937]/60 border border-gray-700/40 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2.5">
              <div className="p-1.5 bg-blue-500/10 rounded-md">
                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              </div>
            </div>
            <p className="text-xl font-bold text-white">{borrow.length}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Dipinjam</p>
          </div>

          <div className="bg-[#1f2937]/60 border border-gray-700/40 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2.5">
              <div className="p-1.5 bg-red-500/10 rounded-md">
                <AlertCircle className="w-3.5 h-3.5 text-red-400" />
              </div>
            </div>
            <p className="text-xl font-bold text-white">{overdueCount}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Terlambat</p>
          </div>

          <div className="bg-[#1f2937]/60 border border-gray-700/40 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2.5">
              <div className="p-1.5 bg-amber-500/10 rounded-md">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
              </div>
            </div>
            <p className="text-xl font-bold text-white">{formatCurrency(totalFine)}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Denda</p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-8">

          {/* Data Siswa */}
          <div className="lg:col-span-2 bg-[#1f2937]/60 border border-gray-700/40 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-700/40">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <UserCircle className="w-3 h-3" />
                Data Mahasiswa
              </h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: User, label: "Nama", value: student?.nama },
                  { icon: GraduationCap, label: "NIM", value: student?.nim },
                  { icon: BookOpen, label: "Jurusan", value: student?.jurusan },
                  { icon: Mail, label: "Email", value: student?.email },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 bg-gray-800/30 border border-gray-700/30 rounded-lg px-3.5 py-3"
                  >
                    <item.icon className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[9px] text-gray-500 uppercase tracking-wider">{item.label}</p>
                      <p className="text-xs text-gray-200 truncate">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-[#1f2937]/60 border border-gray-700/40 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-700/40">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <QrIcon className="w-3 h-3" />
                QR Code
              </h3>
            </div>
            <div className="p-4 flex flex-col items-center">
              <div className="bg-white rounded-lg p-3">
                <QRCode value={student?.qr_code || ""} size={140} />
              </div>
              <p className="mt-3 text-[10px] font-mono text-gray-500 text-center break-all">
                {student?.qr_code}
              </p>
              <p className="text-[10px] text-gray-500 mt-1">Scan untuk absensi</p>
            </div>
          </div>
        </div>

        {/* Tabel Buku */}
        <div className="bg-[#1f2937]/60 border border-gray-700/40 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-700/40 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <BookMarked className="w-3 h-3" />
              Buku Dipinjam
            </h3>
            <span className="text-[10px] font-mono text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded">
              {borrow.length}
            </span>
          </div>

          {borrow.length === 0 ? (
            <div className="py-16 text-center">
              <div className="inline-flex p-3 bg-gray-800/30 rounded-lg mb-3">
                <BookX className="w-6 h-6 text-gray-600" />
              </div>
              <p className="text-xs text-gray-500">Belum ada buku yang dipinjam</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-gray-700/40">
                    <th className="px-4 py-2.5 text-left text-[9px] font-semibold text-gray-500 uppercase tracking-wider">No</th>
                    <th className="px-4 py-2.5 text-left text-[9px] font-semibold text-gray-500 uppercase tracking-wider">Judul Buku</th>
                    <th className="px-4 py-2.5 text-left text-[9px] font-semibold text-gray-500 uppercase tracking-wider">Tgl Pinjam</th>
                    <th className="px-4 py-2.5 text-left text-[9px] font-semibold text-gray-500 uppercase tracking-wider">Tgl Kembali</th>
                    <th className="px-4 py-2.5 text-left text-[9px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-2.5 text-left text-[9px] font-semibold text-gray-500 uppercase tracking-wider">Denda</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/30">
                  {borrow.map((item, index) => {
                    const overdue = isOverdue(item.tanggal_kembali);
                    const fine = calculateFine(item.tanggal_kembali);
                    return (
                      <tr key={item.id} className="hover:bg-gray-800/20 transition-colors">
                        <td className="px-4 py-3 text-xs text-gray-500 font-mono">
                          {String(index + 1).padStart(2, "0")}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-gray-800/50 rounded shrink-0">
                              <BookMarked className="w-3 h-3 text-gray-500" />
                            </div>
                            <span className="text-xs text-gray-200">{item.judul_buku}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-400 font-mono">{item.tanggal_pinjam}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-xs font-mono ${overdue ? "text-red-400" : "text-gray-400"}`}>
                              {item.tanggal_kembali}
                            </span>
                            {overdue && (
                              <span className="text-[9px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded">
                                Terlambat
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded ${
                            overdue 
                              ? "bg-red-500/10 text-red-400" 
                              : "bg-gray-800/50 text-gray-400"
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-mono ${fine > 0 ? "text-red-400" : "text-gray-600"}`}>
                            {fine > 0 ? formatCurrency(fine) : "-"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-700/30 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="p-1 bg-blue-500/10 rounded">
              <Library className="w-2.5 h-2.5 text-blue-400" />
            </div>
            <span className="text-[10px] text-gray-500">Smart Library System</span>
          </div>
          <p className="text-[9px] text-gray-600 font-mono">v1.0</p>
        </div>
      </div>
    </div>
  );
}
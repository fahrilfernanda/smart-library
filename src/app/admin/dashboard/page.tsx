"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import {
  LogOut,
  BookOpen,
  Users,
  BookMarked,
  Camera,
  Clock,
  User,
  Calendar,
  TrendingUp,
  AlertCircle,
  Library,
} from "lucide-react";

interface BorrowData {
  id: number;
  nama: string;
  judul_buku: string;
  tanggal_pinjam: string;
  status: string;
}

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalBorrowed, setTotalBorrowed] = useState(0);
  const [borrows, setBorrows] = useState<BorrowData[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "admin") {
      router.replace("/login");
      return;
    }

    loadDashboard();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);

      console.log(
        "ROLE:",
        localStorage.getItem("role")
      );

      console.log(
        "EMAIL:",
        localStorage.getItem("user_email")
      );

      const [
        booksResult,
        studentsResult,
        borrowResult,
      ] = await Promise.all([
        supabase
          .from("books")
          .select("*", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("students")
          .select("*", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("borrow")
          .select("*")
          .eq("status", "Dipinjam")
          .order("id", {
            ascending: false,
          }),
      ]);

      setTotalBooks(
        booksResult.count || 0
      );

      setTotalStudents(
        studentsResult.count || 0
      );

      if (borrowResult.error) {
        console.error(
          borrowResult.error.message
        );

        setBorrows([]);
        setTotalBorrowed(0);
      } else {
        setBorrows(
          borrowResult.data || []
        );

        setTotalBorrowed(
          borrowResult.data?.length || 0
        );
      }
    } catch (error) {
      console.error(error);

      alert(
        "Gagal memuat dashboard"
      );
    }

    setLoading(false);
  }

  function handleLogout() {
    localStorage.clear();

    router.replace("/login");
  }

  const stats = [
    {
      title: "Total Buku",
      value: totalBooks,
      icon: BookOpen,
      color: "blue",
      bgGlow: "bg-cyan-500/10",
      iconBg: "bg-cyan-500/15 border-cyan-500/30",
      iconColor: "text-cyan-400",
      borderColor: "border-cyan-500/20",
    },
    {
      title: "Total Anggota",
      value: totalStudents,
      icon: Users,
      color: "emerald",
      bgGlow: "bg-blue-500/10",
      iconBg: "bg-blue-500/15 border-blue-500/30",
      iconColor: "text-blue-400",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Sedang Dipinjam",
      value: totalBorrowed,
      icon: BookMarked,
      color: "amber",
      bgGlow: "bg-purple-500/10",
      iconBg: "bg-purple-500/15 border-purple-500/30",
      iconColor: "text-purple-400",
      borderColor: "border-purple-500/20",
    },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 space-y-6 p-6">

      {/* Header */}
      <div className="relative bg-gradient-to-r from-slate-900/80 to-slate-900/50 border border-cyan-500/20 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-lg backdrop-blur-sm overflow-hidden">
        {/* Decorative gradient line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-blue-400 to-cyan-600" />

        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg">
              <Library className="w-4 h-4 text-cyan-400" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Dashboard Admin
            </h1>
          </div>
          <p className="text-sm text-slate-400 ml-12">
            Smart Library System — Ringkasan data perpustakaan
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500/10 hover:bg-red-500/20 active:scale-[0.97] border border-red-500/30 hover:border-red-500/50 text-red-400 px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-all duration-200 shrink-0"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      {/* Waktu */}
      <div className="bg-gradient-to-r from-slate-900/80 to-slate-900/50 border border-cyan-500/20 rounded-xl p-4 flex items-center gap-3 shadow-lg backdrop-blur-sm">
        <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
          <Clock
            size={16}
            className="text-cyan-400"
          />
        </div>
        <div>
          <span className="text-sm font-medium text-white">
            {currentTime.toLocaleDateString(
              "id-ID",
              {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            )}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
          <span className="text-[11px] text-slate-400 font-medium">Live</span>
        </div>
      </div>

      {/* Statistik */}
      <div className="grid md:grid-cols-3 gap-4">

        {stats.map((item, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br from-slate-900/80 to-slate-900/50 border ${item.borderColor} rounded-2xl p-5 shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 relative overflow-hidden group backdrop-blur-sm`}
          >
            {/* Hover glow */}
            <div className={`absolute -top-12 -right-12 w-32 h-32 ${item.bgGlow} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

            <div className="flex justify-between items-start relative">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  {item.title}
                </p>
                <h2 className="text-3xl font-bold text-white tracking-tight">
                  {item.value}
                </h2>
              </div>

              <div className={`p-3 ${item.iconBg} border rounded-xl`}>
                <item.icon
                  size={22}
                  className={item.iconColor}
                />
              </div>
            </div>
          </div>
        ))}

      </div>

      {/* Kamera */}
      <div className="grid md:grid-cols-2 gap-4">

        <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/50 border border-cyan-500/20 rounded-2xl overflow-hidden shadow-lg backdrop-blur-sm">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Camera size={17} className="text-cyan-400" />
              <h2 className="font-semibold text-sm text-white">
                ESP32 CAM 1
              </h2>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider">
                Live
              </span>
            </div>
          </div>
          <div className="p-3">
            <img
              src={
                process.env
                  .NEXT_PUBLIC_CAM1 ||
                "/camera-offline.jpg"
              }
              alt="CAM1"
              className="rounded-xl w-full bg-slate-800 aspect-video object-cover"
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/50 border border-cyan-500/20 rounded-2xl overflow-hidden shadow-lg backdrop-blur-sm">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Camera size={17} className="text-cyan-400" />
              <h2 className="font-semibold text-sm text-white">
                ESP32 CAM 2
              </h2>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider">
                Live
              </span>
            </div>
          </div>
          <div className="p-3">
            <img
              src={
                process.env
                  .NEXT_PUBLIC_CAM2 ||
                "/camera-offline.jpg"
              }
              alt="CAM2"
              className="rounded-xl w-full bg-slate-800 aspect-video object-cover"
            />
          </div>
        </div>

      </div>

      {/* Tabel */}
      <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/50 border border-cyan-500/20 rounded-2xl overflow-hidden shadow-lg backdrop-blur-sm">

        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-white text-lg tracking-tight">
              Peminjaman Aktif
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Daftar buku yang sedang dipinjam saat ini
            </p>
          </div>
          {!loading && (
            <div className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1.5 rounded-lg">
              <BookMarked size={14} className="text-cyan-400" />
              <span className="text-xs font-semibold text-cyan-400">
                {borrows.length} buku
              </span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-[3px] border-slate-700 border-t-cyan-400 rounded-full animate-spin" />
            <p className="text-sm text-slate-400 font-medium">
              Memuat data peminjaman...
            </p>
          </div>
        ) : borrows.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-4">
              <BookMarked size={24} className="text-slate-500" />
            </div>
            <p className="text-slate-300 font-medium text-sm">
              Tidak ada peminjaman aktif
            </p>
            <p className="text-slate-500 text-xs mt-1">
              Semua buku telah dikembalikan
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="p-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-center w-16">
                    No
                  </th>
                  <th className="p-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-left">
                    Nama Peminjam
                  </th>
                  <th className="p-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-left">
                    Judul Buku
                  </th>
                  <th className="p-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-center">
                    Tanggal Pinjam
                  </th>
                  <th className="p-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-center w-32">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {borrows.map(
                  (item, index) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-800 hover:bg-cyan-500/5 transition-colors duration-150"
                    >
                      <td className="p-4 text-center">
                        <span className="text-xs font-mono text-slate-400 bg-slate-800/50 w-6 h-6 inline-flex items-center justify-center rounded-md">
                          {index + 1}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 bg-cyan-500/10 border border-cyan-500/30 rounded-lg flex items-center justify-center shrink-0">
                            <User size={13} className="text-cyan-400" />
                          </div>
                          <span className="text-sm font-medium text-white">
                            {item.nama}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center justify-center shrink-0">
                            <BookOpen size={13} className="text-blue-400" />
                          </div>
                          <span className="text-sm text-slate-300">
                            {item.judul_buku}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Calendar size={12} className="text-slate-500" />
                          <span className="text-sm text-slate-400">
                            {item.tanggal_pinjam}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold">
                          <div className="w-1 h-1 bg-cyan-400 rounded-full" />
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
}

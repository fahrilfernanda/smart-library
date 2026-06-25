"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import { BookOpen, LogIn, UserPlus } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (loading) return;
    setLoading(true);

    try {
      // 1. Cek tabel users (admin & student legacy — pakai plain password)
      const { data: userData, error: userErr } = await supabase
        .from("students")
        .select("*")
        .eq("email", email)
        .eq("password", password)
        .maybeSingle();

      if (!userErr && userData) {
        localStorage.setItem("admin_email", email);
        localStorage.setItem("role", userData.role);

        if (userData.role === "admin") {
          router.push("/admin/dashboard");
          return;
        }

        // Student dari tabel users (legacy)
        localStorage.setItem("student_email", email);
        localStorage.setItem("student_data", JSON.stringify(userData));
        router.push("/student/dashboard");
        return;
      }

      // 2. Coba Supabase Auth (untuk student yang daftar via register)
      const { data: authData, error: authErr } =
        await supabase.auth.signInWithPassword({ email, password });

      if (!authErr && authData.user) {
        // Cek student di tabel students
        const { data: studentData } = await supabase
          .from("students")
          .select("*")
          .eq("email", email)
          .maybeSingle();

        if (studentData) {
          localStorage.setItem("role", "student");
          localStorage.setItem("student_email", email);
          localStorage.setItem("student_data", JSON.stringify(studentData));
          router.push("/student/dashboard");
          return;
        }

        // Cek admin via profiles
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", authData.user.id)
          .maybeSingle();

        if (profile?.role === "admin") {
          localStorage.setItem("role", "admin");
          router.push("/admin/dashboard");
          return;
        }

        // Auth berhasil tapi role tidak dikenal
        await supabase.auth.signOut();
        localStorage.removeItem("role");
        setError("Akun tidak memiliki akses. Hubungi admin.");
        setLoading(false);
        return;
      }

      // 3. Semua gagal
      setError("Email atau password salah");
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan, silakan coba lagi");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -right-24 top-16 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute left-0 bottom-0 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl" />

      <form
        onSubmit={handleLogin}
        className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl shadow-black/30"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl shadow-lg shadow-cyan-500/30 mb-5">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Smart Library
          </h1>
          <p className="text-blue-200/70 text-sm mt-1">
            Masuk ke akun Anda
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-950/50 border border-red-900/50 rounded-xl flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-[10px] font-semibold text-blue-200/50 uppercase tracking-wider mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm placeholder-blue-300/30 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 transition-all"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-[10px] font-semibold text-blue-200/50 uppercase tracking-wider mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm placeholder-blue-300/30 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 transition-all"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white p-3.5 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              Login
            </>
          )}
        </button>

        <p className="text-center mt-6 text-sm text-blue-200/50">
          Belum punya akun?{" "}
          <Link
            href="/student/register"
            className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors inline-flex items-center gap-1"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Daftar di sini
          </Link>
        </p>
      </form>
    </div>
  );
}

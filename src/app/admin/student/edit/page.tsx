"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import {
  User,
  GraduationCap,
  Mail,
  Phone,
  Save,
  ArrowLeft,
  XCircle,
  AlertCircle,
  UserCog,
  BookOpen,
  CheckCircle
} from "lucide-react";

export default function EditStudentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const id = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [nim, setNim] = useState("");
  const [nama, setNama] = useState("");
  const [jurusan, setJurusan] = useState("");
  const [email, setEmail] = useState("");
  const [noHp, setNoHp] = useState("");

  useEffect(() => {
    if (id) {
      getStudent();
    } else {
      router.push("/admin/student");
    }
  }, [id]);

  async function getStudent() {
    setLoading(true);

    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      alert(error.message);
      router.push("/admin/student");
      return;
    }

    setNim(data.nim || "");
    setNama(data.nama || "");
    setJurusan(data.jurusan || "");
    setEmail(data.email || "");
    setNoHp(data.no_hp || "");

    setLoading(false);
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    
    if (saving) return;

    setSaving(true);

    const { error } = await supabase
      .from("students")
      .update({
        nim,
        nama,
        jurusan,
        email,
        no_hp: noHp,
      })
      .eq("id", id);

    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }

    alert("Data student berhasil diperbarui");
    router.push("/admin/student");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-cyan-300 border-t-cyan-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-4 border-cyan-200 border-t-cyan-400 rounded-full animate-spin animation-delay-500"></div>
          </div>
        </div>
        <p className="mt-4 text-cyan-200">Memuat data student...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => router.push("/admin/student")}
          title="Kembali ke daftar student"
          aria-label="Kembali ke daftar student"
          className="p-2 bg-slate-900/80 hover:bg-cyan-500/15 rounded-2xl transition-colors border border-cyan-400/20"
        >
          <ArrowLeft className="w-5 h-5 text-cyan-200" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <UserCog className="w-8 h-8 text-cyan-400" />
            Edit Student
          </h1>
          <p className="text-cyan-200/80 text-sm mt-1">
            Perbarui data anggota perpustakaan
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-cyan-400/20 shadow-xl shadow-cyan-500/5">
        <form onSubmit={handleUpdate} className="space-y-6">
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

          {/* NIM */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              NIM
            </label>
            <div className="relative">
              <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
              <input
                type="text"
                placeholder="Masukkan NIM"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                className="w-full bg-slate-900/70 border border-cyan-400/20 rounded-2xl p-3.5 pl-12 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* Nama Lengkap */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
              <input
                type="text"
                placeholder="Masukkan nama lengkap"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full bg-slate-900/70 border border-cyan-400/20 rounded-2xl p-3.5 pl-12 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* Jurusan */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Jurusan
            </label>
            <div className="relative">
              <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
              <input
                type="text"
                placeholder="Masukkan jurusan"
                value={jurusan}
                onChange={(e) => setJurusan(e.target.value)}
                className="w-full bg-slate-900/70 border border-cyan-400/20 rounded-2xl p-3.5 pl-12 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
              <input
                type="email"
                placeholder="nama@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/70 border border-cyan-400/20 rounded-2xl p-3.5 pl-12 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200"
              />
            </div>
          </div>

          {/* No HP */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              No HP
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
              <input
                type="text"
                placeholder="Masukkan nomor HP"
                value={noHp}
                onChange={(e) => setNoHp(e.target.value)}
                className="w-full bg-slate-900/70 border border-cyan-400/20 rounded-2xl p-3.5 pl-12 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200"
              />
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-cyan-500/10 border border-cyan-400/20 rounded-2xl p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-cyan-300 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-cyan-100 font-medium">Info Update</p>
              <p className="text-cyan-200/80 text-sm">
                Pastikan data yang diinput sudah benar sebelum menyimpan
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3.5 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Mengupdate...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Update Data
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/student")}
              className="flex-1 bg-slate-900/80 hover:bg-cyan-500/10 text-cyan-100 px-6 py-3.5 rounded-2xl font-semibold transition-all duration-200 border border-cyan-400/20 flex items-center justify-center gap-2"
            >
              <XCircle className="w-5 h-5 text-cyan-300" />
              Batal
            </button>
          </div>
        </form>
      </div>

      {/* Info Cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-3xl p-4 border border-cyan-400/20 shadow-lg shadow-cyan-500/5">
          <p className="text-xs text-cyan-200 uppercase tracking-wide">ID Student</p>
          <p className="text-sm font-mono text-cyan-100 mt-1">#{id}</p>
        </div>
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-3xl p-4 border border-cyan-400/20 shadow-lg shadow-cyan-500/5">
          <p className="text-xs text-cyan-200 uppercase tracking-wide">Terakhir Diupdate</p>
          <p className="text-sm text-cyan-100 mt-1">{new Date().toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-500 {
          animation-delay: 500ms;
        }
      `}</style>
    </div>
  );
}
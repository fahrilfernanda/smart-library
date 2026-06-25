"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../../../lib/supabase";
import {
  BookOpen,
  Barcode,
  BookMarked,
  MapPin,
  Save,
  ArrowLeft,
  XCircle,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from "lucide-react";

export default function EditBookPage() {
  const { id } = useParams();
  const router = useRouter();

  const [kodeBuku, setKodeBuku] = useState("");
  const [judul, setJudul] = useState("");
  const [rackCode, setRackCode] = useState("");
  const [status, setStatus] = useState("Tersedia");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getBook();
  }, []);

  async function getBook() {
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      alert("Data tidak ditemukan");
      router.push("/admin/books");
      return;
    }

    setKodeBuku(data.kode_buku);
    setJudul(data.judul);
    setRackCode(data.rack_code);
    setStatus(data.status);
    setLoading(false);
  }

  async function updateBook(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const { error } = await supabase
      .from("books")
      .update({
        kode_buku: kodeBuku,
        judul,
        rack_code: rackCode,
        status,
      })
      .eq("id", id);

    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }

    alert("Data berhasil diupdate");
    router.push("/admin/books");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-cyan-200 border-t-cyan-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin animation-delay-500"></div>
            </div>
          </div>
          <p className="text-cyan-300 font-semibold">Memuat data buku...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push("/admin/books")}
          title="Kembali ke daftar buku"
          aria-label="Kembali ke daftar buku"
          className="p-2 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-2xl transition-colors border border-cyan-400/20"
        >
          <ArrowLeft className="w-5 h-5 text-cyan-400" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-cyan-400" />
            Edit Buku
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Perbarui informasi buku di perpustakaan
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-cyan-400/20 shadow-xl shadow-cyan-500/5">
        <form onSubmit={updateBook} className="space-y-6">
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

          {/* Kode Buku */}
          <div>
            <label className="block text-sm font-medium text-cyan-100 mb-2">
              Kode Buku
            </label>
            <div className="relative">
              <Barcode className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
              <input
                type="text"
                placeholder="Contoh: BK-001"
                value={kodeBuku}
                onChange={(e) => setKodeBuku(e.target.value)}
                className="w-full bg-slate-700/30 border border-cyan-400/30 rounded-2xl p-3.5 pl-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400/50 transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* Judul Buku */}
          <div>
            <label className="block text-sm font-medium text-cyan-100 mb-2">
              Judul Buku
            </label>
            <div className="relative">
              <BookMarked className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
              <input
                type="text"
                placeholder="Masukkan judul buku"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                className="w-full bg-slate-700/30 border border-cyan-400/30 rounded-2xl p-3.5 pl-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400/50 transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* Lokasi Rak */}
          <div>
            <label className="block text-sm font-medium text-cyan-100 mb-2">
              Lokasi Rak
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
              <input
                type="text"
                placeholder="Contoh: A1, B2, C3"
                value={rackCode}
                onChange={(e) => setRackCode(e.target.value)}
                className="w-full bg-slate-700/30 border border-cyan-400/30 rounded-2xl p-3.5 pl-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400/50 transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-cyan-100 mb-2">
              Status
            </label>
            <div className="relative">
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-700/30 border border-cyan-400/30 rounded-2xl p-3.5 pl-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400/50 transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="Tersedia" className="bg-slate-800 text-white">
                  ✅ Tersedia
                </option>
                <option value="Dipinjam" className="bg-slate-800 text-white">
                  📖 Dipinjam
                </option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <RefreshCw className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <p className="text-xs text-cyan-300/70 mt-1">
              {status === "Tersedia" 
                ? "Buku tersedia untuk dipinjam" 
                : "Buku sedang dipinjam oleh anggota"}
            </p>
          </div>

          {/* Status Info */}
          <div className={`rounded-2xl p-4 flex items-start gap-3 border ${
            status === "Tersedia" 
              ? "bg-cyan-500/10 border-cyan-400/30" 
              : "bg-orange-500/10 border-orange-400/30"
          }`}>
            {status === "Tersedia" ? (
              <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <p className={`font-medium ${
                status === "Tersedia" ? "text-cyan-300" : "text-orange-300"
              }`}>
                Status: {status}
              </p>
              <p className={`text-sm ${
                status === "Tersedia" ? "text-cyan-200/70" : "text-orange-200/70"
              }`}>
                {status === "Tersedia" 
                  ? "Buku dapat dipinjam oleh anggota" 
                  : "Buku sedang tidak tersedia untuk dipinjam"}
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
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Simpan Perubahan
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/books")}
              className="flex-1 bg-slate-700/30 hover:bg-slate-700/50 text-cyan-100 px-6 py-3.5 rounded-2xl font-medium transition-all duration-200 border border-cyan-400/20 flex items-center justify-center gap-2"
            >
              <XCircle className="w-5 h-5" />
              Batal
            </button>
          </div>
        </form>
      </div>

      {/* Info Card */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-4 border border-cyan-400/20 shadow-lg shadow-cyan-500/5">
          <p className="text-xs text-cyan-300/70">ID Buku</p>
          <p className="text-sm font-mono text-cyan-100 mt-1">#{id}</p>
        </div>
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-4 border border-cyan-400/20 shadow-lg shadow-cyan-500/5">
          <p className="text-xs text-cyan-300/70">Terakhir Diupdate</p>
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
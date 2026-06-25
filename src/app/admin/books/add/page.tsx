"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
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
  Lightbulb
} from "lucide-react";

export default function AddBookPage() {
  const router = useRouter();

  const [kodeBuku, setKodeBuku] = useState("");
  const [judul, setJudul] = useState("");
  const [rackCode, setRackCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase
      .from("books")
      .insert([
        {
          kode_buku: kodeBuku,
          judul,
          rack_code: rackCode,
          status: "Tersedia",
        },
      ]);

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    alert("Buku berhasil ditambahkan");
    router.push("/admin/books");
  }

  return (
    <div className="max-w-2xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          title="Kembali"
          aria-label="Kembali"
          className="p-2 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-lg border border-cyan-400/20 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 text-cyan-400" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg">
              <BookOpen className="w-6 h-6 text-cyan-400" />
            </div>
            Tambah Buku
          </h1>
          <p className="text-slate-400 text-sm mt-1 ml-11">
            Tambahkan koleksi buku baru ke perpustakaan
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-gradient-to-r from-red-500/20 to-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3 animate-in fade-in duration-300">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-300 font-semibold text-sm">Terjadi kesalahan</p>
                <p className="text-red-200/70 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Kode Buku */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Barcode className="w-4 h-4 text-cyan-400" />
              Kode Buku
            </label>
            <input
              type="text"
              placeholder="Contoh: BK-001 atau BOOK001"
              value={kodeBuku}
              onChange={(e) => setKodeBuku(e.target.value)}
              className="w-full bg-slate-800/50 border border-cyan-400/20 rounded-xl p-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all duration-200"
              required
            />
            <p className="text-xs text-slate-400 mt-2">Kode unik untuk identifikasi buku</p>
          </div>

          {/* Judul Buku */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-cyan-400" />
              Judul Buku
            </label>
            <input
              type="text"
              placeholder="Masukkan judul buku lengkap"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className="w-full bg-slate-800/50 border border-cyan-400/20 rounded-xl p-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all duration-200"
              required
            />
          </div>

          {/* Lokasi Rak */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              Lokasi Rak
            </label>
            <input
              type="text"
              placeholder="Contoh: A1, B2, C3, atau A-01-01"
              value={rackCode}
              onChange={(e) => setRackCode(e.target.value)}
              className="w-full bg-slate-800/50 border border-cyan-400/20 rounded-xl p-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all duration-200"
              required
            />
            <p className="text-xs text-slate-400 mt-2">Kode rak tempat buku disimpan secara fisik</p>
          </div>

          {/* Status Info */}
          <div className="bg-gradient-to-r from-cyan-500/15 to-blue-500/15 border border-cyan-400/30 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-cyan-200 font-semibold text-sm">Status otomatis: Tersedia</p>
              <p className="text-cyan-100/70 text-xs mt-1">
                Buku akan secara otomatis tersedia untuk dipinjam oleh anggota
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={loading || !kodeBuku || !judul || !rackCode}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Simpan Buku
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/books")}
              className="flex-1 bg-slate-800/50 hover:bg-slate-800 active:scale-[0.98] text-cyan-100 px-6 py-3 rounded-xl font-semibold transition-all duration-200 border border-slate-700 flex items-center justify-center gap-2"
            >
              <XCircle className="w-5 h-5" />
              Batal
            </button>
          </div>

        </form>
      </div>

      {/* Tips Section */}
      <div className="mt-6 bg-gradient-to-br from-slate-900/80 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-amber-400 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-white mb-3">Tips Pengisian Form</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold mt-0.5">•</span>
                <span><strong>Kode Buku:</strong> Gunakan format yang konsisten, misal BK-001, BK-002, dsb</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold mt-0.5">•</span>
                <span><strong>Judul:</strong> Cantumkan nama penulis jika perlu, contoh "Laskar Pelangi - Andrea Hirata"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold mt-0.5">•</span>
                <span><strong>Lokasi Rak:</strong> Sesuaikan dengan sistem penyimpanan fisik (A1, A2, B1, B2, dsb)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold mt-0.5">•</span>
                <span><strong>LED Search:</strong> Setelah buku ditambahkan, gunakan fitur "Cari" untuk menyalakan LED</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}

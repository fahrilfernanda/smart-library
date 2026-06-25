"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import { supabase } from "../../../../lib/supabase";
import {
  User,
  GraduationCap,
  Mail,
  Phone,
  Save,
  ArrowLeft,
  XCircle,
  CheckCircle,
  AlertCircle,
  UserPlus,
  BookOpen,
  QrCode as QrIcon,
  Download
} from "lucide-react";

export default function AddStudentPage() {
  const router = useRouter();

  const [nim, setNim] = useState("");
  const [nama, setNama] = useState("");
  const [jurusan, setJurusan] = useState("");
  const [email, setEmail] = useState("");
  const [noHp, setNoHp] = useState("");

  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (loading) return;

    setLoading(true);

    const qr = `STD-${Date.now()}`;

    const { error } = await supabase
      .from("students")
      .insert([
        {
          nim,
          nama,
          jurusan,
          email,
          no_hp: noHp,
          qr_code: qr,
        },
      ]);

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setQrCode(qr);
    setSuccess(true);
    alert("Student berhasil ditambahkan");
  }

  const downloadQR = () => {
    const svg = document.querySelector(".qr-code-svg");
    if (svg) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const link = document.createElement("a");
        link.download = `QR-${nim}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      };
      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push("/admin/student")}
          title="Kembali ke daftar student"
          aria-label="Kembali ke daftar student"
          className="p-2 bg-slate-900/80 hover:bg-cyan-500/15 rounded-2xl transition-colors border border-cyan-400/20"
        >
          <ArrowLeft className="w-5 h-5 text-cyan-200" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <UserPlus className="w-8 h-8 text-cyan-400" />
            Tambah Student
          </h1>
          <p className="text-cyan-200/80 text-sm mt-1">
            Tambahkan anggota baru ke perpustakaan
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-cyan-400/20 shadow-xl shadow-cyan-500/5">
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

          {/* Success Message */}
          {success && (
            <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-green-300 font-medium">Berhasil!</p>
                <p className="text-green-200/80 text-sm">Student berhasil ditambahkan</p>
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
            <p className="text-xs text-gray-500 mt-1">Opsional</p>
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
            <p className="text-xs text-gray-500 mt-1">Opsional</p>
          </div>

          {/* Info Card */}
          <div className="bg-cyan-500/10 border border-cyan-400/20 rounded-2xl p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-cyan-300 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-cyan-100 font-medium">QR Code Otomatis</p>
              <p className="text-cyan-200/80 text-sm">
                QR Code akan dibuat otomatis setelah student berhasil ditambahkan
              </p>
            </div>
          </div>

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
                  Simpan
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

        {/* QR Code Section */}
        {qrCode && (
          <div className="mt-8 pt-8 border-t border-cyan-400/20">
            <div className="flex flex-col items-center">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <QrIcon className="w-5 h-5 text-cyan-400" />
                QR Code Student
              </h2>
              
              <div className="bg-slate-900/90 rounded-3xl p-6 shadow-xl shadow-cyan-500/10">
                <QRCode value={qrCode} size={200} className="qr-code-svg" />
              </div>

              <p className="mt-4 text-sm font-mono bg-slate-900/70 px-4 py-2 rounded-2xl border border-cyan-400/20 text-cyan-100">
                {qrCode}
              </p>

              <button
                onClick={downloadQR}
                className="mt-4 flex items-center gap-2 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-100 px-4 py-2 rounded-2xl text-sm font-semibold transition-all duration-200 hover:scale-105 border border-cyan-400/20"
              >
                <Download className="w-4 h-4 text-cyan-200" />
                Download QR Code
              </button>

              <button
                onClick={() => router.push("/admin/student")}
                className="mt-4 flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-2.5 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30"
              >
                Lihat Data Student
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="mt-6 bg-slate-900/80 backdrop-blur-sm rounded-3xl p-4 border border-cyan-400/20 shadow-lg shadow-cyan-500/5">
        <h4 className="text-sm font-semibold text-cyan-100 mb-2">💡 Tips:</h4>
        <ul className="text-sm text-cyan-200/80 space-y-1">
          <li>• NIM harus unik dan tidak boleh duplikat</li>
          <li>• Nama lengkap sesuai dengan identitas</li>
          <li>• Email digunakan untuk komunikasi</li>
          <li>• QR Code akan otomatis tergenerate</li>
        </ul>
      </div>
    </div>
  );
}
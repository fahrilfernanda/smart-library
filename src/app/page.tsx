"use client";

import Link from "next/link";
import { BookOpen, QrCode, Wifi, LogIn } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      <div className="absolute -right-24 top-16 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute left-0 bottom-0 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="absolute inset-0 opacity-10 grid-pattern" />

      <div className="relative z-10">
        <nav className="mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-6 md:px-10 py-6 max-w-7xl">
          <div className="flex items-center gap-3">
            <div className="grid place-items-center w-12 h-12 rounded-3xl bg-white/10 border border-white/15 shadow-sm shadow-black/10">
              <BookOpen className="w-6 h-6 text-blue-200" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Smart Library</h1>
              <p className="text-xs md:text-sm text-blue-200/80">QR Code & IoT Library System</p>
            </div>
          </div>

          <Link
            href="/student/login"
            className="inline-flex items-center gap-2 bg-white text-slate-950 hover:bg-slate-100 transition-all duration-300 px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-black/20"
          >
            <LogIn className="w-4 h-4" />
            Login Student
          </Link>
        </nav>

        <main className="mx-auto max-w-7xl px-6 md:px-10 pb-20">
          <section className="grid gap-10 lg:grid-cols-[1.25fr_0.85fr] items-center pt-10">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-100">
                <Wifi className="w-4 h-4 text-blue-200 animate-pulse" />
                IoT Enabled • Real-time data
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
                  Perpustakaan Pintar dengan QR Code & IoT
                </h1>
                <p className="max-w-3xl text-base md:text-lg text-blue-100/90 leading-relaxed">
                  Sistem perpustakaan pintar yang menggabungkan QR Code, ESP32-CAM, dan Supabase untuk mempermudah peminjaman, pengembalian, monitoring rak, dan pencarian lokasi buku secara otomatis.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/student/login"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-slate-950 font-semibold hover:bg-slate-100 transition duration-300 shadow-lg shadow-black/20"
                >
                  <LogIn className="w-5 h-5" />
                  Login Student
                </Link>
                <Link
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-8 py-4 text-blue-100 font-medium hover:bg-white/15 transition duration-300"
                >
                  Learn More
                  <span className="text-blue-200">→</span>
                </Link>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-blue-200/70">Smart Library</p>
                  <h2 className="text-2xl font-bold text-white mt-2">Platform Perpustakaan Modern</h2>
                </div>
                <div className="rounded-3xl bg-blue-500/15 p-3">
                  <QrCode className="w-5 h-5 text-blue-200" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-3xl bg-slate-950/90 border border-white/10 p-4">
                  <p className="text-sm text-blue-200/80">Akses cepat menggunakan QR Code digital.</p>
                </div>
                <div className="rounded-3xl bg-slate-950/90 border border-white/10 p-4">
                  <p className="text-sm text-blue-200/80">Pemantauan rak buku menggunakan ESP32-CAM.</p>
                </div>
                <div className="rounded-3xl bg-slate-950/90 border border-white/10 p-4">
                  <p className="text-sm text-blue-200/80">Data realtime tersinkronisasi dengan Supabase.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="features" className="mt-20 grid gap-6 md:grid-cols-3">
            <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-blue-400/20">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-3xl bg-blue-500/10 mb-5">
                <QrCode className="w-6 h-6 text-blue-200" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">QR Code</h3>
              <p className="text-sm leading-relaxed text-blue-100/80">
                Identitas digital anggota untuk akses cepat, keamanan, dan proses peminjaman yang lancar.
              </p>
            </div>

            <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-blue-400/20">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-3xl bg-blue-500/10 mb-5">
                <Wifi className="w-6 h-6 text-blue-200" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">IoT Monitoring</h3>
              <p className="text-sm leading-relaxed text-blue-100/80">
                Sistem membantu pantauan rak, suhu buku, dan konektivitas perangkat secara realtime.
              </p>
            </div>

            <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-blue-400/20">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-3xl bg-blue-500/10 mb-5">
                <BookOpen className="w-6 h-6 text-blue-200" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Manajemen Buku</h3>
              <p className="text-sm leading-relaxed text-blue-100/80">
                Kelola koleksi buku, status pinjam, dan pelaporan denda dalam satu tampilan terintegrasi.
              </p>
            </div>
          </section>

          <footer className="mt-20 rounded-[32px] border border-white/10 bg-white/5 p-8 text-center text-blue-200 shadow-xl shadow-black/10">
            <p className="text-sm">© 2026 Smart Library System</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs text-blue-200/80">
              <span className="inline-flex items-center gap-1"><QrCode className="w-3 h-3" /> QR Code</span>
              <span>•</span>
              <span>ESP32-CAM</span>
              <span>•</span>
              <span>IoT</span>
              <span>•</span>
              <span>Next.js</span>
              <span>•</span>
              <span>Supabase</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
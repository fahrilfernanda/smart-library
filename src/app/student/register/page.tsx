"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import QRCode from "react-qr-code";
import { supabase } from "../../../lib/supabase";

import {
  User,
  Mail,
  Lock,
  BookOpen,
  GraduationCap,
  UserPlus,
  ArrowLeft,
  CheckCircle,
  Download,
  Eye,
  EyeOff,
  X,
  AlertCircle,
  Info,
  Sparkles,
  ShieldCheck,
  QrCode,
  PartyPopper,
} from "lucide-react";

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */
type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
  exiting?: boolean;
}

/* ═══════════════════════════════════════════
   TOAST HOOK
   ═══════════════════════════════════════════ */
function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  let counter = 0;

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = ++counter;
    setToasts((prev) => [...prev, { id, type, message }]);

    // Start exit animation at 3.5s
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
      );
    }, 3500);

    // Remove at 4s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  return { toasts, addToast, removeToast };
}

/* ═══════════════════════════════════════════
   TOAST ICONS & STYLES
   ═══════════════════════════════════════════ */
const toastConfig: Record<
  ToastType,
  {
    icon: React.ReactNode;
    border: string;
    progress: string;
    glow: string;
  }
> = {
  success: {
    icon: <CheckCircle className="w-[18px] h-[18px] text-emerald-400 shrink-0" />,
    border: "border-emerald-500/20 bg-emerald-950/70",
    progress: "bg-emerald-400",
    glow: "shadow-emerald-500/5",
  },
  error: {
    icon: <AlertCircle className="w-[18px] h-[18px] text-red-400 shrink-0" />,
    border: "border-red-500/20 bg-red-950/70",
    progress: "bg-red-400",
    glow: "shadow-red-500/5",
  },
  info: {
    icon: <Info className="w-[18px] h-[18px] text-sky-400 shrink-0" />,
    border: "border-sky-500/20 bg-sky-950/70",
    progress: "bg-sky-400",
    glow: "shadow-sky-500/5",
  },
};

/* ═══════════════════════════════════════════
   TOAST CONTAINER
   ═══════════════════════════════════════════ */
function ToastContainer({
  toasts,
  removeToast,
}: {
  toasts: Toast[];
  removeToast: (id: number) => void;
}) {
  return (
    <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2.5 max-w-[380px] w-full pointer-events-none">
      {toasts.map((t) => {
        const cfg = toastConfig[t.type];
        return (
          <div
            key={t.id}
            className={`pointer-events-auto relative overflow-hidden rounded-2xl border backdrop-blur-2xl shadow-2xl shadow-black/40 ${cfg.border} ${cfg.glow} ${
              t.exiting
                ? "animate-toast-out"
                : "animate-toast-in"
            }`}
          >
            <div className="flex items-start gap-3 px-4 py-3.5">
              <div className="mt-0.5">{cfg.icon}</div>
              <p className="text-[13px] text-neutral-200 flex-1 leading-relaxed font-medium">
                {t.message}
              </p>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="text-neutral-600 hover:text-neutral-200 transition-colors mt-0.5 p-0.5 rounded-lg hover:bg-white/5"
                aria-label="Tutup notifikasi"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
              <div
                className={`h-full ${cfg.progress} ${
                  t.exiting
                    ? "animate-progress-out"
                    : "animate-progress"
                }`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════
   CONFETTI CANVAS
   ═══════════════════════════════════════════ */
function ConfettiCanvas({ active }: { active: boolean }) {
  useEffect(() => {
    if (!active) return;

    const canvas = document.getElementById("confetti-canvas") as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces: {
      x: number;
      y: number;
      w: number;
      h: number;
      color: string;
      vy: number;
      vx: number;
      rot: number;
      rv: number;
      opacity: number;
    }[] = [];

    const colors = [
      "#10b981",
      "#34d399",
      "#6ee7b7",
      "#a7f3d0",
      "#ffffff",
      "#3b82f6",
      "#60a5fa",
      "#fbbf24",
    ];

    for (let i = 0; i < 80; i++) {
      pieces.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 300,
        y: canvas.height * 0.4,
        w: Math.random() * 8 + 4,
        h: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vy: Math.random() * -12 - 4,
        vx: (Math.random() - 0.5) * 8,
        rot: Math.random() * 360,
        rv: (Math.random() - 0.5) * 12,
        opacity: 1,
      });
    }

    let frame = 0;
    function animate() {
      ctx!.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      pieces.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25;
        p.rot += p.rv;
        p.vx *= 0.99;

        if (frame > 40) {
          p.opacity -= 0.015;
        }

        if (p.opacity > 0) {
          alive = true;
          ctx!.save();
          ctx!.translate(p.x, p.y);
          ctx!.rotate((p.rot * Math.PI) / 180);
          ctx!.globalAlpha = Math.max(0, p.opacity);
          ctx!.fillStyle = p.color;
          ctx!.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx!.restore();
        }
      });

      frame++;
      if (alive && frame < 180) {
        requestAnimationFrame(animate);
      } else {
        ctx!.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    requestAnimationFrame(animate);
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      id="confetti-canvas"
      className="fixed inset-0 z-[90] pointer-events-none"
    />
  );
}

/* ═══════════════════════════════════════════
   INPUT FIELD
   ═══════════════════════════════════════════ */
function InputField({
  label,
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  minLength,
  rightElement,
}: {
  label: string;
  icon: React.ElementType;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  minLength?: number;
  rightElement?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <div>
      <label
        className={`block text-[10px] font-semibold uppercase tracking-wider mb-2 transition-colors duration-200 ${
          focused
            ? "text-white"
            : hasValue
            ? "text-neutral-300"
            : "text-neutral-500"
        }`}
      >
        {label}
      </label>
      <div
        className={`relative rounded-xl transition-all duration-300 ${
          focused
            ? "ring-2 ring-neutral-500/50 ring-offset-1 ring-offset-neutral-900 shadow-lg shadow-black/20"
            : ""
        }`}
      >
        <Icon
          className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-all duration-200 ${
            focused
              ? "text-white scale-110"
              : hasValue
              ? "text-neutral-300"
              : "text-neutral-600"
          }`}
        />
        <input
          type={type}
          placeholder={placeholder}
          className="w-full bg-neutral-950/80 border border-neutral-800 rounded-xl p-3.5 pl-11 pr-11 text-white text-sm placeholder-neutral-600 focus:outline-none transition-all duration-200 hover:border-neutral-700/80"
          value={value}
          onChange={onChange}
          required={required}
          minLength={minLength}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {rightElement && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   STEP INDICATOR
   ═══════════════════════════════════════════ */
function StepIndicator({ current }: { current: number }) {
  const steps = [
    { label: "Data Diri", num: 1 },
    { label: "Akun", num: 2 },
    { label: "Selesai", num: 3 },
  ];

  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((step, i) => (
        <div key={step.num} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                current >= step.num
                  ? "bg-white text-black shadow-lg shadow-white/10"
                  : "bg-neutral-800 text-neutral-500 border border-neutral-700"
              } ${
                current === step.num
                  ? "ring-4 ring-white/10"
                  : ""
              }`}
            >
              {current > step.num ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                step.num
              )}
            </div>
            <span
              className={`text-[9px] font-semibold mt-1.5 uppercase tracking-wider transition-colors duration-300 ${
                current >= step.num
                  ? "text-neutral-300"
                  : "text-neutral-600"
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-16 h-[2px] mx-2 mb-5 rounded-full transition-colors duration-500 ${
                current > step.num
                  ? "bg-white/40"
                  : "bg-neutral-800"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
export default function RegisterStudentPage() {
  const router = useRouter();
  const { toasts, addToast, removeToast } = useToast();

  const [nama, setNama] = useState("");
  const [nim, setNim] = useState("");
  const [jurusan, setJurusan] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);

  // Determine current step for indicator
  const currentStep = registered ? 3 : email && password ? 2 : 1;

  useEffect(() => {
    if (registered) {
      const t = setTimeout(() => setShowSuccess(true), 100);
      return () => clearTimeout(t);
    }
  }, [registered]);

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    addToast("info", "Memvalidasi data...");

    // Small delay for UX
    await new Promise((r) => setTimeout(r, 400));

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      addToast("error", authError.message);
      setLoading(false);
      return;
    }

    if (!authData.user) {
      addToast("error", "Gagal membuat akun. Silakan coba lagi.");
      setLoading(false);
      return;
    }

    addToast("info", "Menyimpan data siswa...");

    const qr = `STUDENT-${nim}`;

    const { error: dbError } = await supabase.from("students").insert([
      {
        id: authData.user.id,
        nama,
        nim,
        jurusan,
        email,
        qr_code: qr,
      },
    ]);

    if (dbError) {
      addToast("error", dbError.message);
      setLoading(false);
      return;
    }

    setQrCode(qr);
    setRegistered(true);
    setLoading(false);
    setConfettiActive(true);

    // Sequential success toasts
    setTimeout(() => {
      addToast("success", "Akun berhasil dibuat!");
    }, 300);
    setTimeout(() => {
      addToast("success", "QR Code siap digunakan untuk absensi.");
    }, 1200);
  }

  const downloadQR = () => {
    const svg = document.querySelector(".qr-code-svg");
    if (!svg) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();

    img.onload = () => {
      const size = 600;
      const padding = 60;
      const textSpace = 80;
      canvas.width = size + padding * 2;
      canvas.height = size + padding * 2 + textSpace;

      // Background
      ctx!.fillStyle = "#ffffff";
      ctx!.fillRect(0, 0, canvas.width, canvas.height);

      // QR shadow
      ctx!.shadowColor = "rgba(0,0,0,0.08)";
      ctx!.shadowBlur = 20;
      ctx!.shadowOffsetY = 4;
      ctx!.fillStyle = "#ffffff";
      ctx!.beginPath();
      ctx!.roundRect(padding - 16, padding - 16, size + 32, size + 32, 24);
      ctx!.fill();

      // Reset shadow
      ctx!.shadowColor = "transparent";

      // QR
      ctx!.drawImage(img, padding, padding, size, size);

      // Name
      ctx!.fillStyle = "#171717";
      ctx!.font = "bold 18px system-ui, sans-serif";
      ctx!.textAlign = "center";
      ctx!.fillText(nama, canvas.width / 2, size + padding + 35);

      // NIM
      ctx!.fillStyle = "#737373";
      ctx!.font = "14px monospace";
      ctx!.fillText(`NIM: ${nim}`, canvas.width / 2, size + padding + 58);

      // ID
      ctx!.fillStyle = "#a3a3a3";
      ctx!.font = "12px monospace";
      ctx!.fillText(qrCode, canvas.width / 2, size + padding + 78);

      const link = document.createElement("a");
      link.download = `QR-${nim}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      addToast("success", "QR Code berhasil didownload!");
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex justify-center items-center p-4 relative overflow-hidden">
      {/* ── Background layers ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-20%,rgba(255,255,255,0.04),transparent)]" />
      <div className="absolute inset-0 opacity-[0.02] [background-image:radial-gradient(circle,_#fff_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-neutral-800/5 blur-3xl pointer-events-none" />

      {/* ── Confetti ── */}
      <ConfettiCanvas active={confettiActive} />

      {/* ── Toast Notifications ── */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* ── Back Button ── */}
      <Link
        href="/login"
        className="absolute top-5 left-5 flex items-center gap-2 text-neutral-400 hover:text-white transition-all duration-300 bg-neutral-900/90 border border-neutral-800/80 px-4 py-2.5 rounded-2xl hover:border-neutral-700 hover:bg-neutral-800/90 z-10 text-sm shadow-lg shadow-black/20 backdrop-blur-xl group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span className="font-medium">Kembali</span>
      </Link>

      {/* ── Main Card ── */}
      <div className="bg-neutral-900/90 border border-neutral-800/80 p-8 rounded-[32px] w-full max-w-[520px] relative z-10 max-h-[92vh] overflow-y-auto shadow-2xl shadow-black/40 backdrop-blur-2xl custom-scrollbar">

        {/* ── Step Indicator ── */}
        <StepIndicator current={currentStep} />

        {/* ── Header ── */}
        {!registered && (
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex p-4 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl mb-5 shadow-xl shadow-white/5">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Registrasi Siswa
            </h1>
            <p className="text-neutral-500 mt-2 text-sm flex items-center justify-center gap-1.5">
              <Sparkles className="w-3 h-3 text-neutral-600" />
              Buat akun anggota Smart Library
            </p>
          </div>
        )}

        {/* ── Form ── */}
        {!registered ? (
          <form
            onSubmit={handleRegister}
            className="space-y-5 animate-fade-in"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Nama Lengkap"
                icon={User}
                placeholder="Nama lengkap"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
              />
              <InputField
                label="NIM"
                icon={GraduationCap}
                placeholder="Nomor Induk"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                required
              />
            </div>

            <InputField
              label="Jurusan"
              icon={BookOpen}
              placeholder="Teknik Informatika"
              value={jurusan}
              onChange={(e) => setJurusan(e.target.value)}
              required
            />

            <InputField
              label="Email"
              icon={Mail}
              type="email"
              placeholder="nama@universitas.ac.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div>
              <InputField
                label="Password"
                icon={Lock}
                type={showPassword ? "text" : "password"}
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-neutral-600 hover:text-white transition-colors p-0.5 rounded-md hover:bg-white/5"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                }
              />
              <div className="flex items-center gap-2.5 mt-2.5 ml-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 w-6 rounded-full transition-all duration-300 ${
                        password.length >= i * 2
                          ? password.length >= 10
                            ? "bg-emerald-400"
                            : password.length >= 6
                            ? "bg-amber-400"
                            : "bg-red-400"
                          : "bg-neutral-800"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-neutral-600 font-medium">
                  {password.length === 0
                    ? "Belum diisi"
                    : password.length < 6
                    ? "Terlalu pendek"
                    : password.length < 8
                    ? "Cukup"
                    : password.length < 10
                    ? "Kuat"
                    : "Sangat kuat"}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white hover:bg-neutral-100 active:scale-[0.98] text-black py-4 rounded-2xl font-bold text-sm transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2.5 mt-4 shadow-xl shadow-white/5"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-neutral-300 border-t-black rounded-full animate-spin" />
                  <span>Membuat akun...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Daftar Sekarang</span>
                </>
              )}
            </button>

            <p className="text-center text-xs text-neutral-600 pt-1">
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="text-neutral-400 hover:text-white font-medium transition-colors underline underline-offset-2 decoration-neutral-700 hover:decoration-neutral-400"
              >
                Masuk di sini
              </Link>
            </p>
          </form>
        ) : (
          /* ── Success State ── */
          <div className="space-y-6">
            {/* Checkmark */}
            <div
              className={`flex flex-col items-center transition-all duration-700 ease-out ${
                showSuccess
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-6 scale-95"
              }`}
            >
              <div className="relative mb-5">
                <div className="w-24 h-24 bg-emerald-500/10 border-2 border-emerald-500/20 rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/25 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-9 h-9 text-emerald-400" />
                  </div>
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-emerald-500/15 animate-ping-slow" />
              </div>

              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                  <ShieldCheck className="w-3 h-3" />
                  Verifikasi Berhasil
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Registrasi Berhasil!
                </h2>
                <p className="text-neutral-500 text-sm mt-2 max-w-xs leading-relaxed">
                  Simpan QR Code berikut untuk absensi masuk dan keluar perpustakaan.
                </p>
              </div>
            </div>

            {/* QR Card */}
            <div
              className={`bg-neutral-950/80 border border-neutral-800/80 rounded-2xl p-6 transition-all duration-700 ease-out delay-150 ${
                showSuccess
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-6 scale-95"
              }`}
            >
              <div className="flex items-center justify-center gap-3 mb-5">
                <div className="h-px bg-gradient-to-r from-transparent to-neutral-800 flex-1" />
                <div className="flex items-center gap-1.5">
                  <QrCode className="w-3 h-3 text-neutral-500" />
                  <h3 className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">
                    QR Code Identitas
                  </h3>
                </div>
                <div className="h-px bg-gradient-to-l from-transparent to-neutral-800 flex-1" />
              </div>

              <div className="flex flex-col items-center">
                {/* QR */}
                <div className="relative group">
                  <div className="absolute -inset-3 bg-gradient-to-br from-white/5 to-white/0 rounded-[28px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-white rounded-3xl p-5 shadow-2xl shadow-black/40 border border-neutral-200">
                    <QRCode
                      value={qrCode}
                      size={180}
                      className="qr-code-svg"
                      level="H"
                    />
                  </div>
                </div>

                {/* Student Info */}
                <div className="mt-5 w-full space-y-2.5">
                  <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-xl px-4 py-3 flex items-center justify-between">
                    <span className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">
                      Nama
                    </span>
                    <span className="text-sm text-white font-medium">
                      {nama}
                    </span>
                  </div>
                  <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-xl px-4 py-3 flex items-center justify-between">
                    <span className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">
                      NIM
                    </span>
                    <span className="text-sm text-white font-mono font-medium">
                      {nim}
                    </span>
                  </div>
                  <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-xl px-4 py-3 flex items-center justify-between">
                    <span className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">
                      Jurusan
                    </span>
                    <span className="text-sm text-neutral-300">
                      {jurusan}
                    </span>
                  </div>
                  <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-xl px-4 py-3 flex items-center justify-between">
                    <span className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">
                      ID QR
                    </span>
                    <span className="text-sm text-neutral-400 font-mono">
                      {qrCode}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full">
                  <button
                    onClick={downloadQR}
                    className="flex-1 bg-neutral-800/80 hover:bg-neutral-700 active:scale-[0.98] border border-neutral-700/80 text-white px-5 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-black/10"
                  >
                    <Download className="w-4 h-4" />
                    Download QR
                  </button>
                  <button
                    onClick={() => {
                      addToast("info", "Mengalihkan ke halaman login...");
                      setTimeout(() => router.push("/login"), 800);
                    }}
                    className="flex-1 bg-white hover:bg-neutral-100 active:scale-[0.98] text-black px-5 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-xl shadow-white/5"
                  >
                    Login Sekarang
                  </button>
                </div>

                {/* Warning */}
                <div className="mt-5 w-full bg-amber-500/5 border border-amber-500/15 rounded-xl px-4 py-3 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-500/70 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-500/60 leading-relaxed">
                    Simpan QR Code ini dengan baik. QR Code digunakan untuk absensi masuk dan keluar perpustakaan secara otomatis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <div className="mt-8 pt-5 border-t border-neutral-800/40 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="w-1 h-1 bg-neutral-800 rounded-full" />
            <p className="text-[9px] text-neutral-700 font-mono tracking-[0.2em]">
              SMART LIBRARY SYSTEM
            </p>
            <div className="w-1 h-1 bg-neutral-800 rounded-full" />
          </div>
        </div>
      </div>

      {/* ── Global Animations ── */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #262626; border-radius: 999px; }

        @keyframes toast-in {
          from {
            opacity: 0;
            transform: translateX(50px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        @keyframes toast-out {
          from {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateX(50px) scale(0.95);
          }
        }
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
        @keyframes progress-out {
          from { width: 100%; }
          to { width: 0%; opacity: 0; }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.4;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .animate-toast-in {
          animation: toast-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-toast-out {
          animation: toast-out 0.3s cubic-bezier(0.4, 0, 1, 1) forwards;
        }
        .animate-progress {
          animation: progress 4s linear forwards;
        }
        .animate-progress-out {
          animation: progress-out 0.3s ease-out forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-ping-slow {
          animation: ping-slow 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
}
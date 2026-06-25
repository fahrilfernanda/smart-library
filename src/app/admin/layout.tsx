"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  BookMarked,
  RefreshCw,
  LogOut,
  Library,
  ChevronRight,
  Menu,
  X,
  UserCog,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    checkLogin();
  }, []);

  function checkLogin() {
    if (pathname === "/login") {
      setLoading(false);
      return;
    }

    const role = localStorage.getItem("role");

    console.log("ROLE =", role);

    if (role === "admin") {
      setLoading(false);
      return;
    }

    router.replace("/login");
  }

  function handleLogout() {
    localStorage.clear();

    router.replace("/login");
  }

  if (pathname === "/login") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex justify-center items-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 font-semibold text-white">
            Memuat Dashboard...
          </p>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: pathname.startsWith("/admin/dashboard"),
    },
    {
      href: "/admin/books",
      label: "Buku",
      icon: BookOpen,
      active: pathname.startsWith("/admin/books"),
    },
    {
      href: "/admin/student",
      label: "Anggota",
      icon: Users,
      active: pathname.startsWith("/admin/student"),
    },
    {
      href: "/admin/borrow",
      label: "Peminjaman",
      icon: BookMarked,
      active: pathname.startsWith("/admin/borrow"),
    },
    {
      href: "/admin/return",
      label: "Pengembalian",
      icon: RefreshCw,
      active: pathname.startsWith("/admin/return"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex">

      {/* Mobile Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white p-2 rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/30"
      >
        {mobileOpen ? (
          <X size={22} />
        ) : (
          <Menu size={22} />
        )}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:relative z-50
        w-72 h-screen bg-gradient-to-b from-slate-900/95 to-slate-900/80 backdrop-blur-sm shadow-2xl
        border-r border-cyan-500/20
        transition-all duration-300

        ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
      `}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg">
              <Library className="w-6 h-6 text-cyan-400" />
            </div>

            <div>
              <h1 className="font-bold text-xl text-white">
                Smart Library
              </h1>

              <p className="text-xs text-slate-400">
                Admin Panel
              </p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-2">

          {navItems.map((item) => (

            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl
                transition-all duration-200

                ${
                  item.active
                    ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 text-cyan-400"
                    : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                }
              `}
            >
              <item.icon size={20} />

              <span className="text-sm font-medium">
                {item.label}
              </span>

              {item.active && (
                <ChevronRight
                  className="ml-auto text-cyan-400"
                  size={18}
                />
              )}
            </Link>

          ))}

        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-slate-800/50 bg-gradient-to-t from-slate-900/80 to-transparent">

          <div className="flex items-center gap-3 mb-4">

            <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
              <UserCog
                className="text-cyan-400"
                size={18}
              />
            </div>

            <div>

              <p className="font-semibold text-white text-sm">
                Administrator
              </p>

              <p className="text-xs text-slate-400">
                {localStorage.getItem(
                  "user_email"
                ) || "admin"}
              </p>

            </div>

          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-red-600/80 to-red-700/80 hover:from-red-600 hover:to-red-700 active:scale-[0.97] text-white py-2.5 rounded-lg flex justify-center items-center gap-2 transition-all duration-200 font-medium text-sm shadow-lg shadow-red-500/20"
          >
            <LogOut size={16} />

            Logout
          </button>

        </div>

      </aside>

      {/* Content */}
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>

    </div>
  );
}

import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-5">
      <h1 className="text-2xl font-bold mb-8">
        Smart Library
      </h1>

      <nav className="space-y-4">

        <Link
          href="/admin/dashboard"
          className="block hover:text-blue-400"
        >
          🏠 Dashboard
        </Link>

        <Link
          href="/admin/books"
          className="block hover:text-blue-400"
        >
          📚 Buku
        </Link>

        <Link
          href="/admin/members"
          className="block hover:text-blue-400"
        >
          👥 Anggota
        </Link>

        <Link
          href="/admin/borrow"
          className="block hover:text-blue-400"
        >
          📤 Peminjaman
        </Link>

        <Link
          href="/admin/returns"
          className="block hover:text-blue-400"
        >
          📥 Pengembalian
        </Link>

        <Link
          href="/admin/fines"
          className="block hover:text-blue-400"
        >
          💰 Denda
        </Link>

        <Link
          href="/admin/reports"
          className="block hover:text-blue-400"
        >
          📊 Laporan
        </Link>

      </nav>
    </aside>
  );
}
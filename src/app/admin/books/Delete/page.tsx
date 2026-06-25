"use client";

import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

export default function DeleteBookPage() {
  const router = useRouter();

  // This page is never navigated to directly; deletion is handled
  // inline in the BooksPage list via a confirm dialog.
  // Redirect to /admin/books if accessed directly.
  router.replace("/admin/books");

  return null;
}

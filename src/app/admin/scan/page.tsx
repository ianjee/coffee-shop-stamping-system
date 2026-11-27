import { requireAdmin } from "@/lib/auth";
import Scanner from "./scanner";
import AdminNav from "@/components/AdminNav";

export default async function ScanPage() {
  await requireAdmin();
  return (
    <>
      <AdminNav />
      <main className="page">
        <Scanner />
        <p className="hint small center">Scan the QR on the customer&apos;s loyalty card, not the login QR. Scanning doesn&apos;t stamp — approve on the next screen.</p>
      </main>
    </>
  );
}

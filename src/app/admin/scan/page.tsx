import { requireAdmin } from "@/lib/auth";
import Scanner from "./scanner";
import AdminNav from "@/components/AdminNav";

export default async function ScanPage() {
  await requireAdmin();
  return (
    <>
      <AdminNav />
      <main className="page">
        <div className="page-head">
          <p className="eyebrow">Stamping</p>
          <h1>Scan Customer STAMP QR</h1>
          <p className="lede">Scan the QR shown on the customer&apos;s loyalty card. Do not scan the customer LOGIN QR created in Customer Management.</p>
        </div>
        <p className="note">Scanning identifies a customer; it does not issue a stamp. Review and approve on the next screen.</p>
        <Scanner />
      </main>
    </>
  );
}

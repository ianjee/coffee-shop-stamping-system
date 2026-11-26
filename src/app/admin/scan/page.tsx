import { requireAdmin } from "@/lib/auth";
import Scanner from "./scanner";
export default async function ScanPage(){await requireAdmin();return <main className="wrap"><h1 className="text-2xl font-bold">Scan Customer Stamp QR</h1><p>Scanning identifies a customer; it does not issue a stamp. Review and approve on the next screen.</p><Scanner/></main>;}

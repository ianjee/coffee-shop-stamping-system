import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminNav from "@/components/AdminNav";
export default async function Dashboard() {
  await requireAdmin();
  const [customers, stamps, rewards] = await Promise.all([
    prisma.customer.count(), prisma.stamp.count(), prisma.reward.count({where:{status:"AVAILABLE"}})
  ]);
  return <><AdminNav /><main className="page">
    <div className="quick-actions">
      <Link href="/admin/scan" className="quick quick-primary">
        <span className="quick-icon"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2"/><rect x="8" y="8" width="3" height="3"/><rect x="13" y="8" width="3" height="3"/><rect x="8" y="13" width="3" height="3"/><path d="M13 13h3v3"/></svg></span>
        <span className="quick-text"><b>Scan QR</b><small>Stamp a customer</small></span>
      </Link>
      <Link href="/admin/customers/new" className="quick">
        <span className="quick-icon"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M18 8v6M15 11h6"/></svg></span>
        <span className="quick-text"><b>Add customer</b><small>Create a new card</small></span>
      </Link>
    </div>
    <div className="page-head"><p className="eyebrow">Overview</p><h1>Admin Dashboard</h1><p className="lede">A quick look at how your loyalty program is brewing.</p></div>
    <div className="stats">
      <div className="stat"><span className="stat-label">Customers</span><span className="stat-num">{customers}</span></div>
      <div className="stat"><span className="stat-label">Stamps issued</span><span className="stat-num">{stamps}</span></div>
      <div className="stat"><span className="stat-label">Available rewards</span><span className="stat-num">{rewards}</span></div>
    </div>
  </main></>;
}

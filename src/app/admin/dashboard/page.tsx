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
    <div className="page-head"><p className="eyebrow">Overview</p><h1>Admin Dashboard</h1><p className="lede">A quick look at how your loyalty program is brewing.</p></div>
    <div className="stats">
      <div className="stat"><span className="stat-label">Customers</span><span className="stat-num">{customers}</span></div>
      <div className="stat"><span className="stat-label">Stamps issued</span><span className="stat-num">{stamps}</span></div>
      <div className="stat"><span className="stat-label">Available rewards</span><span className="stat-num">{rewards}</span></div>
    </div>
    <div className="actions">
      <Link href="/admin/scan" className="btn">Scan a stamp QR</Link>
      <Link href="/admin/customers/new" className="btn btn-outline">Add customer</Link>
    </div>
  </main></>;
}

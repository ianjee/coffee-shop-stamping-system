import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export default async function Dashboard() {
  await requireAdmin();
  const [customers, stamps, rewards] = await Promise.all([
    prisma.customer.count(), prisma.stamp.count(), prisma.reward.count({where:{status:"AVAILABLE"}})
  ]);
  return <main className="wrap"><h1 className="text-3xl font-bold">Admin Dashboard</h1>
    <nav><Link href="/admin/customers">Customers</Link><Link href="/admin/scan">Scan QR</Link><Link href="/admin/stamps">Stamp history</Link><form action="/api/admin/logout" method="post"><button>Log out</button></form></nav>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div className="panel"><b>Customers</b><p className="text-3xl">{customers}</p></div>
      <div className="panel"><b>Stamps issued</b><p className="text-3xl">{stamps}</p></div>
      <div className="panel"><b>Available rewards</b><p className="text-3xl">{rewards}</p></div>
    </div>
  </main>;
}

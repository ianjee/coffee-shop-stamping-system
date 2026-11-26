import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export default async function Customers() {
  await requireAdmin();
  const customers=await prisma.customer.findMany({orderBy:{createdAt:"desc"},include:{stamps:true}});
  return <main className="wrap"><h1 className="text-2xl font-bold">Customer Management</h1><nav><Link href="/admin/dashboard">Dashboard</Link><Link href="/admin/customers/new">Add customer</Link></nav>
    <div className="panel"><table><thead><tr><th>Name</th><th>Created</th><th>Status</th><th>Stamps</th><th>Card</th></tr></thead><tbody>
      {customers.map(c=><tr key={c.id}><td>{c.name}</td><td>{c.createdAt.toLocaleDateString()}</td><td>{c.status}</td><td>{c.stamps.length}</td><td><Link href={`/admin/customers/${c.id}`}>Manage QR</Link></td></tr>)}
    </tbody></table></div></main>;
}

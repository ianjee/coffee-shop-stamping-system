import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminNav from "@/components/AdminNav";
export default async function Customers() {
  await requireAdmin();
  const customers=await prisma.customer.findMany({orderBy:{createdAt:"desc"},include:{stamps:true}});
  return <><AdminNav /><main className="page">
    <div className="page-head row"><div><p className="eyebrow">People</p><h1>Customer Management</h1></div><Link href="/admin/customers/new" className="btn">+ Add customer</Link></div>
    <div className="panel table-wrap"><table><thead><tr><th>Name</th><th>Created</th><th>Status</th><th>Stamps</th><th></th></tr></thead><tbody>
      {customers.map(c=><tr key={c.id}><td><span className="person"><span className="avatar">{c.name.charAt(0).toUpperCase()}</span>{c.name}</span></td><td>{c.createdAt.toLocaleDateString()}</td><td><span className={`badge ${c.status==="ACTIVE"?"badge-ok":"badge-off"}`}>{c.status}</span></td><td>{c.stamps.length}</td><td><Link href={`/admin/customers/${c.id}`}>Manage QR →</Link></td></tr>)}
    </tbody></table></div></main></>;
}

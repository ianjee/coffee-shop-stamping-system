import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CustomerActions from "./customer-actions";
import AdminNav from "@/components/AdminNav";
import Link from "next/link";
export default async function CustomerDetail({params}:{params:Promise<{id:string}>}) {
 await requireAdmin(); const {id}=await params;
 const c=await prisma.customer.findUnique({where:{id},include:{credentials:true,stamps:true,rewards:true}});
 if(!c)notFound();
 return <><AdminNav /><main className="page">
  <Link href="/admin/customers" className="back">← All customers</Link>
  <div className="page-head"><p className="eyebrow">Customer</p><h1>{c.name}</h1></div>
  <div className="panel">
   <dl className="details">
    <div><dt>Status</dt><dd><span className={`badge ${c.status==="ACTIVE"?"badge-ok":"badge-off"}`}>{c.status}</span></dd></div>
    <div><dt>Stamp count</dt><dd>{c.stamps.length}</dd></div>
    <div><dt>Created</dt><dd>{c.createdAt.toLocaleString()}</dd></div>
   </dl>
   <CustomerActions id={c.id} active={c.status==="ACTIVE"}/>
  </div></main></>;
}

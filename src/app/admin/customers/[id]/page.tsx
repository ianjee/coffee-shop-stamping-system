import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CustomerActions from "./customer-actions";
export default async function CustomerDetail({params}:{params:Promise<{id:string}>}) {
 await requireAdmin(); const {id}=await params;
 const c=await prisma.customer.findUnique({where:{id},include:{credentials:true,stamps:true,rewards:true}});
 if(!c)notFound();
 return <main className="wrap"><h1 className="text-2xl font-bold">{c.name}</h1><div className="panel"><p>Status: {c.status}</p><p>Stamp count: {c.stamps.length}</p><p>Created: {c.createdAt.toLocaleString()}</p><CustomerActions id={c.id} active={c.status==="ACTIVE"}/></div></main>;
}

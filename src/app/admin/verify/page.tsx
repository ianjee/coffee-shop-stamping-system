import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/tokens";
import ApproveStamp from "./approve-stamp";
import { notFound } from "next/navigation";
import AdminNav from "@/components/AdminNav";
import Link from "next/link";
export default async function Verify({searchParams}:{searchParams:Promise<{token?:string}>}){
 await requireAdmin();const {token}=await searchParams;if(!token)notFound();
 const cred=await prisma.credential.findFirst({where:{tokenHash:hashToken(token),purpose:"STAMP",revokedAt:null},include:{customer:true}});
 if(!cred||cred.customer.status!=="ACTIVE")return <><AdminNav /><main className="page"><div className="panel narrow center"><h1>Invalid or revoked stamp QR</h1><p className="hint">This code can&apos;t be used to issue a stamp.</p><Link href="/admin/scan" className="btn">Scan again</Link></div></main></>;
 const count=await prisma.stamp.count({where:{customerId:cred.customerId}});
 return <><AdminNav /><main className="page"><div className="page-head"><p className="eyebrow">Stamping</p><h1>Verify Customer</h1></div>
  <div className="panel narrow"><span className="person big"><span className="avatar">{cred.customer.name.charAt(0).toUpperCase()}</span><span><b>{cred.customer.name}</b><span className="hint block">Current stamps: {count}</span></span></span><ApproveStamp token={token}/></div></main></>;
}

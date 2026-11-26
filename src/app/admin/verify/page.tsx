import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/tokens";
import ApproveStamp from "./approve-stamp";
import { notFound } from "next/navigation";
export default async function Verify({searchParams}:{searchParams:Promise<{token?:string}>}){
 await requireAdmin();const {token}=await searchParams;if(!token)notFound();
 const cred=await prisma.credential.findFirst({where:{tokenHash:hashToken(token),purpose:"STAMP",revokedAt:null},include:{customer:true}});
 if(!cred||cred.customer.status!=="ACTIVE")return <main className="wrap"><h1>Invalid or revoked stamp QR</h1></main>;
 const count=await prisma.stamp.count({where:{customerId:cred.customerId}});
 return <main className="wrap"><h1 className="text-2xl font-bold">Verify Customer</h1><div className="panel"><p>Name: <b>{cred.customer.name}</b></p><p>Current stamps: {count}</p><ApproveStamp token={token}/></div></main>;
}

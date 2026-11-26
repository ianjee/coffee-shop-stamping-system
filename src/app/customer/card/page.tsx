import {requireCustomer} from "@/lib/auth";
import {prisma} from "@/lib/prisma";
import QRCode from "qrcode";
import {createToken,hashToken} from "@/lib/tokens";

export default async function Card(){
 const c=await requireCustomer();
 const token=createToken();
 await prisma.$transaction([
   prisma.credential.updateMany({where:{customerId:c.id,purpose:"STAMP",revokedAt:null},data:{revokedAt:new Date()}}),
   prisma.credential.create({data:{customerId:c.id,purpose:"STAMP",tokenHash:hashToken(token)}})
 ]);
 const [stamps,rewards]=await Promise.all([
   prisma.stamp.count({where:{customerId:c.id}}),
   prisma.reward.findMany({where:{customerId:c.id,status:"AVAILABLE"}})
 ]);
 const qr=await QRCode.toDataURL(token,{width:280,margin:2});
 return <main className="wrap"><h1 className="text-3xl font-bold">Hello, {c.name}</h1>
  <div className="panel"><p className="text-xl">Your stamps: <b>{stamps}</b></p>
   <p>Available rewards: {rewards.length}</p>{rewards.map(r=><p key={r.id}>{r.name}</p>)}
   <h2 className="font-bold mt-5">Your stamp QR</h2><p>Show this code to the shop admin when you make a qualifying purchase.</p>
   <img src={qr} alt="Your stamp QR code" width="280" height="280"/>
   <p className="text-xs mt-2">Refreshing this page replaces the previous stamp QR.</p>
  </div>
 </main>;
}

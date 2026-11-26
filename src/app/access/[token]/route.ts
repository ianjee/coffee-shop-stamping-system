import {NextResponse} from "next/server";import {prisma} from "@/lib/prisma";import {hashToken} from "@/lib/tokens";import {getSession} from "@/lib/session";
export async function GET(req:Request,{params}:{params:Promise<{token:string}>}){const {token}=await params;const cred=await prisma.credential.findFirst({where:{tokenHash:hashToken(token),purpose:"LOGIN",revokedAt:null},include:{customer:true}});
 if(!cred||cred.customer.status!=="ACTIVE")return NextResponse.redirect(new URL("/?access=invalid",req.url));
 const s=await getSession();s.customerId=cred.customerId;delete s.adminId;await s.save();return NextResponse.redirect(new URL("/customer/card",req.url));}

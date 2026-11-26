import {NextResponse} from "next/server";import {z} from "zod";import QRCode from "qrcode";import {prisma} from "@/lib/prisma";import {getSession} from "@/lib/session";import {createToken,hashToken} from "@/lib/tokens";
const schema=z.object({name:z.string().trim().min(1).max(100)});
export async function POST(req:Request){const s=await getSession();if(!s.adminId)return NextResponse.json({error:"Unauthorized"},{status:401});
 try{const {name}=schema.parse(await req.json());const login=createToken(),stamp=createToken();const customer=await prisma.customer.create({data:{name,credentials:{create:[{purpose:"LOGIN",tokenHash:hashToken(login)},{purpose:"STAMP",tokenHash:hashToken(stamp)}]}}});
 const url=`${process.env.APP_URL||new URL(req.url).origin}/access/${login}`;const qr=await QRCode.toDataURL(url);return NextResponse.json({id:customer.id,url,qr});}
 catch{return NextResponse.json({error:"Could not create customer"},{status:400});}}

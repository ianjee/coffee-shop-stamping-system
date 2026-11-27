import { NextResponse } from "next/server";
import { z } from "zod";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { createToken, createStampToken, hashToken } from "@/lib/tokens";

const schema = z.object({ name: z.string().trim().min(1).max(100) });

export async function POST(req: Request) {
  const session = await getSession();
  if (!session.adminId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name } = schema.parse(await req.json());
    const loginToken = createToken();

    const customer = await prisma.customer.create({
      data: {
        name,
        credentials: {
          create: [{ purpose: "LOGIN", tokenHash: hashToken(loginToken) }]
        }
      }
    });

    const stampToken = createStampToken(customer.id, customer.stampTokenVersion);
    await prisma.credential.create({
      data: {
        customerId: customer.id,
        purpose: "STAMP",
        tokenHash: hashToken(stampToken)
      }
    });

    const baseUrl = (process.env.APP_URL || new URL(req.url).origin).replace(/\/+$/, "");
    const url = `${baseUrl}/access/${loginToken}`;
    const qr = await QRCode.toDataURL(url);
    return NextResponse.json({ id: customer.id, url, qr });
  } catch (error) {
    console.error("Create customer failed:", error);
    return NextResponse.json({ error: "Could not create customer" }, { status: 400 });
  }
}

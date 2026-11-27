import { NextResponse } from "next/server";
import { z } from "zod";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { createStampToken, hashToken } from "@/lib/tokens";

const schema = z.object({ name: z.string().trim().min(1).max(100) });

export async function POST(req: Request) {
  const session = await getSession();
  if (!session.adminId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name } = schema.parse(await req.json());

    const customer = await prisma.customer.create({
      data: { name }
    });

    // One credential powers both customer access and admin stamping.
    const token = createStampToken(customer.id, customer.stampTokenVersion);
    await prisma.credential.create({
      data: {
        customerId: customer.id,
        purpose: "STAMP",
        tokenHash: hashToken(token)
      }
    });

    const configuredUrl = process.env.APP_URL?.replace(/\/+$/, "");
    const baseUrl = configuredUrl || new URL(req.url).origin;
    const url = `${baseUrl}/access/${token}`;
    const qr = await QRCode.toDataURL(url, { width: 320, margin: 2 });

    return NextResponse.json({ id: customer.id, url, qr });
  } catch (error) {
    console.error("Create customer failed:", error);
    return NextResponse.json(
      { error: "Could not create customer" },
      { status: 400 }
    );
  }
}

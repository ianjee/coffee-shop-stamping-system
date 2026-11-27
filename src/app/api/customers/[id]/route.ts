import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { createToken, createStampToken, hashToken } from "@/lib/tokens";
import QRCode from "qrcode";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session.adminId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { action } = await req.json();

  if (action === "deactivate" || action === "activate") {
    await prisma.customer.update({
      where: { id },
      data: { status: action === "activate" ? "ACTIVE" : "INACTIVE" }
    });
    return NextResponse.json({ ok: true });
  }

  if (action === "regenerate") {
    const customer = await prisma.customer.findUnique({ where: { id } }); 
    if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });

    const loginToken = createToken();
    const nextVersion = customer.stampTokenVersion + 1;
    const stampToken = createStampToken(customer.id, nextVersion);

    await prisma.$transaction([
      prisma.credential.updateMany({
        where: { customerId: id, revokedAt: null },
        data: { revokedAt: new Date() }
      }),
      prisma.customer.update({
        where: { id },
        data: { stampTokenVersion: nextVersion }
      }),
      prisma.credential.createMany({
        data: [
          { customerId: id, purpose: "LOGIN", tokenHash: hashToken(loginToken) },
          { customerId: id, purpose: "STAMP", tokenHash: hashToken(stampToken) }
        ]
      })
    ]);

    const baseUrl = (process.env.APP_URL || new URL(req.url).origin).replace(/\/+$/, "");
    const url = `${baseUrl}/access/${loginToken}`;
    return NextResponse.json({ url, qr: await QRCode.toDataURL(url) });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

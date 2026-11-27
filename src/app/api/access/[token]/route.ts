import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/tokens";
import { getSession } from "@/lib/session";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  // New shared customer QR credentials use STAMP. Accept old LOGIN
  // credentials too, so previously issued login QR codes keep working.
  const credential = await prisma.credential.findFirst({
    where: {
      tokenHash: hashToken(token),
      purpose: { in: ["LOGIN", "STAMP"] },
      revokedAt: null
    },
    include: { customer: true }
  });

  if (!credential || credential.customer.status !== "ACTIVE") {
    return NextResponse.json({ ok: false, redirect: "/?access=invalid" }, { status: 401 });
  }

  const session = await getSession();
  session.customerId = credential.customerId;
  delete session.adminId;
  await session.save();

  return NextResponse.json({ ok: true, redirect: "/customer/card" });
}

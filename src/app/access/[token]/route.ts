import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/tokens";
import { getSession } from "@/lib/session";

export async function GET(
  req: Request,
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
    return NextResponse.redirect(new URL("/?access=invalid", req.url));
  }

  const session = await getSession();
  session.customerId = credential.customerId;
  delete session.adminId;
  await session.save();

  return NextResponse.redirect(new URL("/customer/card", req.url));
}

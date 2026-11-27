import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { hashToken } from "@/lib/tokens";

const schema = z.object({ token: z.string().min(20) });

export async function POST(req: Request) {
  const session = await getSession();
  if (!session.adminId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { token } = schema.parse(await req.json());

    // The shared customer QR is stored as a STAMP credential.
    const credential = await prisma.credential.findFirst({
      where: {
        tokenHash: hashToken(token),
        purpose: "STAMP",
        revokedAt: null
      },
      include: { customer: true }
    });

    if (!credential || credential.customer.status !== "ACTIVE") {
      return NextResponse.json({ error: "Invalid customer QR" }, { status: 404 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const stamp = await tx.stamp.create({
        data: { customerId: credential.customerId, adminId: session.adminId! }
      });

      const total = await tx.stamp.count({
        where: { customerId: credential.customerId }
      });

      const threshold = Math.max(1, Number(process.env.REWARD_THRESHOLD || 10));
      const rewardName = process.env.REWARD_NAME || "Free coffee";

      if (total > 0 && total % threshold === 0) {
        await tx.reward.create({
          data: {
            customerId: credential.customerId,
            requiredStamps: threshold,
            name: rewardName
          }
        });
      }

      return { stamp, total };
    });

    return NextResponse.json({ ok: true, total: result.total });
  } catch {
    return NextResponse.json(
      { error: "Could not approve stamp" },
      { status: 400 }
    );
  }
}

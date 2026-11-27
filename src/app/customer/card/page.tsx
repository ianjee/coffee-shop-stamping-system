import { requireCustomer } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import QRCode from "qrcode";
import { createStampToken, hashToken } from "@/lib/tokens";
import { CupIcon } from "@/components/AdminNav";

export const dynamic = "force-dynamic";

export default async function Card() {
  const customer = await requireCustomer();
  const token = createStampToken(customer.id, customer.stampTokenVersion);
  const tokenHash = hashToken(token);

  // Existing customers created by the earlier version may not have this
  // deterministic credential yet. Create it once, and revoke old random
  // stamp credentials so only the stable QR remains active.
  const existing = await prisma.credential.findUnique({ where: { tokenHash } });
  if (!existing) {
    await prisma.$transaction(async (tx) => {
      const raced = await tx.credential.findUnique({ where: { tokenHash } });
      if (!raced) {
        await tx.credential.updateMany({
          where: { customerId: customer.id, purpose: "STAMP", revokedAt: null },
          data: { revokedAt: new Date() }
        });
        await tx.credential.create({
          data: { customerId: customer.id, purpose: "STAMP", tokenHash }
        });
      }
    });
  } else if (
    existing.customerId !== customer.id ||
    existing.purpose !== "STAMP" ||
    existing.revokedAt
  ) {
    throw new Error("Your stamp QR has been revoked. Ask the admin to regenerate your QR credentials.");
  }

  const [stamps, rewards] = await Promise.all([
    prisma.stamp.count({ where: { customerId: customer.id } }),
    prisma.reward.findMany({ where: { customerId: customer.id, status: "AVAILABLE" } })
  ]);

  const qr = await QRCode.toDataURL(token, { width: 280, margin: 2 });

  const PER_CARD = 10; // stamps needed to fill one card
  const filled = stamps % PER_CARD;
  const completed = Math.floor(stamps / PER_CARD);

  return (
    <main className="customer">
      <div className="customer-in">
        <p className="eyebrow light">Coffee Shop Loyalty</p>
        <h1 className="greet">Hello, {customer.name}</h1>

        <section className="loyalty-card">
          <div className="lc-head">
            <span>Your stamps</span>
            <b>{filled}<small> / {PER_CARD}</small></b>
          </div>
          <div className="stamp-grid">
            {Array.from({ length: PER_CARD }, (_, i) => (
              <span key={i} className={`stamp ${i < filled ? "on" : ""}`}>
                {i < filled ? <CupIcon size={22} /> : i + 1}
              </span>
            ))}
          </div>
          <p className="lc-foot">{stamps} total stamp{stamps === 1 ? "" : "s"}{completed > 0 ? ` · ${completed} card${completed === 1 ? "" : "s"} completed` : ""}</p>
        </section>

        <section className="panel">
          <h2>Rewards</h2>
          {rewards.length === 0
            ? <p className="hint">No rewards available yet. Keep collecting stamps!</p>
            : <ul className="rewards">{rewards.map((reward) => <li key={reward.id}><CupIcon size={18} />{reward.name}</li>)}</ul>}
        </section>

        <section className="panel center">
          <h2>Your stamp QR</h2>
          <p className="hint">Show this code to the shop admin when you make a qualifying purchase.</p>
          <img src={qr} alt="Your stamp QR code" width="280" height="280" className="qr" />
          <p className="hint small">This QR remains valid until an admin regenerates your credentials.</p>
        </section>
      </div>
    </main>
  );
}

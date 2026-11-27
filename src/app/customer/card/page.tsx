import { requireCustomer } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import QRCode from "qrcode";
import { headers } from "next/headers";
import { createStampToken, hashToken } from "@/lib/tokens";
import { CupIcon } from "@/components/AdminNav";
import CartLogo from "@/components/CartLogo";
import CustomerQrDownload from "@/components/CustomerQrDownload";

export const dynamic = "force-dynamic";

async function getPublicBaseUrl() {
  const configuredUrl = process.env.APP_URL?.replace(/\/+$/, "");
  if (configuredUrl) return configuredUrl;

  const requestHeaders = await headers();
  const hostHeader =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const host = hostHeader?.split(",")[0]?.trim();

  if (!host) return "http://localhost:3000";

  const forwardedProtocol = requestHeaders.get("x-forwarded-proto");
  const protocol =
    forwardedProtocol?.split(",")[0]?.trim() ||
    (process.env.NODE_ENV === "production" ? "https" : "http");

  return `${protocol}://${host}`;
}

export default async function Card() {
  const customer = await requireCustomer();
  const token = createStampToken(customer.id, customer.stampTokenVersion);
  const tokenHash = hashToken(token);

  // Backfill the shared STAMP credential for customers created by older versions.
  const existing = await prisma.credential.findUnique({ where: { tokenHash } });

  if (!existing) {
    await prisma.$transaction(async (tx) => {
      const raced = await tx.credential.findUnique({ where: { tokenHash } });
      if (!raced) {
        await tx.credential.updateMany({
          where: {
            customerId: customer.id,
            purpose: "STAMP",
            revokedAt: null
          },
          data: { revokedAt: new Date() }
        });

        await tx.credential.create({
          data: {
            customerId: customer.id,
            purpose: "STAMP",
            tokenHash
          }
        });
      }
    });
  } else if (
    existing.customerId !== customer.id ||
    existing.purpose !== "STAMP" ||
    existing.revokedAt
  ) {
    throw new Error(
      "Your customer QR has been revoked. Ask the admin to regenerate your QR."
    );
  }

  const [stamps, rewards, baseUrl] = await Promise.all([
    prisma.stamp.count({ where: { customerId: customer.id } }),
    prisma.reward.findMany({
      where: { customerId: customer.id, status: "AVAILABLE" }
    }),
    getPublicBaseUrl()
  ]);

  // Encode a complete web URL, not a bare token. iPhone Camera can open it.
  const qrUrl = `${baseUrl}/access/${token}`;
  const qr = await QRCode.toDataURL(qrUrl, {
    width: 1000,
    margin: 4,
    errorCorrectionLevel: "H",
    color: {
      dark: "#38251D",
      light: "#FFFFFF"
    }
  });

  const PER_CARD = 10;
  const filled = stamps % PER_CARD;
  const completed = Math.floor(stamps / PER_CARD);

  return (
    <main className="customer">
      <div className="customer-in">
        <p className="eyebrow light brand-line"><CartLogo size={26} />CoffeeSpot</p>
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
          <p className="lc-foot">
            {stamps} total stamp{stamps === 1 ? "" : "s"}
            {completed > 0
              ? ` · ${completed} card${completed === 1 ? "" : "s"} completed`
              : ""}
          </p>
        </section>

        <section className="panel">
          <h2>Rewards</h2>
          {rewards.length === 0 ? (
            <p className="hint">No rewards available yet. Keep collecting stamps!</p>
          ) : (
            <ul className="rewards">
              {rewards.map((reward) => (
                <li key={reward.id}>
                  <CupIcon size={18} />
                  {reward.name}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel center">
          <h2>Your customer QR</h2>
          <p className="hint">
            Show this same QR to the shop admin for stamps. Scan it with your
            phone to open your loyalty card.
          </p>
            <CustomerQrDownload qr={qr} />
          <p className="hint small">
            Keep this QR private. Anyone who has it can open this customer card.
          </p>
        </section>
      </div>
    </main>
  );
}

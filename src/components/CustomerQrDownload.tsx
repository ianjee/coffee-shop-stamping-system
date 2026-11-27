
"use client";

import { downloadBrandedQr } from "@/lib/download-branded-qr";

type Props = {
  qr: string;
};

export default function CustomerQrDownload({ qr }: Props) {
  function downloadQr() {
    downloadBrandedQr(qr);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14
      }}
    >
      <img
        src={qr}
        alt="Your customer QR code"
        width={320}
        height={320}
        className="qr"
      />

      <button
        type="button"
        onClick={downloadQr}
        style={{
          background: "#8C6B50",
          color: "#FFF9F0",
          border: "1px solid #C5A66D",
          borderRadius: 10,
          padding: "12px 24px",
          fontWeight: 700,
          cursor: "pointer",
          fontSize: 14
        }}
      >
        Download QR Code
      </button>
    </div>
  );
}


"use client";

type Props = {
  qr: string;
};

export default function CustomerQrDownload({ qr }: Props) {
  async function downloadQr() {
    const canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 1200;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const image = new Image();

    image.onload = () => {
      // Background
      ctx.fillStyle = "#B89573";
      ctx.fillRect(0, 0, 1000, 1200);

      // Outer mocha frame
      ctx.fillStyle = "#8C6B50";
      ctx.beginPath();
      ctx.roundRect(24, 24, 952, 1152, 40);
      ctx.fill();

      // Ivory card
      ctx.fillStyle = "#F5EBDD";
      ctx.beginPath();
      ctx.roundRect(42, 42, 916, 1116, 28);
      ctx.fill();

      // Shop name
      ctx.fillStyle = "#5C4433";
      ctx.font = "800 58px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("COFFEE SPOTJ.ST6329", 500, 175);

      // Gold QR border
      ctx.fillStyle = "#C5A66D";
      ctx.beginPath();
      ctx.roundRect(60, 245, 880, 880, 18);
      ctx.fill();

      // White QR background
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.roundRect(72, 257, 856, 856, 12);
      ctx.fill();

      // Actual QR code
      ctx.drawImage(image, 72, 257, 856, 856);

      // Download
      const link = document.createElement("a");
      link.download = "Coffee-SpotJ-ST6329-QR.png";
      link.href = canvas.toDataURL("image/png");

      document.body.appendChild(link);
      link.click();
      link.remove();
    };

    image.onerror = () => {
      alert("Unable to create the QR download. Please refresh and try again.");
    };

    image.src = qr;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
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

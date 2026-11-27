
"use client";

type Props = {
  qr: string;
};

export default function CustomerQrDownload({ qr }: Props) {
  function downloadQr() {
    const canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 1200;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Rounded rectangle helper
    function roundedRect(
      x: number,
      y: number,
      width: number,
      height: number,
      radius: number,
      color: string
    ) {
      ctx!.beginPath();
      ctx!.roundRect(x, y, width, height, radius);
      ctx!.fillStyle = color;
      ctx!.fill();
    }

    // Outer latte background
    roundedRect(0, 0, 1000, 1200, 0, "#B89573");

    // Soft mocha frame
    roundedRect(24, 24, 952, 1152, 40, "#8C6B50");

    // Warm ivory card
    roundedRect(42, 42, 916, 1116, 28, "#F5EBDD");

    // Shop name
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#5C4433";
    ctx.font = "800 58px Arial, sans-serif";

    const heading = "COFFEE SPOTJ.ST6329";
    ctx.fillText(heading, 500, 190, 860);

    // Champagne-gold QR frame
    roundedRect(60, 250, 880, 880, 18, "#C5A66D");

    // White QR background
    roundedRect(72, 262, 856, 856, 12, "#FFFFFF");

    // Draw the existing QR without changing its destination
    const qrImage = new Image();

    qrImage.onload = () => {
      ctx.drawImage(qrImage, 72, 262, 856, 856);

      const link = document.createElement("a");
      link.download = "Coffee-SpotJ-ST6329-QR.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    qrImage.src = qr;
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

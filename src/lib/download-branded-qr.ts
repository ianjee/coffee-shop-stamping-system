export function downloadBrandedQr(qr: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 1000;
  canvas.height = 1778;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const W = canvas.width;
  const H = canvas.height;
  const cx = W / 2;

  // ---------------------------------
  // HELPERS
  // ---------------------------------

  const fillRoundedRect = (
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    fill: string | CanvasGradient
  ) => {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.fillStyle = fill;
    ctx.fill();
  };

  const drawBean = (
    x: number,
    y: number,
    angle: number,
    scale = 1,
    fill = "#6E4932",
    crease = "#DFC4A3",
    alpha = 1,
    strokeOnly = false,
    lineWidth = 2.2
  ) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(scale, scale);

    ctx.beginPath();
    ctx.ellipse(0, 0, 12, 20, 0, 0, Math.PI * 2);
    if (!strokeOnly) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    ctx.strokeStyle = crease;
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-2, -15);
    ctx.bezierCurveTo(10, -5, -10, 5, 2, 15);
    ctx.strokeStyle = crease;
    ctx.lineWidth = lineWidth * 0.9;
    ctx.lineCap = "round";
    ctx.stroke();

    ctx.restore();
  };

  // ---------------------------------
  // 1. ESPRESSO BACKGROUND & BEAN PATTERN
  // ---------------------------------

  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, "#3D281F");
  bgGrad.addColorStop(0.55, "#342119");
  bgGrad.addColorStop(1, "#271812");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Aesthetic repeating coffee bean background
  for (let y = -110; y < H + 140; y += 130) {
    for (let x = -110; x < W + 140; x += 155) {
      const offsetX = ((Math.floor((y + 110) / 130) % 2) * 35);
      drawBean(
        x + offsetX,
        y,
        -0.52,
        1.35,
        "#5A3C2E",
        "#DFC4A3",
        0.085,
        false,
        2.5
      );
    }
  }

  // Soft vignette to keep center focus clean
  const vignette = ctx.createRadialGradient(cx, H * 0.5, 190, cx, H * 0.5, 920);
  vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
  vignette.addColorStop(1, "rgba(15, 8, 5, 0.34)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, H);

  // ---------------------------------
  // 2. TOP-LEFT ORGANIC DECORATION
  // ---------------------------------

  ctx.save();
  ctx.shadowColor = "rgba(15, 8, 5, 0.28)";
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(390, 0);
  ctx.bezierCurveTo(365, 100, 310, 150, 220, 175);
  ctx.bezierCurveTo(120, 210, 55, 180, 0, 260);
  ctx.closePath();
  ctx.fillStyle = "#E8D5B9";
  ctx.fill();
  ctx.restore();

  const topBeans: Array<[number, number, number, number]> = [
    [85, 70, -0.6, 1],
    [145, 115, 0.4, 1],
    [210, 65, -0.3, 1],
    [270, 115, 0.7, 1],
    [335, 55, -0.5, 1]
  ];
  topBeans.forEach(([x, y, rot, s]) => drawBean(x, y, rot, s));

  // Delicate curved guide line
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, 310);
  ctx.bezierCurveTo(95, 245, 145, 310, 115, 400);
  ctx.bezierCurveTo(85, 475, 30, 495, 0, 535);
  ctx.strokeStyle = "rgba(214, 182, 142, 0.62)";
  ctx.lineWidth = 2.75;
  ctx.lineCap = "round";
  ctx.stroke();
  ctx.restore();

  // ---------------------------------
  // 3. BRAND HEADER
  // ---------------------------------

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle = "#CFA87B";
  ctx.beginPath();
  ctx.arc(cx, 252, 4.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#F6ECE0";
  ctx.font = "bold 50px Georgia, 'Times New Roman', serif";
  ctx.fillText("COFFEE SPOTJ.ST6329", cx, 318, 840);

  ctx.strokeStyle = "rgba(207, 168, 123, 0.65)";
  ctx.lineWidth = 1.75;
  ctx.beginPath();
  ctx.moveTo(cx - 105, 368);
  ctx.lineTo(cx + 105, 368);
  ctx.stroke();

  ctx.fillStyle = "#D8C2A6";
  ctx.font = "600 18px system-ui, -apple-system, Arial, sans-serif";
  ctx.letterSpacing = "4.5px";
  ctx.fillText("YOUR COFFEE  •  YOUR REWARDS", cx, 412, 840);
  ctx.letterSpacing = "0px";
  ctx.restore();

  // ---------------------------------
  // 4. QR CODE FRAME
  // ---------------------------------

  const qrSize = 680;
  const padding = 32;
  const outerSize = qrSize + padding * 2;
  const qrX = (W - outerSize) / 2;
  const qrY = 472;

  ctx.save();
  ctx.shadowColor = "rgba(12, 6, 3, 0.42)";
  ctx.shadowBlur = 36;
  ctx.shadowOffsetY = 14;
  fillRoundedRect(qrX - 10, qrY - 10, outerSize + 20, outerSize + 20, 28, "#E9DDCB");
  ctx.restore();

  fillRoundedRect(qrX, qrY, outerSize, outerSize, 20, "#FFFFFF");

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#CBB192";
  ctx.font = "500 20px system-ui, -apple-system, Arial, sans-serif";
  ctx.letterSpacing = "3px";
  ctx.fillText("SCAN TO VIEW & EARN", cx, qrY + outerSize + 44, 800);
  ctx.letterSpacing = "0px";
  ctx.restore();

  // ---------------------------------
  // 5. REFINED ILLUSTRATED COFFEE CUP
  // ---------------------------------

  ctx.save();
  ctx.translate(225, 1515);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Soft ground shadow
  const groundShadow = ctx.createRadialGradient(0, 86, 12, 0, 86, 132);
  groundShadow.addColorStop(0, "rgba(10, 5, 2, 0.42)");
  groundShadow.addColorStop(1, "rgba(10, 5, 2, 0)");
  ctx.fillStyle = groundShadow;
  ctx.beginPath();
  ctx.ellipse(0, 86, 132, 20, 0, 0, Math.PI * 2);
  ctx.fill();

  // Saucer body with subtle shading
  const saucerGrad = ctx.createLinearGradient(-120, 54, 120, 96);
  saucerGrad.addColorStop(0, "#462917");
  saucerGrad.addColorStop(0.5, "#361E10");
  saucerGrad.addColorStop(1, "#27150B");

  ctx.fillStyle = saucerGrad;
  ctx.strokeStyle = "rgba(184, 134, 88, 0.72)";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.ellipse(0, 72, 120, 21, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Subtle saucer foot ring
  ctx.strokeStyle = "rgba(184, 134, 88, 0.45)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-92, 82);
  ctx.quadraticCurveTo(0, 98, 92, 82);
  ctx.stroke();

  // Handle behind cup wall
  ctx.save();
  ctx.strokeStyle = "rgba(184, 134, 88, 0.75)";
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(72, -16);
  ctx.bezierCurveTo(126, -20, 128, 42, 70, 48);
  ctx.stroke();

  ctx.strokeStyle = "#341D10";
  ctx.lineWidth = 8.5;
  ctx.beginPath();
  ctx.moveTo(72, -16);
  ctx.bezierCurveTo(122, -18, 124, 39, 70, 45);
  ctx.stroke();
  ctx.restore();

  // Cup body (clean straight-slight-taper cylinder)
  const cupGrad = ctx.createLinearGradient(-80, 0, 80, 0);
  cupGrad.addColorStop(0, "#492B18");
  cupGrad.addColorStop(0.28, "#3B2212");
  cupGrad.addColorStop(0.75, "#2E190D");
  cupGrad.addColorStop(1, "#241309");

  ctx.fillStyle = cupGrad;
  ctx.strokeStyle = "rgba(184, 134, 88, 0.75)";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-78, -24);
  ctx.lineTo(-72, 44);
  ctx.quadraticCurveTo(-68, 64, 0, 65);
  ctx.quadraticCurveTo(68, 64, 72, 44);
  ctx.lineTo(78, -24);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Subtle vertical ceramic highlight on left side
  ctx.strokeStyle = "rgba(246, 236, 224, 0.14)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-56, -12);
  ctx.lineTo(-52, 42);
  ctx.stroke();

  // Coffee surface inside cup
  const coffeeGrad = ctx.createRadialGradient(-8, -23, 6, 0, -22, 72);
  coffeeGrad.addColorStop(0, "#C77932");
  coffeeGrad.addColorStop(0.75, "#A85E20");
  coffeeGrad.addColorStop(1, "#7E4314");

  ctx.fillStyle = coffeeGrad;
  ctx.beginPath();
  ctx.ellipse(0, -22, 70, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Clean rim edge
  ctx.strokeStyle = "rgba(198, 148, 98, 0.82)";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.ellipse(0, -24, 78, 15.5, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Soft, tapered steam wisps
  const steamConfigs = [
    { x: -30, topY: -112, sway: -10 },
    { x: 0, topY: -124, sway: 8 },
    { x: 30, topY: -110, sway: -8 }
  ];

  steamConfigs.forEach(({ x, topY, sway }) => {
    const steamGrad = ctx.createLinearGradient(x, -48, x, topY);
    steamGrad.addColorStop(0, "rgba(224, 194, 158, 0.45)");
    steamGrad.addColorStop(0.65, "rgba(224, 194, 158, 0.18)");
    steamGrad.addColorStop(1, "rgba(224, 194, 158, 0)");

    ctx.strokeStyle = steamGrad;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x, -48);
    ctx.bezierCurveTo(
      x + sway,
      -70,
      x - sway,
      -92,
      x + sway * 0.5,
      topY
    );
    ctx.stroke();
  });

  ctx.restore();

  // ---------------------------------
  // 6. BOTTOM-RIGHT DECORATION
  // ---------------------------------

  ctx.save();
  ctx.shadowColor = "rgba(15, 8, 5, 0.25)";
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 6;

  ctx.beginPath();
  ctx.moveTo(W, 1390);
  ctx.bezierCurveTo(925, 1345, 855, 1390, 850, 1470);
  ctx.bezierCurveTo(845, 1540, 925, 1580, W, 1605);
  ctx.closePath();
  ctx.fillStyle = "#E8D5B9";
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(W, 1530);
  ctx.bezierCurveTo(940, 1500, 885, 1565, 900, 1640);
  ctx.bezierCurveTo(915, 1700, 970, 1730, W, 1745);
  ctx.closePath();
  ctx.fillStyle = "#C9A77F";
  ctx.fill();
  ctx.restore();

  drawBean(945, 1630, -0.5, 0.95, "#76513A", "#E8D5B9");

  // ---------------------------------
  // 7. RENDER QR & DOWNLOAD
  // ---------------------------------

  const image = new Image();

  image.onload = () => {
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, qrX + padding, qrY + padding, qrSize, qrSize);
    ctx.restore();

    const link = document.createElement("a");
    link.download = "Coffee-SpotJ-ST6329-QR.png";
    link.href = canvas.toDataURL("image/png");

    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  image.onerror = () => {
    alert("Unable to create QR download. Please try again.");
  };

  image.src = qr;
}
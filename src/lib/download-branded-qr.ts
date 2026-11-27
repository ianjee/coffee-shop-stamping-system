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
    lineWidth = 2.2
  ) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(scale, scale);

    ctx.beginPath();
    ctx.ellipse(0, 0, 12, 20, 0, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();

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

  for (let y = -110; y < H + 140; y += 130) {
    for (let x = -110; x < W + 140; x += 155) {
      const offsetX = (Math.floor((y + 110) / 130) % 2) * 35;
      drawBean(x + offsetX, y, -0.52, 1.35, "#5A3C2E", "#DFC4A3", 0.085, 2.5);
    }
  }

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
  ctx.fillText("COFFEESPOT J.ST6329", cx, 318, 840);

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
  // 4. QR CODE FRAME (PRIMARY FOCUS)
  // ---------------------------------

  const qrSize = 690;
  const padding = 34;
  const outerSize = qrSize + padding * 2;
  const qrX = (W - outerSize) / 2;
  const qrY = 468;

  ctx.save();
  ctx.shadowColor = "rgba(12, 6, 3, 0.44)";
  ctx.shadowBlur = 38;
  ctx.shadowOffsetY = 14;
  fillRoundedRect(qrX - 10, qrY - 10, outerSize + 20, outerSize + 20, 28, "#EAD8BE");
  ctx.restore();

  fillRoundedRect(qrX, qrY, outerSize, outerSize, 20, "#FFFFFF");

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#D5BC9D";
  ctx.font = "600 20px system-ui, -apple-system, Arial, sans-serif";
  ctx.letterSpacing = "3px";
  ctx.fillText("SCAN TO VIEW & EARN", cx, qrY + outerSize + 44, 800);
  ctx.letterSpacing = "0px";
  ctx.restore();

  // ---------------------------------
  // 5. SUBTLE MOTORCYCLE COFFEE CART EMBLEM
  // ---------------------------------

  ctx.save();
  ctx.translate(235, 1525);
  ctx.scale(0.88, 0.88);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const strokeMain = "rgba(218, 184, 140, 0.82)";
  const strokeSoft = "rgba(218, 184, 140, 0.45)";
  const goldAccent = "#D8A559";
  const warmAmber = "#B86E2D";
  const darkFill = "#2D190F";

  // Soft circular crest halo behind cart (echoes round logo gently)
  const crestGrad = ctx.createRadialGradient(0, -10, 20, 0, -10, 155);
  crestGrad.addColorStop(0, "rgba(234, 216, 190, 0.11)");
  crestGrad.addColorStop(0.75, "rgba(234, 216, 190, 0.04)");
  crestGrad.addColorStop(1, "rgba(234, 216, 190, 0)");
  ctx.fillStyle = crestGrad;
  ctx.beginPath();
  ctx.arc(0, -10, 155, 0, Math.PI * 2);
  ctx.fill();

  // Subtle ground shadow
  ctx.fillStyle = "rgba(10, 5, 2, 0.35)";
  ctx.beginPath();
  ctx.ellipse(0, 86, 142, 13, 0, 0, Math.PI * 2);
  ctx.fill();

  // Umbrella pole
  ctx.strokeStyle = strokeMain;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-42, -16);
  ctx.lineTo(-42, -96);
  ctx.stroke();

  // Thatched umbrella canopy
  const umbrellaGrad = ctx.createLinearGradient(-42, -135, -42, -82);
  umbrellaGrad.addColorStop(0, "#E0AE63");
  umbrellaGrad.addColorStop(1, "#B87A35");
  ctx.fillStyle = umbrellaGrad;
  ctx.strokeStyle = strokeMain;
  ctx.lineWidth = 2.5;

  ctx.beginPath();
  ctx.moveTo(-124, -84);
  ctx.quadraticCurveTo(-42, -142, 40, -84);
  ctx.quadraticCurveTo(-42, -76, -124, -84);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Subtle umbrella rib lines
  ctx.strokeStyle = "rgba(56, 33, 18, 0.45)";
  ctx.lineWidth = 1.75;
  [-86, -42, 2].forEach((rx) => {
    ctx.beginPath();
    ctx.moveTo(-42, -126);
    ctx.quadraticCurveTo(rx, -105, rx * 1.15, -83);
    ctx.stroke();
  });

  // Rear wheel (partially tucked under cart skirt)
  const drawWheel = (wx: number, wy: number, r: number) => {
    ctx.save();
    ctx.translate(wx, wy);
    ctx.fillStyle = "#1E1009";
    ctx.strokeStyle = strokeMain;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = strokeSoft;
    ctx.lineWidth = 1.75;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.58, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = goldAccent;
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  drawWheel(-38, 62, 22);
  drawWheel(96, 60, 24);

  // Espresso / Audio box on left of cart counter
  fillRoundedRect(-108, -56, 46, 44, 5, "#9C4A26");
  ctx.strokeStyle = strokeMain;
  ctx.lineWidth = 2.2;
  ctx.strokeRect(-108, -56, 46, 44);

  // Speaker/gauge circle & tiny dials
  ctx.fillStyle = darkFill;
  ctx.beginPath();
  ctx.arc(-85, -31, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = goldAccent;
  ctx.beginPath();
  ctx.arc(-85, -31, 4, 0, Math.PI * 2);
  ctx.fill();

  // Bottles / coffee gear on counter
  fillRoundedRect(-54, -34, 10, 22, 2, "#E8D5B9");
  fillRoundedRect(-40, -30, 9, 18, 2, "#C9A77F");
  fillRoundedRect(-26, -36, 12, 24, 2, "#5E3B28");

  // Cart counter deck
  fillRoundedRect(-114, -14, 168, 12, 4, warmAmber);
  ctx.strokeStyle = strokeMain;
  ctx.lineWidth = 2.2;
  ctx.strokeRect(-114, -14, 168, 12);

  // Tiki / straw fringe skirt under counter
  const skirtGrad = ctx.createLinearGradient(0, -2, 0, 56);
  skirtGrad.addColorStop(0, "#DDA95E");
  skirtGrad.addColorStop(1, "#A86E2B");
  ctx.fillStyle = skirtGrad;
  ctx.beginPath();
  ctx.moveTo(-110, -2);
  ctx.lineTo(48, -2);
  ctx.lineTo(48, 54);
  for (let fx = 48; fx >= -110; fx -= 12) {
    ctx.lineTo(fx - 6, 47);
    ctx.lineTo(fx - 12, 55);
  }
  ctx.closePath();
  ctx.fill();

  // Vertical straw texture strokes
  ctx.strokeStyle = "rgba(56, 33, 18, 0.35)";
  ctx.lineWidth = 1.5;
  for (let sx = -102; sx <= 42; sx += 10) {
    ctx.beginPath();
    ctx.moveTo(sx, 2);
    ctx.lineTo(sx, 48);
    ctx.stroke();
  }

  // Scooter seat & backrest
  fillRoundedRect(46, -44, 16, 36, 6, "#4A3124");
  ctx.strokeStyle = strokeMain;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Scooter front body & leg shield
  ctx.fillStyle = "#A44626";
  ctx.strokeStyle = strokeMain;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(52, -8);
  ctx.lineTo(74, -8);
  ctx.quadraticCurveTo(86, -34, 80, -52);
  ctx.lineTo(92, -52);
  ctx.quadraticCurveTo(96, -12, 86, 34);
  ctx.lineTo(54, 34);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Front fender over front wheel
  ctx.fillStyle = "#B6522E";
  ctx.beginPath();
  ctx.arc(96, 56, 26, Math.PI * 1.08, Math.PI * 1.88);
  ctx.lineTo(96, 56);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Handlebar, headlight & windshield
  ctx.strokeStyle = strokeMain;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(86, -52);
  ctx.lineTo(86, -80);
  ctx.stroke();

  ctx.fillStyle = "rgba(234, 216, 190, 0.22)";
  ctx.beginPath();
  ctx.roundRect(83, -82, 7, 26, 3);
  ctx.fill();
  ctx.stroke();

  // Headlight glow dot
  ctx.fillStyle = "#F5D28B";
  ctx.beginPath();
  ctx.arc(97, -45, 5, 0, Math.PI * 2);
  ctx.fill();

  // Two subtle lightning sparks flanking the cart (nod to the logo)
  const drawMiniBolt = (bx: number, by: number) => {
    ctx.save();
    ctx.translate(bx, by);
    ctx.strokeStyle = "rgba(224, 174, 99, 0.5)";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(4, -14);
    ctx.lineTo(-4, -1);
    ctx.lineTo(3, -1);
    ctx.lineTo(-4, 14);
    ctx.stroke();
    ctx.restore();
  };

  drawMiniBolt(-136, -15);
  drawMiniBolt(132, -15);

  ctx.restore();

  // ---------------------------------
  // 6. BOTTOM-RIGHT MEDIUM & DARK ROAST BEANS (FLUSH RIGHT)
  // ---------------------------------

  const drawRoastBean = (
    x: number,
    y: number,
    angle: number,
    scaleX: number,
    scaleY: number,
    roast: {
      light: string;
      mid: string;
      dark: string;
      creaseDeep: string;
      creaseLine: string;
      highlight: string;
      rim: string;
    }
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(scaleX, scaleY);

    // Soft ground shadow beneath bean
    ctx.save();
    ctx.translate(-6, 12);
    ctx.beginPath();
    ctx.ellipse(0, 0, 56, 86, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(8, 4, 1, 0.48)";
    ctx.filter = "blur(10px)";
    ctx.fill();
    ctx.restore();

    // Clip to bean silhouette for realistic 3D roast shading
    ctx.beginPath();
    ctx.ellipse(0, 0, 56, 86, 0, 0, Math.PI * 2);
    ctx.save();
    ctx.clip();

    // 3D body gradient
    const bodyGrad = ctx.createRadialGradient(-20, -30, 10, 4, 8, 112);
    bodyGrad.addColorStop(0, roast.light);
    bodyGrad.addColorStop(0.52, roast.mid);
    bodyGrad.addColorStop(1, roast.dark);
    ctx.fillStyle = bodyGrad;
    ctx.fillRect(-70, -100, 140, 200);

    // Warm rim reflection so dark roast separates cleanly from dark background
    const rimGrad = ctx.createLinearGradient(-50, -60, 45, 70);
    rimGrad.addColorStop(0, roast.rim);
    rimGrad.addColorStop(0.45, "rgba(255, 228, 196, 0)");
    rimGrad.addColorStop(1, "rgba(255, 228, 196, 0.12)");
    ctx.fillStyle = rimGrad;
    ctx.fillRect(-70, -100, 140, 200);

    // Center crease shadow groove
    ctx.beginPath();
    ctx.moveTo(-2, -74);
    ctx.bezierCurveTo(22, -46, -24, -18, -4, 8);
    ctx.bezierCurveTo(16, 34, -18, 56, 2, 76);
    ctx.strokeStyle = roast.creaseDeep;
    ctx.lineWidth = 11;
    ctx.lineCap = "round";
    ctx.filter = "blur(2.5px)";
    ctx.stroke();
    ctx.filter = "none";

    // Crisp inner seam line
    ctx.beginPath();
    ctx.moveTo(-2, -72);
    ctx.bezierCurveTo(20, -45, -22, -18, -4, 8);
    ctx.bezierCurveTo(14, 34, -16, 56, 2, 74);
    ctx.strokeStyle = roast.creaseLine;
    ctx.lineWidth = 3.2;
    ctx.lineCap = "round";
    ctx.stroke();

    // Natural roasted coffee oil sheen on upper-left lobe
    ctx.save();
    ctx.translate(-22, -28);
    ctx.rotate(-0.35);
    const sheenGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 34);
    sheenGrad.addColorStop(0, roast.highlight);
    sheenGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = sheenGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 34, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore(); // end clip

    // Subtle warm edge highlight to keep silhouette crisp against dark espresso background
    ctx.beginPath();
    ctx.ellipse(0, 0, 56, 86, 0, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(234, 204, 168, 0.28)";
    ctx.lineWidth = 1.75;
    ctx.stroke();

    ctx.restore();
  };

  ctx.save();

  // Upper/back bean: Medium Roast (warm chestnut-cinnamon brown), flush against right edge
  drawRoastBean(978, 1455, -0.32, 1.52, 1.46, {
    light: "#9E643B",
    mid: "#744424",
    dark: "#4B2A14",
    creaseDeep: "rgba(32, 15, 6, 0.58)",
    creaseLine: "rgba(24, 10, 4, 0.85)",
    highlight: "rgba(255, 224, 190, 0.32)",
    rim: "rgba(235, 192, 148, 0.24)"
  });

  // Lower/front bean: Dark Roast (deep French-roast espresso with glossy oil sheen), flush against right edge
  drawRoastBean(952, 1605, -0.62, 1.6, 1.52, {
    light: "#633B24",
    mid: "#3D2214",
    dark: "#1E0F08",
    creaseDeep: "rgba(10, 4, 2, 0.72)",
    creaseLine: "rgba(8, 3, 1, 0.92)",
    highlight: "rgba(255, 228, 198, 0.38)",
    rim: "rgba(222, 178, 134, 0.28)"
  });

  ctx.restore();

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
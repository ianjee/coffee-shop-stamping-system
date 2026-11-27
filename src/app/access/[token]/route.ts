// Customer QR landing. Responds instantly with a bean loading screen (no DB work),
// then the page signs the customer in via /api/access/[token] and redirects.
const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Opening your card…</title>
<noscript><meta http-equiv="refresh" content="0;url=/?access=invalid" /></noscript>
<style>
  html,body{margin:0;height:100%}
  body{display:grid;place-items:center;background:#f5ebdd;color:#744a30;font-family:system-ui,sans-serif}
  .w{display:flex;flex-direction:column;align-items:center;gap:4px}
  svg{animation:hop .9s cubic-bezier(.4,0,.3,1) infinite}
  .s{width:26px;height:5px;border-radius:50%;background:rgba(59,36,24,.22);animation:sh .9s cubic-bezier(.4,0,.3,1) infinite}
  p{margin:6px 0 0;font-size:.85rem;font-weight:600;color:#7a6455;letter-spacing:.04em}
  @keyframes hop{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-14px) rotate(180deg)}}
  @keyframes sh{0%,100%{transform:scaleX(1);opacity:1}50%{transform:scaleX(.55);opacity:.5}}
</style></head>
<body><div class="w" role="status">
<svg width="56" height="56" viewBox="0 0 48 48" aria-hidden="true"><g transform="rotate(-30 24 24)"><ellipse cx="24" cy="24" rx="12" ry="18" fill="currentColor"/><path d="M24 7c-6 7 6 11 0 17s6 11 0 17" fill="none" stroke="#f5ebdd" stroke-width="2.6" stroke-linecap="round"/></g></svg>
<span class="s"></span><p>Opening your card…</p></div>
<script>
  var token = location.pathname.split("/").filter(Boolean).pop();
  fetch("/api/access/" + token, { method: "POST" })
    .then(function (r) { return r.json(); })
    .then(function (d) { location.replace(d.redirect || "/"); })
    .catch(function () { location.replace("/?access=invalid"); });
</script></body></html>`;

export async function GET() {
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" }
  });
}

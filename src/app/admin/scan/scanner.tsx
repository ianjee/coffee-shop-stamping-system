"use client";

import { useEffect, useState } from "react";
import BeanLoader from "@/components/BeanLoader";
import { useLoader } from "@/components/LoadingProvider";

function getCustomerToken(scannedValue: string) {
  const value = scannedValue.trim();

  // QR contains https://your-domain/access/TOKEN.
  // Accept full URLs as well as raw tokens for manual/legacy scanning.
  try {
    const parsed = new URL(value);
    const segments = parsed.pathname.split("/").filter(Boolean);
    const accessIndex = segments.lastIndexOf("access");

    if (accessIndex >= 0 && segments[accessIndex + 1]) {
      return decodeURIComponent(segments[accessIndex + 1]);
    }

    const queryToken = parsed.searchParams.get("token");
    if (queryToken) return queryToken;
  } catch {
    // Not a URL: treat the scanned value as the token itself.
  }

  return value;
}

export default function Scanner() {
  const { run } = useLoader();
  const [message, setMessage] = useState("Starting camera…");
  const [token, setToken] = useState("");

  useEffect(() => {
    let scanner: import("html5-qrcode").Html5Qrcode | undefined;
    let stopped = false;

    (async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        scanner = new Html5Qrcode("reader");

        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          async (decodedText: string) => {
            if (stopped) return;
            stopped = true;
            const customerToken = getCustomerToken(decodedText);
            run(() => new Promise(() => {}));
            await scanner?.stop();
            window.location.href =
              "/admin/verify?token=" + encodeURIComponent(customerToken);
          },
          () => {}
        );

        setMessage("Point the camera at the customer's single QR code.");
      } catch {
        setMessage(
          "Camera unavailable. Allow camera access and use HTTPS, or paste the customer QR URL below."
        );
      }
    })();

    return () => {
      stopped = true;
      scanner?.stop().catch(() => {});
    };
  }, [run]);

  return (
    <div className="panel">
      <div id="reader" className="reader" />
      {message === "Starting camera…" ? (
        <div className="center"><BeanLoader size={36} label={message} /></div>
      ) : (
        message.startsWith("Camera unavailable") && <p className="hint center">{message}</p>
      )}
      <form
        className="inline-form"
        onSubmit={(event) => {
          event.preventDefault();
          const customerToken = getCustomerToken(token);
          if (!customerToken) return;
          run(() => new Promise(() => {}));
          window.location.href =
            "/admin/verify?token=" + encodeURIComponent(customerToken);
        }}
      >
        <input
          placeholder="Paste customer QR URL or token"
          value={token}
          onChange={(event) => setToken(event.target.value)}
        />
        <button className="btn">Verify</button>
      </form>
    </div>
  );
}

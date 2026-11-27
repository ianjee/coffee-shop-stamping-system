
"use client";

import { useState } from "react";
import { useLoader } from "@/components/LoadingProvider";
import { downloadBrandedQr } from "@/lib/download-branded-qr";

export default function CustomerActions({
  id,
  active
}: {
  id: string;
  active: boolean;
}) {
  const { run } = useLoader();
  const [qr, setQr] = useState("");
  const [url, setUrl] = useState("");

  async function act(action: string) {
    const { r, d } = await run(async () => {
      const r = await fetch(`/api/customers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      });
      return { r, d: await r.json() };
    });

    if (!r.ok) {
      alert(d.error || "Action failed");
      return;
    }

    if (action === "regenerate") {
      setQr(d.qr);
      setUrl(d.url);
    } else {
      run(() => new Promise(() => {}));
      location.reload();
    }
  }

  function downloadCustomerQr() {
    if (!qr) return;
    downloadBrandedQr(qr);
  }

  return (
    <div className="mt-4">
      <div className="actions">
        <button
          className={active ? "btn btn-outline" : "btn"}
          onClick={() => act(active ? "deactivate" : "activate")}
        >
          {active ? "Deactivate" : "Activate"}
        </button>

        <button
          className="btn btn-outline"
          onClick={() => act("regenerate")}
        >
          Regenerate QR credentials
        </button>
      </div>

      {qr && (
        <div className="qr-result">
          <h2>New customer QR</h2>

          <img
            src={qr}
            alt="New customer QR"
            width={240}
            className="qr"
          />

          <p className="break-all hint">{url}</p>

          <button
            type="button"
            onClick={downloadCustomerQr}
            className="btn btn-outline"
          >
            Download Branded QR
          </button>
        </div>
      )}
    </div>
  );
}

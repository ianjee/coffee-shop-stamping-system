"use client";
import { useState } from "react";
import { useLoader } from "@/components/LoadingProvider";

export default function NewCustomerForm() {
  const { run } = useLoader();
  const [name, setName] = useState("");
  const [result, setResult] = useState<{ url: string; qr: string } | null>(null);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const { response, data } = await run(async () => {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
      });
      return { response, data: await response.json() };
    });
    if (!response.ok) {
      setError(data.error || "Could not create customer");
      return;
    }
    setResult(data);
  }

  return (
    <div className="panel narrow">
      <form onSubmit={submit} className="form">
        <label className="field"><span>Customer name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={100} />
        </label>
        <button className="btn">Create customer and QR</button>
      </form>
      {error && <p role="alert" className="alert">{error}</p>}
      {result && (
        <div className="qr-result">
          <h2>Customer LOGIN QR</h2>
          <p className="hint">The customer scans this QR to open their loyalty card. It is not the stamp QR that the admin scans.</p>
          <img src={result.qr} alt="Customer login QR" width="240" className="qr" />
          <p className="break-all hint">{result.url}</p>
          <a href={result.qr} download="customer-login-qr.png" className="btn btn-outline">Download login QR image</a>
          <p className="hint">Give this login QR to the customer and keep it private.</p>
        </div>
      )}
    </div>
  );
}

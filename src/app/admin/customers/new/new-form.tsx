"use client";
import {useState} from "react";
export default function NewCustomerForm(){
 const [name,setName]=useState(""),[result,setResult]=useState<{url:string;qr:string}|null>(null),[error,setError]=useState("");
 async function submit(e:React.FormEvent){e.preventDefault();setError("");const r=await fetch("/api/customers",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name})});const d=await r.json();if(!r.ok){setError(d.error||"Could not create customer");return;}setResult(d);}
 return <div className="panel max-w-lg"><form onSubmit={submit} className="space-y-3"><label>Customer name<input value={name} onChange={e=>setName(e.target.value)} required maxLength={100}/></label><button>Create customer and QR</button></form>
 {error&&<p role="alert">{error}</p>}{result&&<div className="mt-5"><h2 className="font-bold">Customer login QR</h2><img src={result.qr} alt="Customer login QR" width="240"/><p className="break-all">{result.url}</p><a href={result.qr} download="customer-login-qr.png">Download QR image</a><p className="mt-2 text-sm">Give this login QR to the customer and keep it private.</p></div>}</div>;
}

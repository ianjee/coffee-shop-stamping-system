"use client";
import {useState} from "react";
export default function ApproveStamp({token}:{token:string}){const [busy,setBusy]=useState(false),[msg,setMsg]=useState("");
 async function approve(){setBusy(true);const r=await fetch("/api/stamps",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token})});const d=await r.json();setMsg(r.ok?`Stamp approved. New total: ${d.total}`:(d.error||"Could not approve stamp"));setBusy(false);}
 return <div className="mt-4"><button disabled={busy} onClick={approve}>Approve Stamp</button>{msg&&<p className="mt-3">{msg}</p>}</div>}

"use client";
import {useState} from "react";
import {useLoader} from "@/components/LoadingProvider";
export default function ApproveStamp({token}:{token:string}){const {run}=useLoader();const [busy,setBusy]=useState(false),[msg,setMsg]=useState("");
 async function approve(){setBusy(true);const {r,d}=await run(async()=>{const r=await fetch("/api/stamps",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token})});return {r,d:await r.json()};});setMsg(r.ok?`Stamp approved. New total: ${d.total}`:(d.error||"Could not approve stamp"));setBusy(false);}
 return <div className="mt-4"><button className="btn block" disabled={busy} onClick={approve}>Approve Stamp</button>{msg&&<p className="note">{msg}</p>}</div>}

"use client";
import {useState} from "react";
export default function CustomerActions({id,active}:{id:string;active:boolean}){
 const [qr,setQr]=useState("");
 const [url,setUrl]=useState("");
 async function act(action:string){
  const r=await fetch(`/api/customers/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({action})});
  const d=await r.json();
  if(!r.ok){alert(d.error||"Action failed");return;}
  if(action==="regenerate"){setQr(d.qr);setUrl(d.url);}else location.reload();
 }
 return <div className="mt-4">
  <div className="flex gap-3"><button onClick={()=>act(active?"deactivate":"activate")}>{active?"Deactivate":"Activate"}</button><button onClick={()=>act("regenerate")}>Regenerate QR credentials</button></div>
  {qr&&<div className="mt-5"><h2 className="font-bold">New customer login QR</h2><img src={qr} alt="New login QR" width="240"/><p className="break-all">{url}</p><a href={qr} download="customer-login-qr.png">Download QR image</a></div>}
 </div>;
}

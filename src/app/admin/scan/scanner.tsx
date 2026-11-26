"use client";
import {useEffect,useState} from "react";
export default function Scanner(){
 const [message,setMessage]=useState("Starting camera…");
 useEffect(()=>{let scanner:any;let stopped=false;(async()=>{try{const {Html5Qrcode}=await import("html5-qrcode");scanner=new Html5Qrcode("reader");await scanner.start({facingMode:"environment"},{fps:10,qrbox:{width:250,height:250}},async(text:string)=>{if(stopped)return;stopped=true;await scanner.stop();location.href="/admin/verify?token="+encodeURIComponent(text);},()=>{});setMessage("Point the camera at the customer's stamp QR.");}catch{setMessage("Camera unavailable. Allow camera access and use HTTPS, or enter the stamp token manually.");}})();return()=>{stopped=true;scanner?.stop().catch(()=>{});};},[]);
 const [token,setToken]=useState("");
 return <div className="panel"><div id="reader" className="max-w-lg"></div><p>{message}</p><form className="mt-4 flex gap-2" onSubmit={e=>{e.preventDefault();location.href="/admin/verify?token="+encodeURIComponent(token)}}><input placeholder="Paste stamp token" value={token} onChange={e=>setToken(e.target.value)}/><button>Verify</button></form></div>;
}

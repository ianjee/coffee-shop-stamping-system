"use client";
import { useState } from "react";
export default function LoginForm() {
  const [username,setUsername]=useState(""), [password,setPassword]=useState(""), [error,setError]=useState("");
  async function submit(e:React.FormEvent) {
    e.preventDefault(); setError("");
    const r=await fetch("/api/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username,password})});
    if(r.ok) location.href="/admin/dashboard"; else setError("Invalid username or password.");
  }
  return <form className="panel form" onSubmit={submit}>
    <label className="field"><span>Username</span><input value={username} onChange={e=>setUsername(e.target.value)} required autoComplete="username" /></label>
    <label className="field"><span>Password</span><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password" /></label>
    {error && <p role="alert" className="alert">{error}</p>}
    <button className="btn block">Sign in</button>
  </form>;
}

"use client";
import { useState } from "react";
export default function LoginForm() {
  const [username,setUsername]=useState(""), [password,setPassword]=useState(""), [error,setError]=useState("");
  async function submit(e:React.FormEvent) {
    e.preventDefault(); setError("");
    const r=await fetch("/api/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username,password})});
    if(r.ok) location.href="/admin/dashboard"; else setError("Invalid username or password.");
  }
  return <form className="panel max-w-md space-y-3" onSubmit={submit}>
    <label>Username<input value={username} onChange={e=>setUsername(e.target.value)} required /></label>
    <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></label>
    {error && <p role="alert">{error}</p>}<button>Sign in</button>
  </form>;
}

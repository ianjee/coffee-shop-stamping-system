import Link from "next/link";
import CartLogo from "./CartLogo";

export function CupIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Z" />
      <path d="M17 11h1.5a2.5 2.5 0 0 1 0 5H17" />
      <path d="M8 3c-.8 1 .8 1.6 0 3M12 3c-.8 1 .8 1.6 0 3" />
    </svg>
  );
}

export default function AdminNav() {
  return (
    <header className="topbar">
      <div className="topbar-in">
        <Link href="/admin/dashboard" className="brand"><CartLogo size={22} /><span>CoffeeSpot</span></Link>
        <nav>
          <Link href="/admin/dashboard">Dashboard</Link>
          <Link href="/admin/customers">Customers</Link>
          <Link href="/admin/scan">Scan QR</Link>
          <Link href="/admin/stamps">Stamp history</Link>
          <form action="/api/admin/logout" method="post"><button className="btn-ghost">Log out</button></form>
        </nav>
      </div>
    </header>
  );
}

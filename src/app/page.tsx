import Link from "next/link";
import { CupIcon } from "@/components/AdminNav";
export default function Home() {
  return (
    <main className="hero">
      <div className="hero-card">
        <span className="hero-badge"><CupIcon size={30} /></span>
        <p className="eyebrow">Digital loyalty card</p>
        <h1>Every cup,<br />a little reward.</h1>
        <p className="lede">Digital stamps, customer cards, and rewards for your coffee shop, all in one place.</p>
        <Link href="/admin/login" className="btn">Admin login</Link>
      </div>
    </main>
  );
}

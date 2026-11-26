import Link from "next/link";
export default function Home() {
  return <main className="wrap"><h1 className="text-3xl font-bold">Coffee Shop Loyalty</h1>
    <p className="mt-3">Digital stamps, customer cards, and rewards.</p>
    <div className="panel"><Link href="/admin/login">Admin login</Link></div>
  </main>;
}

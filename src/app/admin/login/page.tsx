import LoginForm from "./login-form";
import { CupIcon } from "@/components/AdminNav";
export default function LoginPage() {
  return (
    <main className="hero">
      <div className="auth">
        <span className="hero-badge"><CupIcon size={28} /></span>
        <h1>Welcome back</h1>
        <p className="lede">Sign in to manage customers and stamps.</p>
        <LoginForm />
      </div>
    </main>
  );
}

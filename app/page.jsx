"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const ok = await login(form.email, form.password);
    if (ok) router.push("/dashboard");
    else setError("Invalid credentials. Check the demo logins below.");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[52%] relative overflow-hidden flex-col justify-between p-12"
        style={{ background: "linear-gradient(145deg,#0c4a6e 0%,#0369a1 45%,#0ea5e9 100%)" }}>
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute top-1/3 -left-16 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-20 right-1/4 w-80 h-80 rounded-full bg-white/5" />

        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl border border-white/20">🩺</div>
          <div>
            <span className="text-white font-display font-bold text-xl">Schedula</span>
            <p className="text-white/60 text-xs">Healthcare Platform</p>
          </div>
        </div>

        <div className="relative">
          <p className="text-white/60 text-sm font-medium uppercase tracking-widest mb-3">Welcome back</p>
          <h1 className="text-white font-display font-bold text-5xl leading-tight mb-4">
            Your health,<br />
            <span className="text-cyan-300">our priority</span>
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-xs">
            Connect with top-rated doctors and manage your healthcare journey — all in one place.
          </p>
          <div className="flex gap-6 mt-10">
            {[["500+","Doctors"],["10k+","Patients"],["4.9★","Rating"]].map(([val,label]) => (
              <div key={label}>
                <p className="text-white font-display font-bold text-2xl">{val}</p>
                <p className="text-white/60 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/15">
          <p className="text-white/90 text-sm leading-relaxed italic">
            "Schedula made booking my cardiologist appointment effortless. Got a same-day slot!"
          </p>
          <div className="flex items-center gap-2 mt-3">
            <div className="w-8 h-8 rounded-full bg-cyan-400/40 flex items-center justify-center text-white text-xs font-bold">AK</div>
            <div>
              <p className="text-white text-xs font-semibold">Ananya K.</p>
              <p className="text-white/50 text-xs">Verified Patient</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-16 bg-white min-h-screen lg:min-h-0">

        <div className="lg:hidden flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-3"
            style={{ background: "linear-gradient(135deg,#0ea5e9,#0369a1)" }}>🩺</div>
          <h1 className="font-display font-bold text-2xl" style={{ color: "#0369a1" }}>Schedula</h1>
          <p className="text-slate-400 text-sm mt-0.5">Smart Healthcare Scheduling</p>
        </div>

        <div className="w-full max-w-md">
          <h2 className="font-display font-bold text-3xl text-slate-800 mb-1">Sign in</h2>
          <p className="text-slate-400 mb-8">Enter your credentials to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email / Mobile</label>
              <div className="relative">
                <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input type="text" placeholder="you@example.com" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm placeholder:text-slate-400 outline-none transition-all focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                  required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input type={showPassword ? "text" : "password"} placeholder="Enter your password"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm placeholder:text-slate-400 outline-none transition-all focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                  required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1">
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <div onClick={() => setRememberMe(!rememberMe)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${rememberMe ? "border-cyan-500 bg-cyan-500" : "border-slate-300"}`}>
                  {rememberMe && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <button type="button" className="text-sm font-semibold text-cyan-500 hover:text-cyan-600">Forgot password?</button>
            </div>

            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                <span className="mt-0.5 flex-shrink-0">⚠️</span> {error}
              </div>
            )}

            <button type="submit" disabled={isLoading}
              className="w-full py-3.5 rounded-xl font-bold text-white text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#0369a1,#0ea5e9)" }}>
              {isLoading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</>
                : <>Sign In <ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
            <div className="relative flex justify-center"><span className="px-3 bg-white text-slate-400 text-sm">Or continue with</span></div>
          </div>

          <button className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all text-sm font-semibold text-slate-700 active:scale-[0.98]">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

         
          

          <p className="text-center text-sm text-slate-500 mt-6">
            No account?{" "}
            <Link href="/signup" className="font-bold text-cyan-500 hover:text-cyan-600">Create one free →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Mail, Phone, Lock, ArrowRight, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "", role: "patient" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    const ok = await signup({ name: form.name, email: form.email, phone: form.phone, password: form.password, role: form.role });
    if (!ok) { setError("Something went wrong. Please try again."); return; }
    router.push("/dashboard");
  };

  const isDoctor    = form.role === "doctor";
  const accentColor = isDoctor ? "#7c3aed" : "#0369a1";
  const gradFrom    = isDoctor ? "#5b21b6" : "#134e4a";
  const gradTo      = isDoctor ? "#7c3aed" : "#0d9488";

  // Smaller inputs on desktop to fit without scroll
  const fieldClass = "w-full pl-10 pr-4 py-2.5 lg:py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm placeholder:text-slate-400 outline-none transition-all focus:border-current focus:bg-white";

  return (
    <div className="min-h-screen lg:h-screen flex flex-col lg:flex-row lg:overflow-hidden">

      {/* ── LEFT PANEL ── */}
      <div
        className="hidden lg:flex lg:w-[44%] relative overflow-hidden flex-col justify-between p-8 xl:p-10"
        style={{ background: `linear-gradient(145deg, ${gradFrom} 0%, ${gradTo} 100%)` }}
      >
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl border border-white/20">🩺</div>
          <div>
            <span className="text-white font-bold text-lg">Schedula</span>
            <p className="text-white/60 text-xs">Healthcare Platform</p>
          </div>
        </div>

        {/* Main copy */}
        <div className="relative">
          <p className="text-white/60 text-xs font-medium uppercase tracking-widest mb-2">Join today</p>
          <h1 className="text-white font-bold text-3xl xl:text-4xl leading-tight mb-3">
            Better health<br />
            <span style={{ color: isDoctor ? "#c4b5fd" : "#99f6e4" }}>starts here</span>
          </h1>
          <p className="text-white/70 text-sm leading-relaxed max-w-xs mb-5">
            {isDoctor
              ? "Join our network of verified doctors and help patients book care seamlessly."
              : "Create your free account and get instant access to top-rated doctors near you."}
          </p>
          <div className="space-y-2">
            {(isDoctor
              ? ["Manage your patient appointments", "View detailed patient records", "Get notified on new bookings", "Grow your practice digitally"]
              : ["Book same-day appointments", "Get real-time reminders", "Manage your health records", "Chat with your doctor"]
            ).map(perk => (
              <div key={perk} className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Check size={9} className="text-white" />
                </div>
                <span className="text-white/80 text-sm">{perk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/15">
          <p className="text-white/90 text-xs leading-relaxed italic">
            {isDoctor
              ? `"Schedula cut my appointment admin time by 80%. I can now focus on my patients."`
              : `"Signed up in under a minute. Now I manage all my family's health in one place."`}
          </p>
          <p className="text-white/60 text-xs font-semibold mt-2">
            {isDoctor ? "— Dr. Ananya K., Ophthalmologist" : "— Rahul M., Pune"}
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-8 lg:p-8 xl:p-10 bg-white overflow-y-auto">

        {/* Mobile logo */}
        <div className="lg:hidden flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-2"
            style={{ background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})` }}>🩺</div>
          <h1 className="font-bold text-xl" style={{ color: accentColor }}>Schedula</h1>
        </div>

        <div className="w-full max-w-md">

          <h2 className="font-bold text-2xl text-slate-800 mb-0.5">Create account</h2>
          <p className="text-slate-400 text-sm mb-4">Free forever. No credit card needed.</p>

          <form onSubmit={handleSubmit} className="space-y-3">

            {/* Role toggle */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Signing up as</label>
              <div className="grid grid-cols-2 gap-2">
                {[{ value: "patient", label: "Patient", emoji: "🧑‍⚕️" }, { value: "doctor", label: "Doctor", emoji: "👨‍⚕️" }].map(({ value, label, emoji }) => (
                  <button key={value} type="button" onClick={() => setForm({ ...form, role: value })}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                      form.role === value ? "text-white shadow-md" : "border-slate-200 text-slate-500 bg-slate-50"
                    }`}
                    style={form.role === value ? { background: accentColor, borderColor: accentColor } : {}}>
                    <span>{emoji}</span> {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Name + Email side by side on desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input type="text" placeholder={isDoctor ? "Dr. Your Name" : "Your Full Name"}
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className={fieldClass} required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input type="email" placeholder="you@example.com"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className={fieldClass} required />
                </div>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Mobile Number <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input type="tel" placeholder="+91 9876543210"
                  value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  className={fieldClass} />
              </div>
            </div>

            {/* Password + Confirm side by side on desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input type={showPassword ? "text" : "password"} placeholder="Min 6 characters"
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                    className={`${fieldClass} pr-10`} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {/* Strength bar */}
                <div className="flex gap-1 mt-1.5">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all ${form.password.length >= i*3 ? "" : "bg-slate-200"}`}
                      style={form.password.length >= i*3 ? { background: accentColor } : {}} />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input type={showPassword ? "text" : "password"} placeholder="Re-enter password"
                    value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                    className={`${fieldClass} pr-10`} required />
                  {form.confirmPassword && (
                    <div className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center ${
                      form.password === form.confirmPassword ? "bg-emerald-100" : "bg-red-100"
                    }`}>
                      {form.password === form.confirmPassword
                        ? <Check size={11} className="text-emerald-500" />
                        : <span className="text-red-500 text-[10px] font-bold">✕</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-sm text-red-600">
                ⚠️ {error}
              </div>
            )}

            <button type="submit" disabled={isLoading}
              className="w-full py-3 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg hover:opacity-90"
              style={{ background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})` }}>
              {isLoading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account...</>
                : <>Create Account <ArrowRight size={15} /></>}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-4">
            Already have an account?{" "}
            <Link href="/" className="font-bold" style={{ color: accentColor }}>Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
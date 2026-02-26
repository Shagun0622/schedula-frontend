"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Heart, Clock, Star, MapPin, ChevronRight, Stethoscope, TrendingUp, CalendarCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { DOCTORS, SPECIALTIES, AVATAR_COLORS } from "@/lib/data";

/* ─── Grain overlay ─────────────────────────────────────── */
const GrainSVG = () => (
  <svg className="pointer-events-none fixed inset-0 w-full h-full opacity-[0.025] z-0" xmlns="http://www.w3.org/2000/svg">
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#grain)" />
  </svg>
);

/* ─── Stat pill ──────────────────────────────────────────── */
function StatPill({ icon: Icon, value, label, accent }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-sm"
      style={{ background: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.15)" }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: accent + "33" }}>
        <Icon size={16} style={{ color: accent }} />
      </div>
      <div>
        <p className="font-bold text-white text-[15px] leading-none">{value}</p>
        <p className="text-white/50 text-[11px] mt-0.5 tracking-wide uppercase">{label}</p>
      </div>
    </div>
  );
}

/* ─── Doctor card ────────────────────────────────────────── */
function DoctorCard({ doctor, onToggleFav }) {
  const c = AVATAR_COLORS[parseInt(doctor.id) % AVATAR_COLORS.length];
  const initials = doctor.name.split(" ").filter((_, i) => i > 0).map(n => n[0]).join("").slice(0, 2);
  const available = doctor.availability === "Available today";

  return (
    <Link href={`/dashboard/doctor/${doctor.id}`} className="block group">
      <div className="relative bg-white rounded-3xl border border-slate-100/80 p-5 overflow-hidden
        shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(14,165,233,0.15)]
        hover:-translate-y-1 hover:border-sky-200/60 transition-all duration-300 cursor-pointer">

        {/* Subtle top stripe */}
        <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-3xl opacity-80"
          style={{ background: `linear-gradient(90deg, ${c.text}, transparent)` }} />

        {/* Background glow on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at top left, ${c.bg}60, transparent 60%)` }} />

        <div className="relative flex gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center font-bold text-xl tracking-tight shadow-sm"
              style={{ background: c.bg, color: c.text }}>
              {initials}
            </div>
            {available && (
              <span className="absolute -bottom-1 -right-1 w-[18px] h-[18px] rounded-full bg-emerald-400 border-[2.5px] border-white shadow-sm" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-bold text-slate-800 text-[15px] tracking-tight truncate leading-snug">{doctor.name}</h3>
                <p className="text-[13px] font-semibold mt-0.5" style={{ color: c.text }}>{doctor.specialty}</p>
              </div>
              <button onClick={e => { e.preventDefault(); onToggleFav(doctor.id); }}
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center hover:bg-rose-50 transition-colors -mr-1 -mt-0.5">
                <Heart size={15} className={doctor.isFavorite ? "fill-rose-400 stroke-rose-400" : "stroke-slate-300 group-hover:stroke-slate-400"} />
              </button>
            </div>

            {/* Availability badge */}
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-[5px] rounded-full text-[11px] font-semibold mt-2 border ${
              available
                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                : "bg-amber-50 text-amber-600 border-amber-100"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${available ? "bg-emerald-500 animate-pulse" : "bg-amber-400"}`} />
              {doctor.availability}
            </span>

            {/* Stats row */}
            <div className="flex items-center gap-5 mt-3 pt-3 border-t border-slate-50">
              {[
                { val: `${doctor.experience}+`, label: "Yrs Exp" },
                { val: `${(doctor.patients / 1000).toFixed(0)}k+`, label: "Patients" },
              ].map(({ val, label }) => (
                <div key={label} className="flex flex-col gap-[2px]">
                  <span className="font-bold text-slate-800 text-[13px] leading-none">{val}</span>
                  <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">{label}</span>
                </div>
              ))}
              <div className="flex flex-col gap-[2px]">
                <div className="flex items-center gap-1">
                  <Star size={11} className="fill-amber-400 stroke-amber-400" />
                  <span className="font-bold text-slate-800 text-[13px] leading-none">{doctor.rating}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">{(doctor.reviews / 1000).toFixed(1)}k rev.</span>
              </div>
              <div className="ml-auto hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                <Clock size={11} className="text-sky-400" />
                {doctor.hours}
              </div>
            </div>
          </div>
        </div>

        {/* Book CTA (reveals on hover) */}
        <div className="absolute bottom-3.5 right-4 opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-300">
          <div className="flex items-center gap-1 text-[11px] font-bold text-sky-500">
            Book <ChevronRight size={12} />
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function DashboardPage() {
  const { user } = useAuth();
  const [search, setSearch]          = useState("");
  const [activeSpecialty, setActive] = useState("All");
  const [doctors, setDoctors]        = useState(DOCTORS);
  const firstName = user?.name?.split(" ")[0] ?? "User";

  const filtered = useMemo(() => doctors.filter(d => {
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase());
    const matchSpec   = activeSpecialty === "All" || d.specialization.toLowerCase().includes(activeSpecialty.toLowerCase());
    return matchSearch && matchSpec;
  }), [doctors, search, activeSpecialty]);

  const toggleFav = id => setDoctors(prev => prev.map(d => d.id === id ? { ...d, isFavorite: !d.isFavorite } : d));

  return (
    <div className="min-h-screen" style={{ background: "#f8fafd" }}>
      <GrainSVG />

      {/* ── Mobile header ─────────────────── */}
      <div className="md:hidden px-4 pt-5 pb-0 relative z-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-sky-200">
              {user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <p className="font-bold text-slate-800 text-[15px] leading-snug">Hello, {firstName} 👋</p>
              <p className="text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                <MapPin size={10} className="text-sky-400" /> {user?.location ?? "India"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Desktop hero ──────────────────── */}
      <div className="hidden md:block mx-6 mt-6 relative z-10">
        <div className="rounded-[28px] p-8 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0c2d48 0%, #0369a1 50%, #0ea5e9 100%)" }}>

          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-[0.08]"
            style={{ background: "white", transform: "translate(30%, -30%)" }} />
          <div className="absolute bottom-0 right-24 w-40 h-40 rounded-full opacity-[0.06]"
            style={{ background: "white", transform: "translateY(30%)" }} />

          {/* Mesh highlight */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(56,189,248,0.2), transparent 60%)" }} />

          <div className="relative">
            <span className="inline-block text-[11px] font-semibold tracking-[0.12em] uppercase text-sky-300/80 mb-2">
              MedConnect Dashboard
            </span>
            <h2 className="font-bold text-3xl text-white mb-1 tracking-tight">Hello, {firstName}! 👋</h2>
            <p className="text-white/50 text-sm mb-7 flex items-center gap-1.5">
              <MapPin size={12} className="text-sky-400" /> {user?.location ?? "India"}
            </p>

            <div className="flex gap-3 flex-wrap">
              <StatPill icon={Stethoscope}    value="6+" label="Specialists"        accent="#38bdf8" />
              <StatPill icon={TrendingUp}     value="4.8★" label="Avg Rating"       accent="#34d399" />
              <StatPill icon={CalendarCheck}  value="Same Day" label="Appointments" accent="#a78bfa" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Search + filters ──────────────── */}
      <div className="px-4 md:px-6 mt-6 relative z-10">
        {/* Search */}
        <div className="relative max-w-2xl mb-4">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #0ea5e9, #38bdf8)" }}>
            <Search size={14} className="text-white" />
          </div>
          <input
            type="text"
            placeholder="Search doctors or specialties…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-14 pr-4 py-3.5 bg-white rounded-2xl border border-slate-200/80 text-sm text-slate-700
              placeholder:text-slate-400 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100/60
              transition-all shadow-sm hover:border-slate-300"
          />
        </div>

        {/* Specialty pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {SPECIALTIES.map(s => (
            <button
              key={s}
              onClick={() => setActive(s)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-200 ${
                activeSpecialty === s
                  ? "text-white shadow-md shadow-sky-200/60"
                  : "bg-white text-slate-500 border border-slate-200 hover:border-sky-300 hover:text-sky-600"
              }`}
              style={activeSpecialty === s
                ? { background: "linear-gradient(135deg, #0284c7, #38bdf8)" }
                : {}}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Results ───────────────────────── */}
      <div className="px-4 md:px-6 mt-6 pb-10 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-5 rounded-full" style={{ background: "linear-gradient(180deg, #0ea5e9, #38bdf8)" }} />
            <h2 className="font-bold text-slate-800 text-[17px] tracking-tight">
              {filtered.length} Doctor{filtered.length !== 1 ? "s" : ""}
            </h2>
          </div>
          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-0.5 uppercase tracking-wide">
            Tap to book <ChevronRight size={12} />
          </span>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
            {filtered.map(doctor => (
              <DoctorCard key={doctor.id} doctor={doctor} onToggleFav={toggleFav} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto mb-5 text-4xl">
              🔍
            </div>
            <p className="text-slate-700 font-bold text-lg mb-1">No doctors found</p>
            <p className="text-slate-400 text-sm mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => { setSearch(""); setActive("All"); }}
              className="px-6 py-2.5 rounded-full text-white text-sm font-semibold shadow-md shadow-sky-200 transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #0284c7, #38bdf8)" }}>
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
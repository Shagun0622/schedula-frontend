"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { PATIENTS } from "@/lib/data";
import { Search, ChevronRight, Shield, Activity, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

const STATUS_CONFIG = {
  Active:      { color: "bg-cyan-50 text-cyan-700 border-cyan-200",      dot: "bg-cyan-500",     icon: Activity     },
  Recovered:   { color: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500", icon: CheckCircle2 },
  Critical:    { color: "bg-red-50 text-red-700 border-red-200",          dot: "bg-red-500",      icon: AlertTriangle},
  "Follow-up": { color: "bg-amber-50 text-amber-700 border-amber-200",    dot: "bg-amber-500",    icon: Clock        },
};

const FILTER_TABS = ["All", "Active", "Follow-up", "Critical", "Recovered"];

export default function PatientsPage() {
  const { user } = useAuth();
  const router   = useRouter();
  const [search,    setSearch]    = useState("");
  const [activeTab, setActiveTab] = useState("All");

  if (user?.role !== "doctor") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center mb-4">
          <Shield size={36} className="text-red-400" />
        </div>
        <h2 className="font-display font-bold text-xl text-slate-800 mb-2">Access Restricted</h2>
        <p className="text-slate-400 text-sm max-w-xs">This page is only accessible to registered doctors.</p>
        <button onClick={() => router.push("/dashboard")}
          className="mt-5 px-5 py-2.5 rounded-xl bg-slate-800 text-white text-sm font-semibold">Go back</button>
      </div>
    );
  }

  const filtered = useMemo(() => PATIENTS.filter(p => {
    const matchSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.conditions.some(c => c.toLowerCase().includes(search.toLowerCase()));
    const matchTab = activeTab === "All" || p.status === activeTab;
    return matchSearch && matchTab;
  }), [search, activeTab]);

  const counts = {
    All: PATIENTS.length,
    Active: PATIENTS.filter(p => p.status === "Active").length,
    "Follow-up": PATIENTS.filter(p => p.status === "Follow-up").length,
    Critical: PATIENTS.filter(p => p.status === "Critical").length,
    Recovered: PATIENTS.filter(p => p.status === "Recovered").length,
  };

  return (
    <div className="px-4 md:px-6 pt-5 pb-8">
      <div className="md:hidden mb-5">
        <h1 className="font-display font-bold text-2xl text-slate-800">My Patients</h1>
        <p className="text-slate-400 text-sm mt-0.5">{PATIENTS.length} patients under your care</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label:"Total Patients", value: PATIENTS.length,                                  color:"from-violet-500 to-violet-600", emoji:"👥" },
          { label:"Critical Cases", value: PATIENTS.filter(p=>p.status==="Critical").length, color:"from-red-500 to-red-600",        emoji:"🚨" },
          { label:"Follow-ups Due", value: PATIENTS.filter(p=>p.status==="Follow-up").length,color:"from-amber-500 to-amber-600",    emoji:"📅" },
          { label:"Recovered",      value: PATIENTS.filter(p=>p.status==="Recovered").length,color:"from-emerald-500 to-emerald-600",emoji:"✅" },
        ].map(({ label, value, color, emoji }) => (
          <div key={label} className={`rounded-2xl bg-gradient-to-br ${color} p-4 text-white shadow-md`}>
            <div className="text-2xl mb-1">{emoji}</div>
            <div className="font-display font-bold text-2xl">{value}</div>
            <div className="text-white/80 text-xs mt-0.5 font-medium">{label}</div>
          </div>
        ))}
      </div>

      <div className="relative mb-4">
        <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input placeholder="Search patients, conditions..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all shadow-sm" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 -mx-4 px-4 md:mx-0 md:px-0">
        {FILTER_TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold transition-all ${
              activeTab === tab
                ? "bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-md"
                : "bg-white text-slate-500 border border-slate-200"
            }`}>
            {tab}
            {counts[tab] > 0 && (
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                activeTab === tab ? "bg-white/30 text-white" : "bg-slate-100 text-slate-600"
              }`}>{counts[tab]}</span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filtered.map(patient => {
          const cfg = STATUS_CONFIG[patient.status];
          return (
            <button key={patient.id} onClick={() => router.push(`/dashboard/patients/${patient.id}`)}
              className="text-left bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:shadow-violet-100 hover:-translate-y-0.5 hover:border-violet-200 transition-all duration-300 overflow-hidden group">
              <div className="h-1" style={{ background: patient.avatar.text }} />
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-display font-bold text-base flex-shrink-0"
                    style={{ background: patient.avatar.bg, color: patient.avatar.text }}>
                    {patient.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-display font-bold text-slate-800 text-[15px] truncate">{patient.name}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{patient.age} yrs · {patient.gender} · {patient.bloodGroup}</p>
                      </div>
                      <span className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${cfg.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />{patient.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {patient.conditions.slice(0,2).map(c => (
                        <span key={c} className="px-2 py-0.5 rounded-full text-[11px] font-medium"
                          style={{ background: patient.avatar.bg, color: patient.avatar.text }}>{c}</span>
                      ))}
                      {patient.conditions.length > 2 && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500">+{patient.conditions.length - 2} more</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-50">
                      <span className="text-xs text-slate-400">Last: {patient.lastVisit}</span>
                      <ChevronRight size={15} className="text-slate-300 group-hover:text-violet-400 transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-semibold text-slate-600">No patients found</p>
          <button onClick={() => { setSearch(""); setActiveTab("All"); }}
            className="mt-4 px-5 py-2 rounded-full border border-slate-200 text-sm font-semibold text-violet-500 bg-white">
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

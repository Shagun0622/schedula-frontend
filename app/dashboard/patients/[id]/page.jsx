"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { PATIENTS } from "@/lib/data";
import {
  ArrowLeft, Phone, Mail, MapPin, Droplets, Activity,
  AlertTriangle, Pill, FileText, Calendar, Clock,
  Shield, ChevronDown, ChevronUp, Edit3,
} from "lucide-react";

const STATUS_CONFIG = {
  Active:      { color: "bg-cyan-50 text-cyan-700 border-cyan-200",      dot: "bg-cyan-500"     },
  Recovered:   { color: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  Critical:    { color: "bg-red-50 text-red-700 border-red-200",          dot: "bg-red-500"      },
  "Follow-up": { color: "bg-amber-50 text-amber-700 border-amber-200",    dot: "bg-amber-500"    },
};

export default function PatientDetailPage() {
  const { user }  = useAuth();
  const params    = useParams();
  const router    = useRouter();
  const patient   = PATIENTS.find(p => p.id === params.id);

  const [activeTab,     setActiveTab]     = useState("overview");
  const [expandedVisit, setExpandedVisit] = useState(0);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [note,          setNote]          = useState("");

  if (user?.role !== "doctor") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center mb-4">
          <Shield size={36} className="text-red-400" />
        </div>
        <h2 className="font-display font-bold text-xl text-slate-800 mb-2">Access Restricted</h2>
        <button onClick={() => router.push("/dashboard")}
          className="mt-5 px-5 py-2.5 rounded-xl bg-slate-800 text-white text-sm font-semibold">Go back</button>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Patient not found</p>
          <button onClick={() => router.push("/dashboard/patients")} className="text-violet-500 font-semibold">Go back</button>
        </div>
      </div>
    );
  }

  const cfg      = STATUS_CONFIG[patient.status];
  const initials = patient.name.split(" ").map(n=>n[0]).join("").slice(0,2);
  const latestVital = patient.vitals[0];

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background:`linear-gradient(145deg,#2e1065,${patient.avatar.text})` }}>
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5" />
        <div className="flex items-center justify-between px-5 pt-5 pb-4 relative">
          <button onClick={() => router.push("/dashboard/patients")}
            className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white hover:bg-white/25">
            <ArrowLeft size={18} />
          </button>
          <span className="font-display font-bold text-white">Patient Details</span>
          <button onClick={() => setShowNoteModal(true)}
            className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center hover:bg-white/25 text-white">
            <Edit3 size={16} />
          </button>
        </div>
        <div className="px-5 pb-10 relative flex items-end gap-4">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-display font-bold text-2xl border-[3px] border-white/25 shadow-2xl flex-shrink-0"
            style={{ background: patient.avatar.bg, color: patient.avatar.text }}>{initials}</div>
          <div className="pb-1">
            <h1 className="font-display font-bold text-2xl text-white leading-tight">{patient.name}</h1>
            <p className="text-white/70 text-sm mt-1">{patient.age} years · {patient.gender} · {patient.bloodGroup}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />{patient.status}
              </span>
              {patient.nextVisit && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/15 text-white border border-white/20">
                  <Clock size={10} /> Next: {patient.nextVisit}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contact strip */}
      <div className="mx-4 lg:mx-6 -mt-5 bg-white rounded-2xl shadow-lg grid grid-cols-3 divide-x divide-slate-100 relative z-10">
        {[
          { icon: Phone,  label: "Call",     value: patient.phone.split(" ")[0]+"...", href: `tel:${patient.phone}` },
          { icon: Mail,   label: "Email",    value: "Send email",                       href: `mailto:${patient.email}` },
          { icon: MapPin, label: "Location", value: patient.location.split(",")[0],     href: "#" },
        ].map(({ icon:Icon, label, value, href }) => (
          <a key={label} href={href} className="flex flex-col items-center gap-1 py-4 px-2 hover:bg-slate-50 transition-colors rounded-2xl">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: patient.avatar.bg }}>
              <Icon size={14} style={{ color: patient.avatar.text }} />
            </div>
            <span className="text-[10px] text-slate-400 font-medium">{label}</span>
            <span className="text-xs font-bold text-slate-700 truncate max-w-[80px] text-center">{value}</span>
          </a>
        ))}
      </div>

      {/* Quick vitals */}
      <div className="mx-4 lg:mx-6 mt-3 grid grid-cols-4 gap-2">
        {[
          { label:"BP",     value: latestVital.bp,     icon:"🫀" },
          { label:"Pulse",  value: latestVital.pulse,  icon:"💓" },
          { label:"Temp",   value: latestVital.temp,   icon:"🌡️" },
          { label:"O₂ Sat", value: latestVital.oxygen, icon:"🫁" },
        ].map(({ label, value, icon }) => (
          <div key={label} className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm text-center">
            <div className="text-base mb-1">{icon}</div>
            <div className="font-display font-bold text-slate-800 text-xs leading-tight">{value}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mx-4 lg:mx-6 mt-4 flex bg-slate-100 rounded-2xl p-1 gap-1">
        {[{ id:"overview",label:"Overview"},{ id:"vitals",label:"Vitals"},{ id:"history",label:"History"}].map(({ id, label }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === id ? "bg-white text-slate-800 shadow-sm" : "text-slate-400"
            }`}>{label}</button>
        ))}
      </div>

      <div className="mx-4 lg:mx-6 mt-4 space-y-3">

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <>
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
              <h3 className="font-display font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm">
                <Activity size={15} style={{ color: patient.avatar.text }} /> Conditions
              </h3>
              <div className="flex flex-wrap gap-2">
                {patient.conditions.map(c => (
                  <span key={c} className="px-3 py-1.5 rounded-xl text-xs font-semibold"
                    style={{ background: patient.avatar.bg, color: patient.avatar.text }}>{c}</span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
              <h3 className="font-display font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm">
                <AlertTriangle size={15} className="text-amber-500" /> Allergies
              </h3>
              {patient.allergies[0] === "None known"
                ? <p className="text-sm text-slate-400 italic">No known allergies</p>
                : <div className="flex flex-wrap gap-2">
                    {patient.allergies.map(a => (
                      <span key={a} className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-50 text-red-600 border border-red-200">⚠️ {a}</span>
                    ))}
                  </div>}
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
              <h3 className="font-display font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm">
                <Pill size={15} className="text-emerald-500" /> Current Medications
              </h3>
              <div className="space-y-2.5">
                {patient.medications.map((med, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: patient.avatar.bg }}>
                      <Pill size={14} style={{ color: patient.avatar.text }} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{med.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{med.dose} · {med.frequency}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
              <h3 className="font-display font-bold text-slate-800 mb-3 text-sm">Patient Info</h3>
              {[
                ["Email",     patient.email,      Mail    ],
                ["Phone",     patient.phone,      Phone   ],
                ["Location",  patient.location,   MapPin  ],
                ["Blood",     patient.bloodGroup, Droplets],
                ["Weight",    patient.weight,     Activity],
                ["Height",    patient.height,     Activity],
                ["Last Visit",patient.lastVisit,  Calendar],
              ].map(([label, value, Icon]) => (
                <div key={label} className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-slate-100">
                    <Icon size={13} className="text-slate-500" />
                  </div>
                  <span className="text-sm text-slate-400 w-20 flex-shrink-0">{label}</span>
                  <span className="text-sm font-semibold text-slate-700 truncate">{value}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* VITALS */}
        {activeTab === "vitals" && (
          <div className="space-y-3">
            {patient.vitals.map((v, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{i === 0 ? "Latest Reading" : `Previous · ${v.date}`}</p>
                  {i === 0 && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">Most Recent</span>}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label:"Blood Pressure", value: v.bp,     icon:"🫀", warn: false },
                    { label:"Pulse Rate",      value: v.pulse,  icon:"💓", warn: false },
                    { label:"Temperature",     value: v.temp,   icon:"🌡️", warn: false },
                    { label:"Oxygen Sat.",     value: v.oxygen, icon:"🫁", warn: parseInt(v.oxygen) < 95 },
                  ].map(({ label, value, icon, warn }) => (
                    <div key={label} className={`p-3 rounded-xl border ${warn ? "border-red-200 bg-red-50" : "border-slate-100 bg-slate-50"}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-base">{icon}</span>
                        {warn && <AlertTriangle size={12} className="text-red-500" />}
                      </div>
                      <div className={`font-display font-bold text-base ${warn ? "text-red-600" : "text-slate-800"}`}>{value}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-2 flex items-center gap-1"><Calendar size={10} /> Recorded: {v.date}</p>
              </div>
            ))}
          </div>
        )}

        {/* HISTORY */}
        {activeTab === "history" && (
          <div className="space-y-3">
            {patient.visits.map((visit, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <button onClick={() => setExpandedVisit(expandedVisit === i ? null : i)}
                  className="w-full flex items-start gap-3 p-4 text-left hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: patient.avatar.bg }}>
                    <FileText size={16} style={{ color: patient.avatar.text }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-slate-800 text-sm">{visit.reason}</p>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1"><Calendar size={10} /> {visit.date}</p>
                  </div>
                  {expandedVisit === i ? <ChevronUp size={16} className="text-slate-400 flex-shrink-0 mt-1" /> : <ChevronDown size={16} className="text-slate-400 flex-shrink-0 mt-1" />}
                </button>
                {expandedVisit === i && (
                  <div className="px-4 pb-4 space-y-3 border-t border-slate-50">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-3 mb-1.5">Doctor's Notes</p>
                      <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-3">{visit.notes}</p>
                    </div>
                    {visit.prescription && (
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Prescription</p>
                        <p className="text-sm font-medium rounded-xl p-3 border"
                          style={{ background: patient.avatar.bg, color: patient.avatar.text, borderColor: patient.avatar.bg }}>
                          💊 {visit.prescription}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-slate-800 text-lg">Add Quick Note</h3>
              <button onClick={() => setShowNoteModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">✕</button>
            </div>
            <p className="text-sm text-slate-400 mb-3">Patient: <strong className="text-slate-700">{patient.name}</strong></p>
            <textarea value={note} onChange={e => setNote(e.target.value)}
              placeholder="Enter clinical notes, observations, or prescription..."
              rows={5}
              className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 resize-none transition-all" />
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowNoteModal(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold">Cancel</button>
              <button onClick={() => { setShowNoteModal(false); setNote(""); }}
                className="flex-1 py-3 rounded-xl text-white text-sm font-semibold"
                style={{ background: patient.avatar.text }}>Save Note</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

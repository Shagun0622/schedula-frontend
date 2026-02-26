"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft, Users, MessageCircle, TrendingUp, Heart,
  X, Building2, Star, Calendar, Clock, User, FileText, AlertCircle,
} from "lucide-react";
import { DOCTORS, AVATAR_COLORS } from "@/lib/data";

const DAYS = [
  { day: "Mon", date: "24" }, { day: "Tue", date: "25" }, { day: "Wed", date: "26" },
  { day: "Thu", date: "27" }, { day: "Fri", date: "28" }, { day: "Sat", date: "29" },
];

const TIME_SLOTS = {
  Morning:   ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM"],
  Afternoon: ["12:00 PM", "01:00 PM", "02:00 PM", "02:30 PM"],
  Evening:   ["03:00 PM", "04:00 PM", "04:30 PM", "05:00 PM"],
};

const COMMON_SYMPTOMS = [
  "Fever", "Headache", "Chest Pain", "Back Pain", "Cough",
  "Fatigue", "Nausea", "Dizziness", "Shortness of Breath", "Eye Pain",
];

export default function DoctorPage() {
  const params  = useParams();
  const router  = useRouter();
  const { user } = useAuth();
  const doctor  = DOCTORS.find(d => d.id === params.id);

  const [isFav,        setIsFav]        = useState(doctor?.isFavorite ?? false);
  const [selectedDay,  setSelectedDay]  = useState("Wed");
  const [selectedTime, setSelectedTime] = useState("");
  const [activeTab,    setActiveTab]    = useState("overview");

  // Patient info form
  const [patientInfo, setPatientInfo] = useState({
    name:     user?.name ?? "",
    age:      "",
    gender:   "",
    disease:  "",
    symptoms: [],
    notes:    "",
    firstVisit: "yes",
  });

  const toggleSymptom = (s) => {
    setPatientInfo(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(s)
        ? prev.symptoms.filter(x => x !== s)
        : [...prev.symptoms, s],
    }));
  };

  if (!doctor) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Doctor not found</p>
          <button onClick={() => router.push("/dashboard")} className="text-cyan-500 font-semibold">Go back</button>
        </div>
      </div>
    );
  }

  const c        = AVATAR_COLORS[parseInt(doctor.id) % AVATAR_COLORS.length];
  const initials = doctor.name.split(" ").filter((_, i) => i > 0).map(n => n[0]).join("").slice(0, 2);
  const selectedDateInfo = DAYS.find(d => d.day === selectedDay);

  const patientInfoValid = patientInfo.name.trim() && patientInfo.disease.trim();

  const goToPayment = () => {
    if (!selectedTime || !patientInfoValid) return;
    const bookingData = {
      doctorId:    doctor.id,
      doctor:      doctor.name,
      specialty:   doctor.specialty,
      hospital:    doctor.hospital,
      date:        `${selectedDay}, Feb ${selectedDateInfo?.date}`,
      time:        selectedTime,
      color:       c,
      fee:         doctor.fee ?? 500,
      patientInfo,
    };
    localStorage.setItem("schedula_pending_booking", JSON.stringify(bookingData));
    router.push("/dashboard/payment");
  };

  const handleConfirm = () => {
    if (activeTab === "overview")  { setActiveTab("schedule");  return; }
    if (activeTab === "schedule")  { if (selectedTime) setActiveTab("patient"); return; }
    if (activeTab === "patient")   { goToPayment(); return; }
  };

  const buttonLabel = () => {
    if (activeTab === "overview")  return "Book Appointment →";
    if (activeTab === "schedule")  return !selectedTime ? "Select a time slot" : `Next — Add Patient Info`;
    if (activeTab === "patient")   return !patientInfoValid ? "Fill required fields" : `Proceed to Payment →`;
  };

  const inputClass = "w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm placeholder:text-slate-400 outline-none focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100 transition-all";

  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "schedule", label: "Schedule" },
    { id: "patient",  label: "Your Info" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-28 lg:pb-0">
      <div className="max-w-5xl mx-auto lg:flex lg:min-h-screen">

        {/* LEFT */}
        <div className="lg:flex-1">

          {/* Hero */}
          <div className="relative overflow-hidden" style={{ background: `linear-gradient(145deg, #0c4a6e, ${c.text})` }}>
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5" />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5" />
            <div className="flex items-center justify-between px-5 pt-5 pb-4 relative">
              <button onClick={() => router.push("/dashboard")}
                className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors">
                <ArrowLeft size={18} />
              </button>
              <span className="font-display font-bold text-white">Doctor Profile</span>
              <button onClick={() => setIsFav(!isFav)}
                className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors">
                <Heart size={18} className={isFav ? "fill-rose-300 stroke-rose-300" : "stroke-white"} />
              </button>
            </div>
            <div className="px-5 pb-10 relative flex items-end gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-display font-bold text-2xl border-[3px] border-white/25 shadow-2xl"
                  style={{ background: c.bg, color: c.text }}>{initials}</div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-[3px] border-white/80 shadow" />
              </div>
              <div className="pb-1">
                <h1 className="font-display font-bold text-2xl text-white leading-tight">{doctor.name}</h1>
                <p className="text-white/75 text-sm mt-1">{doctor.specialty}</p>
                <p className="text-white/60 text-xs">{doctor.qualification}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} width="12" height="12" viewBox="0 0 24 24"
                      fill={i <= Math.round(doctor.rating) ? "#fde68a" : "rgba(255,255,255,0.2)"} stroke="none">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                  <span className="text-amber-200 text-xs font-bold ml-1">{doctor.rating}</span>
                  <span className="text-white/40 text-xs">({doctor.reviews.toLocaleString()})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mx-4 lg:mx-6 -mt-5 bg-white rounded-2xl shadow-lg grid grid-cols-4 divide-x divide-slate-100 relative z-10">
            {[
              { icon: Users,         value: `${(doctor.patients/1000).toFixed(0)}k+`, label: "Patients" },
              { icon: TrendingUp,    value: `${doctor.experience}+`,                  label: "Yrs Exp."  },
              { icon: Star,          value: doctor.rating,                             label: "Rating"    },
              { icon: MessageCircle, value: `${(doctor.reviews/1000).toFixed(1)}k`,   label: "Reviews"   },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="py-4 px-2 flex flex-col items-center gap-1">
                <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: c.light }}>
                  <Icon size={13} style={{ color: c.text }} />
                </div>
                <span className="font-display font-bold text-slate-800 text-sm">{value}</span>
                <span className="text-slate-400 text-[10px] text-center">{label}</span>
              </div>
            ))}
          </div>

          {/* Hospital + Fee */}
          <div className="mx-4 lg:mx-6 mt-3 flex items-center justify-between p-3 rounded-2xl border"
            style={{ background: c.light, borderColor: c.bg }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: c.bg }}>
                <Building2 size={18} style={{ color: c.text }} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Hospital</p>
                <p className="text-sm font-bold" style={{ color: c.text }}>{doctor.hospital}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 font-medium">Consult Fee</p>
              <p className="text-lg font-display font-bold" style={{ color: c.text }}>₹{doctor.fee ?? 500}</p>
            </div>
          </div>

          {/* Step indicator */}
          <div className="mx-4 lg:mx-6 mt-4 flex items-center gap-2">
            {TABS.map(({ id, label }, i) => {
              const done    = (activeTab === "schedule" && id === "overview") ||
                              (activeTab === "patient"  && (id === "overview" || id === "schedule"));
              const current = activeTab === id;
              return (
                <div key={id} className="flex items-center gap-2 flex-1">
                  <div className={`flex items-center gap-1.5 flex-1 ${i > 0 ? "justify-end" : ""}`}>
                    {i > 0 && <div className={`flex-1 h-0.5 rounded-full ${done ? "" : "bg-slate-200"}`}
                      style={done ? { background: c.text } : {}} />}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      done    ? "text-white"    :
                      current ? "text-white"    : "bg-slate-100 text-slate-400"
                    }`} style={done || current ? { background: c.text } : {}}>
                      {done ? "✓" : i + 1}
                    </div>
                    {i < TABS.length - 1 && <div className={`flex-1 h-0.5 rounded-full ${current || done ? "" : "bg-slate-200"}`}
                      style={current || done ? { background: c.text } : {}} />}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mx-4 lg:mx-6 flex justify-between mt-1 mb-2">
            {TABS.map(({ id, label }) => (
              <span key={id} className={`text-[10px] font-semibold ${activeTab === id ? "" : "text-slate-400"}`}
                style={activeTab === id ? { color: c.text } : {}}>{label}</span>
            ))}
          </div>

          {/* Tab content */}
          <div className="px-4 lg:px-6 mt-2 pb-4 space-y-3">

            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <>
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                  <h3 className="font-display font-bold text-slate-800 mb-2 text-sm">About Doctor</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{doctor.about}</p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                  <h3 className="font-display font-bold text-slate-800 mb-3 text-sm">Service & Info</h3>
                  {[["Service",doctor.service],["Specialization",doctor.specialization],["Hours",doctor.hours],["Availability","Monday – Friday"]].map(([k,v]) => (
                    <div key={k} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                      <span className="text-sm text-slate-400">{k}</span>
                      <span className="text-sm font-semibold text-slate-700">{v}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* SCHEDULE */}
            {activeTab === "schedule" && (
              <>
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                  <p className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <Calendar size={15} style={{ color: c.text }} /> Select Day
                  </p>
                  <div className="flex gap-2">
                    {DAYS.map(({ day, date }) => (
                      <button key={day} onClick={() => setSelectedDay(day)}
                        className={`flex-1 py-2.5 rounded-xl text-center transition-all font-semibold ${
                          selectedDay === day ? "text-white shadow-md" : "bg-slate-50 text-slate-500"
                        }`} style={selectedDay === day ? { background: c.text } : {}}>
                        <div className="text-[10px]">{day}</div>
                        <div className="text-base">{date}</div>
                      </button>
                    ))}
                  </div>
                </div>
                {Object.entries(TIME_SLOTS).map(([period, slots]) => (
                  <div key={period} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <Clock size={11} /> {period}
                    </p>
                    <div className="grid grid-cols-3 lg:grid-cols-4 gap-2">
                      {slots.map(slot => (
                        <button key={slot} onClick={() => setSelectedTime(slot)}
                          className={`py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                            selectedTime === slot ? "border-transparent text-white shadow-md" : "bg-slate-50 text-slate-500 border-slate-100"
                          }`} style={selectedTime === slot ? { background: c.text } : {}}>
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {selectedTime && (
                  <div className="rounded-2xl p-4 border flex items-center justify-between" style={{ background: c.light, borderColor: c.bg }}>
                    <div>
                      <p className="text-xs font-medium text-slate-400 mb-0.5">Selected</p>
                      <p className="text-sm font-bold" style={{ color: c.text }}>
                        {selectedDay}, Feb {selectedDateInfo?.date} · {selectedTime}
                      </p>
                    </div>
                    <button onClick={() => setSelectedTime("")}
                      className="w-7 h-7 rounded-full bg-white/70 flex items-center justify-center text-slate-400">
                      <X size={13} />
                    </button>
                  </div>
                )}
              </>
            )}

            {/* PATIENT INFO */}
            {activeTab === "patient" && (
              <>
                {/* Selected slot reminder */}
                <div className="rounded-2xl p-3 border flex items-center gap-3" style={{ background: c.light, borderColor: c.bg }}>
                  <Calendar size={15} style={{ color: c.text }} />
                  <p className="text-sm font-bold" style={{ color: c.text }}>
                    {selectedDay}, Feb {selectedDateInfo?.date} · {selectedTime} — {doctor.name}
                  </p>
                </div>

                {/* Patient basic info */}
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                  <h3 className="font-display font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm">
                    <User size={15} style={{ color: c.text }} /> Patient Details
                    <span className="text-red-400 text-xs font-normal">(* required)</span>
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Full Name *</label>
                      <input value={patientInfo.name} onChange={e => setPatientInfo({...patientInfo, name: e.target.value})}
                        placeholder="Enter patient name" className={inputClass} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Age</label>
                        <input type="number" value={patientInfo.age} onChange={e => setPatientInfo({...patientInfo, age: e.target.value})}
                          placeholder="e.g. 28" min="1" max="120" className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Gender</label>
                        <select value={patientInfo.gender} onChange={e => setPatientInfo({...patientInfo, gender: e.target.value})}
                          className={inputClass}>
                          <option value="">Select</option>
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">First Visit?</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[["yes","Yes, first time"],["no","No, returning patient"]].map(([val, label]) => (
                          <button key={val} type="button" onClick={() => setPatientInfo({...patientInfo, firstVisit: val})}
                            className={`py-2.5 px-3 rounded-xl border-2 text-xs font-semibold transition-all ${
                              patientInfo.firstVisit === val ? "text-white" : "border-slate-200 text-slate-500 bg-slate-50"
                            }`} style={patientInfo.firstVisit === val ? { background: c.text, borderColor: c.text } : {}}>
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Disease / condition */}
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                  <h3 className="font-display font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm">
                    <AlertCircle size={15} style={{ color: c.text }} /> Condition / Disease *
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Main Complaint / Diagnosis *</label>
                      <input value={patientInfo.disease} onChange={e => setPatientInfo({...patientInfo, disease: e.target.value})}
                        placeholder="e.g. Blurred vision, Fever, Back pain..." className={inputClass} />
                    </div>

                    {/* Symptom chips */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-2">Common Symptoms (tap to select)</label>
                      <div className="flex flex-wrap gap-2">
                        {COMMON_SYMPTOMS.map(s => {
                          const selected = patientInfo.symptoms.includes(s);
                          return (
                            <button key={s} type="button" onClick={() => toggleSymptom(s)}
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                                selected ? "text-white border-transparent" : "border-slate-200 text-slate-500 bg-slate-50"
                              }`} style={selected ? { background: c.text } : {}}>
                              {selected ? "✓ " : ""}{s}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional notes */}
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                  <h3 className="font-display font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm">
                    <FileText size={15} style={{ color: c.text }} /> Additional Notes for Doctor
                  </h3>
                  <textarea value={patientInfo.notes} onChange={e => setPatientInfo({...patientInfo, notes: e.target.value})}
                    placeholder="Any additional info — ongoing medications, allergies, previous diagnoses, specific concerns..."
                    rows={4}
                    className={`${inputClass} resize-none`} />
                </div>

                {/* Validation warning */}
                {!patientInfoValid && (
                  <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700">
                    <AlertCircle size={15} className="flex-shrink-0" />
                    Please fill in Patient Name and Main Complaint to continue.
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* RIGHT: desktop booking panel */}
        <div className="hidden lg:flex lg:w-[300px] lg:flex-col lg:border-l lg:border-slate-100 lg:bg-white lg:sticky lg:top-0 lg:h-screen">
          <div className="p-6 flex-1 flex flex-col overflow-y-auto">
            <h2 className="font-display font-bold text-slate-800 text-lg mb-1">Book Appointment</h2>

            {/* Progress steps */}
            <div className="space-y-2 mb-5">
              {[
                { id: "overview", label: "1. View Doctor Profile" },
                { id: "schedule", label: "2. Choose Date & Time" },
                { id: "patient",  label: "3. Patient Info" },
              ].map(({ id, label }) => {
                const done = (activeTab === "schedule" && id === "overview") ||
                             (activeTab === "patient" && (id === "overview" || id === "schedule"));
                return (
                  <div key={id} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold ${
                    activeTab === id ? "text-white" : done ? "text-emerald-600 bg-emerald-50" : "text-slate-400 bg-slate-50"
                  }`} style={activeTab === id ? { background: c.text } : {}}>
                    <span>{done ? "✓" : "○"}</span> {label}
                  </div>
                );
              })}
            </div>

            {selectedTime && (
              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50 mb-3">
                <p className="text-xs text-slate-400 mb-0.5">Appointment</p>
                <p className="text-sm font-bold text-slate-800">{selectedDay}, Feb {selectedDateInfo?.date} · {selectedTime}</p>
              </div>
            )}
            {patientInfo.disease && (
              <div className="p-3 rounded-xl border mb-3" style={{ background: c.light, borderColor: c.bg }}>
                <p className="text-xs text-slate-400 mb-0.5">Patient</p>
                <p className="text-sm font-bold" style={{ color: c.text }}>{patientInfo.name}</p>
                <p className="text-xs text-slate-500 mt-0.5 truncate">{patientInfo.disease}</p>
              </div>
            )}
            <div className="mt-auto p-3 rounded-xl" style={{ background: c.light }}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-500">Consultation Fee</span>
                <span className="font-bold" style={{ color: c.text }}>₹{doctor.fee ?? 500}</span>
              </div>
              <p className="text-xs text-slate-400">+ platform fee & taxes</p>
            </div>
          </div>
          <div className="p-6 border-t border-slate-100">
            <button onClick={handleConfirm}
              disabled={activeTab === "patient" && !patientInfoValid}
              className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all ${
                (activeTab === "patient" && !patientInfoValid) ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "text-white shadow-lg hover:opacity-90"
              }`} style={(activeTab === "patient" && !patientInfoValid) ? {} : { background: c.text }}>
              {activeTab === "overview" ? "Choose a Date →"
               : activeTab === "schedule" ? (selectedTime ? "Add Patient Info →" : "Select a time first")
               : patientInfoValid ? "Proceed to Payment →" : "Fill required fields"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sticky footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white border-t border-slate-100 shadow-2xl px-4 pt-3 pb-7">
        <button onClick={handleConfirm}
          disabled={(activeTab === "schedule" && !selectedTime) || (activeTab === "patient" && !patientInfoValid)}
          className="w-full py-4 rounded-2xl font-bold text-base transition-all"
          style={
            (activeTab === "schedule" && !selectedTime) || (activeTab === "patient" && !patientInfoValid)
              ? { background: "#f1f5f9", color: "#94a3b8" }
              : { background: c.text, color: "#fff", boxShadow: `0 8px 24px ${c.text}55` }
          }>
          {buttonLabel()}
        </button>
      </div>
    </div>
  );
}
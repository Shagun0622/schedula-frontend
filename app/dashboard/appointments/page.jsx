"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Building2,
  Stethoscope,
  Trash2,
  RotateCcw,
  Activity,
  User,
  FileText,
} from "lucide-react";

const STATUS_CONFIG = {
  confirmed: {
    label: "Ongoing",
    dot: "bg-cyan-500",
    badge: "bg-cyan-50 text-cyan-700 border-cyan-200",
    icon: Activity,
  },
  pending: {
    label: "Pending",
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
  },
  completed: {
    label: "Completed",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelled",
    dot: "bg-red-400",
    badge: "bg-red-50 text-red-600 border-red-200",
    icon: XCircle,
  },
};

const TABS = ["All", "Ongoing", "Pending", "Completed", "Cancelled"];

const DEFAULT_COLORS = [
  { bg: "#dbeafe", text: "#1d4ed8" },
  { bg: "#dcfce7", text: "#15803d" },
  { bg: "#f3e8ff", text: "#7c3aed" },
  { bg: "#fce7f3", text: "#be185d" },
];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [deleteId, setDeleteId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  // Load appointments safely
  useEffect(() => {
    const stored = localStorage.getItem("schedula_appointments");
    if (stored) {
      try {
        setAppointments(JSON.parse(stored));
      } catch {
        localStorage.removeItem("schedula_appointments");
      }
    }
  }, []);

  const save = (updated) => {
    setAppointments(updated);
    localStorage.setItem("schedula_appointments", JSON.stringify(updated));
  };

  const cancelAppointment = (id) =>
    save(
      appointments.map((a) =>
        a.id === id ? { ...a, status: "cancelled" } : a
      )
    );

  const markCompleted = (id) =>
    save(
      appointments.map((a) =>
        a.id === id ? { ...a, status: "completed" } : a
      )
    );

  const deleteAppointment = (id) => {
    save(appointments.filter((a) => a.id !== id));
    setDeleteId(null);
  };

  const counts = useMemo(
    () => ({
      All: appointments.length,
      Ongoing: appointments.filter((a) => a.status === "confirmed").length,
      Pending: appointments.filter((a) => a.status === "pending").length,
      Completed: appointments.filter((a) => a.status === "completed").length,
      Cancelled: appointments.filter((a) => a.status === "cancelled").length,
    }),
    [appointments]
  );

  const filtered = appointments.filter((a) => {
    if (activeTab === "All") return true;
    if (activeTab === "Ongoing") return a.status === "confirmed";
    if (activeTab === "Pending") return a.status === "pending";
    if (activeTab === "Completed") return a.status === "completed";
    if (activeTab === "Cancelled") return a.status === "cancelled";
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 px-4 md:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
          Appointments
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {appointments.length} total appointment
          {appointments.length !== 1 && "s"}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
              activeTab === tab
                ? "bg-gradient-to-r from-cyan-500 to-sky-500 text-white shadow-lg"
                : "bg-white border border-slate-200 text-slate-600 hover:border-cyan-300"
            }`}
          >
            {tab}
            {counts[tab] > 0 && (
              <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                {counts[tab]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-4 animate-bounce">
            <Stethoscope size={32} className="text-slate-300" />
          </div>
          <h3 className="font-bold text-lg text-slate-700">
            You're all clear for now 🎉
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Book your next appointment to get started.
          </p>
        </div>
      )}

      {/* Cards */}
      <div className="space-y-4">
        {filtered.map((apt, i) => {
          const cfg = STATUS_CONFIG[apt.status] ?? STATUS_CONFIG.confirmed;
          const c = apt.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length];
          const initials = apt.doctor
            ? apt.doctor
                .split(" ")
                .slice(1)
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
            : "DR";

          const expanded = expandedId === apt.id;
          const pi = apt.patientInfo;

          return (
            <div
              key={apt.id}
              className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="p-5">
                <div className="flex gap-4">
                  {/* Avatar */}
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base relative overflow-hidden"
                    style={{ background: c.bg, color: c.text }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent" />
                    <span className="relative">{initials}</span>
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm md:text-base">
                          {apt.doctor}
                        </h3>
                        <p
                          className="text-sm font-semibold"
                          style={{ color: c.text }}
                        >
                          {apt.specialty}
                        </p>
                      </div>

                      <span
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${cfg.badge}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}
                        />
                        {cfg.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg">
                        <Calendar size={12} /> {apt.date}
                      </span>
                      <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg">
                        <Clock size={12} /> {apt.time}
                      </span>
                    </div>

                    {/* Expandable patient info */}
                    {pi && (
                      <div className="mt-3">
                        <button
                          onClick={() =>
                            setExpandedId(expanded ? null : apt.id)
                          }
                          className="text-xs font-semibold text-cyan-600"
                        >
                          {expanded ? "Hide Details ▲" : "View Details ▼"}
                        </button>

                        {expanded && (
                          <div className="mt-2 text-sm text-slate-600 space-y-1">
                            <p>
                              <strong>Patient:</strong> {pi.name}
                            </p>
                            <p>
                              <strong>Condition:</strong> {pi.disease}
                            </p>
                            {pi.notes && (
                              <p>
                                <strong>Notes:</strong> {pi.notes}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    {(apt.status === "confirmed" ||
                      apt.status === "pending") && (
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => markCompleted(apt.id)}
                          className="flex-1 py-2 text-xs rounded-xl border border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                        >
                          ✓ Complete
                        </button>
                        <button
                          onClick={() => cancelAppointment(apt.id)}
                          className="flex-1 py-2 text-xs rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => setDeleteId(apt.id)}
                          className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-400" />
            </div>
            <h3 className="font-bold text-slate-800 mb-2">
              Delete appointment?
            </h3>
            <p className="text-slate-400 text-sm mb-5">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600"
              >
                Keep
              </button>
              <button
                onClick={() => deleteAppointment(deleteId)}
                className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
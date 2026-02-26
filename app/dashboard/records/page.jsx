"use client";

import { FileText, Download, Eye } from "lucide-react";

const RECORDS = [
  { id: "1", name: "Blood Test Report",         date: "Feb 15, 2025", type: "Lab Report",   size: "2.4 MB" },
  { id: "2", name: "ECG Report",                date: "Jan 28, 2025", type: "Cardiac",       size: "1.1 MB" },
  { id: "3", name: "Prescription - Dr. Sharma", date: "Jan 10, 2025", type: "Prescription",  size: "0.5 MB" },
  { id: "4", name: "X-Ray Chest",               date: "Dec 22, 2024", type: "Radiology",     size: "8.2 MB" },
];

const TYPE_COLORS = {
  "Lab Report":   "bg-blue-50 text-blue-600",
  "Cardiac":      "bg-rose-50 text-rose-600",
  "Prescription": "bg-emerald-50 text-emerald-600",
  "Radiology":    "bg-violet-50 text-violet-600",
};

export default function RecordsPage() {
  return (
    <div className="px-4 pt-4">
      <div className="mb-5">
        <h1 className="font-display font-bold text-2xl text-slate-800">Records</h1>
        <p className="text-slate-500 text-sm mt-0.5">Your medical documents</p>
      </div>
      <div className="space-y-3">
        {RECORDS.map(record => (
          <div key={record.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center flex-shrink-0">
              <FileText size={22} className="text-cyan-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-800 text-sm truncate">{record.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[record.type] ?? "bg-slate-100 text-slate-600"}`}>
                  {record.type}
                </span>
                <span className="text-slate-400 text-xs">{record.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
                <Eye size={16} />
              </button>
              <button className="p-2 rounded-lg hover:bg-cyan-50 transition-colors text-slate-400 hover:text-cyan-500">
                <Download size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

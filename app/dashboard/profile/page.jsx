
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User, Activity, Heart, FileText, Upload, Zap, Phone,
  Edit3, Check, X, Plus, Trash2, LogOut, Camera,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const lsGet = (key, fallback) => {
  if (typeof window === "undefined") return fallback;
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};
const lsSet = (key, val) => localStorage.setItem(key, JSON.stringify(val));

// ── Reusable field row ────────────────────────────────────────────────────────
function FieldRow({ label, value, editing, name, type = "text", options, onChange, emptyColor = "text-orange-400" }) {
  const empty = !value || value === "";
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <span className="text-slate-600 text-sm font-medium">{label}</span>
      {editing ? (
        options ? (
          <select value={value} onChange={e => onChange(name, e.target.value)}
            className="text-sm font-semibold border border-slate-200 rounded-lg px-2 py-1 bg-white outline-none focus:border-blue-400 text-slate-700 min-w-[130px]">
            <option value="">Not specified</option>
            {options.map(o => <option key={o}>{o}</option>)}
          </select>
        ) : (
          <input type={type} value={value} onChange={e => onChange(name, e.target.value)}
            className="text-sm font-semibold border border-slate-200 rounded-lg px-2 py-1 bg-white outline-none focus:border-blue-400 text-slate-700 text-right w-36" />
        )
      ) : (
        <span className={`text-sm font-semibold ${empty ? emptyColor : "text-slate-800"}`}>
          {empty ? "Not set" : value}
        </span>
      )}
    </div>
  );
}

// ── Card wrapper ──────────────────────────────────────────────────────────────
function Card({ title, Icon, headerBg, iconBg, editing, onEdit, onSave, onCancel, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className={`${headerBg} px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${iconBg}`}>
            <Icon size={15} className="text-white" />
          </div>
          <span className="font-bold text-slate-800 text-sm">{title}</span>
        </div>
        {!editing ? (
          <button onClick={onEdit}
            className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/60 transition-colors">
            <Edit3 size={11} /> Edit
          </button>
        ) : (
          <div className="flex gap-1">
            <button onClick={onCancel} className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-600">
              <X size={12} />
            </button>
            <button onClick={onSave} className="px-2.5 py-1.5 rounded-lg bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 hover:bg-blue-600">
              <Check size={11} /> Save
            </button>
          </div>
        )}
      </div>
      <div className="px-4 py-1">{children}</div>
    </div>
  );
}

// ── Tag list (conditions / allergies) ────────────────────────────────────────
function TagList({ items, color, onRemove, editing, newVal, setNewVal, onAdd, placeholder }) {
  return (
    <>
      {items.length === 0 && !editing && (
        <p className="text-emerald-500 font-semibold text-sm py-3">None reported</p>
      )}
      <div className="flex flex-wrap gap-1.5 py-2">
        {items.map((item, i) => (
          <span key={i} className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${color}`}>
            {item}
            {editing && (
              <button onClick={() => onRemove(i)} className="ml-0.5 opacity-60 hover:opacity-100">
                <X size={9} />
              </button>
            )}
          </span>
        ))}
      </div>
      {editing && (
        <div className="flex gap-2 pb-2">
          <input value={newVal} onChange={e => setNewVal(e.target.value)} placeholder={placeholder}
            onKeyDown={e => { if (e.key === "Enter" && newVal.trim()) { onAdd(); } }}
            className="flex-1 text-sm border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-blue-400" />
          <button onClick={onAdd}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-bold hover:bg-slate-700">
            <Plus size={12} />
          </button>
        </div>
      )}
    </>
  );
}

// ── TABS ──────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "profile",       label: "Profile",       Icon: User     },
  { id: "prescriptions", label: "Prescriptions", Icon: FileText },
  { id: "reports",       label: "Test Reports",  Icon: Activity },
  { id: "documents",     label: "Documents",     Icon: Upload   },
  { id: "vitals",        label: "Vital Signs",   Icon: Zap      },
  { id: "emergency",     label: "Emergency",     Icon: Phone    },
];

// ── INPUT STYLE ───────────────────────────────────────────────────────────────
const inp = "w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-all";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router   = useRouter();
  const isDoctor = user?.role === "doctor";
  const initials = user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2) ?? "U";

  const [activeTab, setActiveTab] = useState("profile");
  const [toast,     setToast]     = useState(false);
  const [editing,   setEditing]   = useState(null); // which section is being edited
  const [draft,     setDraft]     = useState({});

  // ── persisted data ──
  const [personal,   setPersonal]   = useState(() => lsGet("pro_personal",   { age:"", gender:"", blood:"", phone: user?.phone??"", location: user?.location??"" }));
  const [physical,   setPhysical]   = useState(() => lsGet("pro_physical",   { height:"", weight:"", bmi:"" }));
  const [lifestyle,  setLifestyle]  = useState(() => lsGet("pro_lifestyle",  { smoking:"", alcohol:"", exercise:"", diet:"" }));
  const [insurance,  setInsurance]  = useState(() => lsGet("pro_insurance",  { provider:"", number:"", validity:"", type:"" }));
  const [conditions, setConditions] = useState(() => lsGet("pro_conditions", []));
  const [allergies,  setAllergies]  = useState(() => lsGet("pro_allergies",  []));
  const [newCond,    setNewCond]    = useState("");
  const [newAlg,     setNewAlg]     = useState("");

  const [vitals,        setVitals]       = useState(() => lsGet("pro_vitals",   []));
  const [prescriptions, setPrescs]       = useState(() => lsGet("pro_prescs",   []));
  const [reports,       setReports]      = useState(() => lsGet("pro_reports",  []));
  const [documents,     setDocuments]    = useState(() => lsGet("pro_docs",     []));
  const [emergency,     setEmergency]    = useState(() => lsGet("pro_emerg",    []));

  const [addVital, setAddVital] = useState(false);
  const [addPresc, setAddPresc] = useState(false);
  const [addRep,   setAddRep]   = useState(false);
  const [addDoc,   setAddDoc]   = useState(false);
  const [addEmerg, setAddEmerg] = useState(false);

  const [vForm, setVForm] = useState({ bp:"", pulse:"", temp:"", oxygen:"", date: new Date().toISOString().split("T")[0] });
  const [pForm, setPForm] = useState({ medicine:"", dose:"", freq:"", duration:"", doctor:"", date:"" });
  const [rForm, setRForm] = useState({ name:"", date:"", lab:"", result:"", notes:"" });
  const [dForm, setDForm] = useState({ name:"", type:"", date:"", notes:"" });
  const [eForm, setEForm] = useState({ name:"", relation:"", phone:"", alt:"" });

  const showToast = () => { setToast(true); setTimeout(() => setToast(false), 2500); };

  const startEdit = (sec, data) => { setEditing(sec); setDraft({ ...data }); };
  const cancelEdit = () => setEditing(null);
  const fieldChange = (k, v) => setDraft(d => ({ ...d, [k]: v }));

  const commitEdit = (sec, setter, key) => {
    const data = { ...draft };
    if (sec === "physical") {
      const h = parseFloat(data.height), w = parseFloat(data.weight);
      data.bmi = h && w ? (w / ((h / 100) ** 2)).toFixed(1) : "";
    }
    setter(data); lsSet(key, data); setEditing(null); showToast();
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-[300] flex items-center gap-2 bg-emerald-500 text-white px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold animate-fade-up">
          <Check size={15} /> Saved successfully!
        </div>
      )}

      {/* ── Top profile card ── */}
      <div className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 md:px-8 pt-5 pb-0">
          <div className="flex items-center gap-4 mb-5">
            <div className="relative flex-shrink-0">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md ${
                isDoctor ? "bg-gradient-to-br from-violet-400 to-violet-600" : "bg-gradient-to-br from-blue-400 to-blue-600"
              }`}>{initials}</div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-md hover:bg-blue-600 transition-colors">
                <Camera size={11} className="text-white" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-xl text-slate-800">{user?.name}</h2>
              <p className="text-slate-400 text-sm">{user?.email} · <span className="capitalize">{user?.role}</span></p>
            </div>
            <button onClick={() => { logout(); router.push("/"); }}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors">
              <LogOut size={14} /> Logout
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-0.5 overflow-x-auto">
            {TABS.map(({ id, label, Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 border-b-2 ${
                  activeTab === id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}>
                <Icon size={14} />{label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-6">

        {/* ════════ PROFILE ════════ */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Personal */}
            <Card title="Personal Information" Icon={User} headerBg="bg-blue-50" iconBg="bg-blue-500"
              editing={editing === "personal"}
              onEdit={() => startEdit("personal", personal)}
              onSave={() => commitEdit("personal", setPersonal, "pro_personal")}
              onCancel={cancelEdit}>
              {[
                { label:"Age",         name:"age",      type:"number", options: null },
                { label:"Gender",      name:"gender",   options:["Male","Female","Other"] },
                { label:"Blood Group", name:"blood",    options:["A+","A-","B+","B-","O+","O-","AB+","AB-"] },
                { label:"Phone",       name:"phone"    },
                { label:"Location",    name:"location" },
              ].map(f => (
                <FieldRow key={f.name} label={f.label} name={f.name}
                  value={editing === "personal" ? draft[f.name] ?? "" : personal[f.name]}
                  editing={editing === "personal"} type={f.type} options={f.options} onChange={fieldChange} />
              ))}
            </Card>

            {/* Physical */}
            <Card title="Physical Details" Icon={Activity} headerBg="bg-emerald-50" iconBg="bg-emerald-500"
              editing={editing === "physical"}
              onEdit={() => startEdit("physical", physical)}
              onSave={() => commitEdit("physical", setPhysical, "pro_physical")}
              onCancel={cancelEdit}>
              {[
                { label:"Height",  name:"height", suffix:"cm" },
                { label:"Weight",  name:"weight", suffix:"kg" },
              ].map(f => (
                <div key={f.name} className="flex items-center justify-between py-3 border-b border-slate-100">
                  <span className="text-slate-600 text-sm font-medium">{f.label}</span>
                  {editing === "physical" ? (
                    <input type="number" value={draft[f.name] ?? ""} placeholder={f.name === "height" ? "cm" : "kg"}
                      onChange={e => fieldChange(f.name, e.target.value)}
                      className="text-sm font-semibold border border-slate-200 rounded-lg px-2 py-1 bg-white outline-none focus:border-blue-400 text-right w-28" />
                  ) : (
                    <span className={`text-sm font-semibold ${physical[f.name] ? "text-slate-800" : "text-orange-400"}`}>
                      {physical[f.name] ? `${physical[f.name]} ${f.suffix}` : "Not set"}
                    </span>
                  )}
                </div>
              ))}
              <div className="flex items-center justify-between py-3">
                <span className="text-slate-600 text-sm font-medium">BMI</span>
                <span className={`text-sm font-semibold ${
                  editing === "physical"
                    ? (draft.height && draft.weight ? "text-slate-800" : "text-slate-400")
                    : (physical.bmi ? "text-slate-800" : "text-slate-400")
                }`}>
                  {editing === "physical"
                    ? (draft.height && draft.weight
                        ? (parseFloat(draft.weight) / ((parseFloat(draft.height) / 100) ** 2)).toFixed(1)
                        : "Not available")
                    : (physical.bmi || "Not available")}
                </span>
              </div>
            </Card>

            {/* Lifestyle */}
            <Card title="Lifestyle" Icon={Heart} headerBg="bg-purple-50" iconBg="bg-purple-500"
              editing={editing === "lifestyle"}
              onEdit={() => startEdit("lifestyle", lifestyle)}
              onSave={() => commitEdit("lifestyle", setLifestyle, "pro_lifestyle")}
              onCancel={cancelEdit}>
              {[
                { label:"Smoking",  name:"smoking",  options:["Non-smoker","Occasional","Regular","Ex-smoker"] },
                { label:"Alcohol",  name:"alcohol",  options:["None","Occasional","Moderate","Heavy"] },
                { label:"Exercise", name:"exercise", options:["Sedentary","Light","Moderate","Active","Very Active"] },
                { label:"Diet",     name:"diet",     options:["Vegetarian","Non-vegetarian","Vegan","Mixed"] },
              ].map(f => (
                <FieldRow key={f.name} label={f.label} name={f.name}
                  value={editing === "lifestyle" ? draft[f.name] ?? "" : lifestyle[f.name]}
                  editing={editing === "lifestyle"} options={f.options} onChange={fieldChange}
                  emptyColor="text-orange-400" />
              ))}
            </Card>

            {/* Insurance */}
            <Card title="Insurance" Icon={FileText} headerBg="bg-orange-50" iconBg="bg-orange-500"
              editing={editing === "insurance"}
              onEdit={() => startEdit("insurance", insurance)}
              onSave={() => commitEdit("insurance", setInsurance, "pro_insurance")}
              onCancel={cancelEdit}>
              {[
                { label:"Provider", name:"provider" },
                { label:"Number",   name:"number"   },
                { label:"Validity", name:"validity", type:"date" },
                { label:"Type",     name:"type", options:["Individual","Family","Group","Government"] },
              ].map(f => (
                <FieldRow key={f.name} label={f.label} name={f.name}
                  value={editing === "insurance" ? draft[f.name] ?? "" : insurance[f.name]}
                  editing={editing === "insurance"} type={f.type} options={f.options} onChange={fieldChange} />
              ))}
            </Card>

            {/* Medical Conditions */}
            <Card title="Medical Conditions" Icon={Activity} headerBg="bg-red-50" iconBg="bg-red-500"
              editing={editing === "conditions"}
              onEdit={() => setEditing("conditions")}
              onSave={() => { lsSet("pro_conditions", conditions); setEditing(null); showToast(); }}
              onCancel={cancelEdit}>
              <TagList items={conditions} color="bg-red-50 text-red-600 border border-red-200"
                editing={editing === "conditions"}
                onRemove={i => setConditions(conditions.filter((_,j)=>j!==i))}
                newVal={newCond} setNewVal={setNewCond} placeholder="Add condition, press Enter"
                onAdd={() => { if (newCond.trim()) { setConditions([...conditions, newCond.trim()]); setNewCond(""); }}} />
            </Card>

            {/* Allergies */}
            <Card title="Allergies" Icon={Activity} headerBg="bg-yellow-50" iconBg="bg-yellow-400"
              editing={editing === "allergies"}
              onEdit={() => setEditing("allergies")}
              onSave={() => { lsSet("pro_allergies", allergies); setEditing(null); showToast(); }}
              onCancel={cancelEdit}>
              <TagList items={allergies} color="bg-yellow-50 text-yellow-700 border border-yellow-200"
                editing={editing === "allergies"}
                onRemove={i => setAllergies(allergies.filter((_,j)=>j!==i))}
                newVal={newAlg} setNewVal={setNewAlg} placeholder="Add allergy, press Enter"
                onAdd={() => { if (newAlg.trim()) { setAllergies([...allergies, newAlg.trim()]); setNewAlg(""); }}} />
            </Card>
          </div>
        )}

        {/* ════════ PRESCRIPTIONS ════════ */}
        {activeTab === "prescriptions" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-800 text-lg">Prescriptions</h2>
              <button onClick={() => setAddPresc(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors">
                <Plus size={14} /> Add
              </button>
            </div>

            {addPresc && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="font-bold text-slate-800 mb-4 text-sm">New Prescription</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { k:"medicine", l:"Medicine Name",  p:"e.g. Paracetamol 500mg" },
                    { k:"dose",     l:"Dosage",          p:"e.g. 1 tablet"          },
                    { k:"freq",     l:"Frequency",       p:"e.g. 3x daily"          },
                    { k:"duration", l:"Duration",        p:"e.g. 7 days"            },
                    { k:"doctor",   l:"Prescribed By",   p:"Doctor name"            },
                    { k:"date",     l:"Date",            t:"date"                    },
                  ].map(f => (
                    <div key={f.k}>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">{f.l}</label>
                      <input type={f.t ?? "text"} value={pForm[f.k]} placeholder={f.p}
                        onChange={e => setPForm({...pForm, [f.k]: e.target.value})}
                        className={`${inp} focus:border-blue-400`} />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => setAddPresc(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-sm font-semibold">Cancel</button>
                  <button onClick={() => {
                    if (!pForm.medicine) return;
                    const u = [{ ...pForm, id: Date.now() }, ...prescriptions];
                    setPrescs(u); lsSet("pro_prescs", u);
                    setPForm({ medicine:"",dose:"",freq:"",duration:"",doctor:"",date:"" });
                    setAddPresc(false); showToast();
                  }} className="flex-1 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600">Save</button>
                </div>
              </div>
            )}

            {prescriptions.length === 0 && !addPresc && (
              <div className="text-center py-16 text-slate-400">
                <FileText size={40} className="mx-auto mb-3 opacity-20" />
                <p className="font-semibold">No prescriptions added yet</p>
              </div>
            )}

            <div className="space-y-3">
              {prescriptions.map(p => (
                <div key={p.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <FileText size={17} className="text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800">{p.medicine}</h4>
                    <p className="text-sm text-slate-500 mt-0.5">{[p.dose, p.freq, p.duration].filter(Boolean).join(" · ")}</p>
                    {(p.doctor || p.date) && <p className="text-xs text-slate-400 mt-1">{[p.doctor && `By: ${p.doctor}`, p.date].filter(Boolean).join(" · ")}</p>}
                  </div>
                  <button onClick={() => { const u = prescriptions.filter(x=>x.id!==p.id); setPrescs(u); lsSet("pro_prescs",u); }}
                    className="text-slate-300 hover:text-red-400 transition-colors p-1"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════ TEST REPORTS ════════ */}
        {activeTab === "reports" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-800 text-lg">Test Reports</h2>
              <button onClick={() => setAddRep(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors">
                <Plus size={14} /> Add Report
              </button>
            </div>

            {addRep && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="font-bold text-slate-800 mb-4 text-sm">New Test Report</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { k:"name",   l:"Test Name",    p:"e.g. Blood Count"          },
                    { k:"date",   l:"Date",          t:"date"                      },
                    { k:"lab",    l:"Lab / Center",  p:"Lab name"                  },
                    { k:"result", l:"Result",        p:"Normal / Abnormal / Value" },
                    { k:"notes",  l:"Notes",         p:"Additional notes", full:true },
                  ].map(f => (
                    <div key={f.k} className={f.full ? "sm:col-span-2" : ""}>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">{f.l}</label>
                      <input type={f.t ?? "text"} value={rForm[f.k]} placeholder={f.p}
                        onChange={e => setRForm({...rForm, [f.k]: e.target.value})}
                        className={`${inp} focus:border-emerald-400`} />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => setAddRep(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-sm font-semibold">Cancel</button>
                  <button onClick={() => {
                    if (!rForm.name) return;
                    const u = [{ ...rForm, id: Date.now() }, ...reports];
                    setReports(u); lsSet("pro_reports", u);
                    setRForm({ name:"",date:"",lab:"",result:"",notes:"" });
                    setAddRep(false); showToast();
                  }} className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600">Save</button>
                </div>
              </div>
            )}

            {reports.length === 0 && !addRep && (
              <div className="text-center py-16 text-slate-400">
                <Activity size={40} className="mx-auto mb-3 opacity-20" />
                <p className="font-semibold">No test reports added yet</p>
              </div>
            )}

            <div className="space-y-3">
              {reports.map(r => (
                <div key={r.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <Activity size={17} className="text-emerald-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-slate-800">{r.name}</h4>
                      {r.result && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${r.result.toLowerCase().includes("normal") ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                          {r.result}
                        </span>
                      )}
                    </div>
                    {(r.lab || r.date) && <p className="text-sm text-slate-500 mt-0.5">{[r.lab, r.date].filter(Boolean).join(" · ")}</p>}
                    {r.notes && <p className="text-xs text-slate-400 mt-1">{r.notes}</p>}
                  </div>
                  <button onClick={() => { const u = reports.filter(x=>x.id!==r.id); setReports(u); lsSet("pro_reports",u); }}
                    className="text-slate-300 hover:text-red-400 transition-colors p-1"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════ DOCUMENTS ════════ */}
        {activeTab === "documents" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-800 text-lg">Documents</h2>
              <button onClick={() => setAddDoc(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-500 text-white text-sm font-semibold hover:bg-violet-600 transition-colors">
                <Plus size={14} /> Add Document
              </button>
            </div>

            {addDoc && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="font-bold text-slate-800 mb-4 text-sm">New Document</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { k:"name",  l:"Document Name", p:"e.g. X-Ray Chest"                   },
                    { k:"type",  l:"Type",           p:"e.g. Radiology, Prescription, Lab"  },
                    { k:"date",  l:"Date",           t:"date"                                },
                    { k:"notes", l:"Notes",          p:"Optional"                            },
                  ].map(f => (
                    <div key={f.k}>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">{f.l}</label>
                      <input type={f.t ?? "text"} value={dForm[f.k]} placeholder={f.p}
                        onChange={e => setDForm({...dForm, [f.k]: e.target.value})}
                        className={`${inp} focus:border-violet-400`} />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => setAddDoc(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-sm font-semibold">Cancel</button>
                  <button onClick={() => {
                    if (!dForm.name) return;
                    const u = [{ ...dForm, id: Date.now() }, ...documents];
                    setDocuments(u); lsSet("pro_docs", u);
                    setDForm({ name:"",type:"",date:"",notes:"" });
                    setAddDoc(false); showToast();
                  }} className="flex-1 py-2.5 rounded-xl bg-violet-500 text-white text-sm font-semibold hover:bg-violet-600">Save</button>
                </div>
              </div>
            )}

            {documents.length === 0 && !addDoc && (
              <div className="text-center py-16 text-slate-400">
                <Upload size={40} className="mx-auto mb-3 opacity-20" />
                <p className="font-semibold">No documents added yet</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {documents.map(d => (
                <div key={d.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 group relative">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center mb-3">
                    <FileText size={17} className="text-violet-500" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">{d.name}</h4>
                  {d.type && <span className="text-xs px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 font-medium mt-1 inline-block">{d.type}</span>}
                  {d.date && <p className="text-xs text-slate-400 mt-1">{d.date}</p>}
                  <button onClick={() => { const u = documents.filter(x=>x.id!==d.id); setDocuments(u); lsSet("pro_docs",u); }}
                    className="absolute top-3 right-3 text-slate-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════ VITAL SIGNS ════════ */}
        {activeTab === "vitals" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-800 text-lg">Vital Signs</h2>
              <button onClick={() => setAddVital(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 transition-colors">
                <Plus size={14} /> Log Vitals
              </button>
            </div>

            {vitals.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { l:"Blood Pressure", v:vitals[0].bp,     icon:"🫀", u:"mmHg" },
                  { l:"Pulse Rate",     v:vitals[0].pulse,  icon:"💓", u:"bpm"  },
                  { l:"Temperature",    v:vitals[0].temp,   icon:"🌡️", u:"°F"  },
                  { l:"Oxygen Sat.",    v:vitals[0].oxygen, icon:"🫁", u:"%", warn: parseInt(vitals[0].oxygen) < 95 },
                ].map(({ l, v, icon, u, warn }) => (
                  <div key={l} className={`bg-white rounded-2xl border shadow-sm p-4 text-center ${warn ? "border-red-200 bg-red-50" : "border-slate-100"}`}>
                    <div className="text-2xl mb-1">{icon}</div>
                    <div className={`font-bold text-xl ${warn ? "text-red-600" : "text-slate-800"}`}>{v || "—"}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{l}</div>
                  </div>
                ))}
              </div>
            )}

            {addVital && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="font-bold text-slate-800 mb-4 text-sm">Log New Vitals</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { k:"bp",     l:"Blood Pressure",  p:"e.g. 120/80" },
                    { k:"pulse",  l:"Pulse (bpm)",      p:"e.g. 72"     },
                    { k:"temp",   l:"Temperature (°F)", p:"e.g. 98.6"   },
                    { k:"oxygen", l:"Oxygen Sat. (%)",  p:"e.g. 99"     },
                    { k:"date",   l:"Date",             t:"date"         },
                  ].map(f => (
                    <div key={f.k}>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">{f.l}</label>
                      <input type={f.t ?? "text"} value={vForm[f.k]} placeholder={f.p}
                        onChange={e => setVForm({...vForm, [f.k]: e.target.value})}
                        className={`${inp} focus:border-rose-400`} />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => setAddVital(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-sm font-semibold">Cancel</button>
                  <button onClick={() => {
                    const u = [{ ...vForm, id: Date.now() }, ...vitals];
                    setVitals(u); lsSet("pro_vitals", u);
                    setVForm({ bp:"",pulse:"",temp:"",oxygen:"",date: new Date().toISOString().split("T")[0] });
                    setAddVital(false); showToast();
                  }} className="flex-1 py-2.5 rounded-xl bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600">Save</button>
                </div>
              </div>
            )}

            {vitals.length === 0 && !addVital && (
              <div className="text-center py-16 text-slate-400">
                <Zap size={40} className="mx-auto mb-3 opacity-20" />
                <p className="font-semibold">No vitals logged yet</p>
              </div>
            )}

            <div className="space-y-3">
              {vitals.map((v, i) => (
                <div key={v.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-700 text-sm">{v.date}</span>
                      {i === 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 font-semibold">Latest</span>}
                    </div>
                    <button onClick={() => { const u = vitals.filter(x=>x.id!==v.id); setVitals(u); lsSet("pro_vitals",u); }}
                      className="text-slate-300 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { l:"BP",    val:v.bp,     icon:"🫀" },
                      { l:"Pulse", val:v.pulse,  icon:"💓" },
                      { l:"Temp",  val:v.temp,   icon:"🌡️" },
                      { l:"O₂",   val:v.oxygen, icon:"🫁", warn: parseInt(v.oxygen) < 95 },
                    ].map(({ l, val, icon, warn }) => (
                      <div key={l} className={`p-2.5 rounded-xl text-center ${warn ? "bg-red-50 border border-red-200" : "bg-slate-50"}`}>
                        <div className="text-base mb-0.5">{icon}</div>
                        <div className={`font-bold text-sm ${warn ? "text-red-600" : "text-slate-800"}`}>{val || "—"}</div>
                        <div className="text-[10px] text-slate-400">{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════ EMERGENCY ════════ */}
        {activeTab === "emergency" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-800 text-lg">Emergency Contacts</h2>
              <button onClick={() => setAddEmerg(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors">
                <Plus size={14} /> Add Contact
              </button>
            </div>

            {addEmerg && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="font-bold text-slate-800 mb-4 text-sm">New Emergency Contact</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { k:"name",     l:"Full Name",       p:"Contact name"          },
                    { k:"relation", l:"Relationship",    p:"e.g. Spouse, Parent"   },
                    { k:"phone",    l:"Primary Phone",   p:"+91 9876543210"         },
                    { k:"alt",      l:"Alternate Phone", p:"Optional"              },
                  ].map(f => (
                    <div key={f.k}>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">{f.l}</label>
                      <input type="text" value={eForm[f.k]} placeholder={f.p}
                        onChange={e => setEForm({...eForm, [f.k]: e.target.value})}
                        className={`${inp} focus:border-orange-400`} />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => setAddEmerg(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-sm font-semibold">Cancel</button>
                  <button onClick={() => {
                    if (!eForm.name || !eForm.phone) return;
                    const u = [{ ...eForm, id: Date.now() }, ...emergency];
                    setEmergency(u); lsSet("pro_emerg", u);
                    setEForm({ name:"",relation:"",phone:"",alt:"" });
                    setAddEmerg(false); showToast();
                  }} className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600">Save</button>
                </div>
              </div>
            )}

            {emergency.length === 0 && !addEmerg && (
              <div className="text-center py-16 text-slate-400">
                <Phone size={40} className="mx-auto mb-3 opacity-20" />
                <p className="font-semibold">No emergency contacts added yet</p>
                <p className="text-sm mt-1">Add contacts for use in emergencies</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {emergency.map(e => (
                <div key={e.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 group relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-2xl bg-orange-50 flex items-center justify-center font-bold text-orange-500 text-sm flex-shrink-0">
                      {e.name.slice(0,2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{e.name}</h4>
                      {e.relation && <p className="text-xs text-slate-400">{e.relation}</p>}
                    </div>
                  </div>
                  <div className="space-y-1.5 pl-1">
                    <a href={`tel:${e.phone}`} className="flex items-center gap-2 text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                      <Phone size={13} /> {e.phone}
                    </a>
                    {e.alt && (
                      <a href={`tel:${e.alt}`} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
                        <Phone size={13} /> {e.alt}
                      </a>
                    )}
                  </div>
                  <button onClick={() => { const u = emergency.filter(x=>x.id!==e.id); setEmergency(u); lsSet("pro_emerg",u); }}
                    className="absolute top-3 right-3 text-slate-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

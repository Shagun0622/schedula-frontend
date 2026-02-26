"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User, Mail, Phone, MapPin, Heart, Bell, Shield,
  HelpCircle, LogOut, ChevronRight, Edit3, Check, X, Camera,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const MENU_ITEMS = [
  { icon: Heart,      label: "Saved Doctors",     color: "text-rose-500 bg-rose-50"      },
  { icon: Bell,       label: "Notifications",      color: "text-amber-500 bg-amber-50"    },
  { icon: Shield,     label: "Privacy & Security", color: "text-blue-500 bg-blue-50"      },
  { icon: HelpCircle, label: "Help & Support",     color: "text-emerald-500 bg-emerald-50" },
];

const AVATAR_GRADIENTS = [
  "from-cyan-400 to-sky-600",
  "from-violet-400 to-violet-600",
  "from-rose-400 to-pink-600",
  "from-emerald-400 to-teal-600",
  "from-amber-400 to-orange-500",
  "from-indigo-400 to-blue-600",
];

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const isDoctor = user?.role === "doctor";

  const [isEditing, setIsEditing] = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [form, setForm] = useState({
    name:     user?.name     ?? "",
    email:    user?.email    ?? "",
    phone:    user?.phone    ?? "",
    location: user?.location ?? "",
    bio:      user?.bio      ?? "",
    dob:      user?.dob      ?? "",
    gender:   user?.gender   ?? "",
    blood:    user?.blood    ?? "",
    gradient: 0,
  });
  const [editForm, setEditForm] = useState({ ...form });

  const initials = form.name?.split(" ").map(n => n[0]).join("").slice(0, 2) ?? "U";
  const accentFrom = isDoctor ? "from-violet-400" : "from-cyan-400";
  const accentTo   = isDoctor ? "to-violet-600"   : "to-sky-600";
  const accentText = isDoctor ? "text-violet-500"  : "text-cyan-500";
  const accentBg   = isDoctor ? "bg-violet-50"     : "bg-cyan-50";
  const accentBtn  = isDoctor ? "text-violet-600 bg-violet-50 hover:bg-violet-100" : "text-cyan-600 bg-cyan-50 hover:bg-cyan-100";

  const handleSave = () => {
    setForm({ ...editForm });
    // In production: persist to DB / API here
    // For now update localStorage
    const stored = JSON.parse(localStorage.getItem("schedula_user") || "{}");
    localStorage.setItem("schedula_user", JSON.stringify({ ...stored, ...editForm }));
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCancel = () => {
    setEditForm({ ...form });
    setIsEditing(false);
  };

  const handleLogout = () => { logout(); router.push("/"); };

  const inputClass = "w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm placeholder:text-slate-400 outline-none focus:border-current focus:bg-white focus:ring-2 focus:ring-cyan-100 transition-all";

  return (
    <div className="px-4 pt-4 pb-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-display font-bold text-2xl text-slate-800">Profile</h1>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${accentBtn}`}>
            <Edit3 size={14} /> Edit Profile
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button onClick={handleCancel}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold border border-slate-200 text-slate-500 hover:bg-slate-50">
              <X size={14} /> Cancel
            </button>
            <button onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-md"
              style={{ background: isDoctor ? "#7c3aed" : "#0ea5e9" }}>
              <Check size={14} /> Save
            </button>
          </div>
        )}
      </div>

      {/* Saved toast */}
      {saved && (
        <div className="fixed top-5 right-5 z-[200] flex items-center gap-2 bg-emerald-500 text-white px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold animate-fade-up">
          <Check size={16} /> Profile updated successfully!
        </div>
      )}

      {/* Avatar card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${AVATAR_GRADIENTS[editForm.gradient]} flex items-center justify-center text-white font-display font-bold text-2xl shadow-md`}>
              {(isEditing ? editForm.name : form.name)?.split(" ").map(n => n[0]).join("").slice(0, 2) || "U"}
            </div>
            {isEditing && (
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-white shadow-lg">
                <Camera size={13} />
              </button>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Full Name"
                className={`${inputClass} font-display font-bold text-lg mb-2`} />
            ) : (
              <h2 className="font-display font-bold text-xl text-slate-800 truncate">{form.name}</h2>
            )}
            <p className={`text-sm font-semibold capitalize ${accentText}`}>{user?.role}</p>
          </div>
        </div>

        {/* Avatar color picker (edit mode only) */}
        {isEditing && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 mb-2">Avatar Color</p>
            <div className="flex gap-2">
              {AVATAR_GRADIENTS.map((g, i) => (
                <button key={i} onClick={() => setEditForm({ ...editForm, gradient: i })}
                  className={`w-8 h-8 rounded-xl bg-gradient-to-br ${g} transition-transform ${editForm.gradient === i ? "scale-110 ring-2 ring-offset-1 ring-slate-400" : "hover:scale-105"}`} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bio */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-4">
        <h3 className="font-display font-semibold text-slate-700 text-sm mb-3">
          {isDoctor ? "Professional Bio" : "About Me"}
        </h3>
        {isEditing ? (
          <textarea value={editForm.bio} onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
            placeholder={isDoctor ? "Write a short professional bio..." : "Tell us a bit about yourself..."}
            rows={3}
            className={`${inputClass} resize-none`} />
        ) : (
          <p className="text-sm text-slate-500 leading-relaxed">
            {form.bio || <span className="text-slate-300 italic">No bio added yet.</span>}
          </p>
        )}
      </div>

      {/* Personal Info */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-4">
        <h3 className="font-display font-semibold text-slate-700 text-sm mb-4">Personal Information</h3>

        {isEditing ? (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                  placeholder="you@example.com" className={`${inputClass} pl-9`} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input type="tel" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                  placeholder="+91 9876543210" className={`${inputClass} pl-9`} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Location</label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input value={editForm.location} onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                  placeholder="City, State" className={`${inputClass} pl-9`} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Date of Birth</label>
                <input type="date" value={editForm.dob} onChange={e => setEditForm({ ...editForm, dob: e.target.value })}
                  className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Gender</label>
                <select value={editForm.gender} onChange={e => setEditForm({ ...editForm, gender: e.target.value })}
                  className={inputClass}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            {!isDoctor && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Blood Group</label>
                <select value={editForm.blood} onChange={e => setEditForm({ ...editForm, blood: e.target.value })}
                  className={inputClass}>
                  <option value="">Select blood group</option>
                  {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {[
              { icon: Mail,   label: "Email",       value: form.email    },
              { icon: Phone,  label: "Phone",       value: form.phone    },
              { icon: MapPin, label: "Location",    value: form.location },
              { icon: User,   label: "Date of Birth", value: form.dob    },
              { icon: User,   label: "Gender",      value: form.gender   },
              ...(!isDoctor ? [{ icon: User, label: "Blood Group", value: form.blood }] : []),
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <Icon size={15} className="text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="text-sm font-medium text-slate-700 truncate">
                    {value || <span className="text-slate-300 italic">Not set</span>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Menu */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-4">
        {MENU_ITEMS.map(({ icon: Icon, label, color }, i) => (
          <button key={label}
            className={`w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors ${i < MENU_ITEMS.length - 1 ? "border-b border-slate-100" : ""}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon size={15} />
            </div>
            <span className="text-sm font-medium text-slate-700 flex-1 text-left">{label}</span>
            <ChevronRight size={15} className="text-slate-400" />
          </button>
        ))}
      </div>

      {/* Logout */}
      <button onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-red-200 text-red-500 font-semibold hover:bg-red-50 transition-colors">
        <LogOut size={18} /> Sign Out
      </button>
    </div>
  );
}
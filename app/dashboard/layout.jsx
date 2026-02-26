"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Search, Calendar, FileText, User, Stethoscope, Bell, Users } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const PATIENT_NAV = [
  { href: "/dashboard",              label: "Find a Doctor", icon: Search   },
  { href: "/dashboard/appointments", label: "Appointments",  icon: Calendar },
  { href: "/dashboard/records",      label: "Records",       icon: FileText },
  { href: "/dashboard/profile",      label: "Profile",       icon: User     },
];

const DOCTOR_NAV = [
  { href: "/dashboard/patients",     label: "My Patients",   icon: Users    },
  { href: "/dashboard/appointments", label: "Appointments",  icon: Calendar },
  { href: "/dashboard/records",      label: "Records",       icon: FileText },
  { href: "/dashboard/profile",      label: "Profile",       icon: User     },
];

function Sidebar({ user }) {
  const pathname = usePathname();
  const isDoctor = user.role === "doctor";
  const navItems = isDoctor ? DOCTOR_NAV : PATIENT_NAV;
  const initials = user.name?.split(" ").map(n => n[0]).join("").slice(0, 2) ?? "U";

  return (
    <aside className="hidden md:flex w-[220px] lg:w-[240px] flex-shrink-0 flex-col bg-white border-r border-slate-100 h-full">
      <div className="px-5 py-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-sky-600 flex items-center justify-center shadow-md shadow-cyan-200">
            <Stethoscope size={18} className="text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-slate-800 text-base leading-none">Schedula</p>
            <p className="text-slate-400 text-xs mt-0.5">Healthcare</p>
          </div>
        </div>
      </div>

      <div className="px-5 pt-4 pb-0">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
          isDoctor ? "bg-violet-50 text-violet-600 border border-violet-200" : "bg-cyan-50 text-cyan-600 border border-cyan-200"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isDoctor ? "bg-violet-500" : "bg-cyan-500"}`} />
          {isDoctor ? "Doctor Portal" : "Patient Portal"}
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider px-3 mb-2">Menu</p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? isDoctor ? "bg-violet-50 text-violet-600 font-semibold" : "bg-cyan-50 text-cyan-600 font-semibold"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}>
              <Icon size={18} strokeWidth={active ? 2.5 : 1.8} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-5 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-xs flex-shrink-0 ${
            isDoctor ? "bg-gradient-to-br from-violet-400 to-violet-600" : "bg-gradient-to-br from-cyan-400 to-sky-600"
          }`}>{initials}</div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-700 truncate">{user.name}</p>
            <p className="text-xs text-slate-400 capitalize">{user.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function DashboardLayout({ children }) {
  const { user, isLoading } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) router.push("/");
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-[3px] border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isDoctor = user.role === "doctor";
  const navItems = isDoctor ? DOCTOR_NAV : PATIENT_NAV;

  const pageTitle = () => {
    if (pathname === "/dashboard")                   return "Find a Doctor";
    if (pathname === "/dashboard/appointments")      return "Appointments";
    if (pathname === "/dashboard/records")           return "Medical Records";
    if (pathname === "/dashboard/profile")           return "Profile";
    if (pathname === "/dashboard/patients")          return "My Patients";
    if (pathname.startsWith("/dashboard/patients/")) return "Patient Details";
    if (pathname.startsWith("/dashboard/doctor/"))   return "Book Appointment";
    if (pathname === "/dashboard/payment")           return "Payment";
    return "Dashboard";
  };

  return (
    <div className="h-screen flex bg-slate-50 overflow-hidden">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-slate-100 flex-shrink-0">
          <div>
            <h1 className="font-display font-bold text-xl text-slate-800">{pageTitle()}</h1>
            <p className="text-slate-400 text-sm mt-0.5">
              {new Date().toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors">
              <Bell size={18} className="text-slate-600" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold">5</span>
            </button>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs ${isDoctor ? "bg-gradient-to-br from-violet-400 to-violet-600" : "bg-gradient-to-br from-cyan-400 to-sky-600"}`}>
                {user.name?.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <span className="text-sm font-semibold text-slate-700">{user.name?.split(" ")[0]}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <div className="max-w-5xl mx-auto w-full">{children}</div>
        </main>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex items-center justify-around px-2 py-2 z-50 shadow-lg">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link key={href} href={href}
              className={`flex flex-col items-center gap-0.5 py-1 px-4 rounded-xl transition-colors ${
                active ? isDoctor ? "text-violet-500" : "text-cyan-500" : "text-slate-400"
              }`}>
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-[10px] font-medium">{label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

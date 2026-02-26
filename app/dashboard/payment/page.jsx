"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, CreditCard, Smartphone, Building2,
  CheckCircle2, Lock, ChevronDown, ChevronUp, Tag,
} from "lucide-react";

const PAYMENT_METHODS = [
  { id: "card",   label: "Credit / Debit Card", icon: CreditCard  },
  { id: "upi",    label: "UPI",                 icon: Smartphone  },
  { id: "netbank",label: "Net Banking",         icon: Building2   },
];

const UPI_APPS = [
  { id: "gpay",    label: "Google Pay",    emoji: "🔵" },
  { id: "phonepe", label: "PhonePe",       emoji: "🟣" },
  { id: "paytm",   label: "Paytm",         emoji: "🔷" },
  { id: "other",   label: "Other UPI",     emoji: "💳" },
];

const BANKS = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra Bank"];

const OFFERS = [
  { code: "FIRST50",  label: "50% off on first booking", discount: 0.5  },
  { code: "HEALTH10", label: "Flat ₹10 off",             discount: 10, flat: true },
];

export default function PaymentPage() {
  const router  = useRouter();
  const [booking, setBooking] = useState(null);

  const [method,       setMethod]       = useState("card");
  const [upiApp,       setUpiApp]       = useState("gpay");
  const [upiId,        setUpiId]        = useState("");
  const [bank,         setBank]         = useState("State Bank of India");
  const [card,         setCard]         = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [showCvv,      setShowCvv]      = useState(false);
  const [offerCode,    setOfferCode]    = useState("");
  const [appliedOffer, setAppliedOffer] = useState(null);
  const [offerError,   setOfferError]   = useState("");
  const [showOffer,    setShowOffer]    = useState(false);
  const [paying,       setPaying]       = useState(false);
  const [paid,         setPaid]         = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("schedula_pending_booking");
    if (!stored) { router.push("/dashboard"); return; }
    setBooking(JSON.parse(stored));
  }, [router]);

  if (!booking) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-[3px] border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const c           = booking.color ?? { bg: "#dbeafe", text: "#1d4ed8", light: "#eff6ff" };
  const baseFee     = booking.fee ?? 500;
  const platformFee = 25;
  const tax         = Math.round(baseFee * 0.05);

  let discount = 0;
  if (appliedOffer) {
    discount = appliedOffer.flat ? appliedOffer.discount : Math.round(baseFee * appliedOffer.discount);
  }
  const total = baseFee + platformFee + tax - discount;

  const applyOffer = () => {
    setOfferError("");
    const found = OFFERS.find(o => o.code === offerCode.toUpperCase().trim());
    if (found) {
      setAppliedOffer(found);
      setOfferError("");
    } else {
      setAppliedOffer(null);
      setOfferError("Invalid promo code. Try FIRST50 or HEALTH10");
    }
  };

  const handlePay = async () => {
    setPaying(true);
    await new Promise(r => setTimeout(r, 2000));

    // Save confirmed appointment
    const newAppt = {
      id:        `${booking.doctorId}-${Date.now()}`,
      doctorId:  booking.doctorId,
      doctor:    booking.doctor,
      specialty: booking.specialty,
      hospital:  booking.hospital,
      date:      booking.date,
      time:      booking.time,
      status:    "confirmed",
      bookedAt:  new Date().toISOString(),
      color:     c,
      amountPaid: total,
    };
    const existing = JSON.parse(localStorage.getItem("schedula_appointments") || "[]");
    localStorage.setItem("schedula_appointments", JSON.stringify([newAppt, ...existing]));
    localStorage.removeItem("schedula_pending_booking");

    setPaying(false);
    setPaid(true);
  };

  const formatCard = val => val.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  const formatExpiry = val => { const v = val.replace(/\D/g,"").slice(0,4); return v.length > 2 ? v.slice(0,2)+"/"+v.slice(2) : v; };

  // ── SUCCESS SCREEN ──
  if (paid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 animate-fade-up"
            style={{ background: c.light }}>
            <CheckCircle2 size={40} style={{ color: c.text }} />
          </div>
          <h2 className="font-display font-bold text-2xl text-slate-800 mb-1">Payment Successful!</h2>
          <p className="text-slate-400 text-sm mb-5">Your appointment is confirmed 🎉</p>

          <div className="rounded-2xl p-4 mb-6 text-left space-y-2" style={{ background: c.light }}>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Doctor</span>
              <span className="font-bold" style={{ color: c.text }}>{booking.doctor}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Date & Time</span>
              <span className="font-bold text-slate-800">{booking.date} · {booking.time}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Amount Paid</span>
              <span className="font-bold text-emerald-600">₹{total}</span>
            </div>
          </div>

          <button onClick={() => router.push("/dashboard/appointments")}
            className="w-full py-3.5 rounded-xl font-bold text-white text-sm shadow-lg mb-2"
            style={{ background: c.text }}>
            View Appointments
          </button>
          <button onClick={() => router.push("/dashboard")}
            className="w-full py-3 rounded-xl font-semibold text-slate-500 text-sm hover:text-slate-700">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-8">

      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-4 md:px-6 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => router.back()}
          className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="font-display font-bold text-slate-800 text-lg">Secure Payment</h1>
          <p className="text-slate-400 text-xs flex items-center gap-1"><Lock size={10} /> 256-bit SSL encrypted</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 md:px-6 mt-5 space-y-4">

        {/* Booking summary */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="h-1" style={{ background: c.text }} />
          <div className="p-4 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-display font-bold text-base flex-shrink-0"
              style={{ background: c.bg, color: c.text }}>
              {booking.doctor.split(" ").filter((_,i)=>i>0).map(n=>n[0]).join("").slice(0,2)}
            </div>
            <div className="flex-1">
              <h3 className="font-display font-bold text-slate-800">{booking.doctor}</h3>
              <p className="text-sm font-semibold mt-0.5" style={{ color: c.text }}>{booking.specialty}</p>
              <p className="text-xs text-slate-400 mt-1">{booking.hospital}</p>
              <div className="flex flex-wrap gap-3 mt-2">
                <span className="text-xs font-medium text-slate-600 bg-slate-100 rounded-full px-3 py-1">📅 {booking.date}</span>
                <span className="text-xs font-medium text-slate-600 bg-slate-100 rounded-full px-3 py-1">🕐 {booking.time}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Offer / promo */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <button onClick={() => setShowOffer(!showOffer)}
            className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <Tag size={16} className="text-emerald-500" />
            </div>
            <span className="flex-1 text-left font-semibold text-slate-700 text-sm">
              {appliedOffer ? <span className="text-emerald-600">✓ {appliedOffer.code} applied</span> : "Apply Promo Code"}
            </span>
            {showOffer ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
          </button>
          {showOffer && (
            <div className="px-4 pb-4 border-t border-slate-50">
              <div className="flex gap-2 mt-3">
                <input value={offerCode} onChange={e => setOfferCode(e.target.value)}
                  placeholder="Enter promo code"
                  className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all" />
                <button onClick={applyOffer}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition-colors">
                  Apply
                </button>
              </div>
              {offerError && <p className="text-xs text-red-500 mt-2">{offerError}</p>}
              <div className="flex gap-2 mt-3 flex-wrap">
                {OFFERS.map(o => (
                  <button key={o.code} onClick={() => { setOfferCode(o.code); }}
                    className="px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-semibold">
                    {o.code}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Payment method selector */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <h3 className="font-display font-bold text-slate-800 mb-3">Payment Method</h3>
          <div className="space-y-2 mb-5">
            {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setMethod(id)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all ${
                  method === id ? "border-current" : "border-slate-100 bg-slate-50 hover:border-slate-200"
                }`}
                style={method === id ? { borderColor: c.text, background: c.light } : {}}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${method === id ? "bg-white" : "bg-white"}`}>
                  <Icon size={18} style={{ color: method === id ? c.text : "#94a3b8" }} />
                </div>
                <span className={`font-semibold text-sm ${method === id ? "text-slate-800" : "text-slate-500"}`}>{label}</span>
                <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  method === id ? "" : "border-slate-300"
                }`} style={method === id ? { borderColor: c.text } : {}}>
                  {method === id && <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.text }} />}
                </div>
              </button>
            ))}
          </div>

          {/* CARD FIELDS */}
          {method === "card" && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Card Number</label>
                <div className="relative">
                  <CreditCard size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={card.number} onChange={e => setCard({...card, number: formatCard(e.target.value)})}
                    placeholder="1234 5678 9012 3456" maxLength={19}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 font-mono transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Cardholder Name</label>
                <input value={card.name} onChange={e => setCard({...card, name: e.target.value})}
                  placeholder="Name on card"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Expiry</label>
                  <input value={card.expiry} onChange={e => setCard({...card, expiry: formatExpiry(e.target.value)})}
                    placeholder="MM/YY" maxLength={5}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 font-mono transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">CVV</label>
                  <div className="relative">
                    <input type={showCvv ? "text" : "password"} value={card.cvv}
                      onChange={e => setCard({...card, cvv: e.target.value.replace(/\D/g,"").slice(0,4)})}
                      placeholder="•••" maxLength={4}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 font-mono transition-all" />
                    <button type="button" onClick={() => setShowCvv(!showCvv)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">
                      {showCvv ? "HIDE" : "SHOW"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* UPI FIELDS */}
          {method === "upi" && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-2">
                {UPI_APPS.map(app => (
                  <button key={app.id} onClick={() => setUpiApp(app.id)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all ${
                      upiApp === app.id ? "" : "border-slate-100 bg-slate-50 hover:border-slate-200"
                    }`}
                    style={upiApp === app.id ? { borderColor: c.text, background: c.light } : {}}>
                    <span className="text-xl">{app.emoji}</span>
                    <span className="text-[10px] font-semibold text-slate-600 text-center leading-tight">{app.label}</span>
                  </button>
                ))}
              </div>
              {upiApp === "other" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Enter UPI ID</label>
                  <input value={upiId} onChange={e => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all" />
                </div>
              )}
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Lock size={11} /> You will be redirected to the selected UPI app to complete the payment.
              </p>
            </div>
          )}

          {/* NET BANKING */}
          {method === "netbank" && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Select Bank</label>
              <select value={bank} onChange={e => setBank(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all">
                {BANKS.map(b => <option key={b}>{b}</option>)}
              </select>
              <p className="text-xs text-slate-400 mt-3 flex items-center gap-1.5">
                <Lock size={11} /> You will be redirected to your bank's secure payment page.
              </p>
            </div>
          )}
        </div>

        {/* Bill summary */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <h3 className="font-display font-bold text-slate-800 mb-4">Bill Summary</h3>
          <div className="space-y-3">
            {[
              { label: "Consultation Fee",  value: `₹${baseFee}` },
              { label: "Platform Fee",      value: `₹${platformFee}` },
              { label: "GST (5%)",          value: `₹${tax}` },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-slate-500">{label}</span>
                <span className="font-semibold text-slate-700">{value}</span>
              </div>
            ))}
            {appliedOffer && (
              <div className="flex justify-between text-sm">
                <span className="text-emerald-600 font-semibold">Promo ({appliedOffer.code})</span>
                <span className="font-bold text-emerald-600">-₹{discount}</span>
              </div>
            )}
            <div className="border-t border-slate-100 pt-3 flex justify-between">
              <span className="font-display font-bold text-slate-800">Total</span>
              <span className="font-display font-bold text-xl" style={{ color: c.text }}>₹{total}</span>
            </div>
          </div>
        </div>

        {/* Pay button */}
        <button onClick={handlePay} disabled={paying}
          className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg hover:opacity-90"
          style={{ background: `linear-gradient(135deg, #0369a1, ${c.text})` }}>
          {paying
            ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing Payment...</>
            : <><Lock size={16} />Pay ₹{total} Securely</>}
        </button>

        <p className="text-center text-xs text-slate-400 pb-4">
          🔒 Your payment is secured by 256-bit SSL encryption. We never store your card details.
        </p>
      </div>
    </div>
  );
}

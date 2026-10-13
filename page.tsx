"use client";

import React, { useState, useMemo } from "react";

type Role = "family" | "doctor" | "admin";
type Severity = "Critical" | "Moderate" | "Stable";
type AuthPortal = "landing" | "doctor-login" | "staff-login" | "family-login" | "app";

type Patient = {
  id: string;
  name: string;
  severity: Severity;
  stage: string;
  hospital: string;
  doctor: string;
  bed: string;
  payment: "Pending" | "Partial" | "Completed";
  contact: string;
};

const stages = [
  "Incident reported",
  "Ambulance dispatched",
  "Admitted",
  "Bed assigned",
  "Labs in progress",
  "Treatment / surgery",
  "Discharge ready",
];

const sampleDoctors = [
  { name: "Dr. Meera Shah", specialty: "Head of Emergency & Trauma", exp: "12+ Years", shift: "24/7 Trauma Command" },
  { name: "Dr. Karan Verma", specialty: "Critical Care & ICU Specialist", exp: "9+ Years", shift: "ICU Unit 1" },
  { name: "Dr. Rajesh Kadam", specialty: "Emergency Triage & Response", exp: "8+ Years", shift: "Ambulance Dispatch" },
];

export default function Home() {
  // Authentication & Portal State
  const [authPortal, setAuthPortal] = useState<AuthPortal>("landing");
  const [currentUserRole, setCurrentUserRole] = useState<Role>("family");
  const [familyPatientId, setFamilyPatientId] = useState<string>("");

  // Login Form States
  const [doctorEmail, setDoctorEmail] = useState("");
  const [doctorPassword, setDoctorPassword] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffPassword, setStaffPassword] = useState("");
  const [loginPatientId, setLoginPatientId] = useState("");
  const [loginPhone, setLoginPhone] = useState("");
  const [loginError, setLoginError] = useState("");

  // App Main State
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");

  // Single Patient Intake State
  const [newPatientName, setNewPatientName] = useState("");
  const [newPatientSeverity, setNewPatientSeverity] = useState<Severity>("Stable");
  const [newPatientContact, setNewPatientContact] = useState("");
  const [newPatientHospital, setNewPatientHospital] = useState("City General Hospital");
  const [newPatientDoctor, setNewPatientDoctor] = useState("Dr. Meera Shah");

  // Mass Casualty Simulator State
  const [incidentCount, setIncidentCount] = useState(5);
  const [massHospital, setMassHospital] = useState("City General Hospital");
  const [massPatientName, setMassPatientName] = useState("");
  const [massTraumaType, setMassTraumaType] = useState("MVC / Multi-Trauma");

  const [notification, setNotification] = useState<string>(
    "System Ready. Authenticated securely."
  );

  const visiblePatients = useMemo(() => {
    if (currentUserRole === "family" && familyPatientId) {
      return patients.filter((p) => p.id === familyPatientId);
    }
    return patients;
  }, [patients, currentUserRole, familyPatientId]);

  const selectedPatient = useMemo(
    () => visiblePatients.find((p) => p.id === selectedPatientId) ?? visiblePatients[0],
    [visiblePatients, selectedPatientId]
  );

  // Handle Dedicated Doctor Login
  const handleDoctorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (doctorEmail.trim().toLowerCase() === "doctor@careflow.ai" && doctorPassword.trim() === "doctor123") {
      setCurrentUserRole("doctor");
      setFamilyPatientId("");
      setAuthPortal("app");
      setLoginError("");
      setNotification("Logged in as Doctor (Clinical Coordination View unlocked).");
    } else {
      setLoginError("Invalid doctor credentials. Use: doctor@careflow.ai / doctor123");
    }
  };

  // Handle Dedicated Staff / Admin Login
  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (staffEmail.trim().toLowerCase() === "admin@careflow.ai" && staffPassword.trim() === "admin123") {
      setCurrentUserRole("admin");
      setFamilyPatientId("");
      setAuthPortal("app");
      setLoginError("");
      setNotification("Logged in as Hospital Administrator.");
    } else {
      setLoginError("Invalid staff credentials. Use: admin@careflow.ai / admin123");
    }
  };

  // Handle Family Login via Patient ID + Phone
  const handleFamilyLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = patients.find(
      (p) =>
        p.id.toUpperCase() === loginPatientId.trim().toUpperCase() &&
        p.contact.replace(/\s+/g, "").includes(loginPhone.trim().replace(/\s+/g, ""))
    );

    if (found) {
      setCurrentUserRole("family");
      setFamilyPatientId(found.id);
      setSelectedPatientId(found.id);
      setAuthPortal("app");
      setLoginError("");
      setNotification(`Successfully connected to secure feed for patient ${found.name}.`);
    } else {
      setLoginError("Invalid Patient ID or Phone Number. Please check with hospital reception.");
    }
  };

  const handleSingleIntake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim()) return;

    const newId = `CF-${1000 + patients.length + 1}`;
    const autoBed =
      newPatientSeverity === "Critical"
        ? `ICU-${Math.floor(Math.random() * 10) + 1}`
        : newPatientSeverity === "Moderate"
        ? `Ward-${Math.floor(Math.random() * 20) + 1}`
        : `Obs-${Math.floor(Math.random() * 10) + 1}`;

    const newEntry: Patient = {
      id: newId,
      name: newPatientName,
      severity: newPatientSeverity,
      stage: "Admitted",
      hospital: newPatientHospital,
      doctor: newPatientDoctor,
      bed: autoBed,
      payment: "Pending",
      contact: newPatientContact || "+91 90000 00000",
    };

    setPatients((prev) => [...prev, newEntry]);
    setSelectedPatientId(newId);
    setNewPatientName("");
    setNewPatientContact("");
    setNotification(`Patient ${newEntry.name} registered with Secure ID: ${newEntry.id}.`);
  };

  const handleMassIntake = (e: React.FormEvent) => {
    e.preventDefault();
    const generated: Patient[] = Array.from({ length: incidentCount }, (_, i) => {
      const sev: Severity = i % 4 === 0 ? "Critical" : i % 3 === 0 ? "Moderate" : "Stable";
      
      const customName = massPatientName.trim();
      const patientDisplayName = customName 
        ? `${customName} #${i + 1} (${massTraumaType})` 
        : `Casualty #${101 + patients.length + i} (${massTraumaType})`;

      return {
        id: `TR-${2000 + patients.length + i + 1}`,
        name: patientDisplayName,
        severity: sev,
        stage: "Incident reported",
        hospital: massHospital,
        doctor: sev === "Critical" ? "Dr. Meera Shah (Trauma Head)" : "Dr. Karan Verma (Critical Care)",
        bed: sev === "Critical" ? `ICU-0${i + 1}` : `Ward-1${i + 1}`,
        payment: "Pending",
        contact: `+91 98000 ${1000 + i}`,
      };
    });

    setPatients((prev) => [...prev, ...generated]);
    setSelectedPatientId(generated[0].id);
    setMassPatientName("");
    setNotification(`Mass casualty alert: ${incidentCount} custom cases queued for triage.`);
  };

  const handleAdvanceStage = (patientId: string) => {
    if (currentUserRole === "family") return;
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          const currentIndex = stages.indexOf(p.stage);
          const nextStage = stages[Math.min(currentIndex + 1, stages.length - 1)];
          return { ...p, stage: nextStage };
        }
        return p;
      })
    );
  };

  const handleTogglePayment = (patientId: string) => {
    if (currentUserRole !== "admin") return;
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          const nextPay = p.payment === "Pending" ? "Partial" : p.payment === "Partial" ? "Completed" : "Pending";
          return { ...p, payment: nextPay };
        }
        return p;
      })
    );
  };

  const stageIndex = stages.indexOf(selectedPatient?.stage ?? "Incident reported");

  // 1. PUBLIC HOSPITAL LANDING PAGE
  if (authPortal === "landing") {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-teal-100 selection:text-teal-900">
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-4">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-teal-500 animate-pulse" />
              <div>
                <h1 className="text-base font-bold tracking-tight text-teal-800">CareFlow AI Hospital</h1>
                <p className="text-xs text-slate-500 hidden sm:block">Emergency & Mass Casualty Command Center</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => { setLoginError(""); setAuthPortal("doctor-login"); }}
                className="rounded-full bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-amber-700 transition"
              >
                Doctor Login
              </button>
              <button
                onClick={() => { setLoginError(""); setAuthPortal("staff-login"); }}
                className="rounded-full bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-teal-700 transition"
              >
                Staff Login
              </button>
              <button
                onClick={() => { setLoginError(""); setAuthPortal("family-login"); }}
                className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
              >
                Family Portal
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl space-y-10 px-4 sm:px-8 py-8">
          <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-teal-900 to-slate-900 p-8 sm:p-12 text-white shadow-lg">
            <div className="max-w-3xl space-y-4">
              <span className="rounded-full bg-teal-500/20 border border-teal-400/30 px-3 py-1 text-xs font-semibold text-teal-300">
                Next-Gen Emergency Healthcare Orchestration
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Saving Lives Through Real-Time Coordination & Transparency
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                CareFlow AI bridges the critical gap between emergency accident sites, ambulance dispatch, trauma doctors, and anxious family members. Eliminating reception bottlenecks and providing instant ICU/Ward bed allocation when every second counts.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => setAuthPortal("family-login")}
                  className="rounded-xl bg-teal-500 px-5 py-3 text-xs font-bold text-slate-950 hover:bg-teal-400 transition"
                >
                  Track Patient Live Status ➔
                </button>
                <button
                  onClick={() => setAuthPortal("staff-login")}
                  className="rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3 text-xs font-bold text-white hover:bg-slate-800 transition"
                >
                  Hospital Staff Portal
                </button>
              </div>
            </div>
          </section>

          <section className="grid gap-6 grid-cols-1 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
              <div className="h-8 w-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">01</div>
              <h3 className="font-bold text-slate-900 text-sm">Mass Casualty Simulation</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Instantly handles batch emergency intakes during major disasters with custom trauma tagging, auto-routing critical patients to ICU beds.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
              <div className="h-8 w-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">02</div>
              <h3 className="font-bold text-slate-900 text-sm">Clinical Coordination</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Empowers doctors to update patient care stages with a single click, instantly syncing timelines across the entire hospital command center.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
              <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">03</div>
              <h3 className="font-bold text-slate-900 text-sm">Family Peace of Mind</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Eliminates information blackouts. Families track their relative's exact journey securely using a unique Patient ID and phone number.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Expert Medical Staff</p>
              <h3 className="text-lg font-bold text-slate-900">Emergency & Trauma On-Duty Physicians</h3>
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
              {sampleDoctors.map((doc, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">{doc.name}</h4>
                    <span className="rounded-full bg-teal-50 border border-teal-200 px-2 py-0.5 text-[10px] font-semibold text-teal-800">
                      {doc.exp}
                    </span>
                  </div>
                  <p className="text-xs text-teal-700 font-medium">{doc.specialty}</p>
                  <p className="text-xs text-slate-500">Duty Shift: {doc.shift}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    );
  }

  // 2. SEPARATE DOCTOR LOGIN SCREEN
  if (authPortal === "doctor-login") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
        <form onSubmit={handleDoctorLogin} className="max-w-md w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-xl space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Doctor Portal Login</h2>
          <p className="text-xs text-slate-500">Access clinical triage and update patient care timelines.</p>

          <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-[11px] text-amber-800">
            <p className="font-semibold">Doctor Demo Credentials:</p>
            <p>Email: <code className="font-bold">doctor@careflow.ai</code></p>
            <p>Password: <code className="font-bold">doctor123</code></p>
          </div>

          {loginError && <p className="text-xs text-red-600 font-medium">{loginError}</p>}

          <div>
            <label className="text-xs font-medium text-slate-600">Doctor Email</label>
            <input
              type="email"
              required
              value={doctorEmail}
              onChange={(e) => setDoctorEmail(e.target.value)}
              placeholder="doctor@careflow.ai"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600">Password</label>
            <input
              type="password"
              required
              value={doctorPassword}
              onChange={(e) => setDoctorPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs outline-none focus:border-amber-500"
            />
          </div>

          <button type="submit" className="w-full rounded-xl bg-amber-600 py-3 text-xs font-semibold text-white shadow hover:bg-amber-700">
            Login as Doctor
          </button>

          <button
            type="button"
            onClick={() => setAuthPortal("landing")}
            className="w-full text-center text-xs text-slate-500 hover:underline pt-2"
          >
            ← Back to Hospital Home
          </button>
        </form>
      </div>
    );
  }

  // 3. SEPARATE STAFF / ADMIN LOGIN SCREEN
  if (authPortal === "staff-login") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
        <form onSubmit={handleStaffLogin} className="max-w-md w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-xl space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Staff / Admin Login</h2>
          <p className="text-xs text-slate-500">Access hospital command center, bed clearance, and patient intake.</p>

          <div className="rounded-xl bg-teal-50 border border-teal-200 p-3 text-[11px] text-teal-800">
            <p className="font-semibold">Staff Demo Credentials:</p>
            <p>Email: <code className="font-bold">admin@careflow.ai</code></p>
            <p>Password: <code className="font-bold">admin123</code></p>
          </div>

          {loginError && <p className="text-xs text-red-600 font-medium">{loginError}</p>}

          <div>
            <label className="text-xs font-medium text-slate-600">Staff Email</label>
            <input
              type="email"
              required
              value={staffEmail}
              onChange={(e) => setStaffEmail(e.target.value)}
              placeholder="admin@careflow.ai"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600">Password</label>
            <input
              type="password"
              required
              value={staffPassword}
              onChange={(e) => setStaffPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs outline-none focus:border-teal-500"
            />
          </div>

          <button type="submit" className="w-full rounded-xl bg-teal-600 py-3 text-xs font-semibold text-white shadow hover:bg-teal-700">
            Login as Staff / Admin
          </button>

          <button
            type="button"
            onClick={() => setAuthPortal("landing")}
            className="w-full text-center text-xs text-slate-500 hover:underline pt-2"
          >
            ← Back to Hospital Home
          </button>
        </form>
      </div>
    );
  }

  // 4. FAMILY LOGIN SCREEN
  if (authPortal === "family-login") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
        <form onSubmit={handleFamilyLogin} className="max-w-md w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-xl space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Family Tracking Login</h2>
          <p className="text-xs text-slate-500">Enter your Patient ID (e.g. CF-1001) and contact number to view live status.</p>

          {patients.length === 0 && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-[11px] text-amber-800">
              Note: No patients are registered in the system yet. Ask staff to register a patient first via Staff Portal.
            </div>
          )}

          {loginError && <p className="text-xs text-red-600 font-medium">{loginError}</p>}

          <div>
            <label className="text-xs font-medium text-slate-600">Patient ID</label>
            <input
              type="text"
              required
              value={loginPatientId}
              onChange={(e) => setLoginPatientId(e.target.value)}
              placeholder="e.g. CF-1001"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600">Registered Phone Number</label>
            <input
              type="text"
              required
              value={loginPhone}
              onChange={(e) => setLoginPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs outline-none focus:border-teal-500"
            />
          </div>

          <button type="submit" className="w-full rounded-xl bg-teal-600 py-3 text-xs font-semibold text-white shadow hover:bg-teal-700">
            Access Live Patient Feed
          </button>

          <button
            type="button"
            onClick={() => setAuthPortal("landing")}
            className="w-full text-center text-xs text-slate-500 hover:underline pt-2"
          >
            ← Back to Hospital Home
          </button>
        </form>
      </div>
    );
  }

  // 5. MAIN APP INTERFACE (Strictly Role-Gated)
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Header Bar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-teal-500 animate-pulse" />
            <div>
              <h1 className="text-base font-bold tracking-tight text-teal-800">CareFlow AI</h1>
              <p className="text-xs text-slate-500">
                Logged in Role: <span className="font-semibold text-teal-700 uppercase">{currentUserRole}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setAuthPortal("landing");
                setFamilyPatientId("");
              }}
              className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
            >
              Logout / Return to Home
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 sm:px-8 py-6">
        {/* DOCTOR VIEW */}
        {currentUserRole === "doctor" && (
          <section className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 shadow-sm">
            <h2 className="text-sm font-bold text-amber-900">Doctor Clinical Coordination Portal</h2>
            <p className="text-xs text-amber-700 mt-0.5">Select a patient below and advance their care timeline stage.</p>
            {selectedPatient ? (
              <div className="mt-3 flex items-center justify-between bg-white p-4 rounded-xl border border-amber-200">
                <p className="font-bold text-xs text-slate-900">{selectedPatient.name} — Current Stage: <span className="text-teal-700">{selectedPatient.stage}</span></p>
                <button
                  onClick={() => handleAdvanceStage(selectedPatient.id)}
                  className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-700 shadow"
                >
                  Advance Stage ➔
                </button>
              </div>
            ) : null}
          </section>
        )}

        {/* ADMIN/STAFF VIEW */}
        {currentUserRole === "admin" && (
          <section className="rounded-2xl border border-teal-200 bg-teal-50/70 p-5 shadow-sm">
            <h2 className="text-sm font-bold text-teal-900">Hospital Command Center (Admin View)</h2>
            <p className="text-xs text-teal-700 mt-0.5">Manage bed clearance & billing status.</p>
            {selectedPatient ? (
              <div className="mt-3 flex items-center justify-between bg-white p-4 rounded-xl border border-teal-200">
                <p className="font-bold text-xs text-slate-900">{selectedPatient.name} — Bed {selectedPatient.bed} ({selectedPatient.payment})</p>
                <button
                  onClick={() => handleTogglePayment(selectedPatient.id)}
                  className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700"
                >
                  Toggle Billing Status
                </button>
              </div>
            ) : null}
          </section>
        )}

        {/* FAMILY VIEW BANNER */}
        {currentUserRole === "family" && (
          <section className="rounded-2xl border border-teal-200 bg-teal-50/70 p-5 shadow-sm">
            <h2 className="text-sm font-bold text-teal-900">Family Member Live Tracking Portal</h2>
            <p className="text-xs text-teal-700 mt-0.5">Secure, view-only real-time feed for your loved one.</p>
          </section>
        )}

        {/* Live Notification Bar */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-600 flex items-center gap-2 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-teal-500" />
          <span className="truncate">{notification}</span>
        </div>

        {/* Patient Directory & Timeline */}
        <section className="grid gap-6 grid-cols-1 lg:grid-cols-[1fr_1.1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Directory</p>
                <h2 className="text-base font-bold text-slate-900">
                  {currentUserRole === "family" ? "Your Patient Record" : "Active Cases"}
                </h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{visiblePatients.length} Total</span>
            </div>

            {visiblePatients.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-slate-400 text-xs">
                No active records found.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto">
                {visiblePatients.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPatientId(p.id)}
                    className={`w-full rounded-xl border p-3.5 text-left transition ${
                      selectedPatientId === p.id ? "border-teal-500 bg-teal-50/50" : "border-slate-200 bg-slate-50/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-900 text-sm">{p.name}</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">{p.severity}</span>
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-slate-500">
                      <span>{p.id}</span>
                      <span>{p.bed}</span>
                      <span>{p.stage}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Patient Details & Journey */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Patient Live Timeline</p>
            {selectedPatient ? (
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{selectedPatient.name}</h2>
                    <p className="text-xs text-slate-500">ID: {selectedPatient.id} | Contact: {selectedPatient.contact}</p>
                  </div>
                  <span className="rounded-full bg-teal-50 border border-teal-200 px-3 py-1 text-xs font-semibold text-teal-800">
                    {selectedPatient.hospital}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200">
                    <p className="text-slate-400">Current Stage</p>
                    <p className="font-semibold text-slate-800 mt-0.5">{selectedPatient.stage}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200">
                    <p className="text-slate-400">Assigned Doctor</p>
                    <p className="font-semibold text-slate-800 mt-0.5">{selectedPatient.doctor}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-700 mb-2">Care Timeline Progress</p>
                  <div className="space-y-1.5">
                    {stages.map((step, idx) => {
                      const isActive = idx <= (stageIndex >= 0 ? stageIndex : 0);
                      return (
                        <div
                          key={step}
                          className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-xs border ${
                            isActive ? "border-teal-200 bg-teal-50/80 text-teal-900 font-medium" : "border-slate-100 bg-slate-50 text-slate-400"
                          }`}
                        >
                          <span>{step}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] ${isActive ? "bg-teal-600 text-white font-bold" : "bg-slate-200 text-slate-500"}`}>
                            {isActive ? "Passed" : "Queued"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 p-12 text-center text-slate-400 text-xs">
                No patient selected or available.
              </div>
            )}
          </div>
        </section>

        {/* Intake Forms (Visible ONLY for Admin/Staff) */}
        {currentUserRole === "admin" && (
          <section id="intake" className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <form onSubmit={handleSingleIntake} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3.5">
              <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Staff Registration</p>
              <h2 className="text-base font-bold text-slate-900">New Patient Entry</h2>

              <div>
                <label className="text-xs font-medium text-slate-600">Patient Name</label>
                <input
                  type="text"
                  required
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:bg-white focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600">Severity Triage</label>
                  <select
                    value={newPatientSeverity}
                    onChange={(e) => setNewPatientSeverity(e.target.value as Severity)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:bg-white"
                  >
                    <option value="Critical">Critical</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Stable">Stable</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">Contact Number</label>
                  <input
                    type="text"
                    value={newPatientContact}
                    onChange={(e) => setNewPatientContact(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:bg-white"
                  />
                </div>
              </div>

              <button type="submit" className="w-full rounded-xl bg-teal-600 py-2.5 text-xs font-semibold text-white shadow hover:bg-teal-700">
                Register & Generate ID
              </button>
            </form>

            <form onSubmit={handleMassIntake} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3.5">
              <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Simulation Engine</p>
              <h2 className="text-base font-bold text-slate-900">Mass Casualty Intake</h2>

              <div>
                <label className="text-xs font-medium text-slate-600">Incident / Group Name (Optional)</label>
                <input
                  type="text"
                  value={massPatientName}
                  onChange={(e) => setMassPatientName(e.target.value)}
                  placeholder="e.g. Highway Pileup"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600">Cause / Trauma Type</label>
                <select
                  value={massTraumaType}
                  onChange={(e) => setMassTraumaType(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:bg-white"
                >
                  <option value="MVC / Multi-Trauma">MVC / Multi-Trauma</option>
                  <option value="Severe Burn Injury">Severe Burn Injury</option>
                  <option value="Respiratory Distress">Respiratory Distress</option>
                  <option value="Structural Crush Injury">Structural Crush Injury</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600">Injured Count</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={incidentCount}
                  onChange={(e) => setIncidentCount(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none"
                />
              </div>

              <button type="submit" className="w-full rounded-xl border border-teal-300 bg-teal-50 py-2.5 text-xs font-semibold text-teal-800 hover:bg-teal-100">
                Batch Emergency Intake
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}
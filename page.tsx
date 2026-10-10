"use client";

import React, { useState, useMemo } from "react";

type Role = "family" | "doctor" | "nurse" | "admin";
type Severity = "Critical" | "Moderate" | "Stable";
type AuthPortal = "landing" | "doctor-login" | "nurse-login" | "staff-login" | "family-login" | "app";

type CheckupRecord = {
  id: string;
  timestamp: string;
  doctorName: string;
  rawNote: string;
  diagnosis: string;
  surgeryNeeded: string;
  medications: string;
  dosageInstructions: string;
  dietaryPlan: string;
  estimatedRecovery: string;
};

type Patient = {
  id: string;
  name: string;
  severity: Severity;
  stage: string;
  hospital: string;
  doctor: string;
  assignedNurse: string;
  bed: string;
  payment: "Pending" | "Partial" | "Completed";
  contact: string;
  checkupHistory: CheckupRecord[];
};

type MedicalStaff = {
  id: string;
  name: string;
  role: "doctor" | "nurse";
  specialties: string[];
  shift: string;
};

const defaultStaff: MedicalStaff[] = [
  { id: "DOC-01", name: "Dr. Meera Shah", role: "doctor", specialties: ["Trauma Head", "Emergency Surgery"], shift: "24/7 Trauma Command" },
  { id: "DOC-02", name: "Dr. Karan Verma", role: "doctor", specialties: ["Critical Care", "Pulmonology"], shift: "ICU Unit 1" },
  { id: "DOC-03", name: "Dr. Rajesh Kadam", role: "doctor", specialties: ["Orthopedics", "Emergency Triage"], shift: "Ambulance Response" },
  { id: "NRS-01", name: "Head Nurse Ananya Roy", role: "nurse", specialties: ["ICU Lead", "Trauma Triage"], shift: "Day Shift" },
  { id: "NRS-02", name: "Nurse Priya Sharma", role: "nurse", specialties: ["Post-Op Care", "Medication Admin"], shift: "Evening Shift" },
];

const stages = [
  "Incident reported",
  "Ambulance dispatched",
  "Admitted & Triaged",
  "Bed assigned",
  "Doctor Checkup Complete",
  "Treatment / Surgery in Progress",
  "Discharge Ready",
];

export default function Home() {
  const [authPortal, setAuthPortal] = useState<AuthPortal>("landing");
  const [currentUserRole, setCurrentUserRole] = useState<Role>("family");
  const [familyPatientId, setFamilyPatientId] = useState<string>("");

  const [doctorEmail, setDoctorEmail] = useState("");
  const [doctorPassword, setDoctorPassword] = useState("");
  const [nurseEmail, setNurseEmail] = useState("");
  const [nursePassword, setNursePassword] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffPassword, setStaffPassword] = useState("");
  const [loginPatientId, setLoginPatientId] = useState("");
  const [loginPhone, setLoginPhone] = useState("");
  const [loginError, setLoginError] = useState("");

  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [staffRegistry, setStaffRegistry] = useState<MedicalStaff[]>(defaultStaff);

  const [showRegModal, setShowRegModal] = useState(false);
  const [doctorNoteInput, setDoctorNoteInput] = useState("");

  const [nurseDiagnosis, setNurseDiagnosis] = useState("");
  const [nurseSurgery, setNurseSurgery] = useState("None");
  const [nurseMeds, setNurseMeds] = useState("");
  const [nurseDosage, setNurseDosage] = useState("");
  const [nurseDiet, setNurseDiet] = useState("");
  const [nurseRecovery, setNurseRecovery] = useState("");

  const [newPatientName, setNewPatientName] = useState("");
  const [newPatientSeverity, setNewPatientSeverity] = useState<Severity>("Stable");
  const [newPatientContact, setNewPatientContact] = useState("");
  const [newPatientHospital] = useState("City General Hospital");

  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffRole, setNewStaffRole] = useState<"doctor" | "nurse">("doctor");
  const [newStaffSpecialty, setNewStaffSpecialty] = useState("");

  const [incidentCount, setIncidentCount] = useState(5);
  const [notification, setNotification] = useState<string>("System Ready. Authenticated securely.");

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

  const handleDoctorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (doctorEmail.trim().toLowerCase() === "doctor@careflow.ai" && doctorPassword.trim() === "doctor123") {
      setCurrentUserRole("doctor");
      setFamilyPatientId("");
      setAuthPortal("app");
      setLoginError("");
      setNotification("Logged in as Doctor (Clinical Note Portal).");
    } else {
      setLoginError("Invalid doctor credentials. Use: doctor@careflow.ai / doctor123");
    }
  };

  const handleNurseLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (nurseEmail.trim().toLowerCase() === "nurse@careflow.ai" && nursePassword.trim() === "nurse123") {
      setCurrentUserRole("nurse");
      setFamilyPatientId("");
      setAuthPortal("app");
      setLoginError("");
      setNotification("Logged in as Head Nurse / Nursing Staff.");
    } else {
      setLoginError("Invalid nurse credentials. Use: nurse@careflow.ai / nurse123");
    }
  };

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
      setNotification(`Connected to live feed for patient ${found.name}.`);
    } else {
      setLoginError("Invalid Patient ID or Phone Number.");
    }
  };

  const handleDoctorSubmitNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !doctorNoteInput.trim()) return;

    const lowerNote = doctorNoteInput.toLowerCase();
    const parsedSurgery = lowerNote.includes("surgery") || lowerNote.includes("operation") || lowerNote.includes("orif")
      ? "Required — Urgent Prep"
      : "Not Required (Conservative Care)";
    
    const parsedMeds = lowerNote.includes("cefazolin") ? "IV Cefazolin 1g"
      : lowerNote.includes("paracetamol") ? "IV Paracetamol 1000mg"
      : lowerNote.includes("morphine") ? "IV Morphine 5mg"
      : "Standard Trauma Pain Management Pack";

    const parsedDiet = lowerNote.includes("npo") || lowerNote.includes("fasting")
      ? "NPO (Nothing by Mouth — Surgery Prep)"
      : lowerNote.includes("fluid") ? "Clear Liquid Diet Only"
      : "Normal Light Hospital Meal";

    const parsedRecovery = lowerNote.includes("week") ? "3 - 6 Weeks Estimated"
      : lowerNote.includes("day") ? "3 - 5 Days Observation"
      : "1 - 2 Weeks Estimated";

    setNurseDiagnosis(doctorNoteInput.slice(0, 40) + "...");
    setNurseSurgery(parsedSurgery);
    setNurseMeds(parsedMeds);
    setNurseDosage("Every 8 hours as prescribed");
    setNurseDiet(parsedDiet);
    setNurseRecovery(parsedRecovery);

    const newRecord: CheckupRecord = {
      id: `CHK-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      doctorName: selectedPatient.doctor,
      rawNote: doctorNoteInput,
      diagnosis: "Pending Nurse Final Verification",
      surgeryNeeded: parsedSurgery,
      medications: parsedMeds,
      dosageInstructions: "Pending Nurse Processing",
      dietaryPlan: parsedDiet,
      estimatedRecovery: parsedRecovery,
    };

    setPatients((prev) =>
      prev.map((p) =>
        p.id === selectedPatient.id
          ? {
              ...p,
              stage: "Doctor Checkup Complete",
              checkupHistory: [newRecord, ...p.checkupHistory],
            }
          : p
      )
    );

    setDoctorNoteInput("");
    setNotification(`Checkup note submitted for ${selectedPatient.name}. Sent to Head Nurse for processing.`);
  };

  const handleNurseFinalizeCheckup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || selectedPatient.checkupHistory.length === 0) return;

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === selectedPatient.id) {
          const updatedHistory = [...p.checkupHistory];
          if (updatedHistory[0]) {
            updatedHistory[0] = {
              ...updatedHistory[0],
              diagnosis: nurseDiagnosis || updatedHistory[0].diagnosis,
              surgeryNeeded: nurseSurgery,
              medications: nurseMeds,
              dosageInstructions: nurseDosage,
              dietaryPlan: nurseDiet,
              estimatedRecovery: nurseRecovery,
            };
          }
          return {
            ...p,
            stage: nurseSurgery.includes("Required") ? "Treatment / Surgery in Progress" : "Doctor Checkup Complete",
            checkupHistory: updatedHistory,
          };
        }
        return p;
      })
    );

    setNotification(`Head Nurse verified and updated care plan for ${selectedPatient.name}.`);
  };

  const handleRegisterStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim()) return;

    const newStaff: MedicalStaff = {
      id: `${newStaffRole.toUpperCase()}-${Math.floor(Math.random() * 900) + 100}`,
      name: newStaffName,
      role: newStaffRole,
      specialties: newStaffSpecialty.split(",").map((s) => s.trim()),
      shift: "General On-Call Duty",
    };

    setStaffRegistry((prev) => [...prev, newStaff]);
    setNewStaffName("");
    setNewStaffSpecialty("");
    setShowRegModal(false);
    setNotification(`Successfully registered ${newStaff.role.toUpperCase()}: ${newStaff.name}`);
  };

  const handleSingleIntake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim()) return;

    const newId = `CF-${1000 + patients.length + 1}`;
    
    const matchedDoc = newPatientSeverity === "Critical" 
      ? staffRegistry.find((s) => s.role === "doctor" && s.specialties.some(sp => sp.toLowerCase().includes("trauma")))?.name || "Dr. Meera Shah"
      : staffRegistry.find((s) => s.role === "doctor")?.name || "Dr. Rajesh Kadam";

    const matchedNurse = staffRegistry.find((s) => s.role === "nurse")?.name || "Head Nurse Ananya Roy";

    const autoBed = newPatientSeverity === "Critical"
      ? `ICU-${Math.floor(Math.random() * 10) + 1}`
      : newPatientSeverity === "Moderate"
      ? `Ward-${Math.floor(Math.random() * 20) + 1}`
      : `Obs-${Math.floor(Math.random() * 10) + 1}`;

    const newEntry: Patient = {
      id: newId,
      name: newPatientName,
      severity: newPatientSeverity,
      stage: "Admitted & Triaged",
      hospital: newPatientHospital,
      doctor: matchedDoc,
      assignedNurse: matchedNurse,
      bed: autoBed,
      payment: "Pending",
      contact: newPatientContact || "+91 90000 00000",
      checkupHistory: [],
    };

    setPatients((prev) => [...prev, newEntry]);
    setSelectedPatientId(newId);
    setNewPatientName("");
    setNewPatientContact("");
    setNotification(`Patient ${newEntry.name} registered. Assigned to ${matchedDoc} & ${matchedNurse}.`);
  };

  const handleMassIntake = (e: React.FormEvent) => {
    e.preventDefault();
    const traumaCatalog = [
      { type: "MVC / Multi-Trauma", doc: "Dr. Meera Shah", nurse: "Head Nurse Ananya Roy", bedPrefix: "ICU-T" },
      { type: "Acute Respiratory Distress", doc: "Dr. Karan Verma", nurse: "Nurse Priya Sharma", bedPrefix: "ICU-R" },
      { type: "Crush / Structural Injury", doc: "Dr. Rajesh Kadam", nurse: "Head Nurse Ananya Roy", bedPrefix: "Ward-C" },
      { type: "Hemorrhagic Shock", doc: "Dr. Meera Shah", nurse: "Nurse Priya Sharma", bedPrefix: "ICU-H" },
    ];

    const generated: Patient[] = Array.from({ length: incidentCount }, (_, i) => {
      const sev: Severity = i % 4 === 0 ? "Critical" : i % 3 === 0 ? "Moderate" : "Stable";
      const archetype = traumaCatalog[i % traumaCatalog.length];

      const assignedBed = sev === "Critical" 
        ? `${archetype.bedPrefix}-0${(i % 5) + 1}`
        : sev === "Moderate"
        ? `Ward-${10 + i}`
        : `Obs-0${(i % 8) + 1}`;

      return {
        id: `TR-${2000 + patients.length + i + 1}`,
        name: `Emergency Case #${101 + patients.length + i} (${archetype.type})`,
        severity: sev,
        stage: "Incident reported",
        hospital: "City General Hospital",
        doctor: archetype.doc,
        assignedNurse: archetype.nurse,
        bed: assignedBed,
        payment: "Pending",
        contact: `+91 98000 ${1000 + i}`,
        checkupHistory: [],
      };
    });

    setPatients((prev) => [...prev, ...generated]);
    setSelectedPatientId(generated[0].id);
    setNotification(`Disaster Simulation: ${incidentCount} emergency patients routed to specialists & nursing teams.`);
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

  if (authPortal === "landing") {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-4">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-teal-500 animate-pulse" />
              <div>
                <h1 className="text-base font-bold text-teal-800">CareFlow AI Hospital</h1>
                <p className="text-[11px] text-slate-500 hidden sm:block">Trauma Command & Patient Orchestration</p>
              </div>
              <button
                onClick={() => setShowRegModal(true)}
                className="ml-2 rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 shadow-sm transition"
              >
                + Register Doctor / Nurse
              </button>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button onClick={() => { setLoginError(""); setAuthPortal("doctor-login"); }} className="rounded-full bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700">Doctor Login</button>
              <button onClick={() => { setLoginError(""); setAuthPortal("nurse-login"); }} className="rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700">Nurse Login</button>
              <button onClick={() => { setLoginError(""); setAuthPortal("staff-login"); }} className="rounded-full bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700">Staff Login</button>
              <button onClick={() => { setLoginError(""); setAuthPortal("family-login"); }} className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">Family Portal</button>
            </div>
          </div>
        </header>

        {showRegModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 border border-slate-200">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="font-bold text-slate-900 text-sm">Register Medical Resource Staff</h3>
                <button onClick={() => setShowRegModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">✕</button>
              </div>

              <form onSubmit={handleRegisterStaff} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Full Name</label>
                  <input type="text" required value={newStaffName} onChange={(e) => setNewStaffName(e.target.value)} placeholder="e.g. Dr. Anil Desai" className="mt-1 w-full rounded-xl border p-2.5 text-xs outline-none focus:border-teal-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Staff Role</label>
                  <select value={newStaffRole} onChange={(e) => setNewStaffRole(e.target.value as "doctor" | "nurse")} className="mt-1 w-full rounded-xl border p-2.5 text-xs outline-none">
                    <option value="doctor">Doctor / Specialist</option>
                    <option value="nurse">Head Nurse / Staff Nurse</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Specialties / Department</label>
                  <input type="text" required value={newStaffSpecialty} onChange={(e) => setNewStaffSpecialty(e.target.value)} placeholder="e.g. Trauma Surgery, ICU Lead, Cardiology" className="mt-1 w-full rounded-xl border p-2.5 text-xs outline-none focus:border-teal-500" />
                </div>
                <button type="submit" className="w-full rounded-xl bg-teal-600 py-3 text-xs font-bold text-white hover:bg-teal-700 shadow">Add Medical Resource to System</button>
              </form>
            </div>
          </div>
        )}

        <main className="mx-auto max-w-7xl space-y-12 px-4 sm:px-8 py-8">
          <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-teal-900 via-slate-900 to-blue-950 p-8 sm:p-12 text-white shadow-lg">
            <div className="max-w-3xl space-y-4">
              <span className="rounded-full bg-teal-500/20 border border-teal-400/30 px-3 py-1 text-xs font-semibold text-teal-300">
                Next-Gen Emergency Healthcare Orchestration
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Rapid Doctor Dictation ➔ AI Medical Parsing ➔ Live Family Peace of Mind
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Doctors focus on saving lives by typing rapid checkup notes. Head Nurses and AI agents convert these notes into verified medication schedules, dietary plans, and recovery timelines for anxious family members in real-time.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button onClick={() => setAuthPortal("family-login")} className="rounded-xl bg-teal-500 px-5 py-3 text-xs font-bold text-slate-950 hover:bg-teal-400">
                  Track Patient Live Progress ➔
                </button>
                <button onClick={() => setAuthPortal("nurse-login")} className="rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3 text-xs font-bold text-white hover:bg-slate-800">
                  Head Nurse Coordination Workspace
                </button>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Hospital Resource Management</p>
                <h3 className="text-lg font-bold text-slate-900">Registered Medical Doctors & Nursing Staff ({staffRegistry.length})</h3>
              </div>
              <button onClick={() => setShowRegModal(true)} className="text-xs font-bold text-teal-700 hover:underline">+ Register New Resource</button>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
              {staffRegistry.map((staff) => (
                <div key={staff.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">{staff.name}</h4>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${staff.role === "doctor" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"}`}>
                      {staff.role.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-teal-700 font-medium">{staff.specialties.join(", ")}</p>
                  <p className="text-xs text-slate-500">ID: {staff.id} | Shift: {staff.shift}</p>
                </div>
              ))}
            </div>
          </section>

          {/* HOW CAREFLOW AI WORKS - FULL BOTTOM SECTION */}
          <section id="how-it-works" className="pt-8 border-t border-slate-200 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="rounded-full bg-teal-100 text-teal-800 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                System Guide & Workflow
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                How CareFlow AI Coordinates Emergency Care
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                CareFlow AI connects hospital emergency rooms, trauma specialists, head nurses, and family members through an intelligent real-time data pipeline.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
                <div className="h-8 w-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs">01</div>
                <h4 className="font-bold text-slate-900 text-sm">Emergency Intake & Triage</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Incoming accident cases are registered singly or via mass disaster simulation. Patients are triaged into Critical, Moderate, or Stable.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
                <div className="h-8 w-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-xs">02</div>
                <h4 className="font-bold text-slate-900 text-sm">Rapid Doctor Note Entry</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Doctors type rapid clinical checkup notes. They don't waste time filling dropdowns—just brief medical instructions.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
                <div className="h-8 w-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">03</div>
                <h4 className="font-bold text-slate-900 text-sm">AI Parsing & Nurse Review</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  AI extracts medications, surgery needs, dietary rules, and recovery estimates. The Head Nurse verifies and publishes the plan.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
                <div className="h-8 w-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">04</div>
                <h4 className="font-bold text-slate-900 text-sm">Live Family Tracking Feed</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Families log in securely using the Patient ID & Phone number to track exact checkup timestamps, active medication schedules, and diet plans.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="font-bold text-slate-900 text-base text-center">Core System Features for Visitors & Evaluators</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
                <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                  <h5 className="font-bold text-slate-900">1. Instant ICU & Bed Auto-Routing</h5>
                  <p className="text-slate-500 leading-relaxed">Critical trauma cases automatically get assigned ICU beds (`ICU-T`, `ICU-R`), preventing reception delays during emergency rush hours.</p>
                </div>
                <div className="space-y-1.5 border-l-2 border-amber-500 pl-3">
                  <h5 className="font-bold text-slate-900">2. Medical Specialty Matching</h5>
                  <p className="text-slate-500 leading-relaxed">The AI engine matches patient injury types with doctor specialties (*e.g., Head Trauma to Dr. Meera Shah*).</p>
                </div>
                <div className="space-y-1.5 border-l-2 border-blue-500 pl-3">
                  <h5 className="font-bold text-slate-900">3. Role-Based Security Access</h5>
                  <p className="text-slate-500 leading-relaxed">Doctors, Head Nurses, Staff Admins, and Family members each have strictly isolated workspaces.</p>
                </div>
                <div className="space-y-1.5 border-l-2 border-emerald-500 pl-3">
                  <h5 className="font-bold text-slate-900">4. Transparent Family Portal</h5>
                  <p className="text-slate-500 leading-relaxed">Eliminates information blackouts outside trauma rooms with real-time visibility.</p>
                </div>
                <div className="space-y-1.5 border-l-2 border-purple-500 pl-3">
                  <h5 className="font-bold text-slate-900">5. Mass Casualty Disaster Engine</h5>
                  <p className="text-slate-500 leading-relaxed">Simulates major accident events, generating structured trauma profiles simultaneously.</p>
                </div>
                <div className="space-y-1.5 border-l-2 border-slate-500 pl-3">
                  <h5 className="font-bold text-slate-900">6. Web & Mobile / Android Ready</h5>
                  <p className="text-slate-500 leading-relaxed">Fully responsive layout optimized for hospital command monitors, tablets, and smartphones.</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  if (authPortal === "doctor-login") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
        <form onSubmit={handleDoctorLogin} className="max-w-md w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-xl space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Doctor Portal Login</h2>
          <p className="text-xs text-slate-500">Type rapid checkup notes and dictate clinical orders.</p>
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-[11px] text-amber-800">
            <p className="font-semibold">Doctor Demo Credentials:</p>
            <p>Email: <code className="font-bold">doctor@careflow.ai</code> | Password: <code className="font-bold">doctor123</code></p>
          </div>
          {loginError && <p className="text-xs text-red-600 font-medium">{loginError}</p>}
          <input type="email" required value={doctorEmail} onChange={(e) => setDoctorEmail(e.target.value)} placeholder="doctor@careflow.ai" className="w-full rounded-xl border p-2.5 text-xs outline-none" />
          <input type="password" required value={doctorPassword} onChange={(e) => setDoctorPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-xl border p-2.5 text-xs outline-none" />
          <button type="submit" className="w-full rounded-xl bg-amber-600 py-3 text-xs font-semibold text-white shadow hover:bg-amber-700">Login as Doctor</button>
          <button type="button" onClick={() => setAuthPortal("landing")} className="w-full text-center text-xs text-slate-500 hover:underline pt-2">← Back to Hospital Home</button>
        </form>
      </div>
    );
  }

  if (authPortal === "nurse-login") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
        <form onSubmit={handleNurseLogin} className="max-w-md w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-xl space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Head Nurse / Nurse Portal</h2>
          <p className="text-xs text-slate-500">Process doctor notes, assign medications, dosage, and dietary plans.</p>
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 text-[11px] text-blue-800">
            <p className="font-semibold">Nurse Demo Credentials:</p>
            <p>Email: <code className="font-bold">nurse@careflow.ai</code> | Password: <code className="font-bold">nurse123</code></p>
          </div>
          {loginError && <p className="text-xs text-red-600 font-medium">{loginError}</p>}
          <input type="email" required value={nurseEmail} onChange={(e) => setNurseEmail(e.target.value)} placeholder="nurse@careflow.ai" className="w-full rounded-xl border p-2.5 text-xs outline-none" />
          <input type="password" required value={nursePassword} onChange={(e) => setNursePassword(e.target.value)} placeholder="••••••••" className="w-full rounded-xl border p-2.5 text-xs outline-none" />
          <button type="submit" className="w-full rounded-xl bg-blue-600 py-3 text-xs font-semibold text-white shadow hover:bg-blue-700">Login as Nurse</button>
          <button type="button" onClick={() => setAuthPortal("landing")} className="w-full text-center text-xs text-slate-500 hover:underline pt-2">← Back to Hospital Home</button>
        </form>
      </div>
    );
  }

  if (authPortal === "staff-login") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
        <form onSubmit={handleStaffLogin} className="max-w-md w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-xl space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Staff / Admin Login</h2>
          <p className="text-xs text-slate-500">Register patients, manage medical staff, and handle billing.</p>
          <div className="rounded-xl bg-teal-50 border border-teal-200 p-3 text-[11px] text-teal-800">
            <p className="font-semibold">Staff Demo Credentials:</p>
            <p>Email: <code className="font-bold">admin@careflow.ai</code> | Password: <code className="font-bold">admin123</code></p>
          </div>
          {loginError && <p className="text-xs text-red-600 font-medium">{loginError}</p>}
          <input type="email" required value={staffEmail} onChange={(e) => setStaffEmail(e.target.value)} placeholder="admin@careflow.ai" className="w-full rounded-xl border p-2.5 text-xs outline-none" />
          <input type="password" required value={staffPassword} onChange={(e) => setStaffPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-xl border p-2.5 text-xs outline-none" />
          <button type="submit" className="w-full rounded-xl bg-teal-600 py-3 text-xs font-semibold text-white shadow hover:bg-teal-700">Login as Admin</button>
          <button type="button" onClick={() => setAuthPortal("landing")} className="w-full text-center text-xs text-slate-500 hover:underline pt-2">← Back to Hospital Home</button>
        </form>
      </div>
    );
  }

  if (authPortal === "family-login") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
        <form onSubmit={handleFamilyLogin} className="max-w-md w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-xl space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Family Tracking Login</h2>
          <p className="text-xs text-slate-500">Enter Patient ID and contact number to view live medication, diet, and recovery timeline.</p>
          {patients.length === 0 && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-[11px] text-amber-800">
              Note: Register a patient first via Staff Portal or run Mass Casualty Simulation.
            </div>
          )}
          {loginError && <p className="text-xs text-red-600 font-medium">{loginError}</p>}
          <input type="text" required value={loginPatientId} onChange={(e) => setLoginPatientId(e.target.value)} placeholder="e.g. TR-2001 or CF-1001" className="w-full rounded-xl border p-2.5 text-xs outline-none" />
          <input type="text" required value={loginPhone} onChange={(e) => setLoginPhone(e.target.value)} placeholder="Registered Phone (+91 98000 1000)" className="w-full rounded-xl border p-2.5 text-xs outline-none" />
          <button type="submit" className="w-full rounded-xl bg-teal-600 py-3 text-xs font-semibold text-white shadow hover:bg-teal-700">Access Live Feed</button>
          <button type="button" onClick={() => setAuthPortal("landing")} className="w-full text-center text-xs text-slate-500 hover:underline pt-2">← Back to Hospital Home</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-teal-500 animate-pulse" />
            <div>
              <h1 className="text-base font-bold text-teal-800">CareFlow AI</h1>
              <p className="text-xs text-slate-500">
                Logged in Role: <span className="font-semibold text-teal-700 uppercase">{currentUserRole}</span>
              </p>
            </div>
          </div>
          <button onClick={() => { setAuthPortal("landing"); setFamilyPatientId(""); }} className="rounded-full border px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100">
            Logout / Return Home
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 sm:px-8 py-6">

        {currentUserRole === "doctor" && (
          <section className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-amber-900">Doctor Clinical Checkup Entry</h2>
            <p className="text-xs text-amber-700">Select a patient below and type your clinical notes. AI & Nurses will parse medications, diet, and recovery estimates automatically.</p>
            {selectedPatient ? (
              <form onSubmit={handleDoctorSubmitNote} className="space-y-3 bg-white p-4 rounded-xl border border-amber-200">
                <p className="font-bold text-xs text-slate-900">Selected Patient: <span className="text-teal-700">{selectedPatient.name} ({selectedPatient.id})</span></p>
                <textarea
                  required
                  rows={3}
                  value={doctorNoteInput}
                  onChange={(e) => setDoctorNoteInput(e.target.value)}
                  placeholder="e.g. Patient has compound tibia fracture. Prep for surgery at 3 PM. Prescribe IV Cefazolin 1g, NPO fasting diet until OR..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs outline-none focus:border-amber-500"
                />
                <button type="submit" className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-700 shadow">
                  Submit Note to Head Nurse & AI Parser ➔
                </button>
              </form>
            ) : (
              <p className="text-xs text-slate-500 italic">Select a patient from the directory below to write a note.</p>
            )}
          </section>
        )}

        {currentUserRole === "nurse" && (
          <section className="rounded-2xl border border-blue-200 bg-blue-50/70 p-5 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-blue-900">Head Nurse Verification & Order Formatting</h2>
            <p className="text-xs text-blue-700">Review doctor notes and finalize medical orders for patient timeline visibility.</p>

            {selectedPatient && selectedPatient.checkupHistory.length > 0 ? (
              <form onSubmit={handleNurseFinalizeCheckup} className="space-y-3 bg-white p-4 rounded-xl border border-blue-200 text-xs">
                <div className="bg-slate-50 p-3 rounded-lg border">
                  <p className="font-bold text-slate-800">Latest Doctor Note for {selectedPatient.name}:</p>
                  <p className="italic text-slate-600 mt-1">"{selectedPatient.checkupHistory[0].rawNote}"</p>
                  <p className="text-[10px] text-slate-400 mt-1">Logged by {selectedPatient.checkupHistory[0].doctorName} at {selectedPatient.checkupHistory[0].timestamp}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700">Confirmed Diagnosis</label>
                    <input type="text" value={nurseDiagnosis} onChange={(e) => setNurseDiagnosis(e.target.value)} className="w-full rounded-lg border p-2 mt-1 outline-none" />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Surgery / Operation Needed</label>
                    <select value={nurseSurgery} onChange={(e) => setNurseSurgery(e.target.value)} className="w-full rounded-lg border p-2 mt-1 outline-none">
                      <option value="None">None Required</option>
                      <option value="Required — Immediate Prep">Required — Immediate Prep</option>
                      <option value="Scheduled for Later">Scheduled for Later</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Medications Assigned</label>
                    <input type="text" value={nurseMeds} onChange={(e) => setNurseMeds(e.target.value)} className="w-full rounded-lg border p-2 mt-1 outline-none" />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Dosage & Timing</label>
                    <input type="text" value={nurseDosage} onChange={(e) => setNurseDosage(e.target.value)} className="w-full rounded-lg border p-2 mt-1 outline-none" />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Dietary & Food Guidelines</label>
                    <input type="text" value={nurseDiet} onChange={(e) => setNurseDiet(e.target.value)} className="w-full rounded-lg border p-2 mt-1 outline-none" />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Estimated Recovery Time</label>
                    <input type="text" value={nurseRecovery} onChange={(e) => setNurseRecovery(e.target.value)} className="w-full rounded-lg border p-2 mt-1 outline-none" />
                  </div>
                </div>

                <button type="submit" className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow">
                  Finalize & Post Care Plan to Patient Timeline ➔
                </button>
              </form>
            ) : (
              <p className="text-xs text-slate-500 italic">Select a patient with doctor checkup notes to verify orders.</p>
            )}
          </section>
        )}

        {currentUserRole === "admin" && (
          <section className="rounded-2xl border border-teal-200 bg-teal-50/70 p-5 shadow-sm space-y-2">
            <h2 className="text-sm font-bold text-teal-900">Hospital Command Center (Admin View)</h2>
            {selectedPatient ? (
              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-teal-200 text-xs">
                <p className="font-bold text-slate-900">{selectedPatient.name} — Bed: {selectedPatient.bed} ({selectedPatient.payment})</p>
                <button onClick={() => handleTogglePayment(selectedPatient.id)} className="rounded-xl bg-slate-800 px-3 py-1.5 text-xs text-white hover:bg-slate-700">
                  Toggle Billing Status
                </button>
              </div>
            ) : null}
          </section>
        )}

        <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-600 flex items-center gap-2 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-teal-500" />
          <span className="truncate">{notification}</span>
        </div>

        <section className="grid gap-6 grid-cols-1 lg:grid-cols-[1fr_1.2fr]">
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
                No active records found. Register a patient via Staff Portal or run Mass Casualty Simulation.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[420px] overflow-y-auto">
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
                      <span>Bed: {p.bed}</span>
                      <span>{p.checkupHistory.length} Checkups</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Patient Live Care Journey</p>
            {selectedPatient ? (
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{selectedPatient.name}</h2>
                    <p className="text-xs text-slate-500">ID: {selectedPatient.id} | Bed: {selectedPatient.bed}</p>
                  </div>
                  <span className="rounded-full bg-teal-50 border border-teal-200 px-3 py-1 text-xs font-semibold text-teal-800">
                    {selectedPatient.hospital}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-slate-50 p-2 border">
                    <p className="text-slate-400">Assigned Doctor</p>
                    <p className="font-semibold text-slate-800 mt-0.5">{selectedPatient.doctor}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2 border">
                    <p className="text-slate-400">Assigned Nurse</p>
                    <p className="font-semibold text-slate-800 mt-0.5">{selectedPatient.assignedNurse}</p>
                  </div>
                </div>

                {selectedPatient.checkupHistory.length > 0 && selectedPatient.checkupHistory[0].diagnosis !== "Pending Nurse Final Verification" ? (
                  <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-4 space-y-2 text-xs">
                    <p className="font-bold text-teal-900 uppercase tracking-wider text-[11px]">Active Medical Plan & Instructions</p>
                    <div className="grid grid-cols-2 gap-2 text-slate-700">
                      <div><span className="font-semibold">Operation/Surgery:</span> {selectedPatient.checkupHistory[0].surgeryNeeded}</div>
                      <div><span className="font-semibold">Est. Recovery:</span> {selectedPatient.checkupHistory[0].estimatedRecovery}</div>
                      <div><span className="font-semibold">Medications:</span> {selectedPatient.checkupHistory[0].medications}</div>
                      <div><span className="font-semibold">Dosage Schedule:</span> {selectedPatient.checkupHistory[0].dosageInstructions}</div>
                      <div className="col-span-2"><span className="font-semibold">Food / Dietary Instructions:</span> {selectedPatient.checkupHistory[0].dietaryPlan}</div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                    Patient checkup is in progress. Details will appear once verified by the nursing team.
                  </div>
                )}

                <div>
                  <p className="text-xs font-semibold text-slate-700 mb-2">Care Timeline Progress</p>
                  <div className="space-y-1">
                    {stages.map((step, idx) => {
                      const isActive = idx <= (stageIndex >= 0 ? stageIndex : 0);
                      return (
                        <div key={step} className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-xs border ${isActive ? "border-teal-200 bg-teal-50/80 text-teal-900 font-medium" : "border-slate-100 bg-slate-50 text-slate-400"}`}>
                          <span>{step}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] ${isActive ? "bg-teal-600 text-white font-bold" : "bg-slate-200 text-slate-500"}`}>
                            {isActive ? "Passed" : "Queued"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t">
                  <p className="text-xs font-bold text-slate-800">Checkup History Logs ({selectedPatient.checkupHistory.length})</p>
                  {selectedPatient.checkupHistory.map((chk) => (
                    <div key={chk.id} className="rounded-lg border p-2.5 text-xs space-y-1 bg-slate-50">
                      <div className="flex justify-between font-semibold text-slate-700">
                        <span>Checkup at {chk.timestamp}</span>
                        <span>{chk.doctorName}</span>
                      </div>
                      <p className="text-slate-600 italic">"{chk.rawNote}"</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-dashed p-12 text-center text-slate-400 text-xs">
                No patient selected or available.
              </div>
            )}
          </div>
        </section>

        {currentUserRole === "admin" && (
          <section className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <form onSubmit={handleSingleIntake} className="rounded-2xl border bg-white p-5 shadow-sm space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Patient Registration</p>
              <h2 className="text-base font-bold text-slate-900">Single Intake</h2>
              <input type="text" required value={newPatientName} onChange={(e) => setNewPatientName(e.target.value)} placeholder="Patient Name" className="w-full rounded-xl border p-2 text-xs outline-none" />
              <div className="grid grid-cols-2 gap-2">
                <select value={newPatientSeverity} onChange={(e) => setNewPatientSeverity(e.target.value as Severity)} className="rounded-xl border p-2 text-xs outline-none">
                  <option value="Critical">Critical</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Stable">Stable</option>
                </select>
                <input type="text" value={newPatientContact} onChange={(e) => setNewPatientContact(e.target.value)} placeholder="Contact (+91...)" className="rounded-xl border p-2 text-xs outline-none" />
              </div>
              <button type="submit" className="w-full rounded-xl bg-teal-600 py-2.5 text-xs font-semibold text-white hover:bg-teal-700">Register Patient</button>
            </form>

            <form onSubmit={handleMassIntake} className="rounded-2xl border bg-white p-5 shadow-sm space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Simulation Engine</p>
              <h2 className="text-base font-bold text-slate-900">Mass Casualty Trauma Intake</h2>
              <input type="number" min="1" max="50" value={incidentCount} onChange={(e) => setIncidentCount(Number(e.target.value))} className="w-full rounded-xl border p-2 text-xs outline-none" />
              <button type="submit" className="w-full rounded-xl border border-teal-300 bg-teal-50 py-2.5 text-xs font-semibold text-teal-800 hover:bg-teal-100">Batch Disaster Simulation</button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}
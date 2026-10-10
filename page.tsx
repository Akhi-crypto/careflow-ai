"use client";

import React, { useState } from "react";
import {
  Activity,
  AlertTriangle,
  ShieldCheck,
  FileText,
  UserPlus,
  Stethoscope,
  Heart,
  Users,
  Clock,
  CheckCircle,
  Smartphone,
  Monitor,
  Send,
  Plus,
  RefreshCw,
  Search,
  Check,
  X,
  Sparkles,
  Zap,
  Building,
  UserCheck,
  AlertCircle
} from "lucide-react";

// --- TYPES & DATA INTERFACES ---
interface StaffMember {
  id: string;
  name: string;
  role: "DOCTOR" | "NURSE" | "ADMIN";
  spec: string;
  shift: string;
  status: "Available" | "In Surgery" | "On Call";
}

interface DoctorNote {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  rawDictation: string;
  timestamp: string;
  parsedData: {
    diagnosis: string;
    medications: { name: string; dosage: string; frequency: string }[];
    dietary: string;
    followUp: string;
    urgency: "Routine" | "Urgent" | "Critical";
  };
  nurseVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
}

interface CasualtyPatient {
  id: string;
  triageTag: "Red" | "Yellow" | "Green" | "Black";
  age: number;
  gender: string;
  injury: string;
  vitals: string;
  assignedBed: string;
  status: "Incoming" | "In Triage" | "Stabilized" | "ICU Transfer";
}

export default function CareFlowApp() {
  // --- STATE MANAGEMENT ---
  const [activeRole, setActiveRole] = useState<"DOCTOR" | "NURSE" | "FAMILY" | "ADMIN">("DOCTOR");
  const [activeTab, setActiveTab] = useState<"dashboard" | "dictation" | "verification" | "staff" | "simulation" | "family">("dashboard");

  // Staff Registry State
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    { id: "DOC-01", name: "Dr. Meera Shah", role: "DOCTOR", spec: "Trauma Head, Emergency Surgery", shift: "24/7 Trauma Command", status: "Available" },
    { id: "DOC-02", name: "Dr. Karan Verma", role: "DOCTOR", spec: "Critical Care, Pulmonology", shift: "ICU Unit 1", status: "In Surgery" },
    { id: "DOC-03", name: "Dr. Rajesh Kadam", role: "DOCTOR", spec: "Orthopedics, Emergency Triage", shift: "Ambulance Response", status: "Available" },
    { id: "NRS-01", name: "Head Nurse Ananya Roy", role: "NURSE", spec: "ICU Lead, Trauma Triage", shift: "Day Shift", status: "Available" },
    { id: "NRS-02", name: "Nurse Priya Sharma", role: "NURSE", spec: "Post-Op Care, Medication Admin", shift: "Evening Shift", status: "Available" },
  ]);

  const [newStaff, setNewStaff] = useState({ name: "", role: "DOCTOR" as "DOCTOR" | "NURSE" | "ADMIN", spec: "", shift: "Day Shift" });
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);

  // Doctor Notes & AI Parsing State
  const [notes, setNotes] = useState<DoctorNote[]>([
    {
      id: "NOTE-101",
      patientName: "Aarav Mehta",
      patientId: "PAT-8821",
      doctorName: "Dr. Meera Shah",
      rawDictation: "Patient presented with acute chest pain and dyspnea. Administered IV Sublingual Nitroglycerin 0.4mg. EKG indicates minor ST elevation. Prescribe Aspirin 75mg daily, low-sodium cardiac diet. Re-evaluate in 4 hours.",
      timestamp: "10:15 AM - Today",
      parsedData: {
        diagnosis: "Acute Coronary Syndrome (Rule out MI)",
        medications: [
          { name: "Aspirin", dosage: "75mg", frequency: "Daily" },
          { name: "Sublingual Nitroglycerin", dosage: "0.4mg", frequency: "STAT/PRN" }
        ],
        dietary: "Low-sodium, Cardiac Restrictive",
        followUp: "Re-evaluate EKG & Trop-I in 4 hours",
        urgency: "Critical"
      },
      nurseVerified: true,
      verifiedBy: "Head Nurse Ananya Roy",
      verifiedAt: "10:22 AM"
    },
    {
      id: "NOTE-102",
      patientName: "Siddharth Rao",
      patientId: "PAT-8824",
      doctorName: "Dr. Rajesh Kadam",
      rawDictation: "Closed fracture right tibia post motorcycle fall. Reduced under local block. Applied fiberglass cast. Prescribe Paracetamol 650mg TDS, Ibuprofen 400mg BD post meals. Soft diet, strict leg elevation.",
      timestamp: "11:30 AM - Today",
      parsedData: {
        diagnosis: "Closed Fracture Right Tibia",
        medications: [
          { name: "Paracetamol", dosage: "650mg", frequency: "TDS (Thrice daily)" },
          { name: "Ibuprofen", dosage: "400mg", frequency: "BD (Twice daily post meals)" }
        ],
        dietary: "Regular Soft Diet, High Hydration",
        followUp: "X-Ray alignment check in 24 hours",
        urgency: "Urgent"
      },
      nurseVerified: false
    }
  ]);

  // Dictation Form Input State
  const [inputPatientName, setInputPatientName] = useState("");
  const [inputPatientId, setInputPatientId] = useState("");
  const [inputDictation, setInputDictation] = useState("");
  const [isAiParsing, setIsAiParsing] = useState(false);

  // Mass Casualty Simulation State
  const [simulationActive, setSimulationActive] = useState(false);
  const [casualtyList, setCasualtyList] = useState<CasualtyPatient[]>([]);

  // --- HANDLERS & ACTIONS ---
  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.spec) return;
    const created: StaffMember = {
      id: `${newStaff.role.substring(0, 3)}-0${staffMembers.length + 1}`,
      name: newStaff.name,
      role: newStaff.role,
      spec: newStaff.spec,
      shift: newStaff.shift,
      status: "Available"
    };
    setStaffMembers([...staffMembers, created]);
    setNewStaff({ name: "", role: "DOCTOR", spec: "", shift: "Day Shift" });
    setShowAddStaffModal(false);
  };

  const handleSimulateAiDictation = () => {
    if (!inputPatientName || !inputDictation) return;
    setIsAiParsing(true);

    setTimeout(() => {
      const newNote: DoctorNote = {
        id: `NOTE-${Math.floor(100 + Math.random() * 900)}`,
        patientName: inputPatientName,
        patientId: inputPatientId || `PAT-${Math.floor(1000 + Math.random() * 9000)}`,
        doctorName: "Dr. Meera Shah",
        rawDictation: inputDictation,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        parsedData: {
          diagnosis: "Extracted: Emergency Clinical Presentation",
          medications: [
            { name: "Parsed Drug A", dosage: "500mg", frequency: "Twice daily" },
            { name: "Parsed Drug B", dosage: "10mg", frequency: "STAT" }
          ],
          dietary: "Fluid restriction, Light meal plan",
          followUp: "Routine vital monitoring every 2 hours",
          urgency: inputDictation.toLowerCase().includes("severe") || inputDictation.toLowerCase().includes("bleed") ? "Critical" : "Urgent"
        },
        nurseVerified: false
      };

      setNotes([newNote, ...notes]);
      setIsAiParsing(false);
      setInputPatientName("");
      setInputPatientId("");
      setInputDictation("");
      setActiveTab("verification");
    }, 1200);
  };

  const handleVerifyNote = (noteId: string) => {
    setNotes(notes.map(n => n.id === noteId ? {
      ...n,
      nurseVerified: true,
      verifiedBy: "Head Nurse Ananya Roy",
      verifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } : n));
  };

  const triggerMassCasualtySimulation = () => {
    setSimulationActive(true);
    const mockCasualties: CasualtyPatient[] = [
      { id: "CAS-01", triageTag: "Red", age: 34, gender: "Male", injury: "Blunt force trauma, internal bleeding", vitals: "BP 85/50, HR 130", assignedBed: "Trauma Bay 1", status: "Incoming" },
      { id: "CAS-02", triageTag: "Red", age: 28, gender: "Female", injury: "Severe inhalation burns, hypoxia", vitals: "SpO2 82%, HR 142", assignedBed: "ICU Bed 3", status: "Incoming" },
      { id: "CAS-03", triageTag: "Yellow", age: 45, gender: "Male", injury: "Fractured femur, stable vitals", vitals: "BP 120/80, HR 88", assignedBed: "ER Bed 08", status: "In Triage" },
      { id: "CAS-04", triageTag: "Yellow", age: 52, gender: "Female", injury: "Deep lacerations, moderate blood loss", vitals: "BP 110/70, HR 95", assignedBed: "ER Bed 12", status: "In Triage" },
      { id: "CAS-05", triageTag: "Green", age: 22, gender: "Male", injury: "Minor contusions, superficial abrasions", vitals: "BP 118/75, HR 76", assignedBed: "Waiting Wing B", status: "Stabilized" },
    ];
    setCasualtyList(mockCasualties);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* TOP RESPONSIVE HEADER - Stacks on mobile (9:16), expands on laptop (16:9) */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/90 border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-tr from-cyan-500 to-blue-600 p-2 rounded-xl text-white shadow-lg shadow-cyan-500/20">
                <Activity className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
                  CareFlow AI
                </h1>
                <p className="text-[10px] text-slate-400 font-medium">Hospital Orchestration & Safety Platform</p>
              </div>
            </div>

            {/* Mobile View Screen Indicator */}
            <div className="sm:hidden flex items-center gap-1 text-[10px] bg-slate-800 text-cyan-400 px-2 py-1 rounded border border-slate-700">
              <Smartphone className="w-3 h-3" /> Mobile View
            </div>
          </div>

          {/* ROLE SWITCHER TOOLBAR */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs w-full sm:w-auto justify-center">
            <button
              onClick={() => setActiveRole("DOCTOR")}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${activeRole === "DOCTOR" ? "bg-cyan-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"}`}
            >
              <Stethoscope className="w-3.5 h-3.5" /> Doctor
            </button>
            <button
              onClick={() => setActiveRole("NURSE")}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${activeRole === "NURSE" ? "bg-emerald-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"}`}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Nurse
            </button>
            <button
              onClick={() => setActiveRole("FAMILY")}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${activeRole === "FAMILY" ? "bg-rose-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"}`}
            >
              <Heart className="w-3.5 h-3.5" /> Family
            </button>
            <button
              onClick={() => setActiveRole("ADMIN")}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${activeRole === "ADMIN" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"}`}
            >
              <Building className="w-3.5 h-3.5" /> Admin
            </button>
          </div>
        </div>

        {/* PRIMARY NAVIGATION TABS */}
        <nav className="max-w-7xl mx-auto mt-3 pt-2 border-t border-slate-800/60 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition ${activeTab === "dashboard" ? "bg-slate-800 text-cyan-400 font-semibold" : "text-slate-400 hover:bg-slate-800/50"}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("dictation")}
            className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition ${activeTab === "dictation" ? "bg-slate-800 text-cyan-400 font-semibold" : "text-slate-400 hover:bg-slate-800/50"}`}
          >
            Doctor Dictation
          </button>
          <button
            onClick={() => setActiveTab("verification")}
            className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition relative ${activeTab === "verification" ? "bg-slate-800 text-emerald-400 font-semibold" : "text-slate-400 hover:bg-slate-800/50"}`}
          >
            Nurse Verification
            {notes.filter(n => !n.nurseVerified).length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 bg-amber-500 text-slate-950 font-bold text-[10px] rounded-full">
                {notes.filter(n => !n.nurseVerified).length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("staff")}
            className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition ${activeTab === "staff" ? "bg-slate-800 text-cyan-400 font-semibold" : "text-slate-400 hover:bg-slate-800/50"}`}
          >
            Staff Registry
          </button>
          <button
            onClick={() => setActiveTab("simulation")}
            className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition ${activeTab === "simulation" ? "bg-rose-950/60 text-rose-400 border border-rose-800/50 font-semibold" : "text-slate-400 hover:bg-slate-800/50"}`}
          >
            <AlertTriangle className="w-3.5 h-3.5 inline mr-1" /> Mass Casualty
          </button>
          <button
            onClick={() => setActiveTab("family")}
            className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition ${activeTab === "family" ? "bg-slate-800 text-rose-400 font-semibold" : "text-slate-400 hover:bg-slate-800/50"}`}
          >
            Family Portal
          </button>
        </nav>
      </header>

      {/* MAIN CONTAINER - Adaptive Grid for Widescreen (16:9) & Single Column for Mobile (9:16) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">

        {/* 1. OVERVIEW DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* HERO BANNER */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950 border border-slate-800 p-6 sm:p-10 shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 space-y-4 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Next-Gen Emergency Healthcare Orchestration
                </div>
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  Rapid Doctor Dictation <span className="text-slate-500">|</span> AI Medical Parsing <span className="text-slate-500">|</span> Live Family Peace of Mind
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  CareFlow AI eliminates critical handoff errors in trauma units. Doctors dictate unstructured notes, AI structures the medical directives, head nurses verify safety, and families receive clear real-time updates.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => setActiveTab("dictation")}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 transition text-center"
                  >
                    Start Doctor Dictation
                  </button>
                  <button 
                    onClick={() => setActiveTab("verification")}
                    className="px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm transition text-center"
                  >
                    Nurse Verification Portal ({notes.filter(n => !n.nurseVerified).length} Pending)
                  </button>
                </div>
              </div>
            </section>

            {/* METRICS & QUICK STATS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                <span className="text-xs text-slate-400">Registered Staff</span>
                <p className="text-2xl font-bold text-white mt-1">{staffMembers.length}</p>
                <span className="text-[10px] text-emerald-400 font-medium mt-1 inline-block">● All Shifts Active</span>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                <span className="text-xs text-slate-400">Pending Verification</span>
                <p className="text-2xl font-bold text-amber-400 mt-1">{notes.filter(n => !n.nurseVerified).length}</p>
                <span className="text-[10px] text-amber-400/80 font-medium mt-1 inline-block">Requires Nurse Review</span>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                <span className="text-xs text-slate-400">Verified Charts</span>
                <p className="text-2xl font-bold text-emerald-400 mt-1">{notes.filter(n => n.nurseVerified).length}</p>
                <span className="text-[10px] text-emerald-400/80 font-medium mt-1 inline-block">Synced to Family Portal</span>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                <span className="text-xs text-slate-400">Emergency Status</span>
                <p className="text-2xl font-bold text-rose-400 mt-1">{simulationActive ? "MASS CASUALTY" : "NORMAL"}</p>
                <span className="text-[10px] text-slate-400 font-medium mt-1 inline-block">Triage Command Ready</span>
              </div>
            </div>

            {/* FEATURE HIGHLIGHT CARDS (3-cols laptop, 1-col mobile) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/40 transition">
                <Stethoscope className="w-8 h-8 text-cyan-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">1. Doctor Dictation</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Type or dictate raw clinical checkup observations. Natural language AI extracts medications, dosages, and dietary schedules automatically.
                </p>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/40 transition">
                <ShieldCheck className="w-8 h-8 text-emerald-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">2. Nurse Verification Layer</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Safety guardrail. Head nurses review AI-parsed dosages and instructions before committing them to live patient records.
                </p>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-rose-500/40 transition">
                <Heart className="w-8 h-8 text-rose-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">3. Family Portal Sync</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Translates technical medical jargon into empathetic, plain-language recovery timelines and diet advice for patient relatives.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* 2. DOCTOR DICTATION MODULE */}
        {activeTab === "dictation" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div>
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Clinical Input</span>
                <h3 className="text-xl font-bold text-white mt-1">Rapid Checkup Dictation</h3>
                <p className="text-xs text-slate-400">Type raw observations during patient rounds. The AI engine will parse structure and dosages.</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Patient Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Aarav Mehta"
                      value={inputPatientName}
                      onChange={(e) => setInputPatientName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Patient ID (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. PAT-9012"
                      value={inputPatientId}
                      onChange={(e) => setInputPatientId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Raw Doctor Dictation / Clinical Notes</label>
                  <textarea
                    rows={5}
                    placeholder="Type notes here... e.g., 'Patient has severe abdominal pain. Prescribe Paracetamol 650mg TDS and IV Fluids. Low oil diet. Schedule ultrasound tomorrow morning.'"
                    value={inputDictation}
                    onChange={(e) => setInputDictation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-cyan-500 transition resize-none"
                  />
                </div>

                <button
                  onClick={handleSimulateAiDictation}
                  disabled={isAiParsing || !inputPatientName || !inputDictation}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2"
                >
                  {isAiParsing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> AI Parsing Clinical Notes...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Parse & Route to Nurse Verification
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* RECENT DICTATION FEED */}
            <div className="lg:col-span-5 space-y-4">
              <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Recent Dictations ({notes.length})</h4>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                {notes.map((note) => (
                  <div key={note.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{note.patientName} <span className="text-slate-500 font-mono">({note.patientId})</span></span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${note.nurseVerified ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"}`}>
                        {note.nurseVerified ? "Verified" : "Pending Nurse Review"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 italic line-clamp-2">"{note.rawDictation}"</p>
                    <div className="text-[10px] text-slate-500 flex justify-between pt-2 border-t border-slate-800/60">
                      <span>By: {note.doctorName}</span>
                      <span>{note.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. NURSE VERIFICATION MODULE */}
        {activeTab === "verification" && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Safety Control</span>
              <h3 className="text-xl font-bold text-white mt-1">Head Nurse Verification Queue</h3>
              <p className="text-xs text-slate-400">Review AI-extracted medication dosages and treatment plans before updating live patient charts.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {notes.map((note) => (
                <div key={note.id} className={`bg-slate-900/80 border rounded-2xl p-6 space-y-5 relative ${note.nurseVerified ? "border-slate-800" : "border-amber-500/40 shadow-lg shadow-amber-500/5"}`}>
                  
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-bold text-white">{note.patientName}</h4>
                        <span className="text-xs text-slate-500 font-mono">({note.patientId})</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">Dictated by {note.doctorName} • {note.timestamp}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${note.parsedData.urgency === "Critical" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"}`}>
                      {note.parsedData.urgency}
                    </span>
                  </div>

                  <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-800/80">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Raw Doctor Dictation</span>
                    <p className="text-xs text-slate-300 italic">"{note.rawDictation}"</p>
                  </div>

                  {/* AI PARSED DATA BREAKDOWN */}
                  <div className="space-y-3 bg-slate-950/40 rounded-xl p-4 border border-slate-800/60">
                    <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> AI Parsed Medical Directives
                    </span>

                    <div>
                      <span className="text-[11px] font-semibold text-slate-400">Primary Diagnosis:</span>
                      <p className="text-xs text-white font-medium">{note.parsedData.diagnosis}</p>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-slate-400">Prescribed Medications:</span>
                      <div className="mt-1 space-y-1">
                        {note.parsedData.medications.map((med, idx) => (
                          <div key={idx} className="text-xs bg-slate-900 px-3 py-1.5 rounded border border-slate-800 flex justify-between items-center">
                            <span className="text-white font-medium">{med.name} ({med.dosage})</span>
                            <span className="text-cyan-400 font-mono text-[11px]">{med.frequency}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Dietary Instructions</span>
                        <span className="text-slate-300">{note.parsedData.dietary}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Follow-up Plan</span>
                        <span className="text-slate-300">{note.parsedData.followUp}</span>
                      </div>
                    </div>
                  </div>

                  {/* VERIFICATION ACTION */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                    {note.nurseVerified ? (
                      <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                        <CheckCircle className="w-4 h-4" /> Verified by {note.verifiedBy} at {note.verifiedAt}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleVerifyNote(note.id)}
                        className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                      >
                        <Check className="w-4 h-4" /> Verify & Authorize Patient Plan
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. STAFF REGISTRY MODULE */}
        {activeTab === "staff" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Resource Management</span>
                <h3 className="text-xl font-bold text-white mt-1">Hospital Doctors & Nursing Staff ({staffMembers.length})</h3>
              </div>
              <button
                onClick={() => setShowAddStaffModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition"
              >
                <UserPlus className="w-4 h-4" /> Register New Medical Staff
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {staffMembers.map((staff) => (
                <div key={staff.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${staff.role === "DOCTOR" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"}`}>
                      {staff.role}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">ID: {staff.id}</span>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">{staff.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{staff.spec}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {staff.shift}</span>
                    <span className={`font-semibold ${staff.status === "Available" ? "text-emerald-400" : "text-amber-400"}`}>● {staff.status}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* ADD STAFF MODAL */}
            {showAddStaffModal && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-white">Register Medical Resource</h4>
                    <button onClick={() => setShowAddStaffModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                  </div>

                  <form onSubmit={handleAddStaff} className="space-y-4">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Dr. / Nurse Full Name"
                        value={newStaff.name}
                        onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Role</label>
                      <select
                        value={newStaff.role}
                        onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value as any })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="DOCTOR">DOCTOR</option>
                        <option value="NURSE">NURSE</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Specialization / Department</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Critical Care, Trauma Surgery"
                        value={newStaff.spec}
                        onChange={(e) => setNewStaff({ ...newStaff, spec: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div className="pt-2 flex gap-3">
                      <button type="button" onClick={() => setShowAddStaffModal(false)} className="w-1/2 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">Cancel</button>
                      <button type="submit" className="w-1/2 py-2.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold">Register Staff</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 5. MASS CASUALTY SIMULATION MODULE */}
        {activeTab === "simulation" && (
          <div className="space-y-6">
            <div className="bg-rose-950/30 border border-rose-900/50 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 animate-bounce" /> Emergency Trauma Command
                </span>
                <h3 className="text-xl font-bold text-white mt-1">Mass Casualty Incident Engine</h3>
                <p className="text-xs text-slate-400">Simulate rapid triage protocol during multi-patient emergency influxes.</p>
              </div>

              <button
                onClick={triggerMassCasualtySimulation}
                className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition shadow-lg shadow-rose-600/20"
              >
                {simulationActive ? "Re-trigger Influx Simulation" : "Trigger Mass Casualty Influx"}
              </button>
            </div>

            {simulationActive ? (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-300">Live Triage Patient Stream ({casualtyList.length} Influx)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {casualtyList.map((patient) => (
                    <div key={patient.id} className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          patient.triageTag === "Red" ? "bg-rose-500/20 text-rose-400 border-rose-500/40" :
                          patient.triageTag === "Yellow" ? "bg-amber-500/20 text-amber-400 border-amber-500/40" :
                          "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                        }`}>
                          Triage Tag: {patient.triageTag}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">{patient.id}</span>
                      </div>

                      <div>
                        <h5 className="text-sm font-bold text-white">{patient.gender}, {patient.age} yrs</h5>
                        <p className="text-xs text-slate-300 mt-1"><span className="text-slate-500">Injury:</span> {patient.injury}</p>
                        <p className="text-xs text-cyan-400 mt-0.5"><span className="text-slate-500">Vitals:</span> {patient.vitals}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                        <span>Bed: <strong className="text-white">{patient.assignedBed}</strong></span>
                        <span className="text-emerald-400 font-medium">{patient.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-900/40 border border-slate-800/60 rounded-2xl">
                <AlertCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h4 className="text-base font-bold text-slate-300">Simulation Idle</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">Click the button above to test automated triage allocation and casualty capacity management.</p>
              </div>
            )}
          </div>
        )}

        {/* 6. FAMILY PORTAL MODULE */}
        {activeTab === "family" && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Patient Relative Portal</span>
              <h3 className="text-xl font-bold text-white mt-1">Live Recovery & Care Progress</h3>
              <p className="text-xs text-slate-400">Transparent, plain-language clinical updates for family members.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {notes.filter(n => n.nurseVerified).map((note) => (
                <div key={note.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="text-lg font-bold text-white">{note.patientName}</h4>
                      <p className="text-xs text-slate-400">Attending: {note.doctorName}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                      Verified Safe Plan
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-xs font-semibold text-slate-400 block mb-1">Condition Status:</span>
                      <p className="text-xs bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-200">
                        {note.parsedData.diagnosis}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-slate-400 block mb-1">Medication Schedule:</span>
                      <ul className="text-xs space-y-1">
                        {note.parsedData.medications.map((m, i) => (
                          <li key={i} className="text-slate-300 bg-slate-950/60 px-3 py-1.5 rounded border border-slate-800/80 flex justify-between">
                            <span>{m.name}</span>
                            <span className="text-cyan-400 font-medium">{m.frequency}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-rose-950/20 border border-rose-900/30 rounded-xl p-3 text-xs text-rose-200">
                      <span className="font-bold block mb-0.5">Dietary & Rest Plan:</span>
                      {note.parsedData.dietary}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 mt-16 py-8 text-center text-xs text-slate-500 space-y-2">
        <div className="flex items-center justify-center gap-4 text-slate-400">
          <span className="flex items-center gap-1"><Monitor className="w-3.5 h-3.5" /> Widescreen Desktop (16:9)</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Smartphone className="w-3.5 h-3.5" /> Mobile Vertical (9:16)</span>
        </div>
        <p>© 2026 CareFlow AI Hospital Orchestration Platform. All rights reserved.</p>
      </footer>

    </div>
  );
}
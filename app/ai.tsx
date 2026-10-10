"use client";

import { useMemo, useState } from "react";

type Role = "family" | "doctor" | "admin";

type Patient = {
  id: string;
  name: string;
  severity: "Critical" | "Moderate" | "Stable";
  stage: string;
  hospital: string;
  doctor: string;
  bed: string;
  payment: string;
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

const roleConfig = {
  family: {
    title: "Family Tracking Portal",
    badge: "Live updates for loved ones",
    description: "Family members can follow the journey using a secure patient ID.",
  },
  doctor: {
    title: "Doctor Coordination View",
    badge: "Priority clinical assignment",
    description: "Doctors see triage urgency, pending tasks, and assigned patients.",
  },
  admin: {
    title: "Hospital Command Center",
    badge: "Bed clearance and dispatch control",
    description: "Admins manage resources, beds, ambulance queues, and billing visibility.",
  },
} as const;

const initialPatients: Patient[] = [
  {
    id: "CF-1001",
    name: "Arya deshpande",
    severity: "Critical",
    stage: "Bed assigned",
    hospital: "City General Hospital",
    doctor: "Dr. Meera Shah",
    bed: "ICU-07",
    payment: "Pending",
    contact: "+91 98765 43210",
  },
  {
    id: "CF-1002",
    name: "Nisha Rao",
    severity: "Moderate",
    stage: "Labs in progress",
    hospital: "City General Hospital",
    doctor: "Dr. Karan Verma",
    bed: "Ward-12",
    payment: "Partial",
    contact: "+91 91234 56789",
  },
  {
    id: "CF-1003",
    name: "Rohan Das",
    severity: "Stable",
    stage: "Bed assigned",
    hospital: "City General Hospital",
    doctor: "Dr. Priya Nair",
    bed: "Observation-03",
    payment: "Completed",
    contact: "+91 99887 66554",
  },
];

const highlights = [
  {
    title: "Mass-casualty intake",
    description: "The system can intake a large accident event, generate unique patient IDs, and trigger immediate coordination.",
  },
  {
    title: "Bed clearance prediction",
    description: "AI flags likely evening or next-day discharges so beds can be freed before incoming emergencies arrive.",
  },
  {
    title: "Transparent patient journey",
    description: "Families, doctors, and admins can view the same live status from incident to discharge.",
  },
  {
    title: "Secure identity control",
    description: "Every patient receives a unique ID and role-based access so records stay protected and separated.",
  },
];

export default function Home() {
  const [selectedRole, setSelectedRole] = useState<Role>("family");
  const [incidentCount, setIncidentCount] = useState(10);
  const [hospitalName, setHospitalName] = useState("City General Hospital");
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [selectedPatientId, setSelectedPatientId] = useState(initialPatients[0].id);
  const [message, setMessage] = useState(
    "AI has created a mass-casualty workflow and notified the nearest hospital, ambulance network, and family contacts."
  );

  const selectedPatient = useMemo(
    () => patients.find((patient) => patient.id === selectedPatientId) ?? patients[0],
    [patients, selectedPatientId]
  );

  const totalCritical = patients.filter((patient) => patient.severity === "Critical").length;
  const totalStable = patients.filter((patient) => patient.severity === "Stable").length;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const generatedPatients: Patient[] = Array.from({ length: incidentCount }, (_, index) => {
      const severity = index % 4 === 0 ? "Critical" : index % 3 === 0 ? "Moderate" : "Stable";
      const stageList = [
        "Incident reported",
        "Ambulance dispatched",
        "Admitted",
        "Bed assigned",
        "Labs in progress",
        "Treatment / surgery",
      ];
      const stage = stageList[index % stageList.length];
      const bed = severity === "Critical" ? "ICU-0" + (index + 1) : severity === "Moderate" ? "Ward-1" + (index + 1) : "Observation-0" + (index + 1);
      const doctor = severity === "Critical" ? "Dr. Meera Shah" : severity === "Moderate" ? "Dr. Karan Verma" : "Dr. Priya Nair";

      return {
        id: `CF-${1000 + index + 1}`,
        name: `Patient ${index + 1}`,
        severity,
        stage,
        hospital: hospitalName,
        doctor,
        bed,
        payment: severity === "Critical" ? "Pending" : "Pending",
        contact: `+91 90000 ${1000 + index}`,
      };
    });

    setPatients(generatedPatients);
    setSelectedPatientId(generatedPatients[0].id);
    setSelectedRole("admin");
    setMessage(
      `AI intake completed for ${incidentCount} injured patients. Ambulances, hospital dispatch, bed routing, and family notifications have been queued.`
    );
  };

  const stageIndex = stages.indexOf(selectedPatient?.stage ?? "Incident reported");

  return (
    <div
      suppressHydrationWarning
      className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.15),_transparent_36%),linear-gradient(135deg,_#f8fffe_0%,_#eef6ff_100%)] text-slate-900"
    >
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-12">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-teal-700">
            AI Hospital Flow & Emergency Incident Manager
          </p>
          <p className="text-sm text-slate-600">
            Omnichannel emergency orchestration from incident to discharge
          </p>
        </div>
        <a
          href="#dashboard"
          className="rounded-full border border-teal-700/20 bg-white/80 px-4 py-2 text-sm font-medium text-teal-800 shadow-sm backdrop-blur"
        >
          Open command view
        </a>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-10 px-6 pb-16 lg:px-12">
        <section className="grid gap-8 rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur lg:grid-cols-[1.05fr_0.95fr] lg:p-12">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-teal-100 px-3 py-1 text-sm font-semibold text-teal-800">
              Intelligent emergency response platform
            </span>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              From a mass-casualty accident to transparent patient care, all in one system.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              This platform can alert families, dispatch ambulances, free beds, assign doctors and labs, and expose the full journey to everyone involved.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#intake"
                className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Launch incident intake
              </a>
              <a
                href="#dashboard"
                className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
              >
                View live dashboard
              </a>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-teal-100 bg-slate-950 p-6 text-white shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-300">
              Core roles
            </p>
            <div className="mt-4 space-y-3">
              {Object.entries(roleConfig).map(([key, value]) => (
               < button
                  key={key}
                  onClick={() => setSelectedRole(key as Role)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selectedRole === key ? "border-teal-400 bg-white/15" : "border-white/10 bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{value.title}</p>
                      <p className="text-sm text-slate-400">{value.badge}</p>
                    </div>
                    <span className="rounded-full bg-teal-500/20 px-3 py-1 text-sm font-medium text-teal-300">
                      Open
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{value.description}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="intake" className="grid gap-6 rounded-[2rem] border border-slate-200 bg-white/80 p-8 shadow-sm lg:grid-cols-[0.95fr_1.05fr] lg:p-10">
          <form onSubmit={handleSubmit} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-700">
              Emergency intake
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">
              Simulate a mass-casualty incident
            </h2>
            <div className="mt-5 grid gap-4">
              <label className="text-sm font-medium text-slate-700">
                Number of injured patients
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={incidentCount}
                  onChange={(event) => setIncidentCount(Number(event.target.value))}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-3 py-3 text-slate-900"
                />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Receiving hospital
                <input
                  type="text"
                  value={hospitalName}
                  onChange={(event) => setHospitalName(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-3 py-3 text-slate-900"
                />
              </label>
            </div>
            <button
              type="submit"
              className="mt-6 rounded-full bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              Generate AI emergency workflow
            </button>
            <p className="mt-4 text-sm leading-7 text-slate-600">{message}</p>
          </form>

          <div className="rounded-[1.5rem] border border-teal-100 bg-teal-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-700">
              AI orchestration preview
            </p>
            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl border border-teal-200 bg-white p-4">
                <p className="font-semibold text-slate-900">Bed clearance prediction</p>
                <p className="mt-1 text-sm text-slate-600">The system scans for patients likely to discharge tonight and frees capacity for incoming cases.</p>
              </div>
              <div className="rounded-2xl border border-teal-200 bg-white p-4">
                <p className="font-semibold text-slate-900">Auto-assignment engine</p>
                <p className="mt-1 text-sm text-slate-600">Critical patients are routed to ICU, stable patients to observation, and doctors are assigned from available staff.</p>
              </div>
              <div className="rounded-2xl border border-teal-200 bg-white p-4">
                <p className="font-semibold text-slate-900">Notification flow</p>
                <p className="mt-1 text-sm text-slate-600">Families receive updates by SMS, WhatsApp, or push while the hospital gets a shared live event view.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="dashboard" className="grid gap-6 rounded-[2rem] border border-slate-200 bg-white/80 p-8 shadow-sm lg:grid-cols-[0.95fr_1.05fr] lg:p-10">
          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-700">
                  Patient registry
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Unique patient IDs and live status</h2>
              </div>
              <span className="rounded-full bg-teal-600 px-3 py-1 text-sm font-medium text-white">
                {patients.length} active cases
              </span>
            </div>
            <div className="mt-5 grid gap-3">
              {patients.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => setSelectedPatientId(patient.id)}
                  className={`rounded-2xl border p-4 text-left ${
                    selectedPatientId === patient.id ? "border-teal-500 bg-white" : "border-slate-200 bg-white/80"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{patient.name}</p>
                      <p className="text-sm text-slate-500">{patient.id}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                      {patient.severity}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                    <span className="rounded-full bg-teal-50 px-2.5 py-1">{patient.stage}</span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1">{patient.bed}</span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1">{patient.doctor}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-teal-100 bg-teal-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-700">
              Family transparency view
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              {selectedPatient?.name} • {selectedPatient?.id}
            </h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-teal-200 bg-white p-4">
                <p className="text-sm text-slate-500">Current status</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{selectedPatient?.stage}</p>
              </div>
              <div className="rounded-2xl border border-teal-200 bg-white p-4">
                <p className="text-sm text-slate-500">Assigned doctor</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{selectedPatient?.doctor}</p>
              </div>
              <div className="rounded-2xl border border-teal-200 bg-white p-4">
                <p className="text-sm text-slate-500">Bed & hospital</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{selectedPatient?.bed} • {selectedPatient?.hospital}</p>
              </div>
              <div className="rounded-2xl border border-teal-200 bg-white p-4">
                <p className="text-sm text-slate-500">Payment status</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{selectedPatient?.payment}</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-teal-200 bg-white p-4">
              <p className="font-semibold text-slate-900">Journey timeline</p>
              <div className="mt-4 space-y-3">
                {stages.map((step, index) => {
                  const isActive = index <= (stageIndex >= 0 ? stageIndex : 0);
                  return (
                    <div key={step} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                      <span className={`text-sm ${isActive ? "text-slate-900" : "text-slate-400"}`}>{step}</span>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${isActive ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-600"}`}>
                        {isActive ? "Live" : "Queued"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-teal-200 bg-white p-4">
                <p className="text-sm text-slate-500">Critical patients</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">{totalCritical}</p>
              </div>
              <div className="rounded-2xl border border-teal-200 bg-white p-4">
                <p className="text-sm text-slate-500">Stable patients</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">{totalStable}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="vision" className="grid gap-4 md:grid-cols-2">
          {highlights.map((item) => (
            <div key={item.title} className="rounded-[1.25rem] border border-slate-200 bg-white/80 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
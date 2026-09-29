import React from 'react'
import { CheckCircle2, Clock, Cpu, ShieldAlert, Truck, Sparkles, Building2, AlertTriangle } from 'lucide-react'

export default function IncidentLifecycleStepper({ incident }) {
  if (!incident) return null

  const status = incident.status || 'PENDING'
  const confidencePct = (incident.confidence * 100).toFixed(0)

  // Map status to lifecycle step index (0 to 5)
  let activeStepIdx = 2 // default PENDING is SEVERITY_SCORED & ROUTED
  if (status === 'ACKNOWLEDGED') activeStepIdx = 3
  if (status === 'DISPATCHED') activeStepIdx = 4
  if (status === 'RESOLVED') activeStepIdx = 5

  const steps = [
    {
      id: 'DETECTED',
      label: 'Onboard Frame Detected',
      subtext: `Captured by ${incident.bus_id} at ${incident.timestamp?.split(' ')[1] || '14:49'}`,
      icon: Cpu,
      completed: true
    },
    {
      id: 'AI_VERIFIED',
      label: 'YOLO Edge Model Verified',
      subtext: `AI Confidence: ${confidencePct}% | Frame Inference: 14ms`,
      icon: Sparkles,
      completed: true
    },
    {
      id: 'SEVERITY_SCORED',
      label: 'Severity Scored & Auto-Routed',
      subtext: `Score: ${incident.severity_score}/100 (${incident.severity}) -> ${incident.assigned_dept || 'PWD'}`,
      icon: ShieldAlert,
      completed: activeStepIdx >= 2
    },
    {
      id: 'DISPATCHED',
      label: 'Municipal Crew Dispatched',
      subtext: activeStepIdx >= 4 ? `Ticket Issued to ${incident.assigned_dept || 'PWD'} (ETA: 8m)` : 'Awaiting Municipal Dispatch',
      icon: Truck,
      completed: activeStepIdx >= 4
    },
    {
      id: 'RESOLVED',
      label: 'Hazard Resolved & Verified',
      subtext: activeStepIdx === 5 ? 'Road repaired & closed in municipal ledger' : 'Pending resolution',
      icon: CheckCircle2,
      completed: activeStepIdx === 5
    }
  ]

  return (
    <div className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <span className="text-[11px] font-mono font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          Real-Time Incident Lifecycle
        </span>
        <span className="text-[10px] font-mono bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-slate-300">
          ID: {incident.id}
        </span>
      </div>

      {/* Stepper Timeline */}
      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {steps.map((step, idx) => {
          const Icon = step.icon
          const isCurrent = activeStepIdx === idx || (idx === 2 && activeStepIdx < 2)
          const isDone = step.completed

          return (
            <div key={step.id} className="relative group">
              {/* Step Circle Marker */}
              <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-all ${
                isDone
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/50 ring-2 ring-sky-400'
                  : isCurrent
                  ? 'bg-amber-500 text-slate-950 font-bold animate-ping ring-2 ring-amber-400'
                  : 'bg-slate-900 border border-slate-700 text-slate-500'
              }`}>
                {isDone ? '✓' : idx + 1}
              </div>

              {/* Step Info */}
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className={`text-xs font-bold leading-tight ${
                    isDone ? 'text-white' : isCurrent ? 'text-amber-400 font-extrabold' : 'text-slate-500'
                  }`}>
                    {step.label}
                  </h4>
                  {isCurrent && (
                    <span className="text-[9px] bg-amber-500/20 text-amber-400 font-mono px-1.5 py-0.2 rounded border border-amber-500/30 font-bold">
                      IN PROGRESS
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">{step.subtext}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

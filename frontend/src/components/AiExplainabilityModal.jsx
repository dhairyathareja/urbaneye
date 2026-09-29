import React from 'react'
import { CheckCircle2, X, Sparkles, Cpu, Activity } from 'lucide-react'

export default function AiExplainabilityModal({ isOpen, onClose, incident }) {
  if (!isOpen || !incident) return null

  const type = incident.type || 'pothole'
  const confidencePct = (incident.confidence * 100).toFixed(0)
  const score = incident.severity_score || 92

  const getDetectionFeatures = (incType) => {
    switch (incType) {
      case 'hit_and_run':
        return [
          'High-speed velocity excess (+96% over 40 km/h speed limit)',
          'License plate OCR bounding box extraction (UK 07 AB 9042)',
          'Evasive multi-lane drift trajectory without turn indication'
        ]
      case 'waterlogging':
        return [
          'Underpass water surface reflectivity signature',
          'Roadway capacity submergence (65% lane blockage)',
          'Drainage sump backflow accumulation rate'
        ]
      case 'pedestrian':
        return [
          'Vulnerable pedestrian group detection (school zone)',
          'Absence of marked zebra crossing infrastructure',
          'High transit vehicle approach speed differential'
        ]
      case 'traffic':
        return [
          'Vehicle density saturation (84% corridor capacity)',
          'Average flow velocity drop to 8.2 km/h',
          'Radial intersection gridlock formation'
        ]
      default:
        return [
          'Asphalt fracture and dark subsurface crack pattern',
          'Structural surface depth deformation (14.5 cm depth)',
          'Primary transit corridor lane obstruction'
        ]
    }
  }

  const features = getDetectionFeatures(type)

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0f1117] border border-white/[0.09] rounded-2xl max-w-lg w-full p-6 space-y-5 text-zinc-100 shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/[0.07] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-zinc-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-white">Inference Explainability Report</h3>
              <p className="text-[11px] text-zinc-400 font-mono">AUDIT TRAIL • {incident.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Anomaly Summary */}
        <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.06] flex items-center justify-between text-xs">
          <div>
            <span className="text-zinc-400 text-[11px] block">Target Anomaly</span>
            <span className="font-medium text-white">{incident.title}</span>
          </div>
          <span className="bg-rose-500/15 text-rose-400 px-2 py-0.5 rounded text-[10px] font-mono font-medium">
            {incident.severity}
          </span>
        </div>

        {/* Visual Computer Vision Detections */}
        <div className="space-y-2 text-xs">
          <span className="text-zinc-400 font-medium">1. Computer Vision Features</span>
          <ul className="space-y-1.5 bg-white/[0.02] p-3 rounded-xl border border-white/[0.06] text-zinc-300">
            {features.map((f, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-zinc-400 mt-1.5 shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Model Metrics */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.06] space-y-0.5">
            <span className="text-zinc-500 text-[10px] uppercase font-sans">Model Confidence</span>
            <div className="text-base font-semibold text-white">{confidencePct}% Accuracy</div>
            <p className="text-[10px] text-zinc-500">YOLOv8 Edge Engine</p>
          </div>

          <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.06] space-y-0.5">
            <span className="text-zinc-500 text-[10px] uppercase font-sans">Inference Latency</span>
            <div className="text-base font-semibold text-emerald-400">14.2 ms</div>
            <p className="text-[10px] text-zinc-500">NVIDIA Jetson AGX Orin</p>
          </div>
        </div>

        {/* Risk Multipliers */}
        <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.06] space-y-1.5 text-xs font-mono text-[11px]">
          <div className="flex justify-between text-zinc-400">
            <span>Ward Historical Baseline:</span>
            <span className="text-zinc-200">+34% over ward average</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Transit Vehicle Exposure:</span>
            <span className="text-zinc-200">340 veh/hr (High Load)</span>
          </div>
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="w-full bg-white/[0.05] hover:bg-white/[0.1] text-zinc-200 font-medium py-2 rounded-xl text-xs transition-colors"
        >
          Close Report
        </button>
      </div>
    </div>
  )
}


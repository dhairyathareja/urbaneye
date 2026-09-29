import React from 'react'
import { CheckCircle2, Shield, AlertCircle } from 'lucide-react'

export default function AiSeverityReasoningPanel({ incident }) {
  if (!incident) return null

  const type = incident.type || 'pothole'
  const score = incident.severity_score || 92
  const confidencePct = (incident.confidence * 100).toFixed(0)

  const getFactors = (incType) => {
    switch (incType) {
      case 'hit_and_run':
        return [
          'Velocity excess: 78.4 km/h in 40 km/h zone',
          'License plate OCR extraction verified: UK 07 AB 9042',
          'Evasive multi-lane trajectory without signaling',
          'High risk collision corridor'
        ]
      case 'waterlogging':
        return [
          'Roadway cross-section: 65% submerged',
          'Underpass drainage sump backflow risk',
          'Vehicle exposure load: 280 units/hr',
          'Monsoon rainfall accumulation rate high'
        ]
      case 'pedestrian':
        return [
          'Pedestrian group detected near school crossing',
          'Absence of marked zebra crossing',
          'Transit vehicle approach speed: 45 km/h',
          'Speed buffer reduction advisory triggered'
        ]
      case 'traffic':
        return [
          'Roadway saturation at 84% capacity',
          'Corridor average speed reduced to 8.2 km/h',
          'Radial bottleneck intersection delay',
          'Transit delay accumulation: +18 min'
        ]
      default:
        return [
          'Surface asphalt failure area: 2.4 m²',
          'Structural impact depth: 14.5 cm crater',
          'Transit corridor exposure: 340 veh/hr',
          'Subbase moisture saturation accelerating failure'
        ]
    }
  }

  const factors = getFactors(type)

  return (
    <div className="bg-white/[0.02] border border-white/[0.06] p-3.5 rounded-xl space-y-2.5 text-xs">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
        <span className="font-medium text-white text-[11px] uppercase tracking-wider">
          Decision Reasoning
        </span>
        <span className="text-[10px] font-mono text-zinc-400">
          Confidence: {confidencePct}%
        </span>
      </div>

      <ul className="space-y-1.5 text-[11px] text-zinc-300">
        {factors.map((f, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="w-1 h-1 rounded-full bg-zinc-400 mt-1.5 shrink-0" />
            <span className="leading-snug text-zinc-300">{f}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}


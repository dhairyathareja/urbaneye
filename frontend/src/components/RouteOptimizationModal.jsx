import React, { useState } from 'react'
import { Navigation, Clock, X, Send, Truck } from 'lucide-react'

export default function RouteOptimizationModal({ isOpen, onClose, incident, onConfirmDispatch }) {
  const [isDispatching, setIsDispatching] = useState(false)
  const [selectedCrew, setSelectedCrew] = useState('PWD-07')

  if (!isOpen || !incident) return null

  const crews = [
    {
      id: 'PWD-07',
      name: 'PWD Rapid Asphalt Repair Unit 07',
      distance: '2.4 km',
      eta: '7 min',
      traffic: 'Optimal Flow',
      route: 'PWD Central Depot → Rajpur Road → Incident Site',
      dept: 'Public Works Dept (PWD)'
    },
    {
      id: 'MDB-03',
      name: 'Drainage & Water Ingress Crew 03',
      distance: '3.1 km',
      eta: '11 min',
      traffic: 'Moderate Flow',
      route: 'Drainage Board Station → Underpass Slip Road → Site',
      dept: 'Municipal Drainage Board'
    },
    {
      id: 'TCC-12',
      name: 'Traffic Operations & Patrol 12',
      distance: '1.8 km',
      eta: '4 min',
      traffic: 'Clear Priority Corridor',
      route: 'Traffic Post 4 → Radial Loop → Site',
      dept: 'Traffic Control Cell'
    }
  ]

  const activeCrew = crews.find((c) => c.id === selectedCrew) || crews[0]

  const handleDispatchSubmit = async () => {
    setIsDispatching(true)
    if (onConfirmDispatch) {
      await onConfirmDispatch(incident.id, 'DISPATCH', activeCrew.dept)
    }
    setIsDispatching(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0f1117] border border-white/[0.09] rounded-2xl max-w-lg w-full p-6 space-y-5 text-zinc-100 shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/[0.07] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-zinc-300">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-white">Route Optimization & Crew Selection</h3>
              <p className="text-[11px] text-zinc-400 font-mono">AUTOMATED MULTI-STOP ROUTING</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Incident Summary */}
        <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.06] space-y-0.5 text-xs">
          <span className="text-[10px] font-mono text-zinc-500 uppercase">Target Alert</span>
          <h4 className="font-medium text-white">{incident.title}</h4>
          <p className="text-zinc-400 text-[11px]">{incident.location_name} • Severity: {incident.severity}</p>
        </div>

        {/* Crew Selector */}
        <div className="space-y-2 text-xs">
          <label className="text-zinc-400 font-medium">Nearest Available Units:</label>
          <div className="space-y-2">
            {crews.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCrew(c.id)}
                className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between text-xs ${
                  selectedCrew === c.id
                    ? 'bg-white/[0.07] border-white/25 text-white shadow-sm'
                    : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div>
                  <div className="font-medium text-zinc-200">{c.name}</div>
                  <div className="text-[11px] text-zinc-500 font-mono">{c.dept}</div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-emerald-400 font-semibold">{c.eta}</div>
                  <div className="text-[10px] text-zinc-500">{c.distance}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Optimized Route Details */}
        <div className="bg-white/[0.02] p-3.5 rounded-xl border border-white/[0.06] space-y-2 text-xs">
          <div className="flex items-center justify-between text-zinc-300 font-medium border-b border-white/[0.05] pb-1.5">
            <span>Optimized Navigation Corridor</span>
            <span className="text-emerald-400 font-mono">ETA: {activeCrew.eta}</span>
          </div>

          <div className="space-y-1 text-zinc-400 text-[11px]">
            <div className="flex justify-between">
              <span>Distance:</span>
              <span className="text-zinc-200 font-mono">{activeCrew.distance}</span>
            </div>
            <div className="flex justify-between">
              <span>Traffic Condition:</span>
              <span className="text-zinc-200">{activeCrew.traffic}</span>
            </div>
            <div className="pt-1">
              <span className="text-zinc-500 block mb-0.5">Turn-by-turn trajectory:</span>
              <div className="bg-black/30 p-2 rounded-lg text-zinc-300 font-mono text-[10px]">
                {activeCrew.route}
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleDispatchSubmit}
          disabled={isDispatching}
          className="w-full bg-white hover:bg-zinc-100 text-zinc-950 font-medium py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isDispatching ? 'Transmitting Dispatch...' : 'Confirm Dispatch & Broadcast Route'}</span>
        </button>
      </div>
    </div>
  )
}


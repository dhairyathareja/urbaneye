import React, { useState } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  Filter,
  Search,
  Eye,
  Send,
  SlidersHorizontal,
  Navigation,
  MapPin,
  Clock,
  ChevronRight,
  Shield,
  Layers
} from 'lucide-react'
import AiExplainabilityModal from './AiExplainabilityModal'
import RouteOptimizationModal from './RouteOptimizationModal'
import { generateSvgSnapshot } from '../mockData'

export default function IncidentQueue({ incidents, onSelectIncident, onPerformAction }) {
  const [filterCategory, setFilterCategory] = useState('ALL')
  const [filterSeverity, setFilterSeverity] = useState('ALL')
  const [sortBy, setSortBy] = useState('severity')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIncidentForDispatch, setSelectedIncidentForDispatch] = useState(null)
  const [explainIncident, setExplainIncident] = useState(null)

  const categories = [
    { id: 'ALL', label: 'All Alerts' },
    { id: 'early_detection', label: '🌱 Early Detection' },
    { id: 'pothole', label: 'Road Damage' },
    { id: 'waterlogging', label: 'Waterlogging' },
    { id: 'hit_and_run', label: 'Hit-and-Run / LPR' },
    { id: 'pedestrian', label: 'Pedestrian Zones' },
    { id: 'traffic', label: 'Congestion' }
  ]

  const filteredAndSortedIncidents = incidents
    .filter((inc) => {
      const matchesCategory =
        filterCategory === 'ALL' ||
        (filterCategory === 'early_detection' ? (inc.is_early_detection || inc.ai_details?.is_early_detection) : inc.type === filterCategory)
      const matchesSeverity = filterSeverity === 'ALL' || inc.severity === filterSeverity
      const matchesSearch =
        inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.location_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.id.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSeverity && matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === 'severity') {
        return (b.severity_score || 0) - (a.severity_score || 0)
      } else if (sortBy === 'confidence') {
        return (b.confidence || 0) - (a.confidence || 0)
      } else if (sortBy === 'time') {
        return new Date(b.timestamp) - new Date(a.timestamp)
      }
      return 0
    })

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-zinc-100">
      {/* Top Header & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0f1117] border border-white/[0.07] p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-300">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Prioritized Alert Queue</h2>
            <p className="text-xs text-zinc-400">
              Automated multi-criteria ranking and municipal dispatch workflow
            </p>
          </div>
        </div>

        <div className="relative w-72">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Filter ID, street, keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/[0.09] text-zinc-200 text-xs rounded-xl pl-9 pr-3.5 py-2 focus:outline-none focus:border-white/30 placeholder:text-zinc-600"
          />
        </div>
      </div>

      {/* Filter Tabs & Sort Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0f1117]/60 p-2.5 rounded-xl border border-white/[0.06]">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                filterCategory === cat.id
                  ? 'bg-white text-zinc-950 shadow-sm'
                  : 'bg-white/[0.02] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05] border border-white/[0.05]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-500 font-medium flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" />
            Sort:
          </span>
          {[
            { id: 'severity', label: 'Severity' },
            { id: 'confidence', label: 'Confidence' },
            { id: 'time', label: 'Recent' }
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setSortBy(s.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                sortBy === s.id
                  ? 'bg-white/[0.1] text-white border border-white/20'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Incident Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAndSortedIncidents.map((inc) => {
          const priorityScore = inc.severity_score || 90

          return (
            <div
              key={inc.id}
              className="bg-[#0f1117] border border-white/[0.07] hover:border-white/[0.14] rounded-2xl p-4 space-y-3 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Status & Priority Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                        inc.severity === 'CRITICAL'
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {inc.severity} • {priorityScore}/100
                    </span>
                    {(inc.is_early_detection || inc.ai_details?.is_early_detection) && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        🌱 EARLY RISK
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded ${
                      inc.status === 'DISPATCHED'
                        ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                        : inc.status === 'RESOLVED'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                        : 'bg-white/[0.04] text-zinc-400 border border-white/[0.06]'
                    }`}
                  >
                    {inc.status}
                  </span>
                </div>

                <div>
                  <div className="text-[11px] font-mono text-zinc-500">{inc.id}</div>
                  <h3 className="font-medium text-sm text-white mt-0.5 leading-snug">{inc.title}</h3>
                </div>

                {/* Frame Preview */}
                <div className="relative rounded-xl overflow-hidden border border-white/[0.06] aspect-video bg-zinc-950">
                  <img
                    src={`http://localhost:8000${inc.snapshot_url}`}
                    onError={(e) => {
                      e.target.src = generateSvgSnapshot(inc.type, inc.bus_id, inc.confidence)
                    }}
                    alt={inc.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur px-2 py-0.5 rounded text-[10px] font-mono text-zinc-400">
                    {inc.bus_id}
                  </div>
                </div>

                <div className="text-xs text-zinc-400 space-y-0.5">
                  <p className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3 h-3 text-zinc-500 shrink-0" />
                    <span>{inc.location_name}</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-zinc-500 font-mono text-[11px]">
                    <Clock className="w-3 h-3 text-zinc-600 shrink-0" />
                    <span>{inc.timestamp}</span>
                  </p>
                </div>

                {/* Early Detection Preventive Telemetry Card */}
                {(inc.is_early_detection || inc.ai_details?.is_early_detection) && (
                  <div className="bg-emerald-950/25 border border-emerald-500/30 rounded-xl p-2.5 text-[11px] font-mono space-y-1.5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        PREVENTIVE EARLY INTERVENTION
                      </span>
                      <span className="text-[10px] text-zinc-400 font-medium">Stage 1 Precursor</span>
                    </div>
                    <div className="flex justify-between text-zinc-300">
                      <span className="text-zinc-400">Degradation:</span>
                      <span className="text-emerald-300 font-medium">{inc.degradation_stage || inc.ai_details?.degradation_stage}</span>
                    </div>
                    <div className="flex justify-between text-zinc-300">
                      <span className="text-zinc-400">Growth Velocity:</span>
                      <span className="text-amber-400 font-semibold">{inc.growth_rate_mm_day || inc.ai_details?.growth_rate_mm_day}</span>
                    </div>
                    <div className="flex justify-between text-emerald-300 border-t border-emerald-500/20 pt-1">
                      <span className="text-zinc-400">Preventive Savings:</span>
                      <span className="font-bold text-emerald-400">₹{(inc.preventive_savings_inr || inc.ai_details?.preventive_savings_inr)?.toLocaleString('en-IN')} Saved</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-white/[0.06] flex items-center gap-2">
                <button
                  onClick={() => onSelectIncident(inc)}
                  className="flex-1 bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 font-medium py-2 rounded-xl text-xs border border-white/[0.06] transition-colors flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3 h-3 text-zinc-400" />
                  <span>Inspect</span>
                </button>

                {inc.status === 'PENDING' && (
                  <button
                    onClick={() => setSelectedIncidentForDispatch(inc)}
                    className="flex-1 bg-white hover:bg-zinc-100 text-zinc-950 font-medium py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Dispatch</span>
                  </button>
                )}

                {inc.status === 'DISPATCHED' && (
                  <button
                    onClick={() => onPerformAction(inc.id, 'RESOLVE')}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Resolve</span>
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <RouteOptimizationModal
        isOpen={Boolean(selectedIncidentForDispatch)}
        onClose={() => setSelectedIncidentForDispatch(null)}
        incident={selectedIncidentForDispatch}
        onConfirmDispatch={onPerformAction}
      />

      <AiExplainabilityModal
        isOpen={Boolean(explainIncident)}
        onClose={() => setExplainIncident(null)}
        incident={explainIncident}
      />
    </div>
  )
}


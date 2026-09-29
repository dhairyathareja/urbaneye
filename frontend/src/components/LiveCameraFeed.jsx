import React, { useState } from 'react'
import {
  Camera,
  Video,
  Cpu,
  Zap,
  Radio,
  Sun,
  CloudRain,
  Moon,
  CloudFog,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sliders,
  Car
} from 'lucide-react'
import AiSeverityReasoningPanel from './AiSeverityReasoningPanel'
import { generateSvgSnapshot } from '../mockData'

export default function LiveCameraFeed({ buses, selectedBus, setSelectedBus, activeIncident }) {
  const [activeCam, setActiveCam] = useState('FRONT_AI')
  const [activeWeather, setActiveWeather] = useState('clear')
  const [imgErr, setImgErr] = useState(false)

  const currentBus = selectedBus || buses[0] || { id: 'UK 07 PA 0142', name: 'UTC Smart City EV #14 (Route 1)', speed_kmh: 32 }

  const weatherOptions = [
    { id: 'clear', label: 'Daylight', icon: Sun },
    { id: 'rain', label: 'Rain / Wet', icon: CloudRain },
    { id: 'night', label: 'Night Low-Light', icon: Moon },
    { id: 'fog', label: 'Fog / Mist', icon: CloudFog }
  ]

  const camAngles = [
    {
      id: 'FRONT_AI',
      label: 'Front Roadway Camera',
      icon: Camera,
      anomaly:
        activeWeather === 'rain'
          ? 'Surface Water Ingress & Slick Road'
          : activeWeather === 'night'
          ? 'Night Low-Light Pothole Defect (Headlight Beam)'
          : activeWeather === 'fog'
          ? 'Fog Penetration Pothole Hazard (Road Surface)'
          : 'Asphalt Fracture & Pothole Cluster',
      confidence:
        activeWeather === 'rain'
          ? '96%'
          : activeWeather === 'night'
          ? '94%'
          : activeWeather === 'fog'
          ? '95%'
          : '98%',
      latency: '8.4 ms',
      status: 'CRITICAL',
      desc: 'Pothole, fissure and surface failure inference'
    },
    {
      id: 'SIDE_PAVEMENT',
      label: 'Side Pavement Scanner',
      icon: Camera,
      anomaly: 'Pedestrian Activity Zone (Faces Auto-Redacted)',
      confidence: '89%',
      latency: '8.9 ms',
      status: 'HIGH',
      desc: 'School zone and roadside pedestrian activity'
    },
    {
      id: 'REAR_ROADSIDE',
      label: 'Rear Highway Sensor',
      icon: Video,
      anomaly: 'Hit-and-Run LPR Alert: UK 07 AB 9042',
      confidence: '94%',
      latency: '8.1 ms',
      status: 'CRITICAL',
      desc: 'Speed violation and hit-and-run license plate scan'
    },
    {
      id: 'CABIN_MONITOR',
      label: 'Cabin Driver Monitor',
      icon: ShieldCheck,
      anomaly: 'Driver Attentiveness & Fatigue Telemetry',
      confidence: '97%',
      latency: '7.8 ms',
      status: 'NORMAL',
      desc: 'Facial telemetry and vigilance monitoring'
    }
  ]

  const activeCamInfo = camAngles.find((c) => c.id === activeCam) || camAngles[0]

  const backendSnapshotUrl = `http://localhost:8000/api/snapshots/${activeIncident?.id || 'INC-9041'}.jpg?cam=${activeCam}&weather=${activeWeather}&t=${Date.now()}`
  const svgFallbackUrl = generateSvgSnapshot(activeIncident?.type || 'pothole', currentBus.id, 0.98, activeCam, activeWeather)

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-zinc-100">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0f1117] border border-white/[0.07] p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-300">
            <Video className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Live Onboard Multi-Sensor Stream</h2>
            <p className="text-xs text-zinc-400">
              Active Unit: <span className="font-mono text-zinc-200 font-medium">{currentBus.id}</span> • NavIC L1/L5 Dual Band Sync
            </p>
          </div>
        </div>

        {/* Bus Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">Bus Fleet Unit:</span>
          <select
            value={currentBus.id}
            onChange={(e) => {
              const b = buses.find((item) => item.id === e.target.value)
              if (b) setSelectedBus(b)
            }}
            className="bg-black/40 border border-white/[0.1] text-zinc-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-white/30"
          >
            {buses.map((bus) => (
              <option key={bus.id} value={bus.id}>
                {bus.id} - {bus.name} ({bus.speed_kmh} km/h)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Environmental Weather Filter Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0f1117]/60 p-2.5 rounded-xl border border-white/[0.06]">
        <span className="text-xs font-medium text-zinc-400 flex items-center gap-1.5 px-1">
          <Sun className="w-3.5 h-3.5 text-zinc-400" />
          <span>Environmental Adaptive Profile:</span>
        </span>

        <div className="flex items-center gap-1.5">
          {weatherOptions.map((w) => {
            const Icon = w.icon
            const isSel = activeWeather === w.id
            return (
              <button
                key={w.id}
                onClick={() => {
                  setActiveWeather(w.id)
                  setImgErr(false)
                }}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isSel
                    ? 'bg-white text-zinc-950 shadow-sm'
                    : 'bg-white/[0.02] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05] border border-white/[0.05]'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{w.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Video Viewport & Angle Selector */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative bg-zinc-950 border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl aspect-video">
            <img
              key={`${activeCam}-${activeWeather}-${activeIncident?.id || 'INC-9041'}`}
              src={imgErr ? svgFallbackUrl : backendSnapshotUrl}
              onError={() => setImgErr(true)}
              alt="Live Sensor Feed"
              className="w-full h-full object-cover"
            />

            {/* Top HUD Badges */}
            <div className="absolute top-3.5 left-3.5 bg-black/75 backdrop-blur-md border border-white/[0.1] px-3 py-1 rounded-lg flex items-center gap-2 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-zinc-200 font-medium">{activeCamInfo.id} • 1080P 30FPS</span>
              <span className="text-zinc-500">|</span>
              <span className="text-zinc-400 uppercase">{activeWeather}</span>
            </div>

            <div className="absolute top-12 left-3.5 bg-black/80 backdrop-blur-md border border-emerald-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>DPDP PRIVACY GUARD: ACTIVE (PII REDACTED)</span>
            </div>

            <div className="absolute top-3.5 right-3.5 bg-black/75 backdrop-blur-md border border-white/[0.1] px-3 py-1 rounded-lg flex items-center gap-1.5 text-xs font-mono text-zinc-300">
              <Cpu className="w-3.5 h-3.5 text-zinc-400" />
              <span>Jetson AGX Orin • {activeCamInfo.latency}</span>
            </div>

            {/* Occlusion & False Positive Telemetry Strip */}
            {activeCam === 'FRONT_AI' && (
              <div className="absolute bottom-16 left-3.5 right-3.5 bg-black/85 backdrop-blur-md border border-cyan-500/30 px-3 py-1.5 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-cyan-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  Occlusion Geometry: <strong>R = 42.5 cm</strong> (38% Subsurface Extrapolated)
                </span>
                <span className="text-amber-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  FP Rejection: <strong>98.8% Specificity</strong> (Shadow/Mirage Suppressed)
                </span>
              </div>
            )}

            {/* Bottom Stream Info Overlay */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div>
                <span className="text-zinc-400 text-[11px] block">Detected Pattern</span>
                <span className="font-semibold text-white text-sm">{activeCamInfo.anomaly}</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-zinc-300">
                  Confidence: <strong className="text-emerald-400">{activeCamInfo.confidence}</strong>
                </span>
                <span className="text-zinc-300">
                  Status:{' '}
                  <strong className={activeCamInfo.status === 'CRITICAL' ? 'text-rose-400' : 'text-amber-400'}>
                    {activeCamInfo.status}
                  </strong>
                </span>
              </div>
            </div>
          </div>

          {/* Camera Angles Selector Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {camAngles.map((cam) => {
              const Icon = cam.icon
              const isActive = activeCam === cam.id
              return (
                <button
                  key={cam.id}
                  onClick={() => {
                    setActiveCam(cam.id)
                    setImgErr(false)
                  }}
                  className={`p-3 rounded-xl border text-left transition-all duration-150 ${
                    isActive
                      ? 'bg-white/[0.08] border-white/20 text-white shadow-sm'
                      : 'bg-[#0f1117] border-white/[0.06] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-zinc-300" />
                      <span className="font-medium text-xs text-zinc-200">{cam.id}</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400">{cam.confidence}</span>
                  </div>
                  <p className="text-[11px] font-medium text-zinc-200 truncate">{cam.anomaly}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Telemetry & Traffic Stream Sidebar */}
        <div className="space-y-4">
          {/* Traffic Classification Counters */}
          <div className="bg-[#0f1117] border border-white/[0.07] p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-zinc-400" />
                <h3 className="text-xs font-semibold text-white">Vehicle Flow & Classification</h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.06]">
                ByteTrack
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="bg-white/[0.02] p-2 rounded-xl border border-white/[0.05]">
                <div className="text-[10px] text-zinc-500 font-sans">Cars</div>
                <div className="text-sm font-semibold text-white mt-0.5">42</div>
              </div>
              <div className="bg-white/[0.02] p-2 rounded-xl border border-white/[0.05]">
                <div className="text-[10px] text-zinc-500 font-sans">2-Wheelers</div>
                <div className="text-sm font-semibold text-white mt-0.5">27</div>
              </div>
              <div className="bg-white/[0.02] p-2 rounded-xl border border-white/[0.05]">
                <div className="text-[10px] text-zinc-500 font-sans">Autos</div>
                <div className="text-sm font-semibold text-white mt-0.5">13</div>
              </div>
              <div className="bg-white/[0.02] p-2 rounded-xl border border-white/[0.05]">
                <div className="text-[10px] text-zinc-500 font-sans">Trucks</div>
                <div className="text-sm font-semibold text-white mt-0.5">8</div>
              </div>
              <div className="bg-white/[0.02] p-2 rounded-xl border border-white/[0.05]">
                <div className="text-[10px] text-zinc-500 font-sans">Buses</div>
                <div className="text-sm font-semibold text-white mt-0.5">4</div>
              </div>
              <div className="bg-white/[0.02] p-2 rounded-xl border border-white/[0.05]">
                <div className="text-[10px] text-zinc-500 font-sans">Avg Speed</div>
                <div className="text-sm font-semibold text-white mt-0.5">32 km/h</div>
              </div>
            </div>

            {/* Active Tracked Table */}
            <div className="bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.05] text-[11px] font-mono space-y-1">
              <div className="text-zinc-500 text-[10px] border-b border-white/[0.05] pb-1 flex justify-between">
                <span>Track ID</span>
                <span>Speed / Status</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>V-17 (UK 07 AB 9042)</span>
                <span className="text-rose-400 font-medium">78 km/h • Speed Alert</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>V-22 (UK 07 CD 5819)</span>
                <span className="text-rose-400 font-medium">72 km/h • Lane Infraction</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>V-18 (UK 07 PA 1012)</span>
                <span className="text-emerald-400">34 km/h • Normal</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>V-19 (UK 07 T 3411)</span>
                <span className="text-zinc-400">24 km/h • Normal</span>
              </div>
            </div>
          </div>

          <AiSeverityReasoningPanel
            incident={{
              ...activeIncident,
              type:
                activeWeather === 'rain'
                  ? 'waterlogging'
                  : activeCam === 'CABIN_MONITOR'
                  ? 'pedestrian'
                  : activeCam === 'SIDE_PAVEMENT'
                  ? 'pedestrian'
                  : activeCam === 'REAR_ROADSIDE'
                  ? 'hit_and_run'
                  : 'pothole',
              title: activeCamInfo.anomaly,
              confidence: parseFloat(activeCamInfo.confidence) / 100,
              severity: 'CRITICAL',
              severity_score: 94
            }}
          />
        </div>
      </div>
    </div>
  )
}


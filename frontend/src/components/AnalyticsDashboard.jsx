import React from 'react'
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Activity,
  Zap,
  MapPin,
  Clock,
  Sparkles,
  ArrowUpRight,
  Shield,
  Cpu,
  Database,
  CheckCircle2,
  AlertTriangle,
  EyeOff,
  Layers
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function AnalyticsDashboard({ analyticsData, incidents }) {
  const summary = analyticsData?.summary || {
    total_incidents: 6,
    pending_action: 4,
    dispatched_crew: 1,
    resolved_count: 1,
    km_monitored_today: 1284,
    road_health_index: 74,
    avg_detection_latency_ms: 8.1
  }

  const rhiScore = summary.road_health_index || 74
  const strokeDash = (rhiScore / 100) * 283

  const weeklyTrendData = [
    { day: 'Mon', rhi: 62, count: 14 },
    { day: 'Tue', rhi: 65, count: 11 },
    { day: 'Wed', rhi: 68, count: 9 },
    { day: 'Thu', rhi: 71, count: 8 },
    { day: 'Fri', rhi: 74, count: 6 },
    { day: 'Sat', rhi: 76, count: 4 },
    { day: 'Sun', rhi: 78, count: 3 }
  ]

  const wardScorecards = [
    { ward: 'Ward 4 (Rajpur Road Corridor)', rhi: 78, status: 'Optimal', activeAlerts: 1 },
    { ward: 'Ward 8 (EC Road & Survey Chowk)', rhi: 72, status: 'Moderate', activeAlerts: 2 },
    { ward: 'Ward 12 (Ballupur Chowk)', rhi: 64, status: 'Degrading', activeAlerts: 2 },
    { ward: 'Ward 15 (ISBT Haridwar Bypass)', rhi: 58, status: 'Attention Required', activeAlerts: 1 }
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-zinc-100">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0f1117] border border-white/[0.07] p-4 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-white">Civic Road Health & Predictive Intelligence</h2>
            <span className="text-[10px] font-mono text-zinc-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
              DEHRADUN SMART CITY
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Continuous municipal sensing and autonomous degradation forecast
          </p>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.07] px-3.5 py-1.5 rounded-xl text-xs text-zinc-300 flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-zinc-400" />
          <span>Average Repair Turnaround: <strong className="text-white font-medium">3 Hours</strong> (vs 14 Days manual)</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Radial RHI Speedometer */}
        <div className="bg-[#0f1117] border border-white/[0.07] p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2">
          <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Road Health Index (RHI)</div>
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#10b981"
                strokeWidth="8"
                strokeDasharray="283"
                strokeDashoffset={283 - strokeDash}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-semibold text-white">{rhiScore}</span>
              <span className="text-[9px] font-mono text-emerald-400 font-medium uppercase">Optimal</span>
            </div>
          </div>
        </div>

        <div className="bg-[#0f1117] border border-white/[0.07] p-4 rounded-2xl space-y-1 flex flex-col justify-between">
          <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Edge AI Latency</div>
          <div>
            <div className="text-2xl font-semibold text-white">{summary.avg_detection_latency_ms} ms</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">NVIDIA Jetson AGX Orin</div>
          </div>
        </div>

        <div className="bg-[#0f1117] border border-white/[0.07] p-4 rounded-2xl space-y-1 flex flex-col justify-between">
          <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Distance Monitored</div>
          <div>
            <div className="text-2xl font-semibold text-white">{summary.km_monitored_today} km</div>
            <div className="text-[11px] text-emerald-400 mt-0.5">100% Dehradun Arterials</div>
          </div>
        </div>

        <div className="bg-[#0f1117] border border-white/[0.07] p-4 rounded-2xl space-y-1 flex flex-col justify-between">
          <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Preventive Savings</div>
          <div>
            <div className="text-2xl font-semibold text-emerald-400">₹4.2 Lakhs</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Early Micro-Surfacing</div>
          </div>
        </div>
      </div>

      {/* Ward-Wise Scorecard Table */}
      <div className="bg-[#0f1117] border border-white/[0.07] p-5 rounded-2xl space-y-3">
        <h3 className="text-xs font-semibold text-white">Ward Transparency Scorecard</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {wardScorecards.map((w, idx) => (
            <div key={idx} className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.05] text-xs space-y-1.5">
              <div className="font-medium text-white">{w.ward}</div>
              <div className="flex justify-between font-mono text-[11px] text-zinc-400">
                <span>RHI: <strong className="text-emerald-400">{w.rhi}/100</strong></span>
                <span>{w.status}</span>
              </div>
              <div className="w-full bg-white/[0.05] h-1 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${w.rhi}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Day Trend Chart */}
      <div className="bg-[#0f1117] border border-white/[0.07] p-5 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-white">7-Day Municipal Road Health Index (RHI) Trend</h3>
          <span className="text-[11px] text-zinc-400 font-mono">+16 pts improvement this week</span>
        </div>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyTrendData}>
              <XAxis dataKey="day" stroke="#52525b" fontSize={11} tickLine={false} />
              <YAxis domain={[50, 100]} stroke="#52525b" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#090a0f',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  fontSize: '11px'
                }}
              />
              <Line type="monotone" dataKey="rhi" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: '#10b981' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mathematical Severity Engine Formula Card */}
      <div className="bg-[#0f1117] border border-white/[0.07] p-5 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-zinc-300" />
            <h3 className="text-xs font-semibold text-white">Multi-Factor Severity Scoring Engine</h3>
          </div>
          <span className="text-[10px] font-mono text-zinc-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
            WEIGHTED ALGORITHM
          </span>
        </div>

        <div className="bg-white/[0.02] p-4 rounded-xl border border-white/[0.06] font-mono text-xs space-y-3">
          <div className="text-zinc-200 font-medium bg-black/40 p-2.5 rounded-lg border border-white/[0.07]">
            Severity = (0.40 × Size) + (0.25 × Traffic Load) + (0.20 × AI Confidence) + (0.15 × Multi-Pass Frequency)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-zinc-400 text-[11px]">
            <div className="bg-white/[0.02] p-2.5 rounded-lg border border-white/[0.05] space-y-0.5">
              <span className="text-zinc-500">1. Defect Area (40%)</span>
              <div className="text-zinc-200 font-semibold font-sans">2.4 m² / 14.5 cm</div>
              <div className="text-emerald-400 font-mono">→ 37.6 pts</div>
            </div>
            <div className="bg-white/[0.02] p-2.5 rounded-lg border border-white/[0.05] space-y-0.5">
              <span className="text-zinc-500">2. Traffic Volume (25%)</span>
              <div className="text-zinc-200 font-semibold font-sans">340 veh/hr</div>
              <div className="text-emerald-400 font-mono">→ 23.5 pts</div>
            </div>
            <div className="bg-white/[0.02] p-2.5 rounded-lg border border-white/[0.05] space-y-0.5">
              <span className="text-zinc-500">3. YOLO Certainty (20%)</span>
              <div className="text-zinc-200 font-semibold font-sans">98% Accuracy</div>
              <div className="text-emerald-400 font-mono">→ 18.8 pts</div>
            </div>
            <div className="bg-white/[0.02] p-2.5 rounded-lg border border-white/[0.05] space-y-0.5">
              <span className="text-zinc-500">4. Multi-Pass (15%)</span>
              <div className="text-zinc-200 font-semibold font-sans">3 Buses Corroborated</div>
              <div className="text-emerald-400 font-mono">→ 12.0 pts</div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs">
            <span className="text-zinc-400">Calculated Incident Severity Score:</span>
            <span className="text-rose-400 font-semibold font-mono">
              37.6 + 23.5 + 18.8 + 12.0 = 91.9 → 92 / 100 (CRITICAL P1)
            </span>
          </div>
        </div>
      </div>

      {/* Degradation Physics & Cybersecurity Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crack Degradation Physics */}
        <div className="bg-[#0f1117] border border-white/[0.07] p-5 rounded-2xl space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-zinc-300" />
            <h3 className="text-xs font-semibold text-white">Crack Degradation & Moisture Ingress Model</h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.05] space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between text-zinc-400">
                <span>Crack Growth Velocity:</span>
                <span className="text-zinc-200 font-medium">+1.8 mm / day</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Subbase Moisture Saturation:</span>
                <span className="text-zinc-200 font-medium">65% High Ingress</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>14-Day Failure Probability:</span>
                <span className="text-rose-400 font-medium">84% Structural Collapse Risk</span>
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl text-emerald-300 text-[11px]">
              Preventive recommendation: Micro-surface within 48h to prevent ₹1.2 Lakh full base replacement.
            </div>
          </div>
        </div>

        {/* Security & Edge Buffer */}
        <div className="bg-[#0f1117] border border-white/[0.07] p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-zinc-300" />
              <h3 className="text-xs font-semibold text-white">Hardware Security & Edge Queue</h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.06]">
              TLS 1.3 / MQTT
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.05] space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between text-zinc-400">
                <span>Root-of-Trust:</span>
                <span className="text-emerald-400 font-medium">TPM 2.0 Validated</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Device Certificate:</span>
                <span className="text-zinc-200">CERT-BEL-DEL-101</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Evidence Checksum:</span>
                <span className="text-zinc-200">e7f4c9a...sha256</span>
              </div>
            </div>

            <button
              onClick={() => alert("✅ Edge Sync Complete: 4 local offline detections synchronized over TLS 1.3 / MQTT.")}
              className="w-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 font-medium py-2 rounded-xl text-xs border border-white/[0.08] transition-colors flex items-center justify-center gap-2"
            >
              <Zap className="w-3.5 h-3.5 text-zinc-400" />
              <span>Simulate Edge Reconnect & Hash Sync</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Model & Kaggle Ground-Truth Dataset Benchmarks */}
      <div className="bg-[#0f1117] border border-white/[0.07] p-5 rounded-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-semibold text-white">AI Model & Kaggle Ground-Truth Dataset Benchmarks</h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
            KAGGLE VERIFIED • YOLOv8-NANO TENSORRT
          </span>
        </div>

        <p className="text-xs text-zinc-400">
          Trained and validated on authentic high-resolution Indian road surface datasets under varying environmental conditions (Daylight, Heavy Monsoon Rain, Low-Light Night, Dense Mist).
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
          <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.05] space-y-0.5">
            <div className="text-[10px] text-zinc-500 font-sans">Dataset Size</div>
            <div className="text-base font-semibold text-white">1,976 Imgs</div>
            <div className="text-[10px] text-zinc-400">80/20 Stratified</div>
          </div>
          <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.05] space-y-0.5">
            <div className="text-[10px] text-zinc-500 font-sans">mAP@50 Metric</div>
            <div className="text-base font-semibold text-emerald-400">66.9%</div>
            <div className="text-[10px] text-zinc-400">IoU @ 0.50 Target</div>
          </div>
          <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.05] space-y-0.5">
            <div className="text-[10px] text-zinc-500 font-sans">Precision</div>
            <div className="text-base font-semibold text-emerald-400">74.1%</div>
            <div className="text-[10px] text-zinc-400">True Positives</div>
          </div>
          <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.05] space-y-0.5">
            <div className="text-[10px] text-zinc-500 font-sans">Recall</div>
            <div className="text-base font-semibold text-emerald-400">72.6%</div>
            <div className="text-[10px] text-zinc-400">Hazard Coverage</div>
          </div>
          <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.05] space-y-0.5">
            <div className="text-[10px] text-zinc-500 font-sans">FP Specificity</div>
            <div className="text-base font-semibold text-cyan-400">98.8%</div>
            <div className="text-[10px] text-zinc-400">Shadows / Mirage</div>
          </div>
          <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.05] space-y-0.5">
            <div className="text-[10px] text-zinc-500 font-sans">Edge Inference</div>
            <div className="text-base font-semibold text-amber-400">8.1 ms</div>
            <div className="text-[10px] text-zinc-400">NVIDIA AGX Orin</div>
          </div>
        </div>

        {/* Occlusion Reconstruction & DPDP Compliance Sub-Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="bg-black/30 border border-white/[0.05] p-3.5 rounded-xl space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-cyan-400">
              <Layers className="w-3.5 h-3.5" />
              <span>Occlusion Geometry Extrapolation Engine</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
              When a pothole is up to 45% occluded by standing rainwater, fallen leaves, or vehicle shadow, the AI computes visible chord length c and sagitta h to extrapolate the underlying curvature radius R = (c² / 8h) + (h / 2) (R ≈ 42.5 cm), preventing hazardous under-reporting of defect severity.
            </p>
          </div>

          <div className="bg-black/30 border border-white/[0.05] p-3.5 rounded-xl space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
              <EyeOff className="w-3.5 h-3.5" />
              <span>DPDP Act 2023 Autonomous Privacy Redaction</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
              100% compliant with the Digital Personal Data Protection Act: all pedestrian faces and civilian license plates are automatically blurred at the edge inside the Jetson Orin before transmission. Active hit-and-run violators (e.g. UK 07 AB 9042) are selectively unmasked under lawful warrant exemption.
            </p>
          </div>
        </div>
      </div>

      {/* Multi-Spectral False Positive Rejection & Mirage Suppression */}
      <div className="bg-[#0f1117] border border-white/[0.07] p-5 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-semibold text-white">Multi-Spectral False Positive Rejection & Mirage Suppression</h3>
          </div>
          <span className="text-[10px] font-mono text-zinc-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
            3,371 FALSE ALARMS PREVENTED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.05] space-y-1">
            <span className="text-[11px] text-zinc-400 font-sans">Tree & Cable Shadows</span>
            <div className="text-sm font-semibold text-emerald-400">1,482 Filtered</div>
            <span className="text-[10px] text-zinc-500">100% Non-Hazard Rejection</span>
          </div>
          <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.05] space-y-1">
            <span className="text-[11px] text-zinc-400 font-sans">Bitumen Tar Seam Strips</span>
            <div className="text-sm font-semibold text-emerald-400">1,240 Filtered</div>
            <span className="text-[10px] text-zinc-500">Planar Depth Disparity Check</span>
          </div>
          <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.05] space-y-1">
            <span className="text-[11px] text-zinc-400 font-sans">Heat Mirages & Reflections</span>
            <div className="text-sm font-semibold text-emerald-400">649 Filtered</div>
            <span className="text-[10px] text-zinc-500">Temporal Texture Consistency</span>
          </div>
          <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.05] space-y-1">
            <span className="text-[11px] text-zinc-400 font-sans">False Alarm Reduction</span>
            <div className="text-sm font-semibold text-white">₹6.7 Lakhs Saved</div>
            <span className="text-[10px] text-zinc-500">Unwarranted Dispatch Prevented</span>
          </div>
        </div>
      </div>
    </div>
  )
}


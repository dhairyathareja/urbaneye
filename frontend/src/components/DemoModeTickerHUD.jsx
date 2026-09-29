import React from 'react'
import { Pause, Sparkles, Activity } from 'lucide-react'

export default function DemoModeTickerHUD({ isDemoActive, onToggleDemo, demoStepInfo }) {
  if (!isDemoActive) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9990] bg-[#0c0e14]/90 backdrop-blur-xl border border-white/10 rounded-full px-5 py-2.5 shadow-2xl shadow-black/80 flex items-center gap-3.5 text-xs animate-in slide-in-from-bottom duration-300">
      
      {/* Active Indicator */}
      <div className="flex items-center gap-2 pr-3.5 border-r border-white/10">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-[11px] font-semibold text-slate-200 tracking-wide uppercase font-mono">
          Live Demo
        </span>
      </div>

      {/* Current Step */}
      <div className="flex items-center gap-2 text-slate-300">
        <Activity className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-medium text-slate-100">{demoStepInfo?.title || 'System Initializing...'}</span>
        {demoStepInfo?.detail && (
          <span className="text-slate-400 hidden sm:inline text-[11px]">· {demoStepInfo.detail}</span>
        )}
      </div>

      {/* Control Stop Button */}
      <button
        onClick={onToggleDemo}
        className="ml-1 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white px-2.5 py-1 rounded-full border border-white/10 text-[11px] font-medium transition-all flex items-center gap-1.5"
      >
        <Pause className="w-3 h-3" />
        Pause
      </button>

    </div>
  )
}


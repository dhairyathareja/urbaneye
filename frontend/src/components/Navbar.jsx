import React from 'react'
import { Map, Video, AlertCircle, BarChart3, Moon, Sun, Sparkles, LogOut, UserCheck } from 'lucide-react'

export default function Navbar({
  activeTab,
  setActiveTab,
  onOpenPitchModal,
  liveStats,
  currentUser,
  onLogout,
  theme,
  setTheme
}) {
  const tabs = [
    { id: 'map', label: 'Command Map', icon: Map },
    { id: 'camera', label: 'Live Stream', icon: Video },
    { id: 'incidents', label: 'Alert Queue', icon: AlertCircle, count: liveStats?.pending_action },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ]

  return (
    <header className="bg-white/80 dark:bg-[#08090d]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.07] px-5 py-2.5 sticky top-0 z-50 flex items-center justify-between gap-4">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="font-sora font-[300] text-sm tracking-[0.22em] text-slate-900 dark:text-white uppercase select-none">
            URBANEYE
          </span>
        </div>
      </div>

      {/* Segmented Glass Navigation */}
      <nav className="flex items-center bg-slate-100 dark:bg-white/[0.03] p-1 rounded-xl border border-slate-200 dark:border-white/[0.06]">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs transition-all duration-150 relative ${
                isActive
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-zinc-950 font-medium shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:bg-slate-200 dark:hover:bg-white/[0.04]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" strokeWidth={isActive ? 2 : 1.75} />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? 'bg-rose-600 text-white font-semibold'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Controls & User Profile Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="p-2 rounded-lg bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.07] text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:border-slate-300 dark:hover:border-white/[0.12] transition-colors"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? (
            <Moon className="w-3.5 h-3.5" strokeWidth={1.75} />
          ) : (
            <Sun className="w-3.5 h-3.5 text-amber-400" strokeWidth={1.75} />
          )}
        </button>

        {/* Trigger Test Modal */}
        <button
          onClick={onOpenPitchModal}
          className="flex items-center gap-1.5 bg-slate-900 dark:bg-zinc-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-zinc-950 font-medium px-3 py-1.5 rounded-lg text-xs transition-all shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" strokeWidth={2} />
          <span>Inference Test</span>
        </button>

        {/* User Badge & Log out */}
        {currentUser && (
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-white/10">
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-[11px] font-medium text-slate-900 dark:text-slate-200 leading-none">
                {currentUser.displayName || currentUser.username}
              </span>
              <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400/80 leading-tight">
                {currentUser.role || 'Municipal Admin'}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-lg bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.07] text-slate-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-300 dark:hover:border-rose-500/30 transition-colors"
              title="Lock Station / Switch User"
            >
              <LogOut className="w-3.5 h-3.5" strokeWidth={1.75} />
            </button>
          </div>
        )}
      </div>
    </header>
  )
}


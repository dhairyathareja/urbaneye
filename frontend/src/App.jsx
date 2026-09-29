import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import CommandCenterMap from './components/CommandCenterMap'
import LiveCameraFeed from './components/LiveCameraFeed'
import IncidentQueue from './components/IncidentQueue'
import AnalyticsDashboard from './components/AnalyticsDashboard'
import PitchModal from './components/PitchModal'
import LoginPage from './components/LoginPage'
import { MOCK_BUSES, MOCK_INCIDENTS, MOCK_ANALYTICS } from './mockData'

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('urbaneye_auth') === 'true'
  })
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('urbaneye_user')
      return stored ? JSON.parse(stored) : {
        username: 'admin.urbaneye',
        displayName: 'Command Controller',
        role: 'Smart City Dispatcher'
      }
    } catch {
      return {
        username: 'admin.urbaneye',
        displayName: 'Command Controller',
        role: 'Smart City Dispatcher'
      }
    }
  })

  const [activeTab, setActiveTab] = useState('map')
  const [buses, setBuses] = useState(MOCK_BUSES)
  const [incidents, setIncidents] = useState(MOCK_INCIDENTS)
  const [analyticsData, setAnalyticsData] = useState(MOCK_ANALYTICS)
  const [selectedIncident, setSelectedIncident] = useState(MOCK_INCIDENTS[0])
  const [selectedBus, setSelectedBus] = useState(MOCK_BUSES[0])
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('urbaneye_theme') || 'dark'
  })

  const handleLogin = (userData) => {
    setCurrentUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem('urbaneye_auth', 'true')
    localStorage.setItem('urbaneye_user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('urbaneye_auth')
  }

  // Apply theme to document element
  useEffect(() => {
    const htmlElement = document.documentElement
    if (theme === 'dark') {
      htmlElement.classList.add('dark')
    } else {
      htmlElement.classList.remove('dark')
    }
    localStorage.setItem('urbaneye_theme', theme)
  }, [theme])

  const fetchData = async () => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 1200)

      const [busesRes, incRes, analyticsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/buses`, { signal: controller.signal }),
        fetch(`${import.meta.env.VITE_API_URL}/api/incidents`, { signal: controller.signal }),
        fetch(`${import.meta.env.VITE_API_URL}/api/analytics`, { signal: controller.signal })
      ])
      
      clearTimeout(timeoutId)

      if (busesRes.ok) {
        const bData = await busesRes.json()
        if (bData.buses && bData.buses.length > 0) setBuses(bData.buses)
      }
      if (incRes.ok) {
        const iData = await incRes.json()
        if (iData.incidents && iData.incidents.length > 0) {
          setIncidents(iData.incidents)
          if (!selectedIncident) setSelectedIncident(iData.incidents[0])
        }
      }
      if (analyticsRes.ok) {
        const aData = await analyticsRes.json()
        setAnalyticsData(aData)
      }
    } catch (err) {
      // Standalone mode active
    }
  }

  useEffect(() => {
    if (!isAuthenticated) return
    fetchData()
    const interval = setInterval(fetchData, 4000)
    return () => clearInterval(interval)
  }, [isAuthenticated])

  const handlePerformAction = async (incidentId, action, assignedDept = '') => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/incidents/${incidentId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, assigned_dept: assignedDept })
      })
      if (res.ok) {
        fetchData()
        return
      }
    } catch (err) {
      // Standalone mode
    }

    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        const updatedStatus = action === 'DISPATCH' ? 'DISPATCHED' : action === 'RESOLVE' ? 'RESOLVED' : 'ACKNOWLEDGED'
        return { ...inc, status: updatedStatus, assigned_dept: assignedDept }
      }
      return inc
    }))
  }

  const handleTriggerPitchEvent = async (payload) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/trigger-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        const data = await res.json()
        setSelectedIncident(data.incident)
        fetchData()
        return
      }
    } catch (err) {
      // Standalone mode
    }

    const defaultBus = buses[0] || { id: 'UK 07 PA 0142', name: 'UTC Smart City EV #14' }
    const newInc = {
      id: `INC-${Math.floor(Math.random() * 900) + 9100}`,
      title: `${payload.hazard_type === 'hit_and_run' ? 'Hit-and-Run Vehicle Detection' : 'Pothole & Asphalt Fracture Detected'}`,
      type: payload.hazard_type || 'pothole',
      category: payload.hazard_type === 'hit_and_run' ? 'CRIME_TRAFFIC_SAFETY' : 'ROAD_DAMAGE',
      bus_id: payload.bus_id || defaultBus.id,
      bus_name: defaultBus.name,
      location_name: payload.location_name || 'Rajpur Road, Near Astley Hall, Dehradun',
      lat: 30.3282 + (Math.random() - 0.5) * 0.005,
      lng: 78.0456 + (Math.random() - 0.5) * 0.005,
      severity: 'CRITICAL',
      severity_score: 96,
      confidence: 0.98,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'PENDING',
      snapshot_url: `/api/snapshots/INC-9041.jpg`
    }

    setIncidents(prev => [newInc, ...prev])
    setSelectedIncident(newInc)
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white animate-in fade-in duration-300">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPitchModal={() => setIsPitchModalOpen(true)}
        liveStats={analyticsData?.summary}
        currentUser={currentUser}
        onLogout={handleLogout}
        theme={theme}
        setTheme={setTheme}
      />

      <main className="flex-1 w-full min-h-[calc(100vh-3.8rem)] overflow-y-auto relative">
        {activeTab === 'map' && (
          <CommandCenterMap
            buses={buses}
            incidents={incidents}
            onSelectIncident={(inc) => {
              setSelectedIncident(inc)
              setActiveTab('camera')
            }}
            onSelectBus={(bus) => {
              setSelectedBus(bus)
              setActiveTab('camera')
            }}
            onPerformAction={handlePerformAction}
          />
        )}

        {activeTab === 'camera' && (
          <LiveCameraFeed
            buses={buses}
            selectedBus={selectedBus}
            setSelectedBus={setSelectedBus}
            activeIncident={selectedIncident}
          />
        )}

        {activeTab === 'incidents' && (
          <IncidentQueue
            incidents={incidents}
            onSelectIncident={(inc) => {
              setSelectedIncident(inc)
              setActiveTab('camera')
            }}
            onPerformAction={handlePerformAction}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            analyticsData={analyticsData}
            incidents={incidents}
          />
        )}
      </main>

      <PitchModal
        isOpen={isPitchModalOpen}
        onClose={() => setIsPitchModalOpen(false)}
        buses={buses}
        onTriggerEvent={handleTriggerPitchEvent}
      />
    </div>
  )
}


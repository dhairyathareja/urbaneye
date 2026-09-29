import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import {
  Layers,
  AlertCircle,
  Eye,
  Send,
  Clock,
  CheckCircle2,
  Navigation,
  Sparkles,
  Compass,
  MapPin,
  Activity,
  Map as MapIcon,
  Shield,
  Smartphone,
  CloudRain,
  Truck,
  TrendingUp,
  X,
  ChevronRight,
  Radio,
  FileText
} from 'lucide-react'
import IncidentLifecycleStepper from './IncidentLifecycleStepper'
import AiSeverityReasoningPanel from './AiSeverityReasoningPanel'
import AiExplainabilityModal from './AiExplainabilityModal'
import RouteOptimizationModal from './RouteOptimizationModal'
import { ROAD_GEOMETRIES } from '../roadGeometry'

export default function CommandCenterMap({ buses, incidents, onSelectIncident, onSelectBus, onPerformAction }) {
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersGroupRef = useRef(null)
  const trafficGroupRef = useRef(null)
  const multiRouteGroupRef = useRef(null)
  const baseLayersRef = useRef({})

  const [selectedPin, setSelectedPin] = useState(null)
  const [showLiveTraffic, setShowLiveTraffic] = useState(true)
  const [showMultiStopRoute, setShowMultiStopRoute] = useState(true)
  const [mapStyle, setMapStyle] = useState('googleStreets')
  const [isExplainModalOpen, setIsExplainModalOpen] = useState(false)
  const [dispatchTargetIncident, setDispatchTargetIncident] = useState(null)
  const [showResolutionProofModal, setShowResolutionProofModal] = useState(false)
  const [showMultiPassModal, setShowMultiPassModal] = useState(false)

  // Animated Travelling Avatar Progress (0.0 to 1.0)
  const [truckProgress, setTruckProgress] = useState(0)

  useEffect(() => {
    if (incidents && incidents.length > 0 && !selectedPin) {
      const topCritical = incidents.find((i) => i.severity === 'CRITICAL') || incidents[0]
      setSelectedPin(topCritical)
    }
  }, [incidents])

  // Initialize Map Centered squarely on DEHRADUN (Clock Tower / Rajpur Road corridor)
  useEffect(() => {
    if (!mapContainerRef.current) return

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [30.3255, 78.0437], // Dehradun Clock Tower (Ghanta Ghar)
        zoom: 14,
        zoomControl: false,
        attributionControl: false
      })

      L.control.zoom({ position: 'bottomright' }).addTo(map)

      const googleStreetsLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        updateWhenIdle: false,
        keepBuffer: 4
      })

      const googleHybridLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        updateWhenIdle: false,
        keepBuffer: 4
      })

      const darkLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
        updateWhenIdle: false,
        keepBuffer: 4
      })

      googleStreetsLayer.addTo(map)

      baseLayersRef.current = {
        googleStreets: googleStreetsLayer,
        googleHybrid: googleHybridLayer,
        dark: darkLayer
      }

      mapInstanceRef.current = map
      trafficGroupRef.current = L.layerGroup().addTo(map)
      multiRouteGroupRef.current = L.layerGroup().addTo(map)
      markersGroupRef.current = L.layerGroup().addTo(map)
    }
  }, [])

  // Basemap Switcher
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !baseLayersRef.current.googleStreets) return

    const layers = baseLayersRef.current
    const targetLayer = layers[mapStyle] || layers.googleStreets

    if (!map.hasLayer(targetLayer)) {
      targetLayer.addTo(map)
      targetLayer.bringToBack()
    }

    Object.keys(layers).forEach((key) => {
      if (key !== mapStyle && map.hasLayer(layers[key])) {
        map.removeLayer(layers[key])
      }
    })
  }, [mapStyle])

  // Progress interval for live moving crew avatar
  useEffect(() => {
    const animInterval = setInterval(() => {
      setTruckProgress((prev) => (prev + 0.003) % 1.0)
    }, 120)

    return () => clearInterval(animInterval)
  }, [])

  // Multi-Stop Route & Minimalist Travelling Avatar (100% Exact OSRM Road Geometry)
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !multiRouteGroupRef.current) return

    const routeGroup = multiRouteGroupRef.current
    routeGroup.clearLayers()

    if (!showMultiStopRoute) return

    // 100% exact road geometry tracing Railway Station -> Clock Tower -> Astley Hall -> Madhuban -> Pacific Mall
    const routePoints = ROAD_GEOMETRIES?.crew07_route || []
    if (routePoints.length === 0) return

    const multiPoly = L.polyline(routePoints, {
      color: '#0284c7',
      weight: 4.5,
      dashArray: '8, 6',
      opacity: 0.95
    })
    multiPoly.bindTooltip('<strong>PWD Crew 07 Optimized Route</strong> • 100% Road Snapped', { sticky: true })
    routeGroup.addLayer(multiPoly)

    const totalSegments = routePoints.length - 1
    const scaledProgress = truckProgress * totalSegments
    const segIdx = Math.min(Math.floor(scaledProgress), totalSegments - 1)
    const segT = scaledProgress - segIdx

    const p1 = routePoints[segIdx]
    const p2 = routePoints[segIdx + 1]

    const currLat = p1[0] + (p2[0] - p1[0]) * segT
    const currLng = p1[1] + (p2[1] - p1[1]) * segT

    const remainingEtaMin = Math.max(1, Math.round((1.0 - truckProgress) * 9))
    const distRemainingKm = ((1.0 - truckProgress) * 4.8).toFixed(1)

    // Minimalist Crew Avatar Pill
    const travellingAvatarHtml = `
      <div class="relative group cursor-pointer transition-transform duration-200">
        <div class="px-2.5 py-1 rounded-full bg-zinc-950/90 backdrop-blur-md border border-emerald-500/50 text-white shadow-2xl flex items-center gap-1.5 text-[11px] font-medium whitespace-nowrap">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="text-zinc-100 font-sans">Crew 07</span>
          <span class="text-zinc-400 text-[10px] font-mono">• ${remainingEtaMin}m (${distRemainingKm}km)</span>
        </div>
      </div>
    `

    const travellingIcon = L.divIcon({
      html: travellingAvatarHtml,
      className: 'custom-crew-marker',
      iconSize: [140, 28],
      iconAnchor: [70, 14]
    })

    const truckMarker = L.marker([currLat, currLng], { icon: travellingIcon })
    truckMarker.bindTooltip(`<strong>PWD Crew 07</strong><br/>En route to Rajpur Road site`, { sticky: true })
    routeGroup.addLayer(truckMarker)
  }, [showMultiStopRoute, truckProgress])

  // Live Traffic Flow Lines (100% Exact OSRM Road Geometry)
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !trafficGroupRef.current) return

    const trafficGroup = trafficGroupRef.current
    trafficGroup.clearLayers()

    if (!showLiveTraffic) return

    const dehradunTraffic = [
      {
        name: 'Rajpur Road Corridor (Heavy Congestion)',
        color: '#f43f5e',
        weight: 4,
        opacity: 0.85,
        dash: '6, 6',
        speed: '14 km/h',
        coords: ROAD_GEOMETRIES?.rajpur_road || []
      },
      {
        name: 'Chakrata Road Corridor (Smooth Flow)',
        color: '#10b981',
        weight: 3.5,
        opacity: 0.85,
        dash: '10, 4',
        speed: '48 km/h',
        coords: ROAD_GEOMETRIES?.chakrata_road || []
      },
      {
        name: 'EC Road & Haridwar Rd Corridor (Moderate)',
        color: '#f59e0b',
        weight: 3.5,
        opacity: 0.85,
        dash: '8, 6',
        speed: '28 km/h',
        coords: ROAD_GEOMETRIES?.ec_haridwar_road || []
      },
      {
        name: 'Saharanpur Road / ISBT Corridor',
        color: '#38bdf8',
        weight: 3.5,
        opacity: 0.85,
        dash: '8, 4',
        speed: '36 km/h',
        coords: ROAD_GEOMETRIES?.isbt_corridor || []
      }
    ]

    dehradunTraffic.forEach((tc) => {
      if (tc.coords.length > 0) {
        const line = L.polyline(tc.coords, { color: tc.color, weight: tc.weight, dashArray: tc.dash, opacity: tc.opacity })
        line.bindTooltip(`<strong>${tc.name}</strong> • ${tc.speed}`, { sticky: true })
        trafficGroup.addLayer(line)
      }
    })
  }, [showLiveTraffic])

  // Render Interactive Minimalist Markers
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !markersGroupRef.current) return

    const layerGroup = markersGroupRef.current
    layerGroup.clearLayers()

    // Bus Markers
    buses.forEach((bus) => {
      const busIconHtml = `
        <div class="relative group cursor-pointer transition-transform duration-150 custom-bus-marker">
          <div class="w-7 h-7 rounded-lg bg-zinc-900/90 backdrop-blur-md border border-sky-400/50 shadow-lg flex items-center justify-center text-sky-400 font-medium text-xs">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 6v6M15 6v6M2 12h19.6M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.6-.3-1-1-1H3c-.7 0-1 .4-1 1 0 .4.1.8.2 1.2.3 1.1.8 2.8.8 2.8h3"/>
              <circle cx="6.5" cy="18.5" r="2.5"/><circle cx="16.5" cy="18.5" r="2.5"/>
            </svg>
          </div>
        </div>
      `
      const customBusIcon = L.divIcon({
        html: busIconHtml,
        className: 'custom-bus-marker',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      })

      const busLat = bus.current_lat || bus.lat || 30.3255
      const busLng = bus.current_lng || bus.lng || 78.0437
      const busMarker = L.marker([busLat, busLng], { icon: customBusIcon })
      busMarker.on('click', () => onSelectBus(bus))
      busMarker.bindTooltip(`<strong>${bus.id}</strong> • ${bus.speed_kmh} km/h`, { sticky: true })
      layerGroup.addLayer(busMarker)
    })

    // Incident Pins
    incidents.forEach((inc) => {
      const isSelected = selectedPin?.id === inc.id
      let pinBg = 'bg-zinc-800 border-zinc-600 text-zinc-300'
      let pulseRing = ''

      if (inc.severity === 'CRITICAL') {
        pinBg = 'bg-rose-600 border-rose-400 text-white'
        pulseRing = '<div class="absolute -inset-1 rounded-lg bg-rose-500/30 animate-ping opacity-75"></div>'
      } else if (inc.severity === 'HIGH') {
        pinBg = 'bg-amber-500 border-amber-300 text-zinc-950'
      } else if (inc.severity === 'MODERATE') {
        pinBg = 'bg-zinc-700 border-zinc-500 text-zinc-200'
      }

      const pinHtml = `
        <div class="relative group cursor-pointer transition-transform duration-150 custom-pin-marker">
          ${pulseRing}
          <div class="relative w-8 h-8 rounded-lg ${pinBg} border flex items-center justify-center shadow-lg font-semibold text-xs transition-all ${isSelected ? 'ring-2 ring-white scale-110' : ''}">
            <span>${inc.severity_score || 90}</span>
          </div>
        </div>
      `

      const customIncIcon = L.divIcon({
        html: pinHtml,
        className: 'custom-pin-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      })

      const incMarker = L.marker([inc.lat, inc.lng], { icon: customIncIcon })
      incMarker.bindTooltip(`<strong>${inc.id}</strong> • ${inc.title}<br/>Score: ${inc.severity_score}/100`, { sticky: true })
      incMarker.on('click', () => setSelectedPin(inc))
      layerGroup.addLayer(incMarker)
    })
  }, [buses, incidents, selectedPin])

  return (
    <div className="relative w-full h-[calc(100vh-3.8rem)] bg-[#08090d] overflow-hidden">
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Minimalist Top HUD Bar */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-[#0c0e14]/80 backdrop-blur-xl border border-white/[0.08] p-1.5 rounded-xl shadow-xl">
        {/* Basemap Switcher */}
        <div className="flex items-center bg-white/[0.04] p-0.5 rounded-lg border border-white/[0.06] text-xs">
          <button
            onClick={() => setMapStyle('googleStreets')}
            className={`px-3 py-1 rounded-md transition-all font-medium ${
              mapStyle === 'googleStreets'
                ? 'bg-white text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Streets
          </button>
          <button
            onClick={() => setMapStyle('googleHybrid')}
            className={`px-3 py-1 rounded-md transition-all font-medium ${
              mapStyle === 'googleHybrid'
                ? 'bg-white text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Satellite
          </button>
        </div>

        {/* Multi-Pass Deduplication */}
        <button
          onClick={() => setShowMultiPassModal(true)}
          className="px-3 py-1 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] transition-colors flex items-center gap-1.5"
        >
          <Activity className="w-3.5 h-3.5 text-zinc-400" />
          <span>Multi-Pass (#RD-102)</span>
        </button>

        {/* Crew Route Toggle */}
        <button
          onClick={() => setShowMultiStopRoute(!showMultiStopRoute)}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 border ${
            showMultiStopRoute
              ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
              : 'bg-white/[0.03] text-zinc-400 border-white/[0.06] hover:text-zinc-200'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Crew 07 Tracker</span>
        </button>
      </div>

      {/* Subtle Weather Advisory Status Pill */}
      <div className="absolute top-4 right-4 z-20 bg-[#0c0e14]/80 backdrop-blur-xl border border-white/[0.08] px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2 text-xs text-zinc-300">
        <CloudRain className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-zinc-400">Weather Risk:</span>
        <span className="font-medium text-zinc-200">78% flood likelihood at EC Underpass</span>
      </div>

      {/* Minimal Legend */}
      <div className="absolute bottom-4 left-4 z-20 bg-[#0c0e14]/80 backdrop-blur-xl border border-white/[0.08] px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
          <span className="text-zinc-300 font-medium">Critical</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
          <span className="text-zinc-300 font-medium">High</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-zinc-600" />
          <span className="text-zinc-400 font-medium">Moderate</span>
        </div>
      </div>

      {/* Selected Incident Slide-over Sheet */}
      {selectedPin && (
        <div className="absolute top-4 right-4 bottom-4 z-30 w-96 bg-[#0c0e14]/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-2xl p-5 text-zinc-100 flex flex-col justify-between overflow-y-auto space-y-4 animate-in slide-in-from-right duration-200">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/[0.07] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-medium text-zinc-500">{selectedPin.id}</span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      selectedPin.severity === 'CRITICAL'
                        ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {selectedPin.severity} (Score: {selectedPin.severity_score}/100)
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-white mt-1 leading-snug">{selectedPin.title}</h3>
                <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-zinc-500" />
                  {selectedPin.location_name}
                </p>
              </div>
              <button
                onClick={() => setSelectedPin(null)}
                className="p-1 rounded-md text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.05] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Estimated Repair Budget Card */}
            <div className="bg-white/[0.02] border border-white/[0.06] p-3 rounded-xl flex items-center justify-between text-xs">
              <span className="text-zinc-400">Est. Repair Budget</span>
              <span className="font-mono font-semibold text-emerald-400">
                {selectedPin.type === 'pothole' ? '₹18,400' : selectedPin.type === 'waterlogging' ? '₹32,500' : '₹15,000'}
              </span>
            </div>

            {/* Decision Reasoning */}
            <AiSeverityReasoningPanel incident={selectedPin} />
            <IncidentLifecycleStepper incident={selectedPin} />
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-white/[0.07] space-y-2">
            {selectedPin.status === 'DISPATCHED' ? (
              <button
                onClick={() => setShowResolutionProofModal(true)}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Resolved (Before/After Proof)</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => onSelectIncident(selectedPin)}
                  className="flex-1 bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 font-medium py-2.5 rounded-xl text-xs border border-white/[0.08] transition-colors flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Inspect Stream</span>
                </button>
                <button
                  onClick={() => setDispatchTargetIncident(selectedPin)}
                  className="flex-1 bg-white hover:bg-zinc-100 text-zinc-950 font-medium py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Dispatch Crew</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* RESOLUTION PROOF MODAL */}
      {showResolutionProofModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f1117] border border-white/[0.09] rounded-2xl max-w-lg w-full p-6 space-y-5 text-zinc-100 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.07]">
              <span className="font-semibold text-sm text-zinc-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Resolution Verification Loop
              </span>
              <button onClick={() => setShowResolutionProofModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1.5">
                <span className="text-[11px] font-medium text-rose-400">Before (AI Detected)</span>
                <div className="h-32 bg-zinc-950 rounded-xl border border-white/[0.06] p-3 flex flex-col justify-center items-center text-center text-zinc-400 text-[11px]">
                  <span className="font-mono text-xs text-rose-400 font-semibold mb-1">14.5cm Depth</span>
                  Asphalt Crater Cluster
                </div>
              </div>
              <div className="space-y-1.5">
                <span className="text-[11px] font-medium text-emerald-400">After (Repaired)</span>
                <div className="h-32 bg-zinc-950 rounded-xl border border-white/[0.06] p-3 flex flex-col justify-center items-center text-center text-emerald-400 text-[11px]">
                  <span className="font-mono text-xs text-emerald-400 font-semibold mb-1">Smooth Topcoat</span>
                  Micro-Surfacing Complete
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onPerformAction(selectedPin.id, 'RESOLVE')
                setShowResolutionProofModal(false)
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-xl text-xs transition-colors shadow-sm"
            >
              Confirm Repair & Close Ledger Ticket
            </button>
          </div>
        </div>
      )}

      {/* MULTI-PASS DEDUPLICATION MODAL */}
      {showMultiPassModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f1117] border border-white/[0.09] rounded-2xl max-w-lg w-full p-6 space-y-4 text-zinc-100 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.07]">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-zinc-300" />
                <h3 className="font-semibold text-sm text-white">Multi-Pass Fleet Deduplication</h3>
              </div>
              <button onClick={() => setShowMultiPassModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white/[0.02] p-4 rounded-xl border border-white/[0.06] space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-medium text-white">Road Defect #RD-102</span>
                <span className="bg-rose-500/15 text-rose-400 px-2 py-0.5 rounded text-[10px] font-mono font-medium">
                  CRITICAL 92/100
                </span>
              </div>
              <div className="text-zinc-400 text-[11px]">Rajpur Road, Near Astley Hall, Dehradun</div>

              {/* 3 Fleet Passes */}
              <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
                <span className="text-zinc-400 text-[11px] font-medium">Independent Bus Corroboration:</span>
                <div className="space-y-1 text-zinc-300 font-mono text-[11px]">
                  <div className="bg-white/[0.02] p-2 rounded-lg flex justify-between">
                    <span>BUS-101 @ 08:42:15</span>
                    <span className="text-zinc-400">Conf: 82% • 12.0cm</span>
                  </div>
                  <div className="bg-white/[0.02] p-2 rounded-lg flex justify-between">
                    <span>BUS-204 @ 09:58:40</span>
                    <span className="text-zinc-400">Conf: 89% • 13.5cm</span>
                  </div>
                  <div className="bg-white/[0.02] p-2 rounded-lg flex justify-between">
                    <span>BUS-309 @ 11:17:38</span>
                    <span className="text-emerald-400 font-medium">Conf: 94% • 14.5cm</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/[0.07] p-2.5 rounded-lg text-zinc-300 text-[11px] leading-relaxed">
                Aggregated Bayesian probability elevates defect confidence to <strong className="text-white">97%</strong>, preventing 3 duplicate work tickets.
              </div>
            </div>

            <button
              onClick={() => setShowMultiPassModal(false)}
              className="w-full bg-white/[0.05] hover:bg-white/[0.1] text-zinc-200 font-medium py-2 rounded-xl text-xs transition-colors"
            >
              Close Multi-Pass Inspector
            </button>
          </div>
        </div>
      )}

      <AiExplainabilityModal
        isOpen={isExplainModalOpen}
        onClose={() => setIsExplainModalOpen(false)}
        incident={selectedPin}
      />

      <RouteOptimizationModal
        isOpen={Boolean(dispatchTargetIncident)}
        onClose={() => setDispatchTargetIncident(null)}
        incident={dispatchTargetIncident}
        onConfirmDispatch={onPerformAction}
      />
    </div>
  )
}


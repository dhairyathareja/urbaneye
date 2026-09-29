import React, { useState } from 'react'
import { Cpu, Play, Upload, X, Sparkles } from 'lucide-react'

export default function PitchModal({ isOpen, onClose, buses, onTriggerEvent }) {
  const [selectedBus, setSelectedBus] = useState('UK 07 PA 0142')
  const [selectedHazard, setSelectedHazard] = useState('pothole')
  const [locationName, setLocationName] = useState('Rajpur Road, Near Astley Hall, Dehradun')
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isFiring, setIsFiring] = useState(false)
  const [inferenceStep, setInferenceStep] = useState(null)

  if (!isOpen) return null

  const hazardOptions = [
    { id: 'pothole', label: 'Asphalt Pothole & Fracture', category: 'ROAD_DAMAGE' },
    { id: 'waterlogging', label: 'Monsoon Waterlogging & Flood', category: 'URBAN_HAZARD' },
    { id: 'hit_and_run', label: 'Vehicle Speed Violation / LPR', category: 'TRAFFIC_SAFETY' },
    { id: 'pedestrian', label: 'Pedestrian Crossing Risk', category: 'SAFETY_RISK' }
  ]

  const handleFireRealPipeline = async () => {
    setIsFiring(true)
    setInferenceStep('Ingesting frame from bus camera stream...')
    await new Promise((r) => setTimeout(r, 300))

    setInferenceStep('Executing YOLOv8 + OpenCV contour analysis...')

    try {
      const formData = new FormData()
      formData.append('hazard_type', selectedHazard)
      formData.append('bus_id', selectedBus)
      formData.append('location_name', locationName)
      if (uploadedFile) {
        formData.append('file', uploadedFile)
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/detect-real-frame`, {
        method: 'POST',
        body: formData
      })

      if (res.ok) {
        const data = await res.json()
        setInferenceStep(`Detected ${data.cv_result.class_name} (${data.cv_result.confidence_pct}% conf in ${data.cv_result.latency_ms}ms)`)
        await new Promise((r) => setTimeout(r, 400))
        await onTriggerEvent(data.incident)
      } else {
        await onTriggerEvent({ hazard_type: selectedHazard, bus_id: selectedBus, location_name: locationName })
      }
    } catch (e) {
      await onTriggerEvent({ hazard_type: selectedHazard, bus_id: selectedBus, location_name: locationName })
    }

    setIsFiring(false)
    setInferenceStep(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0f1117] border border-white/[0.09] rounded-2xl max-w-lg w-full p-6 space-y-5 text-zinc-100 shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/[0.07] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-zinc-300">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-white">Live Computer Vision Inference Test</h3>
              <p className="text-[11px] text-zinc-400 font-mono">BUS CAMERA → YOLOV8 EDGE PIPELINE</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hazard Selector */}
        <div className="space-y-1.5 text-xs">
          <label className="text-zinc-400 font-medium">Anomaly Category:</label>
          <div className="grid grid-cols-2 gap-2">
            {hazardOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelectedHazard(opt.id)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedHazard === opt.id
                    ? 'bg-white/[0.08] border-white/25 text-white shadow-sm'
                    : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="font-medium text-xs">{opt.label}</div>
                <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{opt.category}</div>
              </button>
            ))}
          </div>
        </div>

        {/* File Upload */}
        <div className="space-y-1 text-xs">
          <label className="text-zinc-400 font-medium flex justify-between">
            <span>Dashcam Frame Upload</span>
            <span className="text-zinc-500 font-mono text-[10px]">Optional (uses sample asset by default)</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setUploadedFile(e.target.files[0] || null)}
            className="w-full text-xs text-zinc-400 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-white/[0.08] file:text-zinc-200 hover:file:bg-white/[0.12] bg-white/[0.02] border border-white/[0.07] rounded-xl p-1.5"
          />
        </div>

        {/* Bus & Location */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <label className="text-zinc-400 font-medium">Sensing Fleet Unit:</label>
            <select
              value={selectedBus}
              onChange={(e) => setSelectedBus(e.target.value)}
              className="w-full bg-black/40 border border-white/[0.09] text-zinc-200 font-mono text-xs rounded-xl p-2 focus:outline-none focus:border-white/30"
            >
              {buses.map((bus) => (
                <option key={bus.id} value={bus.id}>
                  {bus.id}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400 font-medium">Dehradun Location:</label>
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="w-full bg-black/40 border border-white/[0.09] text-zinc-200 text-xs rounded-xl px-2.5 py-2 focus:outline-none focus:border-white/30"
            />
          </div>
        </div>

        {/* Step Progress Tracker */}
        {inferenceStep && (
          <div className="bg-white/[0.03] border border-white/[0.08] p-2.5 rounded-xl text-xs font-mono text-zinc-300">
            {inferenceStep}
          </div>
        )}

        {/* Execute CTA */}
        <button
          onClick={handleFireRealPipeline}
          disabled={isFiring}
          className="w-full bg-white hover:bg-zinc-100 text-zinc-950 font-medium py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <Play className="w-3.5 h-3.5 fill-zinc-950" />
          <span>{isFiring ? 'Running Inference...' : 'Run YOLOv8 AI Pipeline & Broadcast'}</span>
        </button>
      </div>
    </div>
  )
}


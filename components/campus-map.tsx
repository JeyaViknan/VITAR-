"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { MapPin, Navigation2, Zap, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Building, Route, UserLocation } from "@/lib/types"
import { calculateDistance } from "@/lib/ar-utils"

interface CampusMapProps {
  buildings: Building[]
  currentRoute?: Route
  userLocation?: UserLocation
  onBuildingSelect?: (building: Building) => void
  onClose?: () => void
}

export function CampusMap({ buildings, currentRoute, userLocation, onBuildingSelect, onClose }: CampusMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!canvasRef.current || buildings.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Calculate bounds
    const lats = buildings.map((b) => b.latitude)
    const lons = buildings.map((b) => b.longitude)
    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)
    const minLon = Math.min(...lons)
    const maxLon = Math.max(...lons)

    const latRange = maxLat - minLat || 0.001
    const lonRange = maxLon - minLon || 0.001

    // Add padding
    const padding = 40
    const mapWidth = canvas.width - padding * 2
    const mapHeight = canvas.height - padding * 2

    // Calculate scale
    const latScale = mapHeight / latRange
    const lonScale = mapWidth / lonRange
    const scale = Math.min(latScale, lonScale) * zoom

    // Calculate center
    const centerLat = (minLat + maxLat) / 2
    const centerLon = (minLon + maxLon) / 2
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Clear canvas
    ctx.fillStyle = "rgba(15, 23, 42, 1)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = "rgba(51, 65, 85, 0.3)"
    ctx.lineWidth = 1
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    // Draw route if available
    if (currentRoute && currentRoute.waypoints.length > 0) {
      ctx.strokeStyle = "rgba(59, 130, 246, 0.6)"
      ctx.lineWidth = 3
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      ctx.beginPath()
      currentRoute.waypoints.forEach((waypoint, index) => {
        const x = centerX + ((waypoint.longitude - centerLon) * scale) / lonRange + pan.x
        const y = centerY + ((waypoint.latitude - centerLat) * scale) / latRange + pan.y

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()

      // Draw waypoint markers
      currentRoute.waypoints.forEach((waypoint, index) => {
        const x = centerX + ((waypoint.longitude - centerLon) * scale) / lonRange + pan.x
        const y = centerY + ((waypoint.latitude - centerLat) * scale) / latRange + pan.y

        ctx.fillStyle = index === 0 ? "rgba(34, 197, 94, 0.9)" : "rgba(59, 130, 246, 0.9)"
        ctx.beginPath()
        ctx.arc(x, y, 6, 0, Math.PI * 2)
        ctx.fill()

        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"
        ctx.lineWidth = 2
        ctx.stroke()
      })
    }

    // Draw buildings
    buildings.forEach((building) => {
      const x = centerX + ((building.longitude - centerLon) * scale) / lonRange + pan.x
      const y = centerY + ((building.latitude - centerLat) * scale) / latRange + pan.y

      const isSelected = selectedBuilding?.id === building.id
      const isOnRoute = currentRoute?.waypoints.some((w) => w.buildingId === building.id)

      // Draw building marker
      ctx.fillStyle = isSelected
        ? "rgba(99, 102, 241, 1)"
        : isOnRoute
          ? "rgba(139, 92, 246, 0.8)"
          : "rgba(59, 130, 246, 0.7)"
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, Math.PI * 2)
      ctx.fill()

      // Draw border
      ctx.strokeStyle = isSelected ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.5)"
      ctx.lineWidth = isSelected ? 3 : 2
      ctx.stroke()

      // Draw label
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(building.name.substring(0, 10), x, y + 20)
    })

    // Draw user location
    if (userLocation) {
      const x = centerX + ((userLocation.longitude - centerLon) * scale) / lonRange + pan.x
      const y = centerY + ((userLocation.latitude - centerLat) * scale) / latRange + pan.y

      // Draw pulsing circle
      ctx.fillStyle = "rgba(34, 197, 94, 0.3)"
      ctx.beginPath()
      ctx.arc(x, y, 12, 0, Math.PI * 2)
      ctx.fill()

      // Draw center dot
      ctx.fillStyle = "rgba(34, 197, 94, 1)"
      ctx.beginPath()
      ctx.arc(x, y, 5, 0, Math.PI * 2)
      ctx.fill()

      // Draw direction indicator if heading available
      if (userLocation.heading !== undefined) {
        const headingRad = (userLocation.heading * Math.PI) / 180
        const arrowLength = 15
        const arrowX = x + Math.sin(headingRad) * arrowLength
        const arrowY = y - Math.cos(headingRad) * arrowLength

        ctx.strokeStyle = "rgba(34, 197, 94, 1)"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(arrowX, arrowY)
        ctx.stroke()
      }
    }
  }, [buildings, currentRoute, userLocation, selectedBuilding, zoom, pan])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top

    // Find clicked building
    const lats = buildings.map((b) => b.latitude)
    const lons = buildings.map((b) => b.longitude)
    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)
    const minLon = Math.min(...lons)
    const maxLon = Math.max(...lons)

    const latRange = maxLat - minLat || 0.001
    const lonRange = maxLon - minLon || 0.001

    const centerLat = (minLat + maxLat) / 2
    const centerLon = (minLon + maxLon) / 2
    const centerX = canvasRef.current.width / 2
    const centerY = canvasRef.current.height / 2

    const mapHeight = canvasRef.current.height - 80
    const mapWidth = canvasRef.current.width - 80
    const latScale = mapHeight / latRange
    const lonScale = mapWidth / lonRange
    const scale = Math.min(latScale, lonScale) * zoom

    for (const building of buildings) {
      const x = centerX + ((building.longitude - centerLon) * scale) / lonRange + pan.x
      const y = centerY + ((building.latitude - centerLat) * scale) / latRange + pan.y

      const distance = Math.sqrt((clickX - x) ** 2 + (clickY - y) ** 2)
      if (distance < 15) {
        setSelectedBuilding(building)
        onBuildingSelect?.(building)
        return
      }
    }

    setSelectedBuilding(null)
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return

    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y

    setPan((prev) => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY,
    }))

    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleZoom = (direction: "in" | "out") => {
    setZoom((prev) => {
      const newZoom = direction === "in" ? prev * 1.2 : prev / 1.2
      return Math.max(0.5, Math.min(3, newZoom))
    })
  }

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-slate-900">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {/* Top Controls */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
          <p className="text-white text-sm font-semibold flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Campus Map
          </p>
        </div>
        {onClose && (
          <Button size="icon" variant="ghost" className="bg-black/50 hover:bg-black/70 text-white" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Zoom Controls */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 pointer-events-auto">
        <Button size="icon" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleZoom("in")}>
          +
        </Button>
        <Button size="icon" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleZoom("out")}>
          −
        </Button>
      </div>

      {/* User Location Info */}
      {userLocation && (
        <div className="absolute bottom-4 left-4 pointer-events-auto">
          <Card className="p-4 bg-black/50 border-blue-500/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-white mb-2">
              <MapPin className="w-4 h-4 text-green-500" />
              <span className="text-sm font-semibold">Your Location</span>
            </div>
            <p className="text-xs text-gray-300">
              {userLocation.latitude.toFixed(6)}, {userLocation.longitude.toFixed(6)}
            </p>
            {userLocation.accuracy && (
              <p className="text-xs text-gray-400">Accuracy: ±{userLocation.accuracy.toFixed(0)}m</p>
            )}
          </Card>
        </div>
      )}

      {/* Building Info Panel */}
      {selectedBuilding && (
        <div className="absolute bottom-4 right-4 pointer-events-auto max-w-sm">
          <Card className="p-4 bg-black/80 border-indigo-500/50 backdrop-blur-sm">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-white font-semibold">{selectedBuilding.name}</h3>
                <p className="text-xs text-gray-400 capitalize">{selectedBuilding.category}</p>
              </div>
              <button onClick={() => setSelectedBuilding(null)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-gray-300 mb-3">{selectedBuilding.description}</p>

            {selectedBuilding.amenities.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-400 mb-1">Amenities</p>
                <div className="flex flex-wrap gap-1">
                  {selectedBuilding.amenities.map((amenity) => (
                    <span key={amenity} className="text-xs bg-blue-600/30 text-blue-300 px-2 py-1 rounded">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {userLocation && (
              <div className="mb-3 p-2 bg-blue-600/20 rounded">
                <p className="text-xs text-gray-300">
                  Distance:{" "}
                  {calculateDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    selectedBuilding.latitude,
                    selectedBuilding.longitude,
                  ).toFixed(2)}{" "}
                  km
                </p>
              </div>
            )}

            <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm">
              <Navigation2 className="w-3 h-3 mr-2" />
              Navigate Here
            </Button>
          </Card>
        </div>
      )}
    </div>
  )
}

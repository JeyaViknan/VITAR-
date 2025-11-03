"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Play, Square, Download, AlertCircle } from "lucide-react"
import type { Waypoint } from "@/lib/types"
import { getGeolocation, watchGeolocation } from "@/lib/camera-utils"

export function RouteScanner() {
  const [isScanning, setIsScanning] = useState(false)
  const [routeName, setRouteName] = useState("")
  const [waypoints, setWaypoints] = useState<Waypoint[]>([])
  const [error, setError] = useState<string | null>(null)
  const watchIdRef = useRef<number | null>(null)
  const [distance, setDistance] = useState(0)

  const startScanning = async () => {
    setError(null)
    try {
      const coords = await getGeolocation()
      setWaypoints([
        {
          id: "start",
          buildingId: "",
          latitude: coords.latitude,
          longitude: coords.longitude,
          altitude: coords.altitude || undefined,
          name: "Start Point",
        },
      ])

      const id = watchGeolocation(
        (coords) => {
          setWaypoints((prev) => {
            const newWaypoint: Waypoint = {
              id: `wp-${Date.now()}`,
              buildingId: "",
              latitude: coords.latitude,
              longitude: coords.longitude,
              altitude: coords.altitude || undefined,
              name: `Waypoint ${prev.length}`,
            }

            // Calculate distance
            if (prev.length > 0) {
              const lastWp = prev[prev.length - 1]
              const R = 6371
              const dLat = ((coords.latitude - lastWp.latitude) * Math.PI) / 180
              const dLon = ((coords.longitude - lastWp.longitude) * Math.PI) / 180
              const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos((lastWp.latitude * Math.PI) / 180) *
                  Math.cos((coords.latitude * Math.PI) / 180) *
                  Math.sin(dLon / 2) *
                  Math.sin(dLon / 2)
              const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
              const dist = R * c
              setDistance((prev) => prev + dist)
            }

            return [...prev, newWaypoint]
          })
        },
        (err) => {
          setError(`Geolocation error: ${err.message}`)
        },
      )

      watchIdRef.current = id
      setIsScanning(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start scanning")
    }
  }

  const stopScanning = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
    setIsScanning(false)
  }

  const downloadRoute = () => {
    if (waypoints.length === 0) return

    const route = {
      name: routeName || "Campus Route",
      waypoints,
      distance,
      timestamp: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(route, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `route-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const clearRoute = () => {
    setWaypoints([])
    setDistance(0)
    setRouteName("")
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 border-blue-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Route Scanner</h3>

        {error && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Route Name</label>
            <Input
              placeholder="e.g., Library to Science Building"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              disabled={isScanning}
            />
          </div>

          <div className="flex gap-3">
            {!isScanning ? (
              <Button
                className="bg-gradient-to-r from-blue-600 to-indigo-600 flex-1"
                onClick={startScanning}
                disabled={!routeName.trim()}
              >
                <Play className="w-4 h-4 mr-2" />
                Start Scanning
              </Button>
            ) : (
              <Button className="bg-red-600 hover:bg-red-700 flex-1" onClick={stopScanning}>
                <Square className="w-4 h-4 mr-2" />
                Stop Scanning
              </Button>
            )}
          </div>

          {waypoints.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">{waypoints.length}</span> waypoints captured
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">{distance.toFixed(3)}</span> km distance
              </p>
            </div>
          )}

          {waypoints.length > 0 && (
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={downloadRoute}>
                <Download className="w-4 h-4 mr-2" />
                Download Route
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent" onClick={clearRoute}>
                Clear
              </Button>
            </div>
          )}
        </div>
      </Card>

      {waypoints.length > 0 && (
        <Card className="p-6 border-blue-100">
          <h4 className="font-semibold text-gray-900 mb-4">Waypoints</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {waypoints.map((wp, idx) => (
              <div key={wp.id} className="p-3 bg-gray-50 rounded-lg text-sm">
                <p className="font-medium text-gray-900">{wp.name}</p>
                <p className="text-gray-600">
                  {wp.latitude.toFixed(6)}, {wp.longitude.toFixed(6)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

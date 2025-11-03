"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Plus, Trash2, AlertCircle } from "lucide-react"
import type { Waypoint } from "@/lib/types"
import { getGeolocation } from "@/lib/camera-utils"

export function WaypointCapture() {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([])
  const [waypointName, setWaypointName] = useState("")
  const [waypointDesc, setWaypointDesc] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const captureWaypoint = async () => {
    if (!waypointName.trim()) {
      setError("Please enter a waypoint name")
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      const coords = await getGeolocation()
      const newWaypoint: Waypoint = {
        id: `wp-${Date.now()}`,
        buildingId: "",
        latitude: coords.latitude,
        longitude: coords.longitude,
        altitude: coords.altitude || undefined,
        name: waypointName,
        description: waypointDesc,
      }

      setWaypoints((prev) => [...prev, newWaypoint])
      setWaypointName("")
      setWaypointDesc("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to capture waypoint")
    } finally {
      setIsLoading(false)
    }
  }

  const deleteWaypoint = (id: string) => {
    setWaypoints((prev) => prev.filter((wp) => wp.id !== id))
  }

  const downloadWaypoints = () => {
    if (waypoints.length === 0) return

    const data = {
      waypoints,
      timestamp: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `waypoints-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 border-blue-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Capture Waypoints</h3>

        {error && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Waypoint Name</label>
            <Input
              placeholder="e.g., Main Entrance"
              value={waypointName}
              onChange={(e) => setWaypointName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
            <Input
              placeholder="e.g., North side of campus"
              value={waypointDesc}
              onChange={(e) => setWaypointDesc(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
            onClick={captureWaypoint}
            disabled={isLoading || !waypointName.trim()}
          >
            <MapPin className="w-4 h-4 mr-2" />
            {isLoading ? "Capturing..." : "Capture Current Location"}
          </Button>

          {waypoints.length > 0 && (
            <Button variant="outline" className="w-full bg-transparent" onClick={downloadWaypoints}>
              <Plus className="w-4 h-4 mr-2" />
              Download {waypoints.length} Waypoints
            </Button>
          )}
        </div>
      </Card>

      {waypoints.length > 0 && (
        <Card className="p-6 border-blue-100">
          <h4 className="font-semibold text-gray-900 mb-4">Captured Waypoints</h4>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {waypoints.map((wp) => (
              <div key={wp.id} className="p-4 bg-gray-50 rounded-lg flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{wp.name}</p>
                  {wp.description && <p className="text-sm text-gray-600">{wp.description}</p>}
                  <p className="text-xs text-gray-500 mt-1">
                    {wp.latitude.toFixed(6)}, {wp.longitude.toFixed(6)}
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => deleteWaypoint(wp.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

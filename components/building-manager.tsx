"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Trash2, AlertCircle } from "lucide-react"
import type { Building } from "@/lib/types"
import { getGeolocation } from "@/lib/camera-utils"

const CATEGORIES = ["academic", "residential", "dining", "library", "sports", "other"] as const
const AMENITIES_OPTIONS = ["WiFi", "Parking", "Accessible", "Restrooms", "Cafeteria", "Study Spaces"]

export function BuildingManager() {
  const [buildings, setBuildings] = useState<Building[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "academic" as const,
    amenities: [] as string[],
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const addBuilding = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      setError("Please fill in all required fields")
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      const coords = await getGeolocation()
      const newBuilding: Building = {
        id: `bldg-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        latitude: coords.latitude,
        longitude: coords.longitude,
        altitude: coords.altitude || undefined,
        category: formData.category,
        amenities: formData.amenities,
      }

      setBuildings((prev) => [...prev, newBuilding])
      setFormData({
        name: "",
        description: "",
        category: "academic",
        amenities: [],
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add building")
    } finally {
      setIsLoading(false)
    }
  }

  const deleteBuilding = (id: string) => {
    setBuildings((prev) => prev.filter((b) => b.id !== id))
  }

  const downloadBuildings = () => {
    if (buildings.length === 0) return

    const data = {
      buildings,
      timestamp: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `buildings-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 border-blue-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Building</h3>

        {error && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Building Name</label>
            <Input
              placeholder="e.g., Science Building"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <Input
              placeholder="e.g., Main science and research facility"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value as typeof formData.category }))
              }
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
            <div className="flex flex-wrap gap-2">
              {AMENITIES_OPTIONS.map((amenity) => (
                <button
                  key={amenity}
                  onClick={() => toggleAmenity(amenity)}
                  className={`px-3 py-1 rounded-full text-sm transition ${
                    formData.amenities.includes(amenity)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  disabled={isLoading}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>

          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
            onClick={addBuilding}
            disabled={isLoading || !formData.name.trim()}
          >
            <Plus className="w-4 h-4 mr-2" />
            {isLoading ? "Adding..." : "Add Building at Current Location"}
          </Button>

          {buildings.length > 0 && (
            <Button variant="outline" className="w-full bg-transparent" onClick={downloadBuildings}>
              <Plus className="w-4 h-4 mr-2" />
              Download {buildings.length} Buildings
            </Button>
          )}
        </div>
      </Card>

      {buildings.length > 0 && (
        <Card className="p-6 border-blue-100">
          <h4 className="font-semibold text-gray-900 mb-4">Buildings</h4>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {buildings.map((building) => (
              <div key={building.id} className="p-4 bg-gray-50 rounded-lg flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{building.name}</p>
                  <p className="text-sm text-gray-600">{building.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {building.latitude.toFixed(6)}, {building.longitude.toFixed(6)}
                  </p>
                  {building.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {building.amenities.map((amenity) => (
                        <span key={amenity} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => deleteBuilding(building.id)}
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

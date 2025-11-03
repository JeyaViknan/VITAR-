"use client"

import { useState, useEffect } from "react"
import { AlertCircle, Camera, Smartphone, MapPin, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { requestCameraPermission, requestDeviceOrientationPermission } from "@/lib/camera-utils"
import { getARCapabilities } from "@/lib/ar-utils"

interface CameraPermissionFlowProps {
  onPermissionsGranted: (permissions: PermissionStatus) => void
  onCancel?: () => void
}

export interface PermissionStatus {
  camera: boolean
  geolocation: boolean
  deviceOrientation: boolean
  arCapable: boolean
}

export function CameraPermissionFlow({ onPermissionsGranted, onCancel }: CameraPermissionFlowProps) {
  const [step, setStep] = useState<"intro" | "camera" | "location" | "orientation" | "complete">("intro")
  const [permissions, setPermissions] = useState<PermissionStatus>({
    camera: false,
    geolocation: false,
    deviceOrientation: false,
    arCapable: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [arCapabilities, setArCapabilities] = useState<any>(null)

  useEffect(() => {
    const checkCapabilities = async () => {
      try {
        const caps = await getARCapabilities()
        setArCapabilities(caps)
      } catch (err) {
        console.warn("Failed to check AR capabilities:", err)
        // Set default capabilities - will use fallback map
        setArCapabilities({
          webxr: false,
          arcore: false,
          arkit: false,
          hasAR: false,
        })
      }
    }
    checkCapabilities()
  }, [])

  const handleCameraPermission = async () => {
    setLoading(true)
    setError(null)
    try {
      const granted = await requestCameraPermission()
      if (granted) {
        setPermissions((prev) => ({ ...prev, camera: true }))
        setStep("location")
      } else {
        setError("Camera permission is required for AR navigation")
      }
    } catch (err) {
      setError("Failed to request camera permission")
    } finally {
      setLoading(false)
    }
  }

  const handleLocationPermission = () => {
    setLoading(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      () => {
        setPermissions((prev) => ({ ...prev, geolocation: true }))
        setStep("orientation")
      },
      (err) => {
        setError("Location permission is required for navigation")
        console.error("Geolocation error:", err)
      },
      { enableHighAccuracy: true },
    )
    setLoading(false)
  }

  const handleOrientationPermission = async () => {
    setLoading(true)
    setError(null)
    try {
      const granted = await requestDeviceOrientationPermission()
      if (granted) {
        setPermissions((prev) => ({ ...prev, deviceOrientation: true, arCapable: arCapabilities?.hasAR }))
        setStep("complete")
      } else {
        // Device orientation is optional, continue anyway
        setPermissions((prev) => ({ ...prev, arCapable: arCapabilities?.hasAR }))
        setStep("complete")
      }
    } catch (err) {
      // Continue without device orientation
      setPermissions((prev) => ({ ...prev, arCapable: arCapabilities?.hasAR }))
      setStep("complete")
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = () => {
    onPermissionsGranted(permissions)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        {step === "intro" && (
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">Setup Navigation</h2>
            <p className="text-gray-600 text-center mb-6">
              To provide the best AR navigation experience, we need access to your camera, location, and device
              orientation.
            </p>

            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <Camera className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Camera</p>
                  <p className="text-sm text-gray-600">For AR overlays and navigation</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Location</p>
                  <p className="text-sm text-gray-600">To determine your position on campus</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Compass className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Device Orientation</p>
                  <p className="text-sm text-gray-600">For accurate AR alignment</p>
                </div>
              </div>
            </div>

            {arCapabilities && !arCapabilities.hasAR && (
              <Alert className="mb-6 border-yellow-200 bg-yellow-50">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  Your device may not support AR. You'll use the 3D map instead.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3">
              {onCancel && (
                <Button variant="outline" className="flex-1 bg-transparent" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600" onClick={() => setStep("camera")}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === "camera" && (
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Camera className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">Camera Access</h2>
            <p className="text-gray-600 text-center mb-8">
              We need access to your camera to display AR overlays and navigation markers.
            </p>

            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 mb-3"
              onClick={handleCameraPermission}
              disabled={loading}
            >
              {loading ? "Requesting..." : "Allow Camera Access"}
            </Button>
            <Button variant="outline" className="w-full bg-transparent" onClick={onCancel} disabled={loading}>
              Skip for Now
            </Button>
          </div>
        )}

        {step === "location" && (
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">Location Access</h2>
            <p className="text-gray-600 text-center mb-8">
              We need your location to show your position on the campus map and calculate routes.
            </p>

            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 mb-3"
              onClick={handleLocationPermission}
              disabled={loading}
            >
              {loading ? "Requesting..." : "Allow Location Access"}
            </Button>
            <Button variant="outline" className="w-full bg-transparent" onClick={onCancel} disabled={loading}>
              Skip for Now
            </Button>
          </div>
        )}

        {step === "orientation" && (
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Compass className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">Device Orientation</h2>
            <p className="text-gray-600 text-center mb-8">
              Device orientation helps align AR markers correctly with your surroundings.
            </p>

            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 mb-3"
              onClick={handleOrientationPermission}
              disabled={loading}
            >
              {loading ? "Requesting..." : "Allow Orientation Access"}
            </Button>
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={handleOrientationPermission}
              disabled={loading}
            >
              Continue Without
            </Button>
          </div>
        )}

        {step === "complete" && (
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Smartphone className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">Ready to Navigate!</h2>
            <p className="text-gray-600 text-center mb-8">
              {permissions.arCapable
                ? "Your device supports AR. You're all set for an immersive navigation experience."
                : "Your device will use the 3D map for navigation."}
            </p>

            <div className="bg-blue-50 rounded-lg p-4 mb-8">
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Camera</span>
                  <span className={permissions.camera ? "text-green-600 font-semibold" : "text-gray-400"}>
                    {permissions.camera ? "✓" : "✗"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className={permissions.geolocation ? "text-green-600 font-semibold" : "text-gray-400"}>
                    {permissions.geolocation ? "✓" : "✗"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Device Orientation</span>
                  <span className={permissions.deviceOrientation ? "text-green-600 font-semibold" : "text-gray-400"}>
                    {permissions.deviceOrientation ? "✓" : "✗"}
                  </span>
                </div>
              </div>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
              onClick={handleComplete}
              disabled={!permissions.camera && !permissions.geolocation}
            >
              Start Navigation
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}

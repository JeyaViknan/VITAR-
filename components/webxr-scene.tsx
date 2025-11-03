"use client"

import { useEffect, useRef, useState } from "react"
import { AlertCircle, X, Navigation2, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Building, Route, UserLocation } from "@/lib/types"

interface WebXRSceneProps {
  buildings: Building[]
  currentRoute?: Route
  userLocation?: UserLocation
  onClose?: () => void
}

export function WebXRScene({ buildings, currentRoute, userLocation, onClose }: WebXRSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isSupported, setIsSupported] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const sessionRef = useRef<XRSession | null>(null)
  const glRef = useRef<WebGLRenderingContext | null>(null)

  useEffect(() => {
    const checkSupport = async () => {
      if (!navigator.xr) {
        setError("WebXR is not supported on this device")
        return
      }

      try {
        const supported = await navigator.xr.isSessionSupported("immersive-ar")
        setIsSupported(supported)
      } catch (err) {
        setError("Failed to check WebXR support")
      }
    }

    checkSupport()
  }, [])

  const startARSession = async () => {
    if (!navigator.xr || !canvasRef.current) return

    try {
      const session = await navigator.xr.requestSession("immersive-ar", {
        requiredFeatures: ["hit-test", "dom-overlay"],
        domOverlay: { root: document.body },
      })

      sessionRef.current = session
      setIsActive(true)

      const gl = canvasRef.current.getContext("webgl", { xrCompatible: true })
      if (!gl) {
        throw new Error("Failed to get WebGL context")
      }

      glRef.current = gl

      // Set up animation loop
      const onFrame = (time: number, frame: XRFrame) => {
        const session = frame.session
        const pose = frame.getViewerPose(frame.session.renderState.baseLayer!.framebuffer)

        if (pose) {
          // Render AR content here
          renderARContent(gl, pose, buildings, currentRoute, userLocation)
        }

        session.requestAnimationFrame(onFrame)
      }

      session.requestAnimationFrame(onFrame)
    } catch (err) {
      setError(`Failed to start AR session: ${err instanceof Error ? err.message : "Unknown error"}`)
      setIsActive(false)
    }
  }

  const stopARSession = async () => {
    if (sessionRef.current) {
      await sessionRef.current.end()
      sessionRef.current = null
      setIsActive(false)
    }
  }

  const renderARContent = (
    gl: WebGLRenderingContext,
    pose: XRViewerPose,
    buildings: Building[],
    route?: Route,
    userLocation?: UserLocation,
  ) => {
    // Clear the canvas
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    // Render AR markers for buildings and waypoints
    // This is a simplified version - full implementation would use Three.js or Babylon.js
    if (buildings.length > 0) {
      // Render building markers
      buildings.forEach((building) => {
        // Calculate screen position based on camera pose and building location
        // Render marker at calculated position
      })
    }

    if (route && route.waypoints.length > 0) {
      // Render path visualization
      route.waypoints.forEach((waypoint) => {
        // Render waypoint marker
      })
    }
  }

  if (!isSupported) {
    return (
      <div className="w-full h-screen bg-gray-900 flex items-center justify-center p-4">
        <Alert className="max-w-md border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            WebXR is not supported on this device. Switching to 3D map mode.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="relative w-full h-screen bg-gray-900">
      <canvas ref={canvasRef} className="w-full h-full" />

      {/* AR Controls Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 pointer-events-auto">
          <div className="flex items-center justify-between">
            <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
              <p className="text-white text-sm font-semibold">AR Navigation Active</p>
            </div>
            {onClose && (
              <Button
                size="icon"
                variant="ghost"
                className="bg-black/50 hover:bg-black/70 text-white"
                onClick={onClose}
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-auto">
          <div className="flex gap-3 justify-center">
            {!isActive ? (
              <Button
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                onClick={startARSession}
              >
                <Navigation2 className="w-4 h-4 mr-2" />
                Start AR Navigation
              </Button>
            ) : (
              <Button variant="destructive" onClick={stopARSession}>
                Stop AR Session
              </Button>
            )}
          </div>
        </div>

        {/* Location Info */}
        {userLocation && (
          <div className="absolute bottom-24 left-4 right-4 pointer-events-auto">
            <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white text-sm">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4" />
                <span className="font-semibold">Your Location</span>
              </div>
              <p className="text-gray-300">
                Lat: {userLocation.latitude.toFixed(6)}, Lon: {userLocation.longitude.toFixed(6)}
              </p>
              {userLocation.accuracy && (
                <p className="text-gray-400 text-xs mt-1">Accuracy: ±{userLocation.accuracy.toFixed(0)}m</p>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-auto">
          <Alert className="max-w-md border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  )
}

"use client"

import { useEffect, useRef, useState } from "react"
import type { UserLocation } from "@/lib/types"

export function useARSession() {
  const sessionRef = useRef<XRSession | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)

  useEffect(() => {
    // Watch user location
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          altitude: position.coords.altitude || undefined,
          accuracy: position.coords.accuracy,
          heading: position.coords.heading || undefined,
        })
      },
      (err) => {
        setError(`Geolocation error: ${err.message}`)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [])

  const startSession = async () => {
    if (!navigator.xr) {
      setError("WebXR not supported")
      return
    }

    try {
      const session = await navigator.xr.requestSession("immersive-ar", {
        requiredFeatures: ["hit-test"],
      })
      sessionRef.current = session
      setIsActive(true)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start AR session")
    }
  }

  const endSession = async () => {
    if (sessionRef.current) {
      await sessionRef.current.end()
      sessionRef.current = null
      setIsActive(false)
    }
  }

  return {
    isActive,
    error,
    userLocation,
    startSession,
    endSession,
    session: sessionRef.current,
  }
}

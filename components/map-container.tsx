"use client"

import { useState, useEffect } from "react"
import { CampusMap } from "./campus-map"
import { WebXRScene } from "./webxr-scene"
import type { Building, Route, UserLocation } from "@/lib/types"
import { getARCapabilities } from "@/lib/ar-utils"

interface MapContainerProps {
  buildings: Building[]
  currentRoute?: Route
  userLocation?: UserLocation
  onClose?: () => void
}

export function MapContainer({ buildings, currentRoute, userLocation, onClose }: MapContainerProps) {
  const [useAR, setUseAR] = useState(false)
  const [arCapable, setArCapable] = useState(false)

  useEffect(() => {
    const checkAR = async () => {
      const caps = await getARCapabilities()
      setArCapable(caps.hasAR)
    }
    checkAR()
  }, [])

  if (useAR && arCapable) {
    return (
      <WebXRScene
        buildings={buildings}
        currentRoute={currentRoute}
        userLocation={userLocation}
        onClose={() => setUseAR(false)}
      />
    )
  }

  return <CampusMap buildings={buildings} currentRoute={currentRoute} userLocation={userLocation} onClose={onClose} />
}

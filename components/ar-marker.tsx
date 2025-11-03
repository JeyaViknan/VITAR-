"use client"

import { useEffect, useRef } from "react"
import type { ARMarkerType } from "@/lib/types"

interface ARMarkerProps {
  marker: { type: ARMarkerType }
  screenPosition: { x: number; y: number }
  scale: number
  onClick?: () => void
}

export function ARMarkerComponent({ marker, screenPosition, scale, onClick }: ARMarkerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.transform = `translate(${screenPosition.x}px, ${screenPosition.y}px) scale(${scale})`
    }
  }, [screenPosition, scale])

  const getMarkerColor = () => {
    switch (marker.type) {
      case "waypoint":
        return "bg-blue-500"
      case "building":
        return "bg-indigo-600"
      case "signboard":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const getMarkerIcon = () => {
    switch (marker.type) {
      case "waypoint":
        return "📍"
      case "building":
        return "🏢"
      case "signboard":
        return "🪧"
      default:
        return "●"
    }
  }

  return (
    <div
      ref={containerRef}
      className={`absolute w-12 h-12 ${getMarkerColor()} rounded-full flex items-center justify-center text-white text-xl cursor-pointer hover:scale-110 transition-transform shadow-lg`}
      onClick={onClick}
      style={{
        transformOrigin: "center center",
        left: "-24px",
        top: "-24px",
      }}
    >
      {getMarkerIcon()}
    </div>
  )
}

"use client"

import { useEffect, useRef } from "react"
import type { Route } from "@/lib/types"

interface PathRendererProps {
  route: Route
  canvasWidth: number
  canvasHeight: number
}

export function PathRenderer({ route, canvasWidth, canvasHeight }: PathRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !route.waypoints.length) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvasWidth
    canvas.height = canvasHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    // Draw path line
    ctx.strokeStyle = "rgba(59, 130, 246, 0.8)"
    ctx.lineWidth = 3
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    // Calculate bounds for waypoints
    const lats = route.waypoints.map((w) => w.latitude)
    const lons = route.waypoints.map((w) => w.longitude)
    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)
    const minLon = Math.min(...lons)
    const maxLon = Math.max(...lons)

    const latRange = maxLat - minLat || 0.001
    const lonRange = maxLon - minLon || 0.001

    // Draw path
    ctx.beginPath()
    route.waypoints.forEach((waypoint, index) => {
      const x = ((waypoint.longitude - minLon) / lonRange) * canvasWidth
      const y = ((waypoint.latitude - minLat) / latRange) * canvasHeight

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Draw waypoint markers
    route.waypoints.forEach((waypoint, index) => {
      const x = ((waypoint.longitude - minLon) / lonRange) * canvasWidth
      const y = ((waypoint.latitude - minLat) / latRange) * canvasHeight

      // Draw circle
      ctx.fillStyle = index === 0 ? "rgba(34, 197, 94, 0.9)" : "rgba(59, 130, 246, 0.9)"
      ctx.beginPath()
      ctx.arc(x, y, 6, 0, Math.PI * 2)
      ctx.fill()

      // Draw border
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"
      ctx.lineWidth = 2
      ctx.stroke()
    })
  }, [route, canvasWidth, canvasHeight])

  return <canvas ref={canvasRef} className="absolute inset-0" />
}

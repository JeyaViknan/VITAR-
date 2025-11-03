// Building and location types
export interface Building {
  id: string
  name: string
  description: string
  latitude: number
  longitude: number
  altitude?: number
  imageUrl?: string
  category: "academic" | "residential" | "dining" | "library" | "sports" | "other"
  amenities: string[]
}

export interface Waypoint {
  id: string
  buildingId: string
  latitude: number
  longitude: number
  altitude?: number
  name: string
  description?: string
}

export interface Route {
  id: string
  startBuildingId: string
  endBuildingId: string
  waypoints: Waypoint[]
  distance: number
  estimatedTime: number
  difficulty: "easy" | "moderate" | "difficult"
}

export interface UserLocation {
  latitude: number
  longitude: number
  altitude?: number
  accuracy?: number
  heading?: number
}

export interface ARMarker {
  id: string
  position: { x: number; y: number; z: number }
  type: "waypoint" | "building" | "signboard"
  data: any
}

export type ARMarkerType = "waypoint" | "building" | "signboard"

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
}

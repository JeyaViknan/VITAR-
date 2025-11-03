import { db } from "./firebase"
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore"
import type { Building, Route, Waypoint } from "./types"

// Buildings
export async function fetchBuildings(category?: string): Promise<Building[]> {
  try {
    let q
    if (category) {
      q = query(collection(db, "buildings"), where("category", "==", category))
    } else {
      q = collection(db, "buildings")
    }

    const snapshot = await getDocs(q)
    const buildings: Building[] = []

    snapshot.forEach((doc) => {
      buildings.push({
        id: doc.id,
        ...doc.data(),
      } as Building)
    })

    return buildings
  } catch (error) {
    console.error("Error fetching buildings:", error)
    throw error
  }
}

export async function createBuilding(building: Omit<Building, "id">): Promise<Building> {
  try {
    const docRef = await addDoc(collection(db, "buildings"), {
      ...building,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return {
      id: docRef.id,
      ...building,
    }
  } catch (error) {
    console.error("Error creating building:", error)
    throw error
  }
}

export async function updateBuilding(id: string, updates: Partial<Building>): Promise<void> {
  try {
    await updateDoc(doc(db, "buildings", id), {
      ...updates,
      updatedAt: new Date(),
    })
  } catch (error) {
    console.error("Error updating building:", error)
    throw error
  }
}

export async function deleteBuilding(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "buildings", id))
  } catch (error) {
    console.error("Error deleting building:", error)
    throw error
  }
}

// Routes
export async function fetchRoutes(startBuildingId?: string, endBuildingId?: string): Promise<Route[]> {
  try {
    let q
    if (startBuildingId && endBuildingId) {
      q = query(
        collection(db, "routes"),
        where("startBuildingId", "==", startBuildingId),
        where("endBuildingId", "==", endBuildingId),
      )
    } else {
      q = collection(db, "routes")
    }

    const snapshot = await getDocs(q)
    const routes: Route[] = []

    snapshot.forEach((doc) => {
      routes.push({
        id: doc.id,
        ...doc.data(),
      } as Route)
    })

    return routes
  } catch (error) {
    console.error("Error fetching routes:", error)
    throw error
  }
}

export async function createRoute(route: Omit<Route, "id">): Promise<Route> {
  try {
    const docRef = await addDoc(collection(db, "routes"), {
      ...route,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return {
      id: docRef.id,
      ...route,
    }
  } catch (error) {
    console.error("Error creating route:", error)
    throw error
  }
}

export async function updateRoute(id: string, updates: Partial<Route>): Promise<void> {
  try {
    await updateDoc(doc(db, "routes", id), {
      ...updates,
      updatedAt: new Date(),
    })
  } catch (error) {
    console.error("Error updating route:", error)
    throw error
  }
}

export async function deleteRoute(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "routes", id))
  } catch (error) {
    console.error("Error deleting route:", error)
    throw error
  }
}

// Waypoints
export async function fetchWaypoints(buildingId?: string): Promise<Waypoint[]> {
  try {
    let q
    if (buildingId) {
      q = query(collection(db, "waypoints"), where("buildingId", "==", buildingId))
    } else {
      q = collection(db, "waypoints")
    }

    const snapshot = await getDocs(q)
    const waypoints: Waypoint[] = []

    snapshot.forEach((doc) => {
      waypoints.push({
        id: doc.id,
        ...doc.data(),
      } as Waypoint)
    })

    return waypoints
  } catch (error) {
    console.error("Error fetching waypoints:", error)
    throw error
  }
}

export async function createWaypoint(waypoint: Omit<Waypoint, "id">): Promise<Waypoint> {
  try {
    const docRef = await addDoc(collection(db, "waypoints"), {
      ...waypoint,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return {
      id: docRef.id,
      ...waypoint,
    }
  } catch (error) {
    console.error("Error creating waypoint:", error)
    throw error
  }
}

export async function updateWaypoint(id: string, updates: Partial<Waypoint>): Promise<void> {
  try {
    await updateDoc(doc(db, "waypoints", id), {
      ...updates,
      updatedAt: new Date(),
    })
  } catch (error) {
    console.error("Error updating waypoint:", error)
    throw error
  }
}

export async function deleteWaypoint(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "waypoints", id))
  } catch (error) {
    console.error("Error deleting waypoint:", error)
    throw error
  }
}

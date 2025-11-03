import { db } from "@/lib/firebase"
import { collection, getDocs, addDoc, query, where } from "firebase/firestore"
import type { Waypoint } from "@/lib/types"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const buildingId = searchParams.get("buildingId")

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

    return Response.json({ waypoints })
  } catch (error) {
    console.error("Error fetching waypoints:", error)
    return Response.json({ error: "Failed to fetch waypoints" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const waypoint = await request.json()

    // Validate required fields
    if (!waypoint.buildingId || !waypoint.latitude || !waypoint.longitude) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const docRef = await addDoc(collection(db, "waypoints"), {
      ...waypoint,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return Response.json({ id: docRef.id, ...waypoint }, { status: 201 })
  } catch (error) {
    console.error("Error creating waypoint:", error)
    return Response.json({ error: "Failed to create waypoint" }, { status: 500 })
  }
}

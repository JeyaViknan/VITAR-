import { db } from "@/lib/firebase"
import { collection, getDocs, addDoc, query, where } from "firebase/firestore"
import type { Route } from "@/lib/types"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startBuildingId = searchParams.get("start")
    const endBuildingId = searchParams.get("end")

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

    return Response.json({ routes })
  } catch (error) {
    console.error("Error fetching routes:", error)
    return Response.json({ error: "Failed to fetch routes" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const route = await request.json()

    // Validate required fields
    if (!route.startBuildingId || !route.endBuildingId || !route.waypoints) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const docRef = await addDoc(collection(db, "routes"), {
      ...route,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return Response.json({ id: docRef.id, ...route }, { status: 201 })
  } catch (error) {
    console.error("Error creating route:", error)
    return Response.json({ error: "Failed to create route" }, { status: 500 })
  }
}

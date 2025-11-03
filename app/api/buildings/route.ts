import { db } from "@/lib/firebase"
import { collection, getDocs, addDoc, query, where } from "firebase/firestore"
import type { Building } from "@/lib/types"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

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

    return Response.json({ buildings })
  } catch (error) {
    console.error("Error fetching buildings:", error)
    return Response.json({ error: "Failed to fetch buildings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const building = await request.json()

    // Validate required fields
    if (!building.name || !building.latitude || !building.longitude) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const docRef = await addDoc(collection(db, "buildings"), {
      ...building,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return Response.json({ id: docRef.id, ...building }, { status: 201 })
  } catch (error) {
    console.error("Error creating building:", error)
    return Response.json({ error: "Failed to create building" }, { status: 500 })
  }
}

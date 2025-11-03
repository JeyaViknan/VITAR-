"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CameraPermissionFlow, type PermissionStatus } from "@/components/camera-permission-flow"
import { MobileARNavigator } from "@/components/mobile-ar-navigator"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function NavigatorPage() {
  const router = useRouter()
  const [permissionsGranted, setPermissionsGranted] = useState(false)
  const [permissions, setPermissions] = useState<PermissionStatus | null>(null)
  const [destination, setDestination] = useState<string | null>(null)

  const handlePermissionsGranted = (perms: PermissionStatus) => {
    setPermissions(perms)
    setPermissionsGranted(true)
  }

  const handleCancel = () => {
    router.push("/")
  }

  const handleCloseNavigator = () => {
    router.push("/")
  }

  // Ask destination before starting any navigator/permission flow
  if (!destination) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
        <Card className="w-[90%] max-w-md p-6 bg-black/80 border-white/10 text-white">
          <h2 className="text-xl font-semibold mb-4">Where do you wanna go?</h2>
          <div className="space-y-4">
            <Select onValueChange={(v) => setDestination(v)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent className="bg-black text-white border-white/10">
                <SelectItem value="Library">Library</SelectItem>
                <SelectItem value="AB3">AB3</SelectItem>
                <SelectItem value="AB2">AB2</SelectItem>
                <SelectItem value="Boys Hostel">Boys Hostel</SelectItem>
                <SelectItem value="Girls Hostel">Girls Hostel</SelectItem>
              </SelectContent>
            </Select>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!destination}
              onClick={() => {
                // no-op; selecting destination updates state which will proceed to permission flow
              }}
            >
              Continue
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (!permissionsGranted) {
    return <CameraPermissionFlow onPermissionsGranted={handlePermissionsGranted} onCancel={handleCancel} />
  }

  return <MobileARNavigator onClose={handleCloseNavigator} destination={destination} />
}

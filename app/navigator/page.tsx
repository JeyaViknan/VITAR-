"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CameraPermissionFlow, type PermissionStatus } from "@/components/camera-permission-flow"
import { MobileARNavigator } from "@/components/mobile-ar-navigator"

export default function NavigatorPage() {
  const router = useRouter()
  const [permissionsGranted, setPermissionsGranted] = useState(false)
  const [permissions, setPermissions] = useState<PermissionStatus | null>(null)

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

  if (!permissionsGranted) {
    return <CameraPermissionFlow onPermissionsGranted={handlePermissionsGranted} onCancel={handleCancel} />
  }

  return <MobileARNavigator onClose={handleCloseNavigator} />
}

// AR utility functions for WebXR and fallback support

export const checkWebXRSupport = async (): Promise<boolean> => {
  if (!navigator.xr) {
    console.log("[v0] WebXR not available on this device")
    return false
  }
  try {
    const supported = await navigator.xr.isSessionSupported("immersive-ar")
    return supported
  } catch (error: any) {
    const errorName = error?.name || "Unknown"
    const errorMessage = error?.message || String(error)

    // Log as warning instead of error for permissions policy issues
    if (errorName === "NotAllowedError" || errorMessage.includes("permissions policy")) {
      console.warn("[v0] WebXR blocked by permissions policy - using fallback map mode")
    } else {
      console.warn("[v0] WebXR support check failed:", errorMessage)
    }

    return false
  }
}

export const checkARCoreSupport = (): boolean => {
  // Check for ARCore support (Android)
  const ua = navigator.userAgent
  return /Android/.test(ua)
}

export const checkARKitSupport = (): boolean => {
  // Check for ARKit support (iOS)
  const ua = navigator.userAgent
  return /iPhone|iPad|iPod/.test(ua)
}

export const getARCapabilities = async () => {
  const webxr = await checkWebXRSupport()
  const arcore = checkARCoreSupport()
  const arkit = checkARKitSupport()

  return {
    webxr,
    arcore,
    arkit,
    hasAR: webxr || arcore || arkit,
  }
}

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export const calculateBearing = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const lat1Rad = (lat1 * Math.PI) / 180
  const lat2Rad = (lat2 * Math.PI) / 180

  const y = Math.sin(dLon) * Math.cos(lat2Rad)
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon)

  const bearing = Math.atan2(y, x)
  return ((bearing * 180) / Math.PI + 360) % 360
}

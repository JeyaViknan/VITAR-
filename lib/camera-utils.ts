// Camera and device detection utilities

export const requestCameraPermission = async (): Promise<boolean> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false,
    })
    // Stop the stream immediately after checking permission
    stream.getTracks().forEach((track) => track.stop())
    return true
  } catch (error) {
    console.error("Camera permission denied:", error)
    return false
  }
}

export const getDeviceOrientation = (): Promise<{
  alpha: number
  beta: number
  gamma: number
}> => {
  return new Promise((resolve, reject) => {
    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      resolve({
        alpha: event.alpha || 0,
        beta: event.beta || 0,
        gamma: event.gamma || 0,
      })
      window.removeEventListener("deviceorientation", handleDeviceOrientation)
    }

    if (typeof DeviceOrientationEvent !== "undefined") {
      window.addEventListener("deviceorientation", handleDeviceOrientation)
      setTimeout(() => {
        window.removeEventListener("deviceorientation", handleDeviceOrientation)
        reject(new Error("Device orientation not available"))
      }, 5000)
    } else {
      reject(new Error("Device orientation not supported"))
    }
  })
}

export const requestDeviceOrientationPermission = async (): Promise<boolean> => {
  if (typeof DeviceOrientationEvent === "undefined") {
    return false
  }

  // iOS 13+ requires explicit permission
  if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
    try {
      const permission = await (DeviceOrientationEvent as any).requestPermission()
      return permission === "granted"
    } catch (error) {
      console.error("Device orientation permission denied:", error)
      return false
    }
  }

  return true
}

export const getGeolocation = (): Promise<GeolocationCoordinates> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )
  })
}

export const watchGeolocation = (
  callback: (coords: GeolocationCoordinates) => void,
  onError?: (error: GeolocationPositionError) => void,
): number => {
  return navigator.geolocation.watchPosition((position) => callback(position.coords), onError, {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
  })
}

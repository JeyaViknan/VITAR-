"use client"

import { useState, useEffect, useRef } from "react"
import { Camera, Volume2, VolumeX, Navigation, X, Compass, MapPin, ArrowRight, ArrowLeft, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface NavigationInstruction {
  id: string
  text: string
  distance?: number
  action: "straight" | "left" | "right" | "arrived"
  timestamp: number
}

interface MobileARNavigatorProps {
  onClose?: () => void
  destination?: string
}

// Simulated route with instructions - moved outside component for stability
const routeSteps: Omit<NavigationInstruction, "timestamp">[] = [
  { id: "1", text: "Start walking straight ahead", action: "straight", distance: 5 },
  { id: "2", text: "Move straight, walk 5 meters", action: "straight", distance: 5 },
  { id: "3", text: "Continue straight for 10 meters", action: "straight", distance: 10 },
  { id: "4", text: "Walk 2 meters and take left", action: "left", distance: 2 },
  { id: "5", text: "Walk straight for 15 meters", action: "straight", distance: 15 },
  { id: "6", text: "Walk 3 meters and turn right", action: "right", distance: 3 },
  { id: "7", text: "Continue straight for 8 meters", action: "straight", distance: 8 },
  { id: "8", text: "Walk 4 meters and take left", action: "left", distance: 4 },
  { id: "9", text: "Continue straight for 12 meters", action: "straight", distance: 12 },
  { id: "10", text: "You have arrived at your destination", action: "arrived" },
]

export function MobileARNavigator({ onClose, destination }: MobileARNavigatorProps) {
  const [isNavigating, setIsNavigating] = useState(false)
  const [currentInstruction, setCurrentInstruction] = useState<NavigationInstruction | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [distanceTraveled, setDistanceTraveled] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [showArrivedMessage, setShowArrivedMessage] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const instructionIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (cameraActive && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({
          video: { facingMode: "environment" }, // Back camera
        })
        .then((stream) => {
          streamRef.current = stream
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        })
        .catch((err) => {
          console.error("Camera error:", err)
          // Simulate camera view for demo
        })
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [cameraActive])

  useEffect(() => {
    let distanceInterval: NodeJS.Timeout | null = null
    
    if (isNavigating && cameraActive) {
      // Start with first instruction
      setCurrentStep(0)
      setCurrentInstruction({ ...routeSteps[0], timestamp: Date.now() })
      
      // Speak first instruction
      if (voiceEnabled) {
        speakInstruction(routeSteps[0].text)
      }

      // Simulate distance traveled
      distanceInterval = setInterval(() => {
        setDistanceTraveled((prev) => {
          // Simulate walking at ~1 m/s
          return prev + 1
        })
      }, 1000)

      // Simulate navigation progress
      instructionIntervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          const nextStep = prev + 1
          if (nextStep >= routeSteps.length) {
            setIsNavigating(false)
            if (distanceInterval) clearInterval(distanceInterval)
            return prev
          }
          const nextInstruction = { ...routeSteps[nextStep], timestamp: Date.now() }
          setCurrentInstruction(nextInstruction)
          
          if (voiceEnabled) {
            speakInstruction(nextInstruction.text)
          }
          
          return nextStep
        })
      }, 8000) // Change instruction every 8 seconds
    }

    return () => {
      if (instructionIntervalRef.current) {
        clearInterval(instructionIntervalRef.current)
        instructionIntervalRef.current = null
      }
      if (distanceInterval) {
        clearInterval(distanceInterval)
      }
    }
  }, [isNavigating, cameraActive, voiceEnabled])

  const speakInstruction = (text: string) => {
    if ("speechSynthesis" in window && voiceEnabled) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 1
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleStartNavigation = () => {
    if (!cameraActive) {
      setCameraActive(true)
      setTimeout(() => {
        setIsNavigating(true)
      }, 1000)
    } else {
      setIsNavigating(true)
    }
  }

  const handleStopNavigation = () => {
    setIsNavigating(false)
    setCurrentInstruction(null)
    setCurrentStep(0)
    setDistanceTraveled(0)
    if (instructionIntervalRef.current) {
      clearInterval(instructionIntervalRef.current)
      instructionIntervalRef.current = null
    }
    // Stop any ongoing speech
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }
  }

  const handleSecretArrive = () => {
    // Immediately simulate arrival for demo purposes
    setIsNavigating(false)
    setCurrentInstruction({ id: "secret", text: "You have reached your destination", action: "arrived", timestamp: Date.now() })
    setShowArrivedMessage(true)
    if (voiceEnabled) {
      speakInstruction("You have reached your destination")
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "straight":
        return <ArrowUp className="w-8 h-8" />
      case "left":
        return <ArrowLeft className="w-8 h-8" />
      case "right":
        return <ArrowRight className="w-8 h-8" />
      case "arrived":
        return <MapPin className="w-8 h-8" />
      default:
        return <Navigation className="w-8 h-8" />
    }
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col overflow-hidden ar-mode safe-area-inset">
      {/* Camera View / Background */}
      <div className="relative flex-1 w-full overflow-hidden">
        {cameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-center">
              <Camera className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Camera view will appear here</p>
            </div>
          </div>
        )}

        {/* AR Overlay Elements */}
        {isNavigating && currentInstruction && (
          <>
            {/* Navigation Instruction Card */}
            <div className="absolute bottom-20 left-4 right-4 z-10">
              <Card className="bg-black/80 backdrop-blur-lg border-blue-500/50 p-4 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-blue-600/30 rounded-full flex items-center justify-center border border-blue-500/50">
                    {getActionIcon(currentInstruction.action)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-lg">{currentInstruction.text}</p>
                    {currentInstruction.distance && (
                      <p className="text-sm text-gray-300">In {currentInstruction.distance} meters</p>
                    )}
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  Step {currentStep + 1} of {routeSteps.length}
                </div>
              </Card>
            </div>

            {/* Direction Arrow Overlay */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="relative">
                {currentInstruction.action === "straight" && (
                  <div className="animate-pulse">
                    <ArrowUp className="w-16 h-16 text-blue-500 drop-shadow-lg" />
                  </div>
                )}
                {currentInstruction.action === "left" && (
                  <div className="animate-pulse">
                    <ArrowLeft className="w-16 h-16 text-blue-500 drop-shadow-lg" />
                  </div>
                )}
                {currentInstruction.action === "right" && (
                  <div className="animate-pulse">
                    <ArrowRight className="w-16 h-16 text-blue-500 drop-shadow-lg" />
                  </div>
                )}
              </div>
            </div>

            {/* Distance Indicator */}
            <div className="absolute top-24 left-4 right-4 z-10">
              <Card className="bg-black/60 backdrop-blur-md border-white/20 p-3 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Compass className="w-5 h-5 text-blue-400" />
                    <span className="text-sm">Distance traveled:</span>
                  </div>
                  <span className="font-bold">{distanceTraveled.toFixed(1)}m</span>
                </div>
              </Card>
            </div>
          </>
        )}

        {/* Top Status Bar */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-black/60 backdrop-blur-md border-b border-white/10 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {cameraActive ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-white text-sm font-medium">AR Active</span>
                </div>
              ) : (
                <span className="text-gray-400 text-sm">Camera Off</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              {onClose && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                  onClick={onClose}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Simulated AR Markers */}
        {isNavigating && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Random AR markers for visual effect */}
            <div className="absolute top-32 left-8 w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>
            <div className="absolute top-48 right-12 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div className="absolute bottom-64 left-16 w-4 h-4 bg-yellow-500 rounded-full animate-ping delay-1000"></div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 pb-8 z-20">
        <div className="flex items-center justify-center gap-4">
          {!cameraActive ? (
            <Button
              onClick={handleStartNavigation}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg"
              size="lg"
            >
              <Camera className="w-5 h-5 mr-2" />
              Start AR Navigation
            </Button>
          ) : !isNavigating ? (
            <Button
              onClick={handleStartNavigation}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg"
              size="lg"
            >
              <Navigation className="w-5 h-5 mr-2" />
              Begin Navigation
            </Button>
          ) : (
            <Button
              onClick={handleStopNavigation}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg"
              size="lg"
            >
              Stop Navigation
            </Button>
          )}
        </div>

        {isNavigating && (
          <div className="mt-4 flex items-center justify-center">
            <Button
              onClick={handleSecretArrive}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-4 rounded-full shadow-md"
              size="lg"
            >
              Secret
            </Button>
          </div>
        )}
      </div>

      {/* Destination header and success message overlays */}
      <div className="absolute top-12 left-0 right-0 z-20 flex items-center justify-center pointer-events-none">
        {destination && (
          <span className="bg-black/60 text-white border border-white/10 px-4 py-2 rounded-full text-sm">
            Navigating to: <span className="font-semibold">{destination}</span>
          </span>
        )}
      </div>

      {showArrivedMessage && (
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <div className="bg-black/70 border border-green-500/50 px-6 py-4 rounded-xl">
            <span className="text-green-400 text-xl font-semibold">You have reached your destination</span>
          </div>
        </div>
      )}
    </div>
  )
}


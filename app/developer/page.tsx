"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Zap, MapPin, Route } from "lucide-react"
import { RouteScanner } from "@/components/route-scanner"
import { WaypointCapture } from "@/components/waypoint-capture"
import { BuildingManager } from "@/components/building-manager"

export default function DeveloperPage() {
  const [activeTab, setActiveTab] = useState("scanner")

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b border-blue-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">VITAR Developer Tools</h1>
          </div>
          <a href="/" className="text-gray-600 hover:text-gray-900 transition">
            Back to Home
          </a>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Campus Configuration Tools</h2>
          <p className="text-gray-600">
            Use these tools to scan routes, capture waypoints, and manage campus buildings for VITAR navigation.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="scanner" className="flex items-center gap-2">
              <Route className="w-4 h-4" />
              Route Scanner
            </TabsTrigger>
            <TabsTrigger value="waypoints" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Waypoint Capture
            </TabsTrigger>
            <TabsTrigger value="buildings" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Building Manager
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scanner">
            <RouteScanner />
          </TabsContent>

          <TabsContent value="waypoints">
            <WaypointCapture />
          </TabsContent>

          <TabsContent value="buildings">
            <BuildingManager />
          </TabsContent>
        </Tabs>

        {/* Documentation */}
        <Card className="mt-12 p-8 border-blue-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            Developer Guide
          </h3>
          <div className="space-y-4 text-gray-600">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Route Scanner</h4>
              <p>
                Use the route scanner to trace paths between buildings. The tool records GPS coordinates and creates
                waypoints automatically as you walk the route.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Waypoint Capture</h4>
              <p>
                Manually capture specific waypoints at important locations. Each waypoint stores GPS coordinates, name,
                and description for precise navigation.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Building Manager</h4>
              <p>
                Create and manage campus buildings. Add building information, amenities, categories, and images for the
                navigation system.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </main>
  )
}

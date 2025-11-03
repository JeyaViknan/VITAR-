"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Smartphone, Map, MessageCircle, Zap } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleStartNavigation = () => {
    setIsLoading(true)
    router.push("/navigator")
  }

  const handleDeveloperTools = () => {
    router.push("/developer")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b border-blue-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">VITAR</h1>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition">
              Features
            </a>
            <a href="#about" className="text-gray-600 hover:text-gray-900 transition">
              About
            </a>
            <Button variant="outline" size="sm" onClick={handleDeveloperTools}>
              Developer Tools
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Navigate Your Campus with{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">AR</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Experience campus navigation like never before. Point your camera to see real-time directions, building
              information, and interactive waypoints overlaid on your surroundings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                onClick={handleStartNavigation}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Start Navigation"}
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
          <div className="relative h-96 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <Smartphone className="w-32 h-32 text-blue-600 opacity-50" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h3 className="text-4xl font-bold text-gray-900 mb-12 text-center">Powerful Features</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-8 hover:shadow-lg transition border-blue-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">WebAR Navigation</h4>
            <p className="text-gray-600">
              Real-time AR overlays show directions, building names, and waypoints directly on your camera feed.
            </p>
          </Card>

          <Card className="p-8 hover:shadow-lg transition border-blue-100">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <Map className="w-6 h-6 text-indigo-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">3D Fallback Map</h4>
            <p className="text-gray-600">
              For devices without AR support, explore the campus with an interactive 3D map interface.
            </p>
          </Card>

          <Card className="p-8 hover:shadow-lg transition border-blue-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">AI Chatbot</h4>
            <p className="text-gray-600">
              Ask questions about routes, buildings, and campus facilities. Get instant answers powered by AI.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to explore?</h3>
          <p className="text-lg mb-8 opacity-90">Start navigating your campus with AR-powered directions</p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" onClick={handleStartNavigation}>
            Launch Navigator
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h5 className="font-semibold text-gray-900 mb-4">VITAR</h5>
              <p className="text-gray-600 text-sm">Campus navigation reimagined with AR technology.</p>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-4">Product</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-4">Resources</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-4">Legal</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-gray-600 text-sm">
            <p>&copy; 2025 VITAR. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

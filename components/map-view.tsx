"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronRight, MapPin, Navigation, Play, Volume2 } from "lucide-react"

import type { Device } from "./item-tracker"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

interface MapViewProps {
  selectedDevice: Device | null
  devices: Device[]
}

export function MapView({ selectedDevice, devices }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [distance, setDistance] = useState(0)

  // Simulate distance calculation
  useEffect(() => {
    if (selectedDevice) {
      // Random distance between 5-200 meters
      setDistance(Math.floor(Math.random() * 195) + 5)
    }
  }, [selectedDevice])

  // Simulate sound playing
  const handlePlaySound = () => {
    setIsPlaying(!isPlaying)
    // In a real app, this would play a sound
    setTimeout(() => {
      setIsPlaying(false)
    }, 3000)
  }

  if (!selectedDevice) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-muted-foreground">Select a device to view its location</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl mr-2">{selectedDevice.emoji}</span>
              <h2 className="text-xl font-semibold">{selectedDevice.name}</h2>
            </div>
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{selectedDevice.location.address}</span>
          </div>
          <div
            ref={mapRef}
            className="w-full h-[300px] bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 relative overflow-hidden"
            style={{
              backgroundImage: "url('/placeholder.svg?height=600&width=800')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Map markers for all devices */}
            {devices.map((device) => (
              <div
                key={device.id}
                className={`absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center ${
                  device.id === selectedDevice.id ? "text-primary" : "text-gray-500 opacity-50"
                }`}
                style={{
                  left: `${((device.location.lng + 122.4194) * 100) % 100}%`,
                  top: `${((device.location.lat - 37.7749) * 100) % 100}%`,
                }}
              >
                <div
                  className={`rounded-full p-1 ${
                    device.id === selectedDevice.id ? "bg-primary text-primary-foreground" : "bg-background"
                  }`}
                >
                  {device.emoji}
                </div>
              </div>
            ))}

            {/* Pulse animation for selected device */}
            {selectedDevice && (
              <div
                className="absolute w-12 h-12 transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${((selectedDevice.location.lng + 122.4194) * 100) % 100}%`,
                  top: `${((selectedDevice.location.lat - 37.7749) * 100) % 100}%`,
                }}
              >
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="w-full flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Navigation className="h-4 w-4 mr-1 text-primary" />
              <span className="text-sm font-medium">Distance: {distance} meters away</span>
            </div>
            <div className="text-sm text-muted-foreground">Updated {selectedDevice.lastSeen}</div>
          </div>

          <Separator className="my-2" />

          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className={isPlaying ? "bg-primary text-primary-foreground" : ""}
                onClick={handlePlaySound}
              >
                {isPlaying ? (
                  <>
                    <Volume2 className="h-4 w-4 mr-1 animate-pulse" />
                    Playing...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-1" />
                    Play Sound
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm">
                <Navigation className="h-4 w-4 mr-1" />
                Directions
              </Button>
            </div>
            <div className="flex items-center gap-1">
              <Progress value={selectedDevice.battery} className="w-16 h-2" />
              <span className="text-xs text-muted-foreground">{selectedDevice.battery}%</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}


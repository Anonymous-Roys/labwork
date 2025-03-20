"use client"

import { useState } from "react"
import { Bluetooth, MapPin, Plus, Search } from "lucide-react"

import { DeviceList } from "./device-list"
import { MapView } from "./map-view"
import { NewDeviceDialog } from "./new-device-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RegisterDeviceDialog } from "./register-device-dialog"

export type Device = {
  id: string
  name: string
  emoji: string
  lastSeen: string
  battery: number
  location: {
    lat: number
    lng: number
    address: string
  }
}

const initialDevices: Device[] = [
  {
    id: "1",
    name: "Keys",
    emoji: "🔑",
    lastSeen: "2 minutes ago",
    battery: 85,
    location: {
      lat: 37.7749,
      lng: -122.4194,
      address: "Home, San Francisco",
    },
  },
  {
    id: "2",
    name: "Backpack",
    emoji: "🎒",
    lastSeen: "15 minutes ago",
    battery: 72,
    location: {
      lat: 37.7833,
      lng: -122.4167,
      address: "Office, San Francisco",
    },
  },
  {
    id: "3",
    name: "Wallet",
    emoji: "👛",
    lastSeen: "1 hour ago",
    battery: 45,
    location: {
      lat: 37.7694,
      lng: -122.4862,
      address: "Golden Gate Park",
    },
  },
  {
    id: "4",
    name: "Headphones",
    emoji: "🎧",
    lastSeen: "3 hours ago",
    battery: 23,
    location: {
      lat: 37.7879,
      lng: -122.4074,
      address: "Coffee Shop, Downtown",
    },
  },
]

export function ItemTracker() {
  const [devices, setDevices] = useState<Device[]>(initialDevices)
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(initialDevices[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false)

  const filteredDevices = devices.filter((device) => device.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const addDevice = (device: Omit<Device, "id" | "lastSeen" | "battery" | "location">) => {
    const newDevice: Device = {
      id: Math.random().toString(36).substring(2, 9),
      name: device.name,
      emoji: device.emoji,
      lastSeen: "Just now",
      battery: 100,
      location: {
        lat: 37.7749 + (Math.random() * 0.02 - 0.01),
        lng: -122.4194 + (Math.random() * 0.02 - 0.01),
        address: "Current Location",
      },
    }

    setDevices([...devices, newDevice])
    setSelectedDevice(newDevice)
    setIsDialogOpen(false)
  }

  const handleDeviceRegistered = (deviceId: string) => {
    // In a real app, this would use the actual device information
    const newDevice: Device = {
      id: deviceId,
      name: "New Device",
      emoji: "📍",
      lastSeen: "Just now",
      battery: 100,
      location: {
        lat: 37.7749 + (Math.random() * 0.02 - 0.01),
        lng: -122.4194 + (Math.random() * 0.02 - 0.01),
        address: "Current Location",
      },
    }

    setDevices([...devices, newDevice])
    setSelectedDevice(newDevice)
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Find My Items</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1" onClick={() => setIsRegisterDialogOpen(true)}>
            <Bluetooth className="h-4 w-4" />
            Register Device
          </Button>
          <Button variant="outline" size="icon" className="rounded-full" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add new device</span>
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search devices..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs defaultValue="items" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="items">Items</TabsTrigger>
              <TabsTrigger value="people">People</TabsTrigger>
            </TabsList>
            <TabsContent value="items" className="mt-2">
              <DeviceList
                devices={filteredDevices}
                selectedDevice={selectedDevice}
                onSelectDevice={setSelectedDevice}
              />
            </TabsContent>
            <TabsContent value="people" className="mt-2">
              <div className="flex flex-col items-center justify-center h-64 text-center p-4 border rounded-lg border-dashed border-gray-300 dark:border-gray-700">
                <MapPin className="h-10 w-10 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">No people sharing location</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Invite friends and family to share their location with you.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:col-span-2">
          <MapView selectedDevice={selectedDevice} devices={devices} />
        </div>
      </div>

      <NewDeviceDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onAddDevice={addDevice} />
      <RegisterDeviceDialog
        open={isRegisterDialogOpen}
        onOpenChange={setIsRegisterDialogOpen}
        onDeviceRegistered={handleDeviceRegistered}
      />
    </div>
  )
}


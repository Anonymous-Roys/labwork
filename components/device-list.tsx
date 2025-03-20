"use client"

import { Battery, BatteryLow, Clock } from "lucide-react"

import type { Device } from "./item-tracker"

interface DeviceListProps {
  devices: Device[]
  selectedDevice: Device | null
  onSelectDevice: (device: Device) => void
}

export function DeviceList({ devices, selectedDevice, onSelectDevice }: DeviceListProps) {
  if (devices.length === 0) {
    return (
      <div className="text-center p-4 border rounded-lg border-dashed border-gray-300 dark:border-gray-700">
        <p className="text-muted-foreground">No devices found</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {devices.map((device) => (
        <div
          key={device.id}
          className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
            selectedDevice?.id === device.id ? "bg-primary/10 dark:bg-primary/20" : "hover:bg-muted"
          }`}
          onClick={() => onSelectDevice(device)}
        >
          <div className="flex-shrink-0 mr-3 text-2xl">{device.emoji}</div>
          <div className="flex-grow">
            <h3 className="font-medium">{device.name}</h3>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              <span>{device.lastSeen}</span>
              <span className="mx-1">•</span>
              {device.battery < 25 ? (
                <BatteryLow className="h-3 w-3 mr-1 text-red-500" />
              ) : (
                <Battery className="h-3 w-3 mr-1" />
              )}
              <span className={device.battery < 25 ? "text-red-500" : ""}>{device.battery}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}


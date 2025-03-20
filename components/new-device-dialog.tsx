"use client"

import type React from "react"

import { useState } from "react"
import { Briefcase, Car, Gift, Home, Key, Laptop, Smartphone, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface NewDeviceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddDevice: (device: { name: string; emoji: string }) => void
}

const emojiOptions = [
  { emoji: "🔑", label: "Keys", icon: Key },
  { emoji: "👛", label: "Wallet", icon: Wallet },
  { emoji: "🎒", label: "Backpack", icon: Briefcase },
  { emoji: "📱", label: "Phone", icon: Smartphone },
  { emoji: "💻", label: "Laptop", icon: Laptop },
  { emoji: "🏠", label: "Home", icon: Home },
  { emoji: "🚗", label: "Car", icon: Car },
  { emoji: "🎁", label: "Gift", icon: Gift },
]

export function NewDeviceDialog({ open, onOpenChange, onAddDevice }: NewDeviceDialogProps) {
  const [deviceName, setDeviceName] = useState("")
  const [selectedEmoji, setSelectedEmoji] = useState(emojiOptions[0].emoji)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (deviceName.trim()) {
      onAddDevice({
        name: deviceName,
        emoji: selectedEmoji,
      })
      setDeviceName("")
      setSelectedEmoji(emojiOptions[0].emoji)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogDescription>Add a new item to track with your device network.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Item Name</Label>
              <Input
                id="name"
                placeholder="My Keys"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                autoComplete="off"
              />
            </div>
            <div className="grid gap-2">
              <Label>Choose Icon</Label>
              <div className="grid grid-cols-4 gap-2">
                {emojiOptions.map((option) => (
                  <Button
                    key={option.emoji}
                    type="button"
                    variant={selectedEmoji === option.emoji ? "default" : "outline"}
                    className="h-12 flex flex-col items-center justify-center gap-1 p-1"
                    onClick={() => setSelectedEmoji(option.emoji)}
                  >
                    <span className="text-lg">{option.emoji}</span>
                    <span className="text-xs">{option.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!deviceName.trim()}>
              Add Item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}


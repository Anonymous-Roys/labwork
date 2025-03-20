"use client"

import { useState } from "react"
import { Bluetooth, Check, ChevronRight, QrCode, RefreshCw, Smartphone } from "lucide-react"

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

interface RegisterDeviceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeviceRegistered: (deviceId: string) => void
}

type RegistrationStep = "method" | "code" | "bluetooth" | "pairing" | "success"

export function RegisterDeviceDialog({ open, onOpenChange, onDeviceRegistered }: RegisterDeviceDialogProps) {
  const [step, setStep] = useState<RegistrationStep>("method")
  const [registrationMethod, setRegistrationMethod] = useState<"code" | "bluetooth">("code")
  const [deviceCode, setDeviceCode] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [foundDevices, setFoundDevices] = useState<Array<{ id: string; name: string; signal: number }>>([])
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)
  const [isPairing, setIsPairing] = useState(false)
  const [pairingProgress, setPairingProgress] = useState(0)

  const resetFlow = () => {
    setStep("method")
    setRegistrationMethod("code")
    setDeviceCode("")
    setIsSearching(false)
    setFoundDevices([])
    setSelectedDevice(null)
    setIsPairing(false)
    setPairingProgress(0)
  }

  const handleClose = () => {
    resetFlow()
    onOpenChange(false)
  }

  const handleMethodSelect = (method: "code" | "bluetooth") => {
    setRegistrationMethod(method)
    setStep(method)
  }

  const handleCodeSubmit = () => {
    if (deviceCode.length === 8) {
      setStep("pairing")
      simulatePairing()
    }
  }

  const startBluetoothSearch = () => {
    setIsSearching(true)
    // Simulate finding devices after a delay
    setTimeout(() => {
      setFoundDevices([
        { id: "BT001", name: "Tracker 001", signal: 90 },
        { id: "BT002", name: "Tracker 002", signal: 75 },
        { id: "BT003", name: "Tracker 003", signal: 60 },
      ])
      setIsSearching(false)
    }, 2000)
  }

  const selectDevice = (deviceId: string) => {
    setSelectedDevice(deviceId)
  }

  const startPairing = () => {
    setStep("pairing")
    simulatePairing()
  }

  const simulatePairing = () => {
    setIsPairing(true)
    setPairingProgress(0)

    // Simulate pairing process with progress updates
    const interval = setInterval(() => {
      setPairingProgress((prev) => {
        const newProgress = prev + 10
        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setIsPairing(false)
            setStep("success")
          }, 500)
          return 100
        }
        return newProgress
      })
    }, 400)
  }

  const completeRegistration = () => {
    // Generate a random device ID that would normally come from the actual device
    const newDeviceId = `DEV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    onDeviceRegistered(newDeviceId)
    handleClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Register New Device</DialogTitle>
          <DialogDescription>Connect a new tracking device to your account</DialogDescription>
        </DialogHeader>

        {step === "method" && (
          <div className="py-4 space-y-4">
            <p className="text-sm text-muted-foreground">Choose how you want to register your new tracking device</p>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className={cn(
                  "h-auto flex flex-col items-center justify-center gap-2 p-6 border-2",
                  registrationMethod === "code" && "border-primary",
                )}
                onClick={() => handleMethodSelect("code")}
              >
                <QrCode className="h-10 w-10 mb-2" />
                <span className="font-medium">Registration Code</span>
                <span className="text-xs text-center text-muted-foreground">
                  Enter the 8-digit code that came with your device
                </span>
              </Button>

              <Button
                variant="outline"
                className={cn(
                  "h-auto flex flex-col items-center justify-center gap-2 p-6 border-2",
                  registrationMethod === "bluetooth" && "border-primary",
                )}
                onClick={() => handleMethodSelect("bluetooth")}
              >
                <Bluetooth className="h-10 w-10 mb-2" />
                <span className="font-medium">Bluetooth Pairing</span>
                <span className="text-xs text-center text-muted-foreground">
                  Scan for nearby devices and connect directly
                </span>
              </Button>
            </div>
          </div>
        )}

        {step === "code" && (
          <div className="py-4 space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Button variant="ghost" size="sm" onClick={() => setStep("method")}>
                Back
              </Button>
              <ChevronRight className="h-4 w-4" />
              <span>Enter Registration Code</span>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="bg-muted p-6 rounded-lg">
                  <QrCode className="h-16 w-16" />
                </div>
                <p className="text-sm text-center text-muted-foreground">
                  Enter the 8-digit code printed on the back of your device or on the packaging
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="device-code">Registration Code</Label>
                <Input
                  id="device-code"
                  placeholder="XXXX-XXXX"
                  value={deviceCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^A-Za-z0-9]/g, "")
                    if (value.length <= 8) {
                      setDeviceCode(value)
                    }
                  }}
                  className="text-center text-lg tracking-widest"
                  maxLength={8}
                />
                <p className="text-xs text-muted-foreground">Code should be 8 characters long</p>
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button onClick={handleCodeSubmit} disabled={deviceCode.length !== 8}>
                Continue
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === "bluetooth" && (
          <div className="py-4 space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Button variant="ghost" size="sm" onClick={() => setStep("method")}>
                Back
              </Button>
              <ChevronRight className="h-4 w-4" />
              <span>Bluetooth Pairing</span>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center gap-4 mb-4">
                <div className={cn("bg-muted p-6 rounded-full", isSearching && "animate-pulse")}>
                  <Bluetooth className="h-16 w-16" />
                </div>
                <p className="text-sm text-center text-muted-foreground">
                  {isSearching
                    ? "Searching for nearby devices..."
                    : foundDevices.length > 0
                      ? "Select your device from the list below"
                      : "Make sure your device is in pairing mode and nearby"}
                </p>
              </div>

              {!isSearching && foundDevices.length === 0 ? (
                <Button onClick={startBluetoothSearch} className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Scan for Devices
                </Button>
              ) : null}

              {isSearching && (
                <div className="flex flex-col items-center justify-center gap-2 py-4">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                  <p className="text-sm">Scanning for nearby devices...</p>
                </div>
              )}

              {!isSearching && foundDevices.length > 0 && (
                <div className="space-y-2">
                  <Label>Available Devices</Label>
                  <RadioGroup value={selectedDevice || ""} onValueChange={selectDevice}>
                    {foundDevices.map((device) => (
                      <div
                        key={device.id}
                        className={cn(
                          "flex items-center justify-between p-3 border rounded-lg",
                          selectedDevice === device.id && "border-primary",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value={device.id} id={device.id} />
                          <Label htmlFor={device.id} className="font-normal cursor-pointer">
                            {device.name}
                          </Label>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <div className="flex space-x-0.5">
                            {Array.from({ length: 3 }).map((_, i) => (
                              <div
                                key={i}
                                className={cn(
                                  "h-1.5 w-1 rounded-full",
                                  i < device.signal / 30 ? "bg-primary" : "bg-muted",
                                )}
                              />
                            ))}
                          </div>
                          <span>{device.signal}%</span>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}
            </div>

            <DialogFooter className="mt-4">
              <Button onClick={startPairing} disabled={!selectedDevice}>
                Pair Device
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === "pairing" && (
          <div className="py-4 space-y-6">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className={cn("relative bg-muted p-6 rounded-full", isPairing && "animate-pulse")}>
                <Smartphone className="h-16 w-16" />
                {isPairing && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-primary"></span>
                  </span>
                )}
              </div>

              <div className="text-center">
                <h3 className="text-lg font-medium mb-1">
                  {isPairing ? "Pairing in progress..." : "Pairing complete!"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isPairing ? "Please keep your device nearby" : "Your device has been successfully paired"}
                </p>
              </div>
            </div>

            {isPairing && (
              <div className="space-y-2">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300 ease-in-out"
                    style={{ width: `${pairingProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Connecting...</span>
                  <span>{pairingProgress}%</span>
                </div>
                <div className="space-y-1 mt-4">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">Initializing connection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">Verifying device</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {pairingProgress >= 50 ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <div className="h-4 w-4 flex items-center justify-center">
                        <div className="h-1 w-1 bg-muted-foreground rounded-full animate-pulse" />
                      </div>
                    )}
                    <span className="text-sm">Syncing device information</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {pairingProgress >= 80 ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <div className="h-4 w-4 flex items-center justify-center">
                        <div className="h-1 w-1 bg-muted-foreground rounded-full animate-pulse" />
                      </div>
                    )}
                    <span className="text-sm">Finalizing setup</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {step === "success" && (
          <div className="py-4 space-y-6">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="bg-primary/10 p-6 rounded-full">
                <Check className="h-16 w-16 text-primary" />
              </div>

              <div className="text-center">
                <h3 className="text-lg font-medium mb-1">Device Successfully Registered!</h3>
                <p className="text-sm text-muted-foreground">Your tracking device is now ready to use</p>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Next Steps:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5" />
                  <span>Attach your tracker to the item you want to track</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5" />
                  <span>Name your device and customize its settings</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5" />
                  <span>Test the connection by using the "Play Sound" feature</span>
                </li>
              </ul>
            </div>

            <DialogFooter>
              <Button onClick={completeRegistration}>Complete Setup</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}


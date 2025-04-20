"use client"

import React, { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Highlighter, Type } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export const ColorPicker = ({ defaultColor = "#6366f1", onChange, mode = "text", editor}) => {
    const [color, setColor] = useState(defaultColor)
    const [rgb, setRgb] = useState({ r: 99, g: 102, b: 241 })
    const [hsv, setHsv] = useState({ h: 239, s: 59, v: 95 })
    const [error, setError] = useState("")
    const [open, setOpen] = useState(false)

    const spectrumRef = useRef(null)
    const hueSliderRef = useRef(null)
    const isDraggingRef = useRef(null)

    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result
            ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16),
            }
            : null
    }

    const rgbToHex = (r, g, b) =>
        "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)

    const rgbToHsv = (r, g, b) => {
        r /= 255
        g /= 255
        b /= 255

        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)
        let h = 0
        const s = max === 0 ? 0 : (max - min) / max
        const v = max

        if (max === min) {
            h = 0
        } else {
            const d = max - min
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0)
                    break
                case g:
                    h = (b - r) / d + 2
                    break
                case b:
                    h = (r - g) / d + 4
                    break
            }
            h /= 6
        }

        return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) }
    }

    const hsvToRgb = (h, s, v) => {
        h /= 360
        s /= 100
        v /= 100

        let r = 0, g = 0, b = 0
        const i = Math.floor(h * 6)
        const f = h * 6 - i
        const p = v * (1 - s)
        const q = v * (1 - f * s)
        const t = v * (1 - (1 - f) * s)

        switch (i % 6) {
            case 0: r = v; g = t; b = p; break
            case 1: r = q; g = v; b = p; break
            case 2: r = p; g = v; b = t; break
            case 3: r = p; g = q; b = v; break
            case 4: r = t; g = p; b = v; break
            case 5: r = v; g = p; b = q; break
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255),
        }
    }

    useEffect(() => {
        const rgbValue = hexToRgb(color)
        if (rgbValue) {
            setRgb(rgbValue)
            setHsv(rgbToHsv(rgbValue.r, rgbValue.g, rgbValue.b))
            onChange?.(color)
        }
    }, [color, onChange])

    useEffect(() => {
        if (defaultColor !== color) {
            setColor(defaultColor)
        }
    }, [defaultColor])

    const handleHexChange = (e) => {
        const value = e.target.value
        const hexValue = value.startsWith("#") ? value : `#${value}`

        if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hexValue)) {
            setColor(hexValue)
            setError("")
        } else {
            setColor(value)
            if (value.length >= 4) {
                setError("Invalid hex color format. Use #RRGGBB format.")
            }
        }
    }

    const handleRgbChange = (channel, value) => {
        const numValue = parseInt(value, 10)

        if (value === "") {
            setRgb({ ...rgb, [channel]: 0 })
            return
        }

        if (isNaN(numValue) || numValue < 0 || numValue > 255) {
            setError(`Invalid ${channel.toUpperCase()} value. Use numbers between 0-255.`)
            return
        }

        setError("")
        const newRgb = { ...rgb, [channel]: numValue }
        setRgb(newRgb)
        setColor(rgbToHex(newRgb.r, newRgb.g, newRgb.b))
    }

    const handleSpectrumMouseDown = (e) => {
        if (!spectrumRef.current) return
        isDraggingRef.current = "spectrum"
        updateSpectrumPosition(e)
        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("mouseup", handleMouseUp)
    }

    const handleHueSliderMouseDown = (e) => {
        if (!hueSliderRef.current) return
        isDraggingRef.current = "hue"
        updateHuePosition(e)
        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("mouseup", handleMouseUp)
    }

    const handleMouseMove = (e) => {
        if (isDraggingRef.current === "spectrum") updateSpectrumPosition(e)
        else if (isDraggingRef.current === "hue") updateHuePosition(e)
    }

    const handleMouseUp = () => {
        isDraggingRef.current = null
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
    }

    const updateSpectrumPosition = (e) => {
        if (!spectrumRef.current) return
        const rect = spectrumRef.current.getBoundingClientRect()
        const s = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
        const v = Math.max(0, Math.min(100, 100 - ((e.clientY - rect.top) / rect.height) * 100))
        const newHsv = { ...hsv, s, v }
        setHsv(newHsv)
        const newRgb = hsvToRgb(newHsv.h, newHsv.s, newHsv.v)
        setRgb(newRgb)
        setColor(rgbToHex(newRgb.r, newRgb.g, newRgb.b))
    }

    const updateHuePosition = (e) => {
        if (!hueSliderRef.current) return
        const rect = hueSliderRef.current.getBoundingClientRect()
        const h = Math.max(0, Math.min(360, ((e.clientX - rect.left) / rect.width) * 360))
        const newHsv = { ...hsv, h }
        setHsv(newHsv)
        const newRgb = hsvToRgb(newHsv.h, newHsv.s, newHsv.v)
        setRgb(newRgb)
        setColor(rgbToHex(newRgb.r, newRgb.g, newRgb.b))
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="cursor-pointer flex align-center justify-evenly w-1/2"
                    aria-label={`Select ${mode} color. Current color: ${color}`}
                    onMouseDown={(e) => {
                        e.preventDefault()
                        if (!editor) return

                        if (mode === "text") {
                            editor.chain().focus().setColor?.(color).run()
                        } else {
                            const isActive = editor.isActive('highlight', { color })
                            if (isActive) {
                                editor.chain().focus().unsetHighlight().run()
                            } else {
                                editor.chain().focus().toggleHighlight({ color }).run()
                            }
                        }

                        setOpen(false)
                    }}

                >
                    {mode === "text" ? (
                      <>
                        <Type />
                        <span className="text-3xl" style={{ color }}>■</span>
                      </>
                    ) : (
                      <>
                        <Highlighter />
                        <span className="text-3xl" style={{ color }}>■</span>
                      </>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-80 p-4" align="start">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-md border" style={{ backgroundColor: color }} />
                            <div>
                                <p className="text-sm font-medium">{color}</p>
                                <p className="text-xs text-muted-foreground">RGB: {rgb.r}, {rgb.g}, {rgb.b}</p>
                            </div>
                        </div>
                    </div>

                    {/* Spectrum */}
                    <div className="space-y-2">
                        <div
                            ref={spectrumRef}
                            className="relative w-full h-36 rounded-md cursor-crosshair"
                            style={{
                                backgroundColor: `hsl(${hsv.h}, 100%, 50%)`,
                                backgroundImage:
                                    "linear-gradient(to right, #fff, transparent), linear-gradient(to top, #000, transparent)",
                            }}
                            onMouseDown={handleSpectrumMouseDown}
                            role="slider"
                            aria-label="Color saturation and brightness"
                            aria-valuetext={`Saturation: ${hsv.s}%, Brightness: ${hsv.v}%`}
                            tabIndex={0}
                        >
                            <div
                                className="absolute w-4 h-4 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                style={{
                                    left: `${hsv.s}%`,
                                    top: `${100 - hsv.v}%`,
                                    boxShadow: "0 0 0 1px rgba(0,0,0,0.3)",
                                }}
                            />
                        </div>

                        {/* Hue */}
                        <div
                            ref={hueSliderRef}
                            className="relative w-full h-4 rounded-md cursor-pointer"
                            style={{
                                background:
                                    "linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)",
                            }}
                            onMouseDown={handleHueSliderMouseDown}
                            role="slider"
                            aria-label="Color hue"
                            aria-valuetext={`Hue: ${hsv.h} degrees`}
                            tabIndex={0}
                        >
                            <div
                                className="absolute w-1.5 h-full top-0 transform -translate-x-1/2 pointer-events-none"
                                style={{
                                    left: `${(hsv.h / 360) * 100}%`,
                                    backgroundColor: "white",
                                    boxShadow: "0 0 0 1px rgba(0,0,0,0.3)",
                                }}
                            />
                        </div>
                    </div>

                    {/* Hex */}
                    <div className="space-y-1">
                        <Label htmlFor="hex-input" className="text-xs">Hex</Label>
                        <Input
                            id="hex-input"
                            type="text"
                            value={color}
                            onChange={handleHexChange}
                            placeholder="#RRGGBB"
                            className={cn("h-8", error.includes("hex") && "border-red-500")}
                        />
                    </div>

                    {/* RGB */}
                    <div className="space-y-1">
                        <Label className="text-xs">RGB</Label>
                        <div className="grid grid-cols-3 gap-2">
                            {["r", "g", "b"].map((channel) => (
                                <Input
                                    key={channel}
                                    type="number"
                                    min="0"
                                    max="255"
                                    value={rgb[channel]}
                                    onChange={(e) => handleRgbChange(channel, e.target.value)}
                                    placeholder={channel.toUpperCase()}
                                    className={cn("h-8", error.includes(`${channel.toUpperCase()} value`) && "border-red-500")}
                                    aria-label={`${channel.toUpperCase()} value`}
                                />
                            ))}
                        </div>
                    </div>

                    {error && (
                        <Alert variant="destructive" className="py-2">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="text-xs">{error}</AlertDescription>
                        </Alert>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}

import type React from "react"
import { useState, useRef, useEffect } from "react"

interface PopoverProps {
  trigger: React.ReactNode
  children: React.ReactNode
  position?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  hoverDelay?: number
}

const Popover = ({ trigger, children, position = "bottom", align = "center", hoverDelay = 300 }: PopoverProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimeoutRef = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  const handleMouseEnter = () => {
    clearTimeoutRef()
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    clearTimeoutRef()
    timeoutRef.current = setTimeout(() => setIsOpen(false), hoverDelay)
  }

  useEffect(() => {
    return () => clearTimeoutRef()
  }, [])

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) setIsOpen(false)
    }
    document.addEventListener("keydown", handleEscKey)
    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isOpen])

  const getPositionClasses = () => {
    switch (position) {
      case "top":
        return "bottom-full mb-2"
      case "right":
        return "left-full ml-2"
      case "left":
        return "right-full mr-2"
      case "bottom":
      default:
        return "top-full mt-2"
    }
  }

  const getAlignmentClasses = () => {
    if (position === "left" || position === "right") {
      switch (align) {
        case "start":
          return "top-0"
        case "end":
          return "bottom-0"
        case "center":
        default:
          return "top-1/2 -translate-y-1/2"
      }
    } else {
      switch (align) {
        case "start":
          return "left-0"
        case "end":
          return "right-0"
        case "center":
        default:
          return "left-1/2 -translate-x-1/2"
      }
    }
  }

  return (
    <div className="relative inline-block" style={{lineHeight: 0}}>
      <div ref={triggerRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="cursor-pointer" role="button" aria-expanded={isOpen} aria-haspopup="true" >{trigger}</div>

      {isOpen && (
        <div ref={popoverRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className={`absolute z-50 rounded-md shadow-lg ${getPositionClasses()} ${getAlignmentClasses()}`} role="dialog" aria-modal="true" >{children}</div>
      )}
    </div>
  )
}

export default Popover
"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function Sheet({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}) {
  return (
    <SheetContext.Provider value={{ open: !!open, onOpenChange: onOpenChange || (() => {}) }}>
      {children}
    </SheetContext.Provider>
  )
}

const SheetContext = React.createContext<{
  open: boolean
  onOpenChange: (open: boolean) => void
}>({ open: false, onOpenChange: () => {} })

function SheetTrigger({ children }: { children: React.ReactNode }) {
  const { onOpenChange } = React.useContext(SheetContext)
  return (
    <span onClick={() => onOpenChange(true)} className="inline-block">
      {children}
    </span>
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: React.ComponentProps<"div"> & {
  side?: "top" | "right" | "bottom" | "left"
}) {
  const { open, onOpenChange } = React.useContext(SheetContext)
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-black/80"
        onClick={() => onOpenChange(false)}
      />
      <div
        data-slot="sheet-content"
        className={cn(
          "fixed z-50 flex flex-col gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[starting-style]:transition-none data-[ending-style]:transition-none data-[starting-style]:duration-300 data-[ending-style]:duration-300",
          side === "top" && "inset-x-0 top-0 h-auto border-b data-[starting-style]:slide-in-from-top data-[ending-style]:slide-out-to-top",
          side === "bottom" && "inset-x-0 bottom-0 h-auto border-t data-[starting-style]:slide-in-from-bottom data-[ending-style]:slide-out-to-bottom",
          side === "left" && "inset-y-0 left-0 h-full w-3/4 border-r data-[starting-style]:slide-in-from-left data-[ending-style]:slide-out-to-left sm:max-w-sm",
          side === "right" && "inset-y-0 right-0 h-full w-3/4 border-l data-[starting-style]:slide-in-from-right data-[ending-style]:slide-out-to-right sm:max-w-sm",
          className
        )}
        {...props}
      >
        {children}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          ✕
          <span className="sr-only">Close</span>
        </button>
      </div>
    </div>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-title"
      className={cn("font-semibold text-foreground", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
}

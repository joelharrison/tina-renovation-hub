"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function Select({
  value,
  onValueChange,
  children,
}: {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}) {
  return (
    <SelectContext.Provider value={{ value, onValueChange: onValueChange || (() => {}) }}>
      {children}
    </SelectContext.Provider>
  )
}

const SelectContext = React.createContext<{
  value?: string
  onValueChange: (value: string) => void
}>({ onValueChange: () => {} })

function SelectTrigger({ className, children, ...props }: React.ComponentProps<"button">) {
  const { value, onValueChange } = React.useContext(SelectContext)
  return (
    <button
      type="button"
      data-slot="select-trigger"
      className={cn(
        "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      <span className="opacity-50">▼</span>
    </button>
  )
}

function SelectValue({ placeholder }: { placeholder?: string }) {
  const { value } = React.useContext(SelectContext)
  return <span>{value || placeholder}</span>
}

function SelectContent({ className, children }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="select-content"
      className={cn(
        "relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
        className
      )}
    >
      {children}
    </div>
  )
}

function SelectItem({ value, children, className, ...props }: React.ComponentProps<"div"> & { value: string }) {
  const { onValueChange } = React.useContext(SelectContext)
  return (
    <div
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      onClick={() => onValueChange(value)}
      {...props}
    >
      {children}
    </div>
  )
}

export {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
}

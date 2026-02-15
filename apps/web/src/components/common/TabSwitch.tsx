import React from "react"
import { cn } from "@/lib/utils"

export interface TabOption<T extends string | number = string> {
    label: React.ReactNode
    value: T
}

interface TabSwitchProps<T extends string | number = string> {
    options: TabOption<T>[]
    value: T
    onChange: (value: T) => void
    size?: "sm" | "md" | "lg"
    className?: string
}

const SIZE_STYLES = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-xs",
    lg: "px-4 py-1.5 text-sm",
}

export function TabSwitch<T extends string | number = string>({
    options,
    value,
    onChange,
    size = "md",
    className
}: TabSwitchProps<T>) {
    return (
        <div className={cn("flex items-center gap-1 rounded-lg bg-slate-100 p-1 w-fit", className)}>
            {options.map((option) => (
                <button
                    key={String(option.value)}
                    onClick={() => onChange(option.value)}
                    className={cn(
                        "font-medium rounded-md transition-all cursor-pointer whitespace-nowrap",
                        SIZE_STYLES[size],
                        value === option.value
                            ? "bg-white text-blue-600 shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    {option.label}
                </button>
            ))}
        </div>
    )
}

"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, X } from "lucide-react"
import type { DateRange, Matcher } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { zhCN } from "date-fns/locale"

interface DateRangePickerProps {
    className?: string
    value?: DateRange
    onChange?: (date: DateRange | undefined) => void
    align?: "center" | "start" | "end"
    disabled?: Matcher | Matcher[]
    allowClear?: boolean
}

export function DateRangePicker({
    className,
    value,
    onChange,
    align = "start",
    disabled,
    allowClear = true,
}: DateRangePickerProps) {
    const [open, setOpen] = React.useState(false)
    const [hovered, setHovered] = React.useState(false)

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation()
        onChange?.(undefined)
    }

    const handleSelect = (
        range: DateRange | undefined,
        selectedDay: Date
    ) => {
        // If we already have a complete range, reset to just the clicked day
        if (value?.from && value?.to) {
            onChange?.({
                from: selectedDay,
                to: undefined,
            })
            return
        }

        onChange?.(range)

        if (range?.from && range?.to) {
            setOpen(false)
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div
                    className={cn(
                        "group flex items-center justify-between w-[260px] h-9 px-3 py-1 bg-white border border-slate-200 rounded-md shadow-sm transition-colors cursor-pointer hover:bg-slate-50",
                        open && "ring-2 ring-slate-400 ring-offset-0 border-transparent",
                        !value && "text-muted-foreground",
                        className
                    )}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    onClick={() => setOpen(true)}
                >
                    <div className="flex items-center flex-1 gap-2 text-sm text-slate-600">
                        <span className={cn(!value?.from && "text-slate-400")}>
                            {value?.from ? format(value.from, "yyyy-MM-dd") : "开始日期"}
                        </span>
                        <span className="text-slate-400">~</span>
                        <span className={cn(!value?.to && "text-slate-400")}>
                            {value?.to ? format(value.to, "yyyy-MM-dd") : "结束日期"}
                        </span>
                    </div>

                    <div className="flex items-center ml-2">
                        {/* Clear button appears on hover if value exists and allowClear is true */}
                        {hovered && value?.from && allowClear ? (
                            <div
                                onClick={handleClear}
                                className="p-0.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="h-3.5 w-3.5" />
                            </div>
                        ) : (
                            <CalendarIcon className="h-4 w-4 text-slate-400 opacity-50" />
                        )}
                    </div>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align={align}>
                <Calendar
                    mode="range"
                    defaultMonth={value?.from}
                    selected={value}
                    onSelect={handleSelect}
                    numberOfMonths={2}
                    locale={zhCN}
                    className="border-none"
                    disabled={disabled}
                />
            </PopoverContent>
        </Popover>
    )
}

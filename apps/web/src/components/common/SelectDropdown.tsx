import * as React from "react"
import {
    Select,
    SelectValue,
    SelectContent,
    SelectItem,
    SelectEmpty,
} from "@/components/ui/select"
import * as SelectPrimitive from "@radix-ui/react-select"
import { ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function SelectDropdown({
    value,
    onChange,
    options,
    placeholder = "请选择",
    width = "w-[160px]",
    allowClear = true,
}: {
    value: string
    onChange: (value: string) => void
    options: { label: React.ReactNode; value: string }[]
    placeholder?: string
    width?: string
    allowClear?: boolean
}) {
    const [open, setOpen] = React.useState(false)
    const [hovered, setHovered] = React.useState(false)

    const selectValue = value === "" && !options.some((o) => o.value === "")
        ? ""
        : (value || "__all__")


    return (
        <Select
            value={selectValue}
            onValueChange={(v) => onChange(v === "__all__" ? "" : v)}
            open={open}
            onOpenChange={setOpen}
        >
            <SelectPrimitive.Trigger
                className={cn(
                    "flex h-9 items-center justify-between whitespace-nowrap rounded-lg border border-slate-200 bg-[#f9fafc] px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-ring focus:bg-white disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
                    "hover:bg-slate-50",
                    !selectValue && "text-slate-400",
                    width
                )}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <SelectValue placeholder={placeholder} />
                <SelectPrimitive.Icon asChild>
                    {value && hovered && allowClear ? (
                        <div
                            onPointerDown={(e) => {
                                e.stopPropagation()
                                e.preventDefault()
                                onChange("")
                            }}
                            className="flex h-4 w-4 items-center justify-center rounded-sm hover:bg-slate-200/50"
                        >
                            <X className="h-3 w-3 opacity-50 hover:opacity-100" />
                        </div>
                    ) : (
                        <ChevronDown className="h-4 w-4 opacity-50" />
                    )}
                </SelectPrimitive.Icon>
            </SelectPrimitive.Trigger>
            <SelectContent className="max-h-[340px]">
                {options.length > 0 ? (
                    options.map((opt) => (
                        <SelectItem key={opt.value || "__all__"} value={opt.value || "__all__"}>
                            {opt.label}
                        </SelectItem>
                    ))
                ) : (
                    <SelectEmpty />
                )}
            </SelectContent>
        </Select>
    )
}

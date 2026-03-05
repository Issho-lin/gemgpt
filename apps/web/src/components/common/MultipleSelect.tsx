import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { X, ChevronDown } from "lucide-react"

export function MultipleSelect({ value = [], list = [], onSelect }: {
    value: string[],
    list: { icon?: string, label: string, value: string }[],
    onSelect: (val: string[]) => void
}) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')

    const onclickItem = (val: string) => {
        if (value.includes(val)) {
            onSelect(value.filter((i) => i !== val))
        } else {
            onSelect([...value, val])
        }
        setSearch('')
    }

    const filterUnSelected = list
        .filter((item) => !value.includes(item.value))
        .filter((item) => {
            if (!search) return true
            return new RegExp(search, 'i').test(item.label)
        })

    return (
        <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>
                <div
                    className={`relative min-h-9 flex items-center justify-between w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm cursor-pointer hover:bg-slate-100 ${open ? 'ring-1 ring-blue-500 border-blue-500' : ''}`}
                >
                    <div className="flex flex-wrap items-center gap-1.5 flex-1 w-full min-w-0">
                        {value.length === 0 ? (
                            <span className="text-slate-400">请选择模型</span>
                        ) : (
                            value.map((item) => (
                                <span
                                    key={item}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-white border border-slate-200 text-slate-700 text-xs shadow-sm hover:bg-slate-50 relative group z-10"
                                    onClick={(e) => {
                                        // prevent opening popover when clicking tag
                                        e.stopPropagation()
                                    }}
                                >
                                    {item}
                                    <X
                                        className="h-3 w-3 text-slate-400 hover:text-red-500 cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onclickItem(item)
                                        }}
                                    />
                                </span>
                            ))
                        )}
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50 ml-2 flex-shrink-0" />
                </div>
            </PopoverTrigger>
            <PopoverContent
                className="w-[calc(100vw-40px)] sm:w-[500px] p-0 max-h-[300px] flex flex-col overflow-hidden"
                align="start"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <div className="flex items-center px-3 border-b border-slate-100">
                    <input
                        autoFocus
                        className="flex-1 h-10 bg-transparent outline-none text-sm placeholder:text-slate-400"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="搜索模型... (支持输入自定义字符串后点击添加)"
                    />
                </div>
                <div className="flex-1 overflow-y-auto p-1.5">
                    {filterUnSelected.length > 0 ? (
                        filterUnSelected.map((item, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-2 px-2 py-2 text-sm text-slate-700 rounded-sm cursor-pointer hover:bg-slate-100"
                                onClick={() => onclickItem(item.value)}
                            >
                                {item.icon && (
                                    <Avatar className="h-4 w-4 rounded-none">
                                        <AvatarImage src={item.icon} />
                                        <AvatarFallback className="text-[10px] bg-slate-100 text-slate-500">M</AvatarFallback>
                                    </Avatar>
                                )}
                                <span className="truncate">{item.label}</span>
                            </div>
                        ))
                    ) : (
                        <div className="px-2 py-3 text-sm text-slate-500 text-center">
                            {search ? (
                                <span
                                    className="text-blue-500 cursor-pointer hover:underline"
                                    onClick={() => onclickItem(search)}
                                >
                                    添加 "{search}"
                                </span>
                            ) : "暂无可选模型"}
                        </div>
                    )}
                    {search && filterUnSelected.length > 0 && !filterUnSelected.some(item => item.value === search) && (
                        <div
                            className="flex items-center gap-2 px-2 py-2 mt-1 border-t border-slate-100 text-sm text-blue-600 rounded-sm cursor-pointer hover:bg-slate-100"
                            onClick={() => onclickItem(search)}
                        >
                            添加自定义模型 "{search}"
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
} 

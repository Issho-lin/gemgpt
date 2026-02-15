import React from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ScrollText } from "lucide-react"
import type { LogItem } from "./index"
import { cn } from "@/lib/utils"

interface ModelLogDetailModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    data?: LogItem
}

export default function ModelLogDetailModal({
    open,
    onOpenChange,
    data,
}: ModelLogDetailModalProps) {
    if (!data) return null

    const items: { label: string; value: React.ReactNode; className: string }[] = [
        { label: "RequestID", value: data.id, className: "col-span-1" },
        { label: "Request IP", value: data.requestIp || "-", className: "col-span-1" },
        {
            label: "状态",
            value: (
                <span className={cn(
                    "font-medium",
                    data.status === 200 ? "text-green-500" : "text-red-500"
                )}>
                    {data.status}
                </span>
            ),
            className: "col-span-1"
        },
        { label: "Endpoint", value: data.endpoint || "-", className: "col-span-1" },
        { label: "渠道名", value: data.channelName, className: "col-span-1" },
        { label: "模型", value: data.modelName, className: "col-span-1" },
        { label: "请求时间", value: data.requestTime, className: "col-span-1" },
        { label: "耗时", value: data.duration, className: "col-span-1" },
        { label: "首字响应时长", value: data.ttft || "-", className: "col-span-1" },
        { label: "输入/输出 Tokens", value: data.tokens, className: "col-span-1" },
    ]

    const hasErrorRow = data.status !== 200 && !!data.error;

    if (hasErrorRow) {
        let contentVal: React.ReactNode = data.error
        try {
            const errorObj = JSON.parse(data.error || "")
            contentVal = (
                <pre className="whitespace-pre-wrap font-mono text-xs overflow-auto max-h-[300px]">
                    {JSON.stringify(errorObj, null, 2)}
                </pre>
            )
        } catch (e) {
            contentVal = <div className="break-all">{data.error}</div>
        }
        items.push({
            label: "Content",
            value: contentVal,
            className: "col-span-2"
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[800px] gap-0 p-0 overflow-hidden">
                <DialogHeader className="p-4 border-b border-slate-100">
                    <DialogTitle className="flex items-center gap-2 text-base font-medium text-slate-800">
                        <ScrollText size={18} className="text-slate-500" />
                        日志详情
                    </DialogTitle>
                </DialogHeader>

                <div className="p-6">
                    <div className="grid grid-cols-2 border border-slate-200 rounded-lg overflow-hidden text-sm">
                        {items.map((item, index) => {
                            let removeBorderB = false;
                            if (hasErrorRow) {
                                if (index === items.length - 1) removeBorderB = true;
                            } else {
                                if (index >= items.length - 2) removeBorderB = true;
                            }

                            return (
                                <div
                                    key={index}
                                    className={cn(
                                        "flex border-b border-slate-200",
                                        "even:border-l even:border-l-slate-200",
                                        removeBorderB && "border-b-0",
                                        item.className
                                    )}
                                >
                                    <div className="w-[140px] flex-shrink-0 bg-slate-50 px-4 py-3 text-slate-500 font-medium flex items-center">
                                        {item.label}
                                    </div>
                                    <div className="flex-1 px-4 py-3 text-slate-700 flex items-center break-all">
                                        {item.value}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

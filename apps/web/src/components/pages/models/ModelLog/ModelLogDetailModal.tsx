import React, { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ScrollText, Loader2 } from "lucide-react"
import type { LogItem } from "./index"
import { cn } from "@/lib/utils"
import { getLogDetail } from "@/api/aiproxy"

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
    const [detail, setDetail] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (open && data) {
            setDetail(data)
            // Both success and failed may have body detail, FastGPT fetches unconditionally if open.
            // Wait, FastGPT only fetches if code !== 200? Actually: "if (data.code === 200) return data; else fetch"
            // Let's fetch detail for all non-200, or we can fetch for all just to see request/response?
            // "if (data.code === 200) return data; try getLogDetail(data.id) ..." in FastGPT.
            setLoading(true)
            getLogDetail(data.id).then((res) => {
                setDetail({ ...data, ...res })
            }).catch(() => {
                // silently fail, use basic data
            }).finally(() => {
                setLoading(false)
            })
        } else {
            setDetail(null)
        }
    }, [open, data])

    if (!data || !detail) return null

    const items: { label: string; value: React.ReactNode; className: string }[] = [
        { label: "RequestID", value: detail.id, className: "col-span-1" },
        { label: "Request IP", value: detail.requestIp || "-", className: "col-span-1" },
        {
            label: "状态",
            value: (
                <span className={cn(
                    "font-medium",
                    detail.status === 200 ? "text-green-500" : "text-red-500"
                )}>
                    {detail.status}
                </span>
            ),
            className: "col-span-1"
        },
        { label: "Endpoint", value: detail.endpoint || "-", className: "col-span-1" },
        { label: "渠道名", value: detail.channelName, className: "col-span-1" },
        { label: "模型", value: detail.modelName, className: "col-span-1" },
        { label: "请求时间", value: detail.requestTime, className: "col-span-1" },
        { label: "耗时", value: detail.duration, className: "col-span-1" },
        { label: "首字响应时长", value: detail.ttft || "-", className: "col-span-1" },
        { label: "输入/输出 Tokens", value: detail.tokens, className: "col-span-1" },
    ]

    const hasErrorRow = detail.status !== 200 && !!detail.error;

    if (hasErrorRow) {
        let contentVal: React.ReactNode = detail.error
        try {
            const errorObj = JSON.parse(detail.error || "")
            contentVal = (
                <pre className="whitespace-pre-wrap font-mono text-[10px] overflow-auto max-h-[150px] bg-slate-100 p-2 rounded">
                    {JSON.stringify(errorObj, null, 2)}
                </pre>
            )
        } catch (e) {
            contentVal = <div className="break-all">{detail.error}</div>
        }
        items.push({
            label: "Content",
            value: contentVal,
            className: "col-span-2"
        })
    }

    if (detail.request_body) {
        items.push({
            label: "Request Body",
            value: (
                <pre className="whitespace-pre-wrap font-mono text-[10px] overflow-auto max-h-[150px] bg-slate-100 p-2 rounded break-all">
                    {detail.request_body}
                </pre>
            ),
            className: "col-span-2"
        })
    }

    if (detail.response_body) {
        items.push({
            label: "Response Body",
            value: (
                <pre className="whitespace-pre-wrap font-mono text-[10px] overflow-auto max-h-[150px] bg-slate-100 p-2 rounded break-all">
                    {detail.response_body}
                </pre>
            ),
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
                    <div className="flex flex-col border border-slate-200 rounded-lg overflow-hidden text-sm">
                        {loading ? (
                            <div className="flex justify-center p-8">
                                <Loader2 className="animate-spin text-slate-400" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2">
                                {items.map((item, index) => {
                                    // Remove bottom border for last elements
                                    const isLast = index === items.length - 1;
                                    const isSecondToLast = index === items.length - 2;
                                    const isFullRow = item.className.includes("col-span-2");
                                    const removeBorderB = isLast || (isSecondToLast && !isFullRow && !items[items.length - 1].className.includes("col-span-2"));

                                    return (
                                        <div
                                            key={index}
                                            className={cn(
                                                "flex border-b border-slate-200",
                                                !isFullRow ? "odd:border-r odd:border-r-slate-200" : "",
                                                removeBorderB && "border-b-0",
                                                item.className
                                            )}
                                        >
                                            <div className="w-[140px] flex-shrink-0 bg-slate-50 px-4 py-3 text-slate-500 font-medium flex items-center">
                                                {item.label}
                                            </div>
                                            <div className="flex-1 px-4 py-3 text-slate-700 flex items-center">
                                                <div className="w-full">
                                                    {item.value}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

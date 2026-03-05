import { Send, Loader2, Info } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { DataTable, type ColumnDef } from "@/components/common/DataTable"
import { useMemo, useState, useEffect } from "react"
import { getTestModel } from "@/api/aiproxy"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export interface TestModelItem {
    name: string
    id: string
    status: "waiting" | "running" | "success" | "failed"
    duration?: number
    message?: string
}

export default function TestModelModal({
    open,
    onOpenChange,
    testData,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    testData?: any
}) {
    const [models, setModels] = useState<TestModelItem[]>([])
    const [isTestingAll, setIsTestingAll] = useState(false)

    useEffect(() => {
        if (open && testData?.models) {
            setModels(
                [...testData.models].map((m) => ({
                    name: m,
                    id: m,
                    status: "waiting",
                })) as TestModelItem[]
            )
        } else {
            if (!open) {
                setModels([])
                setIsTestingAll(false)
            }
        }
    }, [open, testData])

    const handleTestOneModel = async (modelId: string) => {
        setModels((prev) =>
            prev.map((m) =>
                m.id === modelId ? { ...m, status: "running", message: "", duration: undefined } : m
            )
        )
        const start = Date.now()
        try {
            await getTestModel(testData.id, modelId)
            const duration = Date.now() - start
            setModels((prev) =>
                prev.map((m) =>
                    m.id === modelId ? { ...m, status: "success", duration } : m
                )
            )
        } catch (error: any) {
            setModels((prev) =>
                prev.map((m) =>
                    m.id === modelId
                        ? { ...m, status: "failed", message: error.message || "请求失败" }
                        : m
                )
            )
        }
    }

    const handleStartTest = async () => {
        if (isTestingAll) return
        setIsTestingAll(true)

        let errorCount = 0

        // Test in batches of 5 to avoid overwhelming the server
        const batchSize = 5
        const itemsToTest = [...models]

        for (let i = 0; i < itemsToTest.length; i += batchSize) {
            const batch = itemsToTest.slice(i, i + batchSize)
            await Promise.all(
                batch.map(async (item) => {
                    setModels((prev) =>
                        prev.map((m) =>
                            m.id === item.id ? { ...m, status: "running", message: "", duration: undefined } : m
                        )
                    )
                    const start = Date.now()
                    try {
                        await getTestModel(testData.id, item.id)
                        const duration = Date.now() - start
                        setModels((prev) =>
                            prev.map((m) =>
                                m.id === item.id ? { ...m, status: "success", duration } : m
                            )
                        )
                    } catch (error: any) {
                        errorCount++
                        setModels((prev) =>
                            prev.map((m) =>
                                m.id === item.id
                                    ? { ...m, status: "failed", message: error.message || "请求失败" }
                                    : m
                            )
                        )
                    }
                })
            )
        }

        setIsTestingAll(false)

        if (errorCount > 0) {
            toast.warning(`有 ${errorCount} 个模型测试失败`)
        } else {
            toast.success("所有测试完成")
        }
    }

    const columns: ColumnDef<TestModelItem>[] = useMemo(
        () => [
            {
                title: "模型名",
                key: "name",
                render: (_, item) => <span className="text-slate-700">{item.name}</span>,
            },
            {
                title: "模型ID",
                key: "id",
                render: (_, item) => <span className="text-slate-500">{item.id}</span>,
            },
            {
                title: "状态",
                key: "status",
                render: (_, item) => (
                    <div className="flex items-center gap-2">
                        <span
                            className={cn(
                                "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
                                {
                                    "bg-slate-100 text-slate-500 border-slate-200": item.status === "waiting",
                                    "bg-blue-50 text-blue-600 border-blue-200": item.status === "running",
                                    "bg-green-50 text-green-600 border-green-200": item.status === "success",
                                    "bg-red-50 text-red-600 border-red-200": item.status === "failed",
                                }
                            )}
                        >
                            {item.status === "waiting" && "等待测试"}
                            {item.status === "running" && "运行中"}
                            {item.status === "success" && "成功"}
                            {item.status === "failed" && "失败"}
                        </span>
                        {item.message && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Info size={14} className="text-red-400 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="max-w-[200px] break-words">{item.message}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                        {item.status === "success" && item.duration !== undefined && (
                            <span className="text-xs text-slate-400">
                                {item.duration > 1000 ? `${(item.duration / 1000).toFixed(2)}s` : `${item.duration}ms`}
                            </span>
                        )}
                    </div>
                ),
            },
            {
                title: "",
                key: "action",
                width: 60,
                render: (_, item) => (
                    <button
                        className="flex items-center justify-center w-8 h-8 rounded text-slate-400 hover:text-blue-500 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-slate-400"
                        onClick={() => handleTestOneModel(item.id)}
                        disabled={item.status === "running" || isTestingAll}
                        title="测试该模型"
                    >
                        {item.status === "running" ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Send size={16} />
                        )}
                    </button>
                ),
            },
        ],
        [isTestingAll, testData]
    )

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-[800px] flex flex-col gap-0 p-0 overflow-hidden max-h-[85vh]"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-7 h-7 bg-white text-slate-700">
                            <Send size={20} />
                        </span>
                        {testData?.name ? `模型测试: ${testData.name}` : "模型测试"}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 min-h-0 bg-white p-6 overflow-y-auto">
                    <div className="bg-slate-50 rounded-lg border border-slate-100 overflow-hidden">
                        <DataTable
                            columns={columns}
                            dataSource={models}
                            rowKey="id"
                            className="bg-transparent"
                            rowClassName="hover:bg-white transition-colors"
                        />
                    </div>
                </div>

                <DialogFooter className="px-6 py-4 border-t bg-white">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="h-9 px-4">
                        取消
                    </Button>
                    <Button
                        className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white min-w-[140px]"
                        onClick={handleStartTest}
                        disabled={isTestingAll || models.length === 0}
                    >
                        {isTestingAll ? (
                            <div className="flex items-center gap-2">
                                <Loader2 size={16} className="animate-spin" />
                                测试中...
                            </div>
                        ) : (
                            `批量测试 ${models.length} 个模型`
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

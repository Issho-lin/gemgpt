import { useState, useMemo, useEffect } from "react"
import { Search, ListFilter, HelpCircle, Loader2 } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { subDays } from "date-fns"
import { DateRangePicker } from "@/components/common/DateRangePicker"
import { cn } from "@/lib/utils"
import { DataTable, type ColumnDef } from "@/components/common/DataTable"
import { SelectDropdown } from "@/components/common/SelectDropdown"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import ModelLogDetailModal from "./ModelLogDetailModal"
import api from "@/lib/api"
import { toast } from "sonner"

export interface LogItem {
    id: string
    channelName: string
    modelName: string
    tokens: string
    duration: string
    status: number
    requestTime: string
    error?: string
    requestIp?: string
    endpoint?: string
    ttft?: string
}

const CHANNEL_OPTIONS = [
    { label: "AIProxy", value: "aiproxy" },
    { label: "OpenAI", value: "openai" },
]

const STATUS_OPTIONS = [
    { label: "成功", value: "success" },
    { label: "失败", value: "failed" },
]

export default function ModelLogTab() {
    const [search, setSearch] = useState("")
    const [channel, setChannel] = useState("")
    const [model, setModel] = useState("")
    const [status, setStatus] = useState("")
    // Date range state
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: subDays(new Date(), 7),
        to: new Date()
    })
    const [selectedLog, setSelectedLog] = useState<LogItem | undefined>(undefined)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [logs, setLogs] = useState<LogItem[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        fetchLogs()
    }, [page, channel, status]) // Basic dependencies, could add more filters

    const fetchLogs = async () => {
        setLoading(true)
        try {
            const res = await api.get(`/models/logs?page=${page}&limit=20`)
            const mappedLogs = res.data.logs.map((log: any) => ({
                id: log.id,
                channelName: log.provider || 'Unknown',
                modelName: log.modelName,
                tokens: `${log.inputTokens} / ${log.outputTokens}`,
                duration: `${log.duration}ms`,
                status: log.status === 'success' ? 200 : 500,
                requestTime: new Date(log.createdAt).toLocaleString(),
                error: log.error,
                requestIp: "-", // Not stored yet
                endpoint: "-", // Not stored yet
                ttft: "-" // Not stored yet
            }))
            setLogs(mappedLogs)
            setTotal(res.data.total)
        } catch (error) {
            toast.error("获取日志失败")
        } finally {
            setLoading(false)
        }
    }

    const columns: ColumnDef<LogItem>[] = useMemo(() => [
        {
            title: "渠道名",
            key: "channelName",
            render: (_, item) => <span className="text-slate-700">{item.channelName}</span>
        },
        {
            title: "模型",
            key: "modelName",
            render: (_, item) => <span className="text-slate-700">{item.modelName}</span>
        },
        {
            title: "输入/输出 TOKENS",
            key: "tokens",
            render: (_, item) => <span className="text-slate-600 font-mono text-sm">{item.tokens}</span>
        },
        {
            title: "耗时",
            key: "duration",
            render: (_, item) => <span className="text-slate-600">{item.duration}</span>
        },
        {
            title: "状态",
            key: "status",
            render: (_, item) => (
                <div className="flex items-center gap-1">
                    <span className={cn(
                        "font-medium",
                        item.status === 200 ? "text-green-500" : "text-red-500"
                    )}>
                        {item.status === 200 ? "成功" : "失败"}
                    </span>
                    {item.status !== 200 && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <HelpCircle className="h-3.5 w-3.5 text-slate-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[400px]">
                                    <div className="break-all">{item.error || "未知错误"}</div>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
            )
        },
        {
            title: "请求时间",
            key: "requestTime",
            render: (_, item) => <span className="text-slate-500 text-sm">{item.requestTime}</span>
        },
        {
            title: "",
            key: "actions",
            width: 100,
            render: (_, item) => (
                <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-3 text-xs flex items-center gap-1 bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                    onClick={() => {
                        setSelectedLog(item)
                        setShowDetailModal(true)
                    }}
                >
                    <ListFilter size={12} />
                    详情
                </Button>
            )
        }
    ], [])

    // Client-side filtering for search (optional, better to do server-side)
    const filteredLogs = useMemo(() => {
        return logs.filter(item => {
            const matchesSearch = search ? item.id.includes(search) || item.modelName.includes(search) : true
            return matchesSearch
        })
    }, [logs, search])

    return (
        <div className="flex flex-col h-full gap-4">
            <div className="flex items-center flex-wrap gap-4 bg-white p-1">
                <DateRangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    className="w-auto"
                    disabled={{ after: new Date() }}
                    allowClear={false}
                />

                <SelectDropdown
                    value={channel}
                    onChange={setChannel}
                    options={CHANNEL_OPTIONS}
                    placeholder="渠道名"
                    width="w-[160px]"
                />

                {/* Model options should ideally be dynamic based on available models */}
                <Input 
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="模型名"
                    className="w-[160px] h-9"
                />

                <SelectDropdown
                    value={status}
                    onChange={setStatus}
                    options={STATUS_OPTIONS}
                    placeholder="状态"
                    width="w-[120px]"
                />

                <div className="flex-1" />

                <div className="relative w-[300px]">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="根据 ID 或模型搜索"
                        className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                </div>
                <Button variant="outline" size="sm" onClick={fetchLogs}>
                    刷新
                </Button>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg overflow-hidden flex flex-col min-h-[200px]">
                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        dataSource={filteredLogs}
                        rowKey="id"
                        className="w-full"
                        rowClassName="hover:bg-slate-50/50 transition-colors group"
                        emptyText="暂无日志记录"
                    />
                )}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center py-4 space-x-2">
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPage(p => Math.max(1, p - 1))} 
                    disabled={page === 1 || loading}
                >
                    上一页
                </Button>
                <span className="py-2 text-sm text-muted-foreground">
                    第 {page} 页 / 共 {Math.ceil(total / 20) || 1} 页
                </span>
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPage(p => p + 1)} 
                    disabled={page * 20 >= total || loading}
                >
                    下一页
                </Button>
            </div>

            <ModelLogDetailModal
                open={showDetailModal}
                onOpenChange={setShowDetailModal}
                data={selectedLog}
            />
        </div>
    )
}

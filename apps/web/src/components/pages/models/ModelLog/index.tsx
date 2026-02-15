import { useState, useMemo } from "react"
import { Search, ListFilter, HelpCircle } from "lucide-react"
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

const MOCK_LOGS: LogItem[] = [
    {
        id: "1",
        channelName: "千问系列",
        modelName: "qwen3-max",
        tokens: "9 / 11",
        duration: "1.78s",
        status: 200,
        requestTime: "2026-02-13 16:16:03",
        requestIp: "192.168.1.101",
        endpoint: "/v1/chat/completions",
        ttft: "0.45s"
    },
    {
        id: "2",
        channelName: "OpenAI",
        modelName: "gpt-4",
        tokens: "150 / 80",
        duration: "2.34s",
        status: 200,
        requestTime: "2026-02-13 16:15:22",
        requestIp: "10.0.0.5",
        endpoint: "/v1/chat/completions",
        ttft: "0.82s"
    },
    {
        id: "3",
        channelName: "Claude",
        modelName: "claude-3-opus",
        tokens: "200 / 400",
        duration: "5.12s",
        status: 200,
        requestTime: "2026-02-13 16:14:10",
        requestIp: "172.16.254.1",
        endpoint: "/v1/messages",
        ttft: "1.2s"
    },
    {
        id: "4",
        channelName: "硅基流动",
        modelName: "deepseek-coder",
        tokens: "50 / 120",
        duration: "1.05s",
        status: 500,
        requestTime: "2026-02-13 16:10:45",
        error: `{"error":{"code":"ModelNotOpen","message":"Your account has not activated the model deepseek-coder. Please activate the model service in the Ark Console.","type":"Not Found"}}`,
        requestIp: "192.168.65.1",
        endpoint: "/v1/chat/completions",
        ttft: "-"
    }
]

const CHANNEL_OPTIONS = [
    { label: "千问系列", value: "千问系列" },
    { label: "OpenAI", value: "OpenAI" },
    { label: "Claude", value: "Claude" },
    { label: "硅基流动", value: "硅基流动" },
]

const MODEL_OPTIONS = [
    { label: "qwen3-max", value: "qwen3-max" },
    { label: "gpt-4", value: "gpt-4" },
    { label: "claude-3-opus", value: "claude-3-opus" },
    { label: "deepseek-coder", value: "deepseek-coder" },
]

const STATUS_OPTIONS = [
    { label: "成功", value: "200" },
    { label: "失败", value: "error" },
]

export default function ModelLogTab() {
    const [search, setSearch] = useState("")
    const [channel, setChannel] = useState("")
    const [model, setModel] = useState("")
    const [status, setStatus] = useState("")
    // Date range state
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: subDays(new Date(), 1),
        to: new Date()
    })
    const [selectedLog, setSelectedLog] = useState<LogItem | undefined>(undefined)
    const [showDetailModal, setShowDetailModal] = useState(false)

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
                        {item.status}
                    </span>
                    {item.status !== 200 && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <HelpCircle className="h-3.5 w-3.5 text-slate-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[400px]">
                                    {(() => {
                                        try {
                                            const errorObj = JSON.parse(item.error || "")
                                            return (
                                                <pre className="whitespace-pre-wrap font-mono text-xs overflow-auto max-h-[300px]">
                                                    {JSON.stringify(errorObj, null, 2)}
                                                </pre>
                                            )
                                        } catch (e) {
                                            return <div className="break-all">{item.error || "未知错误"}</div>
                                        }
                                    })()}
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

    const filteredLogs = useMemo(() => {
        return MOCK_LOGS.filter(item => {
            const matchesSearch = search ? item.id.includes(search) : true
            const matchesChannel = channel ? item.channelName === channel : true
            const matchesModel = model ? item.modelName === model : true
            const matchesStatus = status
                ? (status === "200" ? item.status === 200 : item.status !== 200)
                : true
            return matchesSearch && matchesChannel && matchesModel && matchesStatus
        })
    }, [search, channel, model, status])

    return (
        <div className="flex flex-col h-full gap-4 overflow-y-auto">
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

                <SelectDropdown
                    value={model}
                    onChange={setModel}
                    options={MODEL_OPTIONS}
                    placeholder="模型名"
                    width="w-[160px]"
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
                        placeholder="根据 requestId 搜索"
                        className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg overflow-hidden flex flex-col">
                <DataTable
                    columns={columns}
                    dataSource={filteredLogs}
                    rowKey="id"
                    className="w-full"
                    rowClassName="hover:bg-slate-50/50 transition-colors group"
                />
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-slate-400 py-2">
                已加载全部
            </div>
            <ModelLogDetailModal
                open={showDetailModal}
                onOpenChange={setShowDetailModal}
                data={selectedLog}
            />
        </div>
    )
}

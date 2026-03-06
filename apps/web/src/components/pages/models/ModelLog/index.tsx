import { useState, useMemo, useEffect, useRef } from "react"
import { ListFilter, HelpCircle, Loader2 } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { subDays } from "date-fns"
import { DateRangePicker } from "@/components/common/DateRangePicker"
import { cn } from "@/lib/utils"
import { DataTable, type ColumnDef } from "@/components/common/DataTable"
import { SelectDropdown } from "@/components/common/SelectDropdown"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import ModelLogDetailModal from "./ModelLogDetailModal"
import { toast } from "sonner"
import { getChannelLog, getChannelList } from "@/api/aiproxy"
import { getModelProviders, getModelList } from "@/api/model"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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

const STATUS_OPTIONS: { label: string, value: 'success' | 'error' }[] = [
    { label: "成功", value: "success" },
    { label: "失败", value: "error" },
]

export default function ModelLogTab() {
    const [channel, setChannel] = useState("")
    const [model, setModel] = useState("")
    const [status, setStatus] = useState<'' | 'success' | 'error'>("")
    // Date range state
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: (() => {
            const today = subDays(new Date(), 1);
            today.setHours(0, 0, 0, 0);
            return today;
        })(),
        to: (() => {
            const today = new Date();
            today.setHours(23, 59, 59, 999);
            return today;
        })()
    })
    const [selectedLog, setSelectedLog] = useState<LogItem | undefined>(undefined)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [logs, setLogs] = useState<LogItem[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [channelList, setChannelList] = useState<any[]>([])
    const [allModels, setAllModels] = useState<{ provider: string, model: string }[]>([])
    const [providerList, setProviderList] = useState<any[]>([])
    const pageSize = 10

    const channelOptions = useMemo(() => {
        return channelList.map(c => ({ label: c.name, value: `${c.id}` }))
    }, [channelList])

    const modelOptions = useMemo(() => {
        return allModels
            .map((item) => {
                const provider = providerList.find((p: any) => p.provider === item.provider) || {}
                const rawAvatar = provider.avatar
                const finalAvatar = rawAvatar ? (rawAvatar.startsWith('http') || rawAvatar.startsWith('/') ? rawAvatar : `/${rawAvatar}.svg`) : ''

                return {
                    provider: item.provider,
                    label: (
                        <div className="flex items-center gap-2">
                            {finalAvatar && (
                                <Avatar className="h-4 w-4 rounded-none">
                                    <AvatarImage src={finalAvatar} />
                                    <AvatarFallback className="text-[10px] bg-slate-100 text-slate-500">
                                        {(item.model)?.charAt(0) || "M"}
                                    </AvatarFallback>
                                </Avatar>
                            )}
                            <span className="text-slate-700">{item.model}</span>
                        </div>
                    ),
                    value: item.model
                }
            })
            .sort((a, b) => {
                const targetProvider = 'OpenAI'
                if (a.provider === targetProvider && b.provider !== targetProvider) return -1
                if (a.provider !== targetProvider && b.provider === targetProvider) return 1
                return 0
            })
    }, [allModels, providerList])

    useEffect(() => {
        Promise.all([
            getChannelList(),
            getModelProviders(),
            getModelList()
        ]).then(([list, providerData, modelListData]) => {
            setChannelList(list)
            setProviderList(providerData)
            if (Array.isArray(modelListData)) {
                setAllModels(modelListData)
            }
        }).catch(() => { })
    }, [])

    const init = useRef(false)

    useEffect(() => {
        fetchLogs()
    }, [page])

    useEffect(() => {
        if (!init.current) {
            init.current = true
            return
        }
        if (page === 1) {
            fetchLogs()
        } else {
            setPage(1)
        }
    }, [channel, model, status, dateRange])

    const fetchLogs = async () => {
        setLoading(true)
        try {
            const res = await getChannelLog({
                channel: channel || undefined,
                model_name: model || undefined,
                code_type: status || 'all',
                start_timestamp: dateRange?.from?.getTime() || 0,
                end_timestamp: dateRange?.to?.getTime() || 0,
                offset: (page - 1) * pageSize,
                pageSize: pageSize
            })

            const mappedLogs = res.list.map((log: any) => {
                const cName = channelList.find(c => `${c.id}` === `${log.channel}`)?.name || log.channel
                return {
                    id: log.id,
                    channelName: `${cName}`,
                    modelName: log.model,
                    tokens: `${log.usage?.input_tokens || 0} / ${log.usage?.output_tokens || 0}`,
                    duration: `${((log.created_at - log.request_at) / 1000).toFixed(2)}s`,
                    status: log.code === 200 ? 200 : log.code,
                    requestTime: new Date(log.request_at).toLocaleString(),
                    error: log.content,
                    requestIp: log.ip || "-",
                    endpoint: log.endpoint || "-",
                    ttft: log.ttfb_milliseconds ? `${log.ttfb_milliseconds}ms` : "-"
                }
            })
            setLogs(mappedLogs)
            setTotal(res.total)
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
                    options={channelOptions}
                    placeholder="渠道名称"
                    width="w-[160px]"
                />

                <SelectDropdown
                    value={model}
                    onChange={setModel}
                    options={modelOptions}
                    placeholder="模型名称"
                    width="w-[160px]"
                />

                <SelectDropdown
                    value={status}
                    onChange={(val) => setStatus(val as any)}
                    options={STATUS_OPTIONS}
                    placeholder="状态"
                    width="w-[120px]"
                />

                <div className="flex-1" />

                <Button variant="outline" size="sm" onClick={fetchLogs}>
                    刷新
                </Button>
            </div>

            {/* Data Table */}
            <div className="flex-1 min-h-0 bg-white rounded-lg overflow-auto">
                {loading ? (
                    <div className="h-full flex items-center justify-center p-8">
                        <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        dataSource={logs}
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
                    第 {page} 页 / 共 {Math.ceil(total / pageSize) || 1} 页
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => p + 1)}
                    disabled={page * pageSize >= total || loading}
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

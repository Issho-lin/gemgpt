import { useState, useMemo, useEffect } from "react"
import { MoreHorizontal, Send, Settings, Trash2, Ban } from "lucide-react"
import { cn } from "@/lib/utils"
import { DataTable, type ColumnDef } from "@/components/common/DataTable"
import EditChannelModal from "./EditChannelModal"
import TestModelModal from "./TestModelModal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { HelpCircle, Loader2 } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { getChannelList, getChannelProviders, putChannelStatus, deleteChannel, putChannel } from "@/api/aiproxy"
import { toast } from "sonner"

export default function ModelChannelTab() {
    const [channels, setChannels] = useState<any[]>([])
    const [channelProviders, setChannelProviders] = useState<Record<string, any>>({})
    const [showEditModal, setShowEditModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [editItem, setEditItem] = useState<any>(null)
    const [testItem, setTestItem] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const fetchChannels = async () => {
        try {
            setLoading(true)
            const [list, providersMap] = await Promise.all([
                getChannelList(),
                getChannelProviders()
            ])
            setChannels(list)
            setChannelProviders(providersMap)
        } catch (error) {
            toast.error("获取渠道列表失败")
        } finally {
            setLoading(false)
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        fetchChannels()
    }, [])

    const handleDelete = async (id: number) => {
        if (!window.confirm("确定要删除该渠道吗？")) return
        try {
            await deleteChannel(id)
            setChannels((prev) => prev.filter((c) => c.id !== id))
            toast.success("渠道已删除")
        } catch (error) {
            toast.error("删除渠道失败")
        }
    }

    const handleUpdatePriority = async (item: any, priority: number) => {
        if (priority === item.priority) return
        try {
            await putChannel({ ...item, priority })
            setChannels((prev) => prev.map((c) => (c.id === item.id ? { ...c, priority } : c)))
            toast.success("优先级已更新")
        } catch (error) {
            toast.error("更新优先级失败")
        }
    }

    const handleToggleStatus = async (item: any) => {
        const targetStatus = item.status === 1 ? 2 : 1 // 1: enabled, 2: disabled
        try {
            await putChannelStatus(item.id, targetStatus)
            setChannels((prev) => prev.map((c) => (c.id === item.id ? { ...c, status: targetStatus } : c)))
            toast.success(targetStatus === 1 ? "渠道已启用" : "渠道已禁用")
        } catch (error) {
            toast.error("更新状态失败")
        }
    }

    const columns: ColumnDef<any>[] = useMemo(() => [
        {
            title: "ID",
            key: "id",
            width: 80,
            render: (_, item) => <span className="text-slate-600 font-medium">{item.id}</span>
        },
        {
            title: "渠道名",
            key: "name",
            render: (_, item) => <span className="text-slate-900">{item.name}</span>
        },
        {
            title: "协议类型",
            key: "protocol",
            render: (_, item) => (
                <div className="flex items-center gap-2">
                    <span className="text-slate-700">{channelProviders[item.type]?.name || "未知协议"}</span>
                </div>
            )
        },
        {
            title: "状态",
            key: "status",
            render: (_, item) => (
                <span className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border",
                    item.status === 1
                        ? "bg-green-50 text-green-600 border-green-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                )}>
                    {item.status === 1 ? "启用" : "禁用"}
                </span>
            )
        },
        {
            title: (
                <div className="flex items-center gap-1">
                    优先级
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <HelpCircle size={14} className="text-slate-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>优先级越高的渠道，越容易被请求到</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            ),
            key: "priority",
            width: 120,
            render: (_, item) => (
                <Input
                    type="number"
                    defaultValue={item.priority}
                    onBlur={(e) => {
                        const val = parseInt(e.target.value)
                        if (!isNaN(val)) handleUpdatePriority(item, val)
                    }}
                    className="w-20 h-8 text-sm"
                />
            )
        },
        {
            title: "",
            key: "actions",
            width: 60,
            render: (_, item) => (
                <HoverCard openDelay={0} closeDelay={100}>
                    <HoverCardTrigger asChild>
                        <button className="flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors outline-none cursor-pointer">
                            <MoreHorizontal size={18} />
                        </button>
                    </HoverCardTrigger>
                    <HoverCardContent align="end" className="w-[140px] p-1">
                        <div className="flex flex-col">
                            <button
                                className="flex w-full items-center gap-2 rounded-sm px-2 py-2.5 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer text-left focus:outline-none"
                                onClick={() => setTestItem({ id: item.id, name: item.name, models: item.models })}
                            >
                                <Send size={16} />
                                模型测试
                            </button>
                            <button className="flex w-full items-center gap-2 rounded-sm px-2 py-2.5 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer text-left focus:outline-none"
                                onClick={() => handleToggleStatus(item)}
                            >
                                <Ban size={16} />
                                {item.status === 1 ? "禁用" : "启用"}
                            </button>
                            <button
                                className="flex w-full items-center gap-2 rounded-sm px-2 py-2.5 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer text-left focus:outline-none"
                                onClick={() => {
                                    setEditItem(item)
                                    setIsEdit(true)
                                    setShowEditModal(true)
                                }}
                            >
                                <Settings size={16} />
                                编辑
                            </button>
                            <button
                                className="flex w-full items-center gap-2 rounded-sm px-2 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer text-left focus:outline-none"
                                onClick={() => handleDelete(item.id)}
                            >
                                <Trash2 size={16} />
                                删除
                            </button>
                        </div>
                    </HoverCardContent>
                </HoverCard>
            )
        }
    ], [channelProviders])

    if (loading) {
        return <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>
    }

    return (
        <div className="flex flex-col h-full gap-4">
            <div className="flex justify-end items-center">
                <Button
                    className="h-9 px-4 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600"
                    onClick={() => {
                        setEditItem(null)
                        setIsEdit(false)
                        setShowEditModal(true)
                    }}
                >
                    新增渠道
                </Button>
            </div>
            <div className="bg-white rounded-lg overflow-hidden">
                <DataTable
                    columns={columns}
                    dataSource={channels}
                    rowKey="id"
                    className="w-full"
                    rowClassName="hover:bg-slate-50/50 transition-colors group"
                />
            </div>
            <EditChannelModal
                open={showEditModal}
                onOpenChange={setShowEditModal}
                isEdit={isEdit}
                editData={editItem}
                channelProviders={channelProviders}
                onSuccess={fetchChannels}
            />
            <TestModelModal
                open={!!testItem}
                onOpenChange={(v) => !v && setTestItem(null)}
                testData={testItem}
            />
        </div>
    )
}

import { useState, useMemo } from "react"
import { MoreHorizontal, Send, Settings, Trash2, Ban } from "lucide-react"
import { cn } from "@/lib/utils"
import { DataTable, type ColumnDef } from "@/components/common/DataTable"
import EditChannelModal from "./EditChannelModal"
import TestModelModal from "./TestModelModal"
import { Button } from "@/components/ui/button"
import {
    MOCK_CHANNELS,
    type ChannelItem,
} from "../constants"
import { Input } from "@/components/ui/input"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { HelpCircle } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export default function ModelChannelTab() {
    const [channels, setChannels] = useState(MOCK_CHANNELS)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showTestModal, setShowTestModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)

    const handleDelete = (id: number) => {
        setChannels((prev) => prev.filter((c) => c.id !== id))
    }

    const columns: ColumnDef<ChannelItem>[] = useMemo(() => [
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
                    <span className="text-base leading-none">{item.protocolIcon}</span>
                    <span className="text-slate-700">{item.protocol}</span>
                </div>
            )
        },
        {
            title: "状态",
            key: "status",
            render: (_, item) => (
                <span className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border",
                    item.status === "enabled"
                        ? "bg-green-50 text-green-600 border-green-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                )}>
                    {item.status === "enabled" ? "启用" : "禁用"}
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
                                onClick={() => setShowTestModal(true)}
                            >
                                <Send size={16} />
                                模型测试
                            </button>
                            <button className="flex w-full items-center gap-2 rounded-sm px-2 py-2.5 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer text-left focus:outline-none">
                                <Ban size={16} />
                                {item.status === "enabled" ? "禁用" : "启用"}
                            </button>
                            <button
                                className="flex w-full items-center gap-2 rounded-sm px-2 py-2.5 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer text-left focus:outline-none"
                                onClick={() => {
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
    ], [])

    return (
        <div className="flex flex-col h-full gap-4">
            <div className="flex justify-end items-center">
                <Button
                    className="h-9 px-4 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600"
                    onClick={() => {
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
            />
            <TestModelModal
                open={showTestModal}
                onOpenChange={setShowTestModal}
            />
        </div>
    )
}

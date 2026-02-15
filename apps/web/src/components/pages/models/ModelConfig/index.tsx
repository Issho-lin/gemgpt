import { useState, useMemo } from "react"
import { Search, Send, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { DataTable, type ColumnDef } from "@/components/common/DataTable"
import DefaultModelModal from "./DefaultModelModal"
import ConfigFileModal from "./ConfigFileModal"
import EditModelModal from "./EditModelModal"
import EditVectorModelModal from "./EditVectorModelModal"
import EditAudioModelModal from "./EditAudioModelModal"
import EditSTTModelModal from "./EditSTTModelModal"
import EditReRankModelModal from "./EditReRankModelModal"
import { SelectDropdown } from "@/components/common/SelectDropdown"
import {
    MOCK_CONFIG_MODELS,
    PROVIDER_OPTIONS,
    MODEL_TYPE_OPTIONS,
    TAG_COLORS,
    type ModelType,
    type ConfigModelItem,
} from "../constants"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export default function ModelConfigTab() {
    const [provider, setProvider] = useState("")
    const [modelType, setModelType] = useState<ModelType | "">("")
    const [search, setSearch] = useState("")
    const [models, setModels] = useState(MOCK_CONFIG_MODELS)
    const [showDefaultModal, setShowDefaultModal] = useState(false)
    const [showConfigModal, setShowConfigModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showVectorEditModal, setShowVectorEditModal] = useState(false)
    const [showAudioEditModal, setShowAudioEditModal] = useState(false)
    const [showSTTEditModal, setShowSTTEditModal] = useState(false)
    const [showReRankEditModal, setShowReRankEditModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)

    const activeCount = useMemo(() => models.filter((m) => m.isActive).length, [models])

    const toggleActive = (name: string) => {
        setModels((prev) =>
            prev.map((m) => (m.name === name ? { ...m, isActive: !m.isActive } : m))
        )
    }

    const columns: ColumnDef<ConfigModelItem>[] = useMemo(() => [
        {
            title: (
                <div className="flex items-center gap-1 cursor-pointer hover:text-slate-700">
                    <span>模型ID</span>
                </div>
            ),
            key: "name",
            render: (_, model) => (
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                        <span className="text-base leading-none">{model.providerIcon}</span>
                        <span className="text-sm font-medium text-slate-800">{model.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 ml-7">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-600 border border-blue-200">
                            {model.contextLength}
                        </span>
                        {model.capabilities.map((cap) => {
                            const capColor = cap === "工具调用"
                                ? "bg-purple-50 text-purple-600 border-purple-200"
                                : "bg-green-50 text-green-600 border-green-200"
                            return (
                                <span
                                    key={cap}
                                    className={cn("inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border", capColor)}
                                >
                                    {cap}
                                </span>
                            )
                        })}
                    </div>
                </div>
            ),
        },
        {
            title: "模型类型",
            key: "type",
            render: (_, model) => (
                <span
                    className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border",
                        TAG_COLORS[model.tagColor] ?? TAG_COLORS.blue
                    )}
                >
                    {model.typeLabel}
                </span>
            ),
        },
        {
            title: `启用(${activeCount})`,
            key: "active",
            render: (_, model) => (
                <button
                    onClick={() => toggleActive(model.name)}
                    className={cn(
                        "relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer",
                        model.isActive ? "bg-blue-500" : "bg-slate-200"
                    )}
                >
                    <span
                        className={cn(
                            "inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform",
                            model.isActive ? "translate-x-4" : "translate-x-1"
                        )}
                    />
                </button>
            ),
        },
        {
            title: "",
            key: "actions",
            width: 80,
            render: (_, model) => (
                <div className="flex items-center gap-1">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button className="p-1.5 rounded-md text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
                                    <Send size={14} />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                模型测试
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    className="p-1.5 rounded-md text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
                                    onClick={() => {
                                        setIsEdit(true)
                                        if (model.type === "llm") {
                                            setShowEditModal(true)
                                        } else if (model.type === "embedding") {
                                            setShowVectorEditModal(true)
                                        } else if (model.type === "tts") {
                                            setShowAudioEditModal(true)
                                        } else if (model.type === "stt") {
                                            setShowSTTEditModal(true)
                                        } else if (model.type === "rerank") {
                                            setShowReRankEditModal(true)
                                        }
                                    }}
                                >
                                    <Settings size={14} />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                模型参数编辑
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            ),
        },
    ], [activeCount, toggleActive])

    const filteredModels = useMemo(() => {
        return models.filter((model) => {
            const typeMatch = modelType ? model.type === modelType : true
            const searchMatch = search
                ? model.name.toLowerCase().includes(search.toLowerCase())
                : true
            return typeMatch && searchMatch
        })
    }, [models, modelType, search])


    return (
        <div className="flex flex-col h-full gap-4 overflow-y-auto">
            {/* Top bar: filters + action buttons */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-700 whitespace-nowrap">模型提供商</span>
                    <SelectDropdown
                        value={provider}
                        onChange={setProvider}
                        options={PROVIDER_OPTIONS}
                        width="w-[180px]"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-700 whitespace-nowrap">模型类型</span>
                    <SelectDropdown
                        value={modelType}
                        onChange={(v) => setModelType(v as ModelType | "")}
                        options={MODEL_TYPE_OPTIONS}
                        width="w-[140px]"
                    />
                </div>
                <div className="flex-1" />
                <div className="relative w-[250px]">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="根据模型名称搜索"
                        className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                </div>
                <Button
                    variant="outline"
                    onClick={() => setShowDefaultModal(true)}
                    className="h-9 px-4 text-sm font-medium text-slate-700 bg-white border-slate-200 hover:bg-slate-50"
                >
                    默认模型
                </Button>
                <Button
                    variant="outline"
                    onClick={() => setShowConfigModal(true)}
                    className="h-9 px-4 text-sm font-medium text-slate-700 bg-white border-slate-200 hover:bg-slate-50"
                >
                    配置文件
                </Button>
                <HoverCard openDelay={0} closeDelay={100}>
                    <HoverCardTrigger asChild>
                        <Button className="h-9 px-4 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600">
                            新增模型
                        </Button>
                    </HoverCardTrigger>
                    <HoverCardContent align="end" className="w-[140px] p-1">
                        <div className="flex flex-col">
                            {MODEL_TYPE_OPTIONS.filter((opt) => opt.value !== "").map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => {
                                        setIsEdit(false)
                                        if (opt.value === "llm") {
                                            // 语言模型
                                            setShowEditModal(true)
                                        } else if (opt.value === "embedding") {
                                            // 向量模型
                                            setShowVectorEditModal(true)
                                        } else if (opt.value === "tts") {
                                            // 语音合成
                                            setShowAudioEditModal(true)
                                        } else if (opt.value === "stt") {
                                            // 语音识别
                                            setShowSTTEditModal(true)
                                        } else if (opt.value === "rerank") {
                                            // 重排模型
                                            setShowReRankEditModal(true)
                                        }
                                    }}
                                    className="flex w-full items-center rounded-sm px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer text-left"
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </HoverCardContent>
                </HoverCard>
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                dataSource={filteredModels}
                rowKey="name"
                emptyText="暂无匹配的模型"
                className="w-full"
            />
            <DefaultModelModal
                open={showDefaultModal}
                onOpenChange={setShowDefaultModal}
            />
            <ConfigFileModal
                open={showConfigModal}
                onOpenChange={setShowConfigModal}
            />
            <EditModelModal
                open={showEditModal}
                onOpenChange={setShowEditModal}
                isEdit={isEdit}
            />
            <EditVectorModelModal
                open={showVectorEditModal}
                onOpenChange={setShowVectorEditModal}
                isEdit={isEdit}
            />
            <EditAudioModelModal
                open={showAudioEditModal}
                onOpenChange={setShowAudioEditModal}
                isEdit={isEdit}
            />
            <EditSTTModelModal
                open={showSTTEditModal}
                onOpenChange={setShowSTTEditModal}
                isEdit={isEdit}
            />
            <EditReRankModelModal
                open={showReRankEditModal}
                onOpenChange={setShowReRankEditModal}
                isEdit={isEdit}
            />
        </div>
    )
}


import { useState, useMemo, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Send, Settings, Loader2, Trash2 } from "lucide-react"
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
import api from "@/lib/api"
import { toast } from "sonner"

export default function ModelConfigTab() {
    const [provider, setProvider] = useState("")
    const [modelType, setModelType] = useState<ModelType | "">("")
    const [search, setSearch] = useState("")
    const [models, setModels] = useState<ConfigModelItem[]>([])
    const [providerOptions, setProviderOptions] = useState<{ label: React.ReactNode; value: string }[]>([{ label: "全部", value: "" }])
    const [loading, setLoading] = useState(true)
    const [showDefaultModal, setShowDefaultModal] = useState(false)
    const [showConfigModal, setShowConfigModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showVectorEditModal, setShowVectorEditModal] = useState(false)
    const [showAudioEditModal, setShowAudioEditModal] = useState(false)
    const [showSTTEditModal, setShowSTTEditModal] = useState(false)
    const [showReRankEditModal, setShowReRankEditModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)

    useEffect(() => {
        fetchConfigs()
        fetchProviders()
    }, [])

    const fetchProviders = async () => {
        try {
            const res = await api.get("/core/ai/model/providers")
            const options = res.data.map((p: any) => ({
                value: p.provider,
                label: (
                    <div className="flex items-center gap-2">
                        <Avatar className="h-4 w-4">
                            <AvatarImage src={p.avatar} />
                            <AvatarFallback className="text-[10px]">
                                {p.name?.charAt(0) || p.provider?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <span>{p.provider}</span>
                    </div>
                )
            }))
            setProviderOptions([{ label: "全部", value: "" }, ...options])
        } catch (error) {
            console.error("获取模型提供商失败", error)
        }
    }

    const fetchConfigs = async () => {
        try {
            const res = await api.get("/core/ai/model/list")

            // AppModel 字段: { id, type, provider, model, name, charsPointsPrice, config }
            // 后端 type: "llm" | "vector" | "tts" | "stt" | "rerank"
            // 前端 ModelType: "llm" | "embedding" | "tts" | "stt" | "rerank"
            const TYPE_MAP: Record<string, { type: string; typeLabel: string; tagColor: string }> = {
                llm: { type: "llm", typeLabel: "语言模型", tagColor: "blue" },
                embedding: { type: "embedding", typeLabel: "索引模型", tagColor: "yellow" },
                tts: { type: "tts", typeLabel: "语音合成", tagColor: "green" },
                stt: { type: "stt", typeLabel: "语音识别", tagColor: "purple" },
                rerank: { type: "rerank", typeLabel: "重排模型", tagColor: "red" },
            }

            const mappedModels = res.data.map((m: any) => {
                const typeInfo = TYPE_MAP[m.type] ?? { type: m.type, typeLabel: m.type, tagColor: "blue" }
                return {
                    id: m.id,
                    name: m.name,
                    modelName: m.model, // 真实模型标识符，如 "gpt-4o"
                    provider: m.provider,
                    avatar: m.avatar,
                    type: typeInfo.type,
                    typeLabel: typeInfo.typeLabel,
                    tagColor: typeInfo.tagColor,
                    isActive: m.isActive ?? false,
                    isCustom: m.isCustom ?? false,
                    contextToken: m.contextToken,
                    vision: m.vision,
                    toolChoice: m.toolChoice,
                    order: m.order ?? 9999
                }
            })

            const TYPE_ORDER = ["llm", "embedding", "tts", "stt", "rerank"]
            mappedModels.sort((a: any, b: any) => {
                // 先按供应商 order 排
                const orderA = a.order
                const orderB = b.order
                if (orderA !== orderB) return orderA - orderB

                // 供应商 order 相同，再按模型类型排
                const typeA = TYPE_ORDER.indexOf(a.type)
                const typeB = TYPE_ORDER.indexOf(b.type)
                if (typeA !== typeB) return typeA - typeB

                return 0
            })

            setModels(mappedModels)
        } catch (error) {
            toast.error("获取模型列表失败")
        } finally {
            setLoading(false)
        }
    }

    const activeCount = useMemo(() => models.filter((m) => m.isActive).length, [models])

    const toggleActive = async (id: string, currentStatus: boolean) => {
        try {
            await api.patch("/core/ai/model/toggle", { model: id, isActive: !currentStatus })
            setModels((prev) =>
                prev.map((m) => (m.id === id ? { ...m, isActive: !currentStatus } : m))
            )
            toast.success(currentStatus ? "模型已禁用" : "模型已启用")
        } catch (error) {
            toast.error("状态更新失败")
        }
    }

    const deleteModel = async (id: string) => {
        if (!window.confirm("确定要删除该自定义模型吗？")) return
        try {
            await api.delete("/core/ai/model/delete", { params: { id } })
            setModels((prev) => prev.filter((m) => m.id !== id))
            toast.success("模型已删除")
            // 如果需要重新拉取数据以保证准确性，可以调用 fetchConfigs()
        } catch (error) {
            toast.error("删除模型失败")
        }
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
                    <div className="flex items-center gap-3">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={model.avatar} />
                            <AvatarFallback>{model.provider?.charAt(0) || "M"}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-slate-800">{model.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 ml-7">
                        {model.contextToken && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-600 border border-blue-200">
                                {Math.floor(model.contextToken / 1000)}k
                            </span>
                        )}
                        {model.vision && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-green-50 text-green-600 border border-green-200">
                                视觉
                            </span>
                        )}
                        {model.toolChoice && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-purple-50 text-purple-600 border border-purple-200">
                                工具调用
                            </span>
                        )}
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
                    onClick={() => toggleActive(model.id, model.isActive)}
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
                                        // TODO: Pass model data to edit modal
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
                    {model.isCustom && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        className="p-1.5 rounded-md text-red-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                                        onClick={() => deleteModel(model.id)}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    删除模型
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
            ),
        },
    ], [activeCount]) // Removed toggleActive from dependency array to avoid re-renders causing issues



    const filteredModels = useMemo(() => {
        return models.filter((model) => {
            const providerMatch = provider ? model.provider === provider : true
            const typeMatch = modelType ? model.type === modelType : true
            const searchMatch = search
                ? model.name.toLowerCase().includes(search.toLowerCase())
                : true
            return providerMatch && typeMatch && searchMatch
        })
    }, [models, provider, modelType, search])


    if (loading) {
        return <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>
    }

    return (
        <div className="flex flex-col h-full gap-4">
            {/* Top bar: filters + action buttons */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-700 whitespace-nowrap">模型提供商</span>
                    <SelectDropdown
                        value={provider}
                        onChange={setProvider}
                        options={providerOptions}
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
                rowKey="id"
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


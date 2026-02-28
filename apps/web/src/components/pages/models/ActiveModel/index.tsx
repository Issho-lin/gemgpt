import { useState, useMemo, useEffect } from "react"
import { Search, Copy, Check, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { DataTable, type ColumnDef } from "@/components/common/DataTable"
import { SelectDropdown } from "@/components/common/SelectDropdown"
import {
    MODEL_TYPE_OPTIONS,
    TAG_COLORS,
    type ModelType,
    type ModelItem,
} from "../constants"
import { Input } from "@/components/ui/input"
import api from "@/lib/api"
import { toast } from "sonner"

function ModelNameCell({ model }: { model: ModelItem }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(model.name)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
    }

    return (
        <div className="flex items-center gap-2.5">
            <Avatar className="h-6 w-6">
                <AvatarImage src={model.avatar} />
                <AvatarFallback>{model.provider?.charAt(0) || "M"}</AvatarFallback>
            </Avatar>
            <button
                onClick={handleCopy}
                className="group flex items-center gap-1.5 text-sm font-medium text-slate-800 hover:text-blue-600 transition-colors cursor-pointer"
            >
                {model.name}
                {copied ? (
                    <Check size={13} className="text-green-500" />
                ) : (
                    <Copy size={13} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
            </button>
        </div>
    )
}

const columns: ColumnDef<ModelItem>[] = [
    {
        title: "模型名",
        key: "name",
        render: (_, model) => <ModelNameCell model={model} />,
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
        title: "模型计量",
        key: "usage",
        render: (_, model) => (
            <span className="text-sm text-slate-600">
                {model.usedTokens.toLocaleString()} Tokens
            </span>
        ),
    },
]

export default function ActiveModelTab() {
    const [provider, setProvider] = useState("")
    const [modelType, setModelType] = useState<ModelType | "">("")
    const [search, setSearch] = useState("")
    const [models, setModels] = useState<ModelItem[]>([])
    const [loading, setLoading] = useState(true)

    const [providerOptions, setProviderOptions] = useState<{ label: React.ReactNode; value: string }[]>([{ label: "全部", value: "" }])

    useEffect(() => {
        fetchModels()
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

    const fetchModels = async () => {
        try {
            const res = await api.get("/core/ai/model/list")

            const TYPE_MAP: Record<string, { type: string; typeLabel: string; tagColor: string }> = {
                llm: { type: "llm", typeLabel: "语言模型", tagColor: "blue" },
                embedding: { type: "embedding", typeLabel: "索引模型", tagColor: "yellow" },
                tts: { type: "tts", typeLabel: "语音合成", tagColor: "green" },
                stt: { type: "stt", typeLabel: "语音识别", tagColor: "purple" },
                rerank: { type: "rerank", typeLabel: "重排模型", tagColor: "red" },
            }

            // Filter only active models and map to UI structure
            const activeModels = res.data
                .filter((m: any) => m.isActive)
                .map((m: any) => {
                    const typeInfo = TYPE_MAP[m.type] ?? { type: m.type, typeLabel: m.type, tagColor: "blue" }
                    return {
                        name: m.name,
                        provider: m.provider,
                        avatar: m.avatar,
                        type: typeInfo.type as ModelType,
                        typeLabel: typeInfo.typeLabel,
                        tagColor: typeInfo.tagColor,
                        usedTokens: 0, // Backend needs to provide this
                        order: m.order ?? 9999
                    }
                })

            const TYPE_ORDER = ["llm", "embedding", "tts", "stt", "rerank"]
            activeModels.sort((a: any, b: any) => {
                const orderA = a.order
                const orderB = b.order
                if (orderA !== orderB) return orderA - orderB
                const typeA = TYPE_ORDER.indexOf(a.type)
                const typeB = TYPE_ORDER.indexOf(b.type)
                if (typeA !== typeB) return typeA - typeB
                return 0
            })

            setModels(activeModels)
        } catch (error) {
            toast.error("获取模型列表失败")
        } finally {
            setLoading(false)
        }
    }

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
            {/* Filters */}
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
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="根据模型名称搜索"
                        className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                </div>
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                dataSource={filteredModels}
                rowKey="name"
                emptyText="暂无匹配的模型"
                className="w-full"
            />
        </div>
    )
}

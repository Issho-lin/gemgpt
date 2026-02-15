import { useState, useMemo } from "react"
import { Search, Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { DataTable, type ColumnDef } from "@/components/common/DataTable"
import { SelectDropdown } from "@/components/common/SelectDropdown"
import {
    MOCK_MODELS,
    PROVIDER_OPTIONS,
    MODEL_TYPE_OPTIONS,
    TAG_COLORS,
    type ModelType,
    type ModelItem,
} from "../constants"
import { Input } from "@/components/ui/input"

function ModelNameCell({ model }: { model: ModelItem }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(model.name)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
    }

    return (
        <div className="flex items-center gap-2.5">
            <span className="text-base leading-none">{model.providerIcon}</span>
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

    const filteredModels = useMemo(() => {
        return MOCK_MODELS.filter((model) => {
            const providerMatch = provider ? model.provider === provider : true
            const typeMatch = modelType ? model.type === modelType : true
            const searchMatch = search
                ? model.name.toLowerCase().includes(search.toLowerCase())
                : true
            return providerMatch && typeMatch && searchMatch
        })
    }, [provider, modelType, search])

    return (
        <div className="flex flex-col h-full gap-4 overflow-y-auto">
            {/* Filters */}
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
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="搜索模型名称..."
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

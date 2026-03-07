import { Database, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SelectDropdown } from "@/components/common/SelectDropdown"
import { type KnowledgeDetailItem } from "@/api/knowledge"

type ModelOption = {
    label: string
    value: string
    provider?: string
    avatar?: string
}

type KnowledgeDetailConfigPanelProps = {
    detail: KnowledgeDetailItem | null
    indexOptions: ModelOption[]
    textOptions: ModelOption[]
    imageOptions: ModelOption[]
    updatingModelKey: "vectorModel" | "agentModel" | "vlmModel" | null
    onEdit: () => void
    onUpdateModelConfig: (key: "vectorModel" | "agentModel" | "vlmModel", value: string) => void
}

export default function KnowledgeDetailConfigPanel({
    detail,
    indexOptions,
    textOptions,
    imageOptions,
    updatingModelKey,
    onEdit,
    onUpdateModelConfig,
}: KnowledgeDetailConfigPanelProps) {
    const renderModelOption = (item: ModelOption) => (
        <div className="flex items-center gap-2">
            <Avatar className="h-4 w-4">
                <AvatarImage src={item.avatar} />
                <AvatarFallback className="text-[10px]">
                    {item.label?.charAt(0) || item.provider?.charAt(0) || "M"}
                </AvatarFallback>
            </Avatar>
            <span>{item.label}</span>
        </div>
    )

    return (
        <div className="bg-slate-50/40 p-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
                            <Database size={14} />
                        </div>
                        <div className="font-medium text-slate-900 truncate">{detail?.name || "知识库"}</div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onEdit}>
                        <Pencil size={14} />
                    </Button>
                </div>

                <div className="text-sm text-slate-500">
                    {detail?.description || "这个知识库还没有介绍~"}
                </div>

                <div className="border-t pt-3 text-xs text-slate-500">
                    <div>知识库 ID</div>
                    <div className="mt-1 break-all">{detail?.id || "-"}</div>
                </div>

                <div className="space-y-2">
                    <div className="text-sm text-slate-700">索引模型</div>
                    <SelectDropdown
                        value={detail?.config?.vectorModel || ""}
                        onChange={(v) => onUpdateModelConfig("vectorModel", v)}
                        options={indexOptions.map((item) => ({ label: renderModelOption(item), value: item.value }))}
                        placeholder="请选择索引模型"
                        width="w-full"
                        allowClear={false}
                    />
                </div>

                <div className="space-y-2">
                    <div className="text-sm text-slate-700">文本理解模型</div>
                    <SelectDropdown
                        value={detail?.config?.agentModel || ""}
                        onChange={(v) => onUpdateModelConfig("agentModel", v)}
                        options={textOptions.map((item) => ({ label: renderModelOption(item), value: item.value }))}
                        placeholder="请选择文本理解模型"
                        width="w-full"
                        allowClear={false}
                    />
                </div>

                <div className="space-y-2">
                    <div className="text-sm text-slate-700">图片理解模型</div>
                    <SelectDropdown
                        value={detail?.config?.vlmModel || ""}
                        onChange={(v) => onUpdateModelConfig("vlmModel", v)}
                        options={imageOptions.map((item) => ({ label: renderModelOption(item), value: item.value }))}
                        placeholder="请选择图片理解模型"
                        width="w-full"
                        allowClear={false}
                    />
                </div>

                {updatingModelKey && <div className="text-xs text-slate-500">模型配置更新中...</div>}
            </div>
        </div>
    )
}

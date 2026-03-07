import { useState, useMemo, useEffect } from "react"
import { HelpCircle, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SelectDropdown } from "@/components/common/SelectDropdown"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { putUpdateDefaultModels } from "@/api/model"
import { toast } from "sonner"
import type { ConfigModelItem } from "../constants"

type ConfigModelItemExtended = ConfigModelItem & {
    isDefault?: boolean
    isDefaultDatasetTextModel?: boolean
    isDefaultDatasetImageModel?: boolean
}

export default function DefaultModelModal({
    open,
    onOpenChange,
    models,
    fetchConfigs,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    models: ConfigModelItemExtended[]
    fetchConfigs: () => Promise<void>
}) {
    const [loading, setLoading] = useState(false)
    const [formValues, setFormValues] = useState<Record<string, string>>({})

    // Initialize from models
    useEffect(() => {
        if (open) {
            setFormValues({
                llm: models.find(m => m.type === "llm" && m.isDefault)?.modelName || "",
                embedding: models.find(m => m.type === "embedding" && m.isDefault)?.modelName || "",
                tts: models.find(m => m.type === "tts" && m.isDefault)?.modelName || "",
                stt: models.find(m => m.type === "stt" && m.isDefault)?.modelName || "",
                rerank: models.find(m => m.type === "rerank" && m.isDefault)?.modelName || "",
                datasetTextLLM: models.find(m => m.isDefaultDatasetTextModel)?.modelName || "",
                datasetImageLLM: models.find(m => m.isDefaultDatasetImageModel)?.modelName || "",
            })
        }
    }, [open, models])

    const handleChange = (key: string, value: string) => {
        setFormValues((prev) => ({ ...prev, [key]: value }))
    }

    const handleSubmit = async () => {
        setLoading(true)
        try {
            await putUpdateDefaultModels(formValues)
            toast.success("默认模型配置更新成功")
            await fetchConfigs()
            onOpenChange(false)
        } catch (error) {
            toast.error("默认模型配置更新失败")
        } finally {
            setLoading(false)
        }
    }

    const getOptions = (type: string, filter?: (m: ConfigModelItemExtended) => boolean) => {
        return models
            .filter((m) => m.type === type && m.isActive && (!filter || filter(m)))
            .map((m) => ({
                label: (
                    <div className="flex items-center gap-2">
                        <Avatar className="h-4 w-4">
                            <AvatarImage src={m.avatar} />
                            <AvatarFallback className="text-[10px]">
                                {m.name?.charAt(0) || m.provider?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <span>{m.name}</span>
                    </div>
                ),
                value: m.modelName,
            }))
    }

    const DEFAULT_MODEL_FIELDS = useMemo(() => [
        {
            label: "对话模型",
            key: "llm",
            options: getOptions("llm"),
        },
        {
            label: "索引模型",
            key: "embedding",
            options: getOptions("embedding"),
        },
        {
            label: "语音合成",
            key: "tts",
            options: getOptions("tts"),
        },
        {
            label: "语音识别",
            key: "stt",
            options: getOptions("stt"),
        },
        {
            label: "重排模型",
            key: "rerank",
            options: getOptions("rerank"),
        },
        {
            divider: true,
            label: "知识库文本处理模型",
            key: "datasetTextLLM",
            options: getOptions("llm"),
            tooltip: "用于知识库构建过程中的文本分析和整理节点",
        },
        {
            label: "知识库图片处理模型",
            key: "datasetImageLLM",
            // VLM model needs vision
            options: getOptions("llm", (m) => !!m.vision),
            tooltip: "用于知识库构建过程中的图片分析节点",
        },
    ], [models])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-base font-semibold text-slate-800">
                        <div className="text-blue-500 rounded bg-blue-50 p-1.5 flex items-center justify-center">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                        </div>
                        默认模型配置
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-2">
                    {DEFAULT_MODEL_FIELDS.map((field, idx) => (
                        <div key={field.key || idx}>
                            {field.divider && <div className="h-px bg-slate-100 my-4" />}
                            <div className="grid gap-2">
                                <label className="flex items-center gap-1.5 text-[13px] font-medium text-slate-700">
                                    {field.label}
                                    {field.tooltip && (
                                        <span className="text-slate-400 cursor-help hover:text-slate-600 transition-colors" title={field.tooltip}>
                                            <HelpCircle size={14} />
                                        </span>
                                    )}
                                </label>
                                <SelectDropdown
                                    value={formValues[field.key!] || ""}
                                    onChange={(v) => handleChange(field.key!, v)}
                                    options={field.options || []}
                                    placeholder="请选择默认模型（未配置时为空）"
                                    width="w-full"
                                    allowClear
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <DialogFooter className="mt-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                        取消
                    </Button>
                    <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 font-medium" disabled={loading}>
                        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        确认
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

import { useState } from "react"
import { HelpCircle } from "lucide-react"
import { SelectDropdown } from "@/components/common/SelectDropdown"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const DEFAULT_MODEL_FIELDS: {
    label: string
    key: string
    defaultValue: string
    options: { label: string; value: string }[]
    tooltip?: string
}[] = [
        {
            label: "语言模型",
            key: "llm",
            defaultValue: "glm-4-air",
            options: [
                { label: "🧊 glm-4-air", value: "glm-4-air" },
                { label: "🔮 qwen3-max", value: "qwen3-max" },
                { label: "🔮 qwen3-8b", value: "qwen3-8b" },
                { label: "🐋 deepseek-chat", value: "deepseek-chat" },
                { label: "🐋 deepseek-reasoner", value: "deepseek-reasoner" },
            ],
        },
        {
            label: "索引模型",
            key: "embedding",
            defaultValue: "text-embedding-v4",
            options: [
                { label: "🔮 text-embedding-v4", value: "text-embedding-v4" },
            ],
        },
        {
            label: "语音合成",
            key: "tts",
            defaultValue: "",
            options: [],
        },
        {
            label: "语音识别",
            key: "stt",
            defaultValue: "",
            options: [],
        },
        {
            label: "重排模型",
            key: "rerank",
            defaultValue: "",
            options: [],
        },
        {
            label: "文本理解模型",
            key: "textUnderstanding",
            defaultValue: "glm-4-air",
            tooltip: "用于文本内容分析和理解的模型",
            options: [
                { label: "🧊 glm-4-air", value: "glm-4-air" },
                { label: "🔮 qwen3-max", value: "qwen3-max" },
                { label: "🐋 deepseek-chat", value: "deepseek-chat" },
            ],
        },
        {
            label: "图片理解模型",
            key: "imageUnderstanding",
            defaultValue: "doubao-seed-1-6-thinking-250615",
            tooltip: "用于图片内容分析和理解的模型",
            options: [
                { label: "🌊 doubao-seed-1-6-thinking-250615", value: "doubao-seed-1-6-thinking-250615" },
                { label: "🔮 qwen3-max", value: "qwen3-max" },
            ],
        },
    ]

export default function DefaultModelModal({
    open,
    onOpenChange,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
}) {
    const [formValues, setFormValues] = useState<Record<string, string>>(() => {
        const initial: Record<string, string> = {}
        DEFAULT_MODEL_FIELDS.forEach((f) => {
            initial[f.key] = f.defaultValue
        })
        return initial
    })

    const handleChange = (key: string, value: string) => {
        setFormValues((prev) => ({ ...prev, [key]: value }))
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-base font-semibold text-slate-800">
                        <div className="text-blue-500">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                        </div>
                        默认模型配置
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-5 py-2">
                    {DEFAULT_MODEL_FIELDS.map((field) => (
                        <div key={field.key} className="grid gap-2">
                            <label className="flex items-center gap-1 text-sm font-medium text-slate-700">
                                {field.label}
                                {field.tooltip && (
                                    <span className="text-slate-400 cursor-help" title={field.tooltip}>
                                        <HelpCircle size={14} />
                                    </span>
                                )}
                            </label>
                            <SelectDropdown
                                value={formValues[field.key]}
                                onChange={(v) => handleChange(field.key, v)}
                                options={field.options}
                                placeholder="未配置相关模型"
                                width="w-full"
                            />
                        </div>
                    ))}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        取消
                    </Button>
                    <Button onClick={() => onOpenChange(false)} className="bg-blue-500 hover:bg-blue-600">
                        确认
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

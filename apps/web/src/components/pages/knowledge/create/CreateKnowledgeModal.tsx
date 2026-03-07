import { useEffect, useMemo, useState } from "react"
import { Database, HelpCircle } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SelectDropdown } from "@/components/common/SelectDropdown"
import { getModelList } from "@/api/model"
import { createGeneralKnowledge } from "@/api/knowledge"

type ConfigModelItem = {
    name: string
    model?: string
    modelName?: string
    provider?: string
    avatar?: string
    type?: string
    isActive?: boolean
    vision?: boolean
}

type ModelOption = {
    label: string
    value: string
    provider?: string
    avatar?: string
}

interface CreateKnowledgeModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onCreated?: () => void
}

export default function CreateKnowledgeModal({ open, onOpenChange, onCreated }: CreateKnowledgeModalProps) {
    const [name, setName] = useState("")
    const [models, setModels] = useState<ConfigModelItem[]>([])
    const [indexModel, setIndexModel] = useState("")
    const [textModel, setTextModel] = useState("")
    const [imageModel, setImageModel] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [errorText, setErrorText] = useState("")

    const getOptions = (type: string, filter?: (m: ConfigModelItem) => boolean): ModelOption[] => {
        return models
            .filter((m) => m.type === type && m.isActive && (!filter || filter(m)))
            .map((m) => ({
                label: m.name || m.modelName || m.model || "",
                value: m.modelName || m.model || "",
                provider: m.provider,
                avatar: m.avatar,
            }))
            .filter((m) => !!m.value)
    }

    const indexOptions = useMemo(() => getOptions("embedding"), [models])
    const textOptions = useMemo(() => getOptions("llm"), [models])
    const imageOptions = useMemo(() => getOptions("llm", (m) => !!m.vision), [models])

    useEffect(() => {
        if (!open) return

        const fetchModels = async () => {
            try {
                const data = await getModelList()
                setModels(Array.isArray(data) ? data : [])
            } catch (error) {
                setModels([])
            }
        }

        fetchModels()
    }, [open])

    useEffect(() => {
        if (!open) {
            setName("")
            setErrorText("")
            setSubmitting(false)
        }
    }, [open])

    useEffect(() => {
        if (!indexModel || !indexOptions.some((opt) => opt.value === indexModel)) {
            setIndexModel(indexOptions[0]?.value || "")
        }
    }, [indexOptions, indexModel])

    useEffect(() => {
        if (!textModel || !textOptions.some((opt) => opt.value === textModel)) {
            setTextModel(textOptions[0]?.value || "")
        }
    }, [textOptions, textModel])

    useEffect(() => {
        if (!imageModel || !imageOptions.some((opt) => opt.value === imageModel)) {
            setImageModel(imageOptions[0]?.value || "")
        }
    }, [imageOptions, imageModel])

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

    const handleCreate = async () => {
        const trimmedName = name.trim()
        if (!trimmedName) {
            setErrorText("请输入知识库名称")
            return
        }

        setSubmitting(true)
        setErrorText("")

        try {
            await createGeneralKnowledge({
                name: trimmedName,
                vectorModel: indexModel || undefined,
                agentModel: textModel || undefined,
                vlmModel: imageModel || undefined,
            })

            onCreated?.()
            onOpenChange(false)
        } catch (error: any) {
            setErrorText(error?.response?.data?.message || "创建失败，请稍后重试")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between space-y-0">
                    <DialogTitle className="flex items-center gap-2 text-lg font-medium text-slate-800">
                        <div className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-md">
                            <Database size={14} />
                        </div>
                        创建一个通用知识库
                    </DialogTitle>
                </DialogHeader>

                <div className="p-6 space-y-6">
                    <div className="space-y-3">
                        <label className="text-base font-medium text-slate-900">取个名字</label>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-lg shrink-0">
                                <Database size={20} />
                            </div>
                            <Input
                                placeholder="名称"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-10 border-blue-500 focus-visible:ring-0"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-slate-900">索引模型</label>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <HelpCircle size={14} className="text-slate-400" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>选择用于构建知识库索引的模型</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <SelectDropdown
                            value={indexModel}
                            onChange={setIndexModel}
                            options={indexOptions.map((item) => ({ label: renderModelOption(item), value: item.value }))}
                            placeholder="请选择索引模型"
                            width="w-full"
                            allowClear={false}
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-slate-900">文本理解模型</label>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <HelpCircle size={14} className="text-slate-400" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>选择用于理解和处理文本的模型</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <SelectDropdown
                            value={textModel}
                            onChange={setTextModel}
                            options={textOptions.map((item) => ({ label: renderModelOption(item), value: item.value }))}
                            placeholder="请选择文本理解模型"
                            width="w-full"
                            allowClear={false}
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-900">图片理解模型</label>
                        <SelectDropdown
                            value={imageModel}
                            onChange={setImageModel}
                            options={imageOptions.map((item) => ({ label: renderModelOption(item), value: item.value }))}
                            placeholder="请选择图片理解模型"
                            width="w-full"
                            allowClear={false}
                        />
                    </div>

                    {errorText && <div className="text-sm text-red-500">{errorText}</div>}
                </div>

                <div className="px-6 py-4 flex items-center justify-end gap-3">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
                        关闭
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleCreate} disabled={submitting}>
                        {submitting ? "创建中..." : "确认创建"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

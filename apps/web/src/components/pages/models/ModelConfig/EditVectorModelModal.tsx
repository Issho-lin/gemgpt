import { useState } from "react"
import { FileEdit, HelpCircle } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { JSONEditor } from "@/components/common/JSONEditor"
import { SelectDropdown } from "@/components/common/SelectDropdown"

const BODY_EXTRA_EXAMPLE = `{
  "dimensions": 1536
}`

export default function EditVectorModelModal({
    open,
    onOpenChange,
    isEdit,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    isEdit?: boolean
}) {
    const [formData, setFormData] = useState({
        modelId: "",
        provider: "ChatGLM",
        alias: "",
        normalization: false,
        limitQuery: 1,
        defaultChunkSize: 512,
        maxContext: 8000,
        bodyExtra: "",
        customUrl: "",
        customKey: "",
    })

    const updateField = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }))
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-2xl flex flex-col gap-0 p-0 overflow-hidden"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-7 h-7 bg-blue-50 text-blue-500 rounded-md">
                            <FileEdit size={16} />
                        </span>
                        模型参数编辑
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 min-h-0 overflow-y-auto max-h-[70vh] p-10 bg-slate-50">
                    <div className="space-y-6">
                        {/* Model ID */}
                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                            <label className="flex items-center gap-1 text-sm text-slate-600">
                                模型ID
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger><HelpCircle size={14} className="text-slate-400" /></TooltipTrigger>
                                        <TooltipContent side="bottom" className="max-w-[300px]">
                                            模型的唯一标识，也就是实际请求到服务商model的值，需要与 OneAPI 渠道中的模型对应。
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </label>
                            <Input
                                value={formData.modelId}
                                onChange={e => updateField("modelId", e.target.value)}
                            />
                        </div>

                        {/* Provider */}
                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                            <label className="text-sm text-slate-600">模型提供商</label>
                            <SelectDropdown
                                value={formData.provider}
                                onChange={v => updateField("provider", v)}
                                options={[
                                    { label: "ChatGLM", value: "ChatGLM" },
                                    { label: "Qwen", value: "Qwen" },
                                    { label: "Doubao", value: "Doubao" },
                                ]}
                                width="w-full"
                            />
                        </div>

                        {/* Alias */}
                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                            <label className="flex items-center gap-1 text-sm text-slate-600">
                                别名
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger><HelpCircle size={14} className="text-slate-400" /></TooltipTrigger>
                                        <TooltipContent side="bottom">
                                            模型在系统中展示的名字
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </label>
                            <Input
                                value={formData.alias}
                                onChange={e => updateField("alias", e.target.value)}
                            />
                        </div>

                        {/* Normalization */}
                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                            <label className="flex items-center gap-1 text-sm text-slate-600">
                                归一化处理
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger><HelpCircle size={14} className="text-slate-400" /></TooltipTrigger>
                                        <TooltipContent side="bottom">
                                            对 Embedding 向量进行归一化处理
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </label>
                            <div className="flex justify-end">
                                <Switch
                                    checked={formData.normalization}
                                    onCheckedChange={v => updateField("normalization", v)}
                                />
                            </div>
                        </div>

                        {/* Concurrent Requests */}
                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                            <label className="text-sm text-slate-600">
                                并发请求数
                            </label>
                            <Input
                                type="number"
                                value={formData.limitQuery}
                                onChange={e => updateField("limitQuery", parseInt(e.target.value))}
                            />
                        </div>

                        {/* Default Chunk Size */}
                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                            <label className="flex items-center gap-1 text-sm text-slate-600">
                                默认分块长度
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger><HelpCircle size={14} className="text-slate-400" /></TooltipTrigger>
                                        <TooltipContent side="bottom">
                                            文件导入时的默认分块长度
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </label>
                            <Input
                                type="number"
                                value={formData.defaultChunkSize}
                                onChange={e => updateField("defaultChunkSize", parseInt(e.target.value))}
                            />
                        </div>

                        {/* Max Context */}
                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                            <label className="flex items-center gap-1 text-sm text-slate-600">
                                最大上下文
                            </label>
                            <Input
                                type="number"
                                value={formData.maxContext}
                                onChange={e => updateField("maxContext", parseInt(e.target.value))}
                            />
                        </div>

                        {/* Body Extra */}
                        <div className="grid grid-cols-[140px_1fr] items-start gap-4">
                            <label className="flex items-center gap-1 text-sm text-slate-600 mt-2">
                                额外 Body 参数
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger><HelpCircle size={14} className="text-slate-400" /></TooltipTrigger>
                                        <TooltipContent side="bottom" className="max-w-[300px]">
                                            <div>
                                                发起对话请求时候，合并该配置。例如：
                                                <pre className="mt-2 font-mono text-xs text-white/90 bg-white/10 p-2 rounded border border-white/20">
                                                    {BODY_EXTRA_EXAMPLE}
                                                </pre>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </label>
                            <div className="h-24">
                                <JSONEditor
                                    value={formData.bodyExtra}
                                    onChange={v => updateField("bodyExtra", v)}
                                    lineNumbers="off"
                                    className="h-full"
                                />
                            </div>
                        </div>

                        {/* Custom Request Url */}
                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                            <label className="flex items-center gap-1 text-sm text-slate-600">
                                自定义请求地址
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger><HelpCircle size={14} className="text-slate-400" /></TooltipTrigger>
                                        <TooltipContent side="bottom" className="max-w-[400px]">
                                            <div className="space-y-2">
                                                <div>如果填写该值，则会直接向该地址发起请求，不经过模型渠道的配置。</div>
                                                <div>接口需要遵循 OpenAI 的 API格式，并填写完整请求地址，例如：</div>
                                                <div className="mt-2 text-xs bg-white/10 text-white/90 p-2 rounded font-mono border border-white/20">
                                                    <div>LLM: {"{{host}}/v1/chat/completions"}</div>
                                                    <div>Embedding: {"{{host}}/v1/embeddings"}</div>
                                                    <div>STT: {"{{host}}/v1/audio/transcriptions"}</div>
                                                    <div>TTS: {"{{host}}/v1/audio/speech"}</div>
                                                    <div>Rerank: {"{{host}}/v1/rerank"}</div>
                                                </div>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </label>
                            <Input
                                value={formData.customUrl}
                                onChange={e => updateField("customUrl", e.target.value)}
                            />
                        </div>

                        {/* Custom Request Key */}
                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                            <label className="flex items-center gap-1 text-sm text-slate-600">
                                自定义请求 Key
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger><HelpCircle size={14} className="text-slate-400" /></TooltipTrigger>
                                        <TooltipContent side="bottom" className="max-w-[300px]">
                                            向自定义请求地址发起请求时候，携带请求头：Authorization: Bearer xxx 进行请求
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </label>
                            <Input
                                type="password"
                                value={formData.customKey}
                                onChange={e => updateField("customKey", e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="px-6 py-4 border-t bg-white sm:justify-between">
                    {isEdit ? (
                        <Button variant="outline" className="h-9 px-4 text-slate-500 hover:text-slate-700" onClick={() => { }}>
                            恢复默认配置
                        </Button>
                    ) : (
                        <div />
                    )}
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)} className="h-9 px-4">
                            取消
                        </Button>
                        <Button onClick={() => onOpenChange(false)} className="h-9 px-4 bg-blue-600 hover:bg-blue-700">
                            确认
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

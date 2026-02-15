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
import { Textarea } from "@/components/ui/textarea"
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
  "temperature": 1,
  "max_tokens": null
}`

export default function EditModelModal({
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
        maxContext: 128000,
        maxCitation: 120000,
        maxResponse: 4000,
        maxTemp: 0.99,
        showTopP: true,
        showStopSeq: true,
        responseFormat: `[\n  "text",\n  "json_object"\n]`,
        supportTool: true,
        supportImage: false,
        supportThinking: false,
        useKb: true,
        useClassify: true,
        useExtract: true,
        useToolNode: true,
        defaultPrompt: "",
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
                className="sm:max-w-[1200px] h-[85vh] flex flex-col gap-0 p-0 overflow-hidden"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <DialogHeader className="px-10 py-4 border-b">
                    <DialogTitle className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-7 h-7 bg-blue-50 text-blue-500 rounded-md">
                            <FileEdit size={16} />
                        </span>
                        模型参数编辑
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 min-h-0 overflow-y-auto p-10 bg-slate-50">
                    <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                            {/* Model ID */}
                            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <label className="flex items-center gap-1 text-sm text-slate-600 whitespace-nowrap">
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
                                <label className="text-sm text-slate-600 whitespace-nowrap">模型提供商</label>
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
                                <label className="flex items-center gap-1 text-sm text-slate-600 whitespace-nowrap">
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

                            {/* Max Context */}
                            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <label className="text-sm text-slate-600 whitespace-nowrap">
                                    <span className="text-red-500 mr-1">*</span>
                                    最大上下文
                                </label>
                                <Input
                                    type="number"
                                    value={formData.maxContext}
                                    onChange={e => updateField("maxContext", parseInt(e.target.value))}
                                />
                            </div>

                            {/* Max Citation */}
                            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <label className="text-sm text-slate-600 whitespace-nowrap">
                                    <span className="text-red-500 mr-1">*</span>
                                    知识库最大引用
                                </label>
                                <Input
                                    type="number"
                                    value={formData.maxCitation}
                                    onChange={e => updateField("maxCitation", parseInt(e.target.value))}
                                />
                            </div>

                            {/* Max Response */}
                            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <label className="flex items-center gap-1 text-sm text-slate-600 whitespace-nowrap">
                                    最大响应 tokens
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger><HelpCircle size={14} className="text-slate-400" /></TooltipTrigger>
                                            <TooltipContent side="bottom">
                                                模型 max_tokens 参数
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </label>
                                <Input
                                    type="number"
                                    value={formData.maxResponse}
                                    onChange={e => updateField("maxResponse", parseInt(e.target.value))}
                                />
                            </div>

                            {/* Max Temperature */}
                            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <label className="flex items-center gap-1 text-sm text-slate-600 whitespace-nowrap">
                                    最大温度
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger><HelpCircle size={14} className="text-slate-400" /></TooltipTrigger>
                                            <TooltipContent side="bottom">
                                                模型 temperature 参数，不填则代表模型不支持该参数
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </label>
                                <Input
                                    type="number"
                                    step="0.1"
                                    value={formData.maxTemp}
                                    onChange={e => updateField("maxTemp", parseFloat(e.target.value))}
                                />
                            </div>

                            {/* Toggles */}
                            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <label className="text-sm text-slate-600">展示 Top-p 参数</label>
                                <div className="flex justify-end">
                                    <Switch
                                        checked={formData.showTopP}
                                        onCheckedChange={v => updateField("showTopP", v)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <label className="text-sm text-slate-600">展示停止序列参数</label>
                                <div className="flex justify-end">
                                    <Switch
                                        checked={formData.showStopSeq}
                                        onCheckedChange={v => updateField("showStopSeq", v)}
                                    />
                                </div>
                            </div>

                            {/* Response Format */}
                            <div className="grid grid-cols-[140px_1fr] items-start gap-4">
                                <label className="text-sm text-slate-600 mt-2">响应格式</label>
                                <div className="h-32">
                                    <JSONEditor
                                        value={formData.responseFormat}
                                        onChange={v => updateField("responseFormat", v)}
                                        lineNumbers="off"
                                        className="h-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Features Toggles */}
                            {[
                                { label: "支持工具调用", key: "supportTool" },
                                { label: "支持图片识别", key: "supportImage" },
                                { label: "支持输出思考", key: "supportThinking" },
                                { label: "用于知识库文件处理", key: "useKb" },
                                { label: "用于问题分类", key: "useClassify" },
                                { label: "用于文本提取", key: "useExtract" },
                                { label: "用于工具调用节点", key: "useToolNode" },
                            ].map(item => (
                                <div key={item.key} className="grid grid-cols-[1fr_auto] items-center gap-4 py-1 border-b border-slate-50 last:border-0">
                                    <label className="flex items-center gap-1 text-sm text-slate-600 whitespace-nowrap">
                                        {item.label}
                                        {["supportTool", "supportImage", "supportThinking"].includes(item.key) && (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger><HelpCircle size={14} className="text-slate-400" /></TooltipTrigger>
                                                    <TooltipContent side="bottom">
                                                        {item.label === "支持工具调用" && "模型是否支持调用外部工具 (Function Call)"}
                                                        {item.label === "支持图片识别" && "模型是否支持处理图片输入 (Vision)"}
                                                        {item.label === "支持输出思考" && "模型是否支持输出思考过程 (Chain of Thought)"}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                    </label>
                                    <Switch
                                        checked={formData[item.key as keyof typeof formData] as boolean}
                                        onCheckedChange={v => updateField(item.key, v)}
                                    />
                                </div>
                            ))}

                            {/* Default Prompt */}
                            <div className="space-y-2 mt-4">
                                <label className="flex items-center gap-1 text-sm text-slate-600 whitespace-nowrap">
                                    默认提示词
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger><HelpCircle size={14} className="text-slate-400" /></TooltipTrigger>
                                            <TooltipContent side="bottom">
                                                模型对话时，都会携带该默认提示词
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </label>
                                <Textarea
                                    className="h-20 bg-slate-50"
                                    value={formData.defaultPrompt}
                                    onChange={e => updateField("defaultPrompt", e.target.value)}
                                />
                            </div>

                            {/* Body Extra */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-1 text-sm text-slate-600">
                                    Body 额外字段
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
                                <div className="h-32">
                                    <JSONEditor
                                        value={formData.bodyExtra}
                                        onChange={v => updateField("bodyExtra", v)}
                                        lineNumbers="off"
                                        className="h-full"
                                    />
                                </div>
                            </div>

                            {/* Custom Request Url */}
                            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
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
                            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
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

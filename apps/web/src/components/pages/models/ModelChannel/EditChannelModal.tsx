import { useState } from "react"
import { Settings, HelpCircle } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { JSONEditor } from "@/components/common/JSONEditor"
import { SelectDropdown } from "@/components/common/SelectDropdown"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { MODEL_TYPE_OPTIONS } from "../constants"
import EditModelModal from "../ModelConfig/EditModelModal"
import EditVectorModelModal from "../ModelConfig/EditVectorModelModal"
import EditAudioModelModal from "../ModelConfig/EditAudioModelModal"
import EditSTTModelModal from "../ModelConfig/EditSTTModelModal"
import EditReRankModelModal from "../ModelConfig/EditReRankModelModal"

export default function EditChannelModal({
    open,
    onOpenChange,
    isEdit,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    isEdit?: boolean
}) {
    const [formData, setFormData] = useState({
        name: "",
        protocol: "OpenAI",
        models: [] as string[],
        modelMapping: "{}",
        proxyUrl: "",
        apiKey: "",
    })

    const updateField = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }))
    }

    const [showEditModal, setShowEditModal] = useState(false)
    const [showVectorEditModal, setShowVectorEditModal] = useState(false)
    const [showAudioEditModal, setShowAudioEditModal] = useState(false)
    const [showSTTEditModal, setShowSTTEditModal] = useState(false)
    const [showReRankEditModal, setShowReRankEditModal] = useState(false)
    const [isModelEdit, setIsModelEdit] = useState(false)

    const PROTOCOL_OPTIONS = [
        { label: "OpenAI", value: "OpenAI", icon: "🤖" },
        { label: "Azure OpenAI", value: "Azure", icon: "☁️" },
        { label: "Anthropic", value: "Anthropic", icon: "🧠" },
        { label: "Google Gemini", value: "Gemini", icon: "✨" },
    ]

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-[700px] flex flex-col gap-0 p-0 overflow-hidden"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <DialogHeader className="px-5 py-3 border-b">
                    <DialogTitle className="flex items-center gap-2 text-base">
                        <span className="flex items-center justify-center w-7 h-7 bg-blue-50 text-blue-600 rounded-md">
                            <Settings size={16} />
                        </span>
                        渠道配置
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-4">
                    {/* Channel Name */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">
                            <span className="text-red-500 mr-1">*</span>
                            渠道名
                        </label>
                        <Input
                            className="bg-slate-50 h-9"
                            placeholder="请输入渠道名称"
                            value={formData.name}
                            onChange={e => updateField("name", e.target.value)}
                        />
                    </div>

                    {/* Protocol Type */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">
                            <span className="text-red-500 mr-1">*</span>
                            协议类型
                        </label>
                        <SelectDropdown
                            value={formData.protocol}
                            onChange={v => updateField("protocol", v)}
                            options={PROTOCOL_OPTIONS.map(p => ({
                                label: `${p.icon} ${p.label}`,
                                value: p.value
                            }))}
                            width="w-full"
                        />
                    </div>

                    {/* Models */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-slate-700">
                                <span className="text-red-500 mr-1">*</span>
                                模型({formData.models.length})
                            </label>
                            <div className="flex gap-2">
                                <HoverCard openDelay={0} closeDelay={100}>
                                    <HoverCardTrigger asChild>
                                        <Button variant="outline" size="sm" className="h-7 text-xs px-2 bg-white hover:bg-slate-50 border-slate-200 text-slate-600">
                                            新增模型
                                        </Button>
                                    </HoverCardTrigger>
                                    <HoverCardContent align="end" className="w-[140px] p-1">
                                        <div className="flex flex-col">
                                            {MODEL_TYPE_OPTIONS.filter((opt) => opt.value !== "").map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => {
                                                        setIsModelEdit(false)
                                                        if (opt.value === "llm") {
                                                            setShowEditModal(true)
                                                        } else if (opt.value === "embedding") {
                                                            setShowVectorEditModal(true)
                                                        } else if (opt.value === "tts") {
                                                            setShowAudioEditModal(true)
                                                        } else if (opt.value === "stt") {
                                                            setShowSTTEditModal(true)
                                                        } else if (opt.value === "rerank") {
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
                                <Button variant="outline" size="sm" className="h-7 text-xs px-2 bg-white hover:bg-slate-50 border-slate-200 text-slate-600">
                                    清空模型
                                </Button>
                            </div>
                        </div>
                        <div className="w-full">
                            <SelectDropdown
                                value=""
                                onChange={() => { }}
                                options={[]}
                                placeholder="选择该渠道下可用的模型"
                                width="w-full"
                            />
                        </div>
                    </div>

                    {/* Model Mapping */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-1 text-sm font-medium text-slate-700">
                            模型映射
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <HelpCircle size={14} className="text-slate-400" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>配置模型 ID 映射关系</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </label>
                        <div className="h-28 rounded-md border border-slate-200 overflow-hidden">
                            <JSONEditor
                                value={formData.modelMapping}
                                onChange={v => updateField("modelMapping", v)}
                                lineNumbers="off"
                                className="h-full"
                            />
                        </div>
                    </div>

                    {/* Proxy URL */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">
                            代理地址
                            <span className="text-xs font-normal text-slate-400 ml-1">(默认地址: https://api.openai.com/v1)</span>
                        </label>
                        <Input
                            className="bg-slate-50 h-9"
                            placeholder="https://api.openai.com/v1"
                            value={formData.proxyUrl}
                            onChange={e => updateField("proxyUrl", e.target.value)}
                        />
                    </div>

                    {/* API Key */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">
                            API 密钥
                        </label>
                        <Input
                            type="password"
                            className="bg-slate-50 h-9"
                            placeholder="sk-..."
                            value={formData.apiKey}
                            onChange={e => updateField("apiKey", e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter className="px-5 py-3 border-t bg-white">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="h-8 px-4 text-sm">
                        取消
                    </Button>
                    <Button onClick={() => onOpenChange(false)} className="h-8 px-4 text-sm bg-blue-600 hover:bg-blue-700 text-white">
                        {isEdit ? "保存" : "新建"}
                    </Button>
                </DialogFooter>
            </DialogContent>

            <EditModelModal
                open={showEditModal}
                onOpenChange={setShowEditModal}
                isEdit={isModelEdit}
            />
            <EditVectorModelModal
                open={showVectorEditModal}
                onOpenChange={setShowVectorEditModal}
                isEdit={isModelEdit}
            />
            <EditAudioModelModal
                open={showAudioEditModal}
                onOpenChange={setShowAudioEditModal}
                isEdit={isModelEdit}
            />
            <EditSTTModelModal
                open={showSTTEditModal}
                onOpenChange={setShowSTTEditModal}
                isEdit={isModelEdit}
            />
            <EditReRankModelModal
                open={showReRankEditModal}
                onOpenChange={setShowReRankEditModal}
                isEdit={isModelEdit}
            />
        </Dialog>
    )
}

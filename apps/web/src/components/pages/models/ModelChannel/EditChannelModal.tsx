import { useState, useEffect } from "react"
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { JSONEditor } from "@/components/common/JSONEditor"
import { postCreateChannel, putChannel } from "@/api/aiproxy"
import { toast } from "sonner"

export default function EditChannelModal({
    open,
    onOpenChange,
    isEdit,
    editData,
    channelProviders,
    onSuccess,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    isEdit?: boolean
    editData?: any
    channelProviders?: Record<string, any>
    onSuccess?: () => void
}) {
    const [formData, setFormData] = useState({
        name: "",
        protocol: "1", // Default to OpenAI if available
        models: [] as string[],
        modelMapping: "{}\n",
        proxyUrl: "",
        apiKey: "",
        priority: 1,
        status: 1
    })

    const [loading, setLoading] = useState(false)

    // Sync formData with editData when opened
    useEffect(() => {
        if (open) {
            if (isEdit && editData) {
                setFormData({
                    name: editData.name || "",
                    protocol: String(editData.type || "1"),
                    models: editData.models || [],
                    modelMapping: editData.model_mapping ? JSON.stringify(editData.model_mapping, null, 2) : "{}\n",
                    proxyUrl: editData.base_url || "",
                    apiKey: editData.key || "",
                    priority: editData.priority || 1,
                    status: editData.status || 1
                })
            } else {
                setFormData({
                    name: "",
                    protocol: "1",
                    models: [],
                    modelMapping: "{}\n",
                    proxyUrl: "",
                    apiKey: "",
                    priority: 1,
                    status: 1
                })
            }
        }
    }, [open, isEdit, editData])

    const updateField = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }))
    }

    const handleSubmit = async () => {
        if (!formData.name) {
            toast.error("渠道名称不能为空")
            return
        }

        setLoading(true)
        try {
            let mappingObj = null
            try {
                if (formData.modelMapping && formData.modelMapping.trim() !== "") {
                    mappingObj = JSON.parse(formData.modelMapping)
                }
            } catch (e) {
                toast.error("模型映射必须是合法的 JSON")
                setLoading(false)
                return
            }

            const reqData = {
                type: Number(formData.protocol),
                name: formData.name,
                base_url: formData.proxyUrl,
                models: formData.models,
                model_mapping: mappingObj,
                key: formData.apiKey,
                priority: formData.priority,
                status: formData.status
            }

            if (isEdit && editData?.id) {
                await putChannel({ ...reqData, id: editData.id })
                toast.success("渠道更新成功")
            } else {
                await postCreateChannel(reqData)
                toast.success("渠道创建成功")
            }
            onSuccess?.()
            onOpenChange(false)
        } catch (error: any) {
            toast.error(error?.message || "操作失败")
        } finally {
            setLoading(false)
        }
    }

    const PROTOCOL_OPTIONS = Object.entries(channelProviders || {}).map(([key, value]) => ({
        label: value.name,
        value: key
    }))

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
                        <select
                            className="w-full h-9 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
                            value={formData.protocol}
                            onChange={e => updateField("protocol", e.target.value)}
                        >
                            {PROTOCOL_OPTIONS.map(p => (
                                <option key={p.value} value={p.value}>{p.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Models */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-1 text-sm font-medium text-slate-700">
                            模型列表
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <HelpCircle size={14} className="text-slate-400" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>英文逗号分隔，如: gpt-3.5-turbo,gpt-4</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </label>
                        <Input
                            className="bg-slate-50 h-9"
                            placeholder="gpt-3.5-turbo,gpt-4"
                            value={formData.models.join(',')}
                            onChange={e => updateField("models", e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                        />
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
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="h-8 px-4 text-sm" disabled={loading}>
                        取消
                    </Button>
                    <Button onClick={handleSubmit} className="h-8 px-4 text-sm bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
                        {loading ? "提交中..." : isEdit ? "保存" : "新建"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

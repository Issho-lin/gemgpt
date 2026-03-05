import { useState, useEffect, useMemo } from "react"
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
import { SelectDropdown } from "@/components/common/SelectDropdown"
import { MultipleSelect } from "@/components/common/MultipleSelect"
import { postCreateChannel, putChannel, getChannelProviders, getAiproxyMap } from "@/api/aiproxy"
import { getModelProviders, getModelList } from "@/api/model"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function EditChannelModal({
    open,
    onOpenChange,
    isEdit,
    editData,
    onSuccess,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    isEdit?: boolean
    editData?: any
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
    const [protocolOptions, setProtocolOptions] = useState<{ label: React.ReactNode; value: string }[]>([])
    const [allModels, setAllModels] = useState<{ provider: string, model: string }[]>([])
    const [providerList, setProviderList] = useState<any[]>([])
    const [aiproxyMap, setAiproxyMap] = useState<any>({})

    useEffect(() => {
        if (open) {
            Promise.all([
                getChannelProviders(),
                getAiproxyMap(),
                getModelProviders(),
                getModelList()
            ]).then(([providersMap, aiproxyMap, providerData, modelListData]) => {
                setAiproxyMap(aiproxyMap)
                setProviderList(providerData)
                if (Array.isArray(modelListData)) {
                    setAllModels(modelListData)
                }
                const options = Object.entries(providersMap || {}).map(([key, value]: [string, any]) => {
                    const mappedData = aiproxyMap[key] || {
                        name: value.name || "未知协议",
                        provider: "Other"
                    };

                    const nameDisplay = typeof mappedData.name === 'object'
                        ? (mappedData.name['zh-CN'] || mappedData.name['en'] || mappedData.provider)
                        : mappedData.name;

                    const providerInfo = providerData.find((p: any) => p.provider === mappedData.provider) || {}

                    const rawAvatar = mappedData.avatar || providerInfo.avatar;
                    const getAvatarUrl = (avatarStr: string) => {
                        if (!avatarStr) return '';
                        if (avatarStr.startsWith('http') || avatarStr.startsWith('/')) return avatarStr;
                        return `/${avatarStr}.svg`;
                    };
                    const finalAvatar = getAvatarUrl(rawAvatar);

                    const labelNode = (
                        <div className="flex items-center gap-2">
                            {finalAvatar && (
                                <Avatar className="h-5 w-5 rounded-none">
                                    <AvatarImage src={finalAvatar} />
                                    <AvatarFallback className="text-[10px] bg-slate-100 text-slate-500">
                                        {(nameDisplay || mappedData.provider || key)?.charAt(0) || "M"}
                                    </AvatarFallback>
                                </Avatar>
                            )}
                            <span className="text-slate-700">{nameDisplay || key}</span>
                        </div>
                    );

                    return {
                        label: labelNode,
                        value: key,
                        ...value
                    };
                });
                setProtocolOptions(options);
            }).catch(e => {
                console.error("Failed to load channel providers", e)
            })
        }
    }, [open])

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

    const modelList = useMemo(() => {
        const currentProvider = aiproxyMap[formData.protocol] || { provider: "Other" }
        return allModels
            .map((item) => {
                const provider = providerList.find((p: any) => p.provider === item.provider) || {}
                const rawAvatar = provider.avatar
                const finalAvatar = rawAvatar ? (rawAvatar.startsWith('http') || rawAvatar.startsWith('/') ? rawAvatar : `/${rawAvatar}.svg`) : ''

                return {
                    provider: item.provider,
                    icon: finalAvatar,
                    label: item.model,
                    value: item.model
                }
            })
            .sort((a, b) => {
                if (a.provider === currentProvider.provider && b.provider !== currentProvider.provider) return -1
                if (a.provider !== currentProvider.provider && b.provider === currentProvider.provider) return 1
                return 0
            })
    }, [aiproxyMap, formData.protocol, allModels, providerList])

    const selectedProvider = useMemo(() => {
        return protocolOptions.find((p: any) => p.value === formData.protocol) as any
    }, [protocolOptions, formData.protocol])

    const handleSubmit = async () => {
        if (!formData.name) {
            toast.error("渠道名称不能为空")
            return
        }

        if (formData.models.length === 0) {
            toast.error("已选模型不能为空")
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
                            onChange={(v) => {
                                updateField("protocol", v)
                                // Optional: auto-fill base URL if available
                                const selected = protocolOptions.find((p: any) => p.value === v) as any
                                if (selected && selected.defaultBaseUrl && !isEdit) {
                                    updateField("proxyUrl", selected.defaultBaseUrl)
                                }
                            }}
                            options={protocolOptions}
                            width="w-full"
                        />
                    </div>

                    {/* Models */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-1 text-sm font-medium text-slate-700">
                                模型列表<span className="text-slate-500 font-normal">({formData.models.length})</span>
                            </label>
                            {formData.models.length > 0 && (
                                <span
                                    className="text-xs text-blue-500 cursor-pointer hover:underline"
                                    onClick={() => updateField("models", [])}
                                >
                                    清空模型
                                </span>
                            )}
                        </div>
                        <MultipleSelect
                            value={formData.models}
                            list={modelList}
                            onSelect={(v) => updateField("models", v)}
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
                        <label className="text-sm font-medium text-slate-700 flex items-center">
                            代理地址
                            {selectedProvider?.defaultBaseUrl && (
                                <span className="text-xs font-normal text-slate-400 ml-2 flex items-center">
                                    (默认地址:
                                    <span
                                        className="ml-1 text-slate-500 cursor-copy hover:underline"
                                        title="点击复制"
                                        onClick={() => {
                                            navigator.clipboard.writeText(selectedProvider.defaultBaseUrl)
                                            toast.success("复制成功")
                                        }}
                                    >
                                        {selectedProvider.defaultBaseUrl}
                                    </span>)
                                </span>
                            )}
                        </label>
                        <Input
                            className="bg-slate-50 h-9"
                            placeholder={selectedProvider?.defaultBaseUrl || "https://api.openai.com/v1"}
                            value={formData.proxyUrl}
                            onChange={e => updateField("proxyUrl", e.target.value)}
                        />
                    </div>

                    {/* API Key */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700 flex items-center">
                            API 密钥
                            {selectedProvider?.keyHelp && (
                                <span className="text-xs font-normal text-slate-400 ml-2">
                                    (获取方式: {selectedProvider.keyHelp})
                                </span>
                            )}
                        </label>
                        <Input
                            type="password"
                            className="bg-slate-50 h-9"
                            placeholder={selectedProvider?.keyHelp || "sk-..."}
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

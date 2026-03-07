import { useEffect, useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Database, Search, PlusSquare, List, FileText, Pencil, Folder, Layers3, Copy } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { SelectDropdown } from "@/components/common/SelectDropdown"
import { getModelList } from "@/api/model"
import { getKnowledgeDetail, updateKnowledge, type KnowledgeDetailItem } from "@/api/knowledge"
import { toast } from "sonner"

type ModelItem = {
    name?: string
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

export default function KnowledgeDetailPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const id = searchParams.get("id") || ""

    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(false)
    const [detail, setDetail] = useState<KnowledgeDetailItem | null>(null)
    const [models, setModels] = useState<ModelItem[]>([])

    const [showEditModal, setShowEditModal] = useState(false)
    const [editName, setEditName] = useState("")
    const [editDescription, setEditDescription] = useState("")
    const [editSubmitting, setEditSubmitting] = useState(false)
    const [updatingModelKey, setUpdatingModelKey] = useState<"vectorModel" | "agentModel" | "vlmModel" | null>(null)

    const getOptions = (type: string, filter?: (m: ModelItem) => boolean): ModelOption[] => {
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

    const loadDetail = async () => {
        if (!id) return
        setLoading(true)
        try {
            const data = await getKnowledgeDetail(id)
            setDetail(data || null)
        } catch {
            setDetail(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const loadModels = async () => {
            try {
                const data = (await getModelList()) as ModelItem[]
                setModels(Array.isArray(data) ? data : [])
            } catch {
                setModels([])
            }
        }

        loadModels()
    }, [])

    useEffect(() => {
        loadDetail()
    }, [id])

    const filteredDocuments = useMemo(() => {
        const docs = detail?.documents || []
        const keyword = search.trim().toLowerCase()
        if (!keyword) return docs
        return docs.filter((doc) => doc.filename?.toLowerCase().includes(keyword))
    }, [detail?.documents, search])

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

    const openEditModal = () => {
        setEditName(detail?.name || "")
        setEditDescription(detail?.description || "")
        setShowEditModal(true)
    }

    const handleConfirmEdit = async () => {
        if (!detail) return
        const name = editName.trim()
        if (!name) return

        setEditSubmitting(true)
        try {
            await updateKnowledge(detail.id, {
                name,
                description: editDescription.trim(),
            })
            setShowEditModal(false)
            await loadDetail()
        } finally {
            setEditSubmitting(false)
        }
    }

    const updateModelConfig = async (
        key: "vectorModel" | "agentModel" | "vlmModel",
        value: string
    ) => {
        if (!detail) return

        const oldValue = detail?.config?.[key] || ""
        if (oldValue === value) return

        setUpdatingModelKey(key)
        try {
            await updateKnowledge(detail.id, {
                config: {
                    ...(detail.config || {}),
                    [key]: value,
                },
            })
            setDetail((prev) =>
                prev
                    ? {
                          ...prev,
                          config: {
                              ...(prev.config || {}),
                              [key]: value,
                          },
                      }
                    : prev
            )
            toast.success("模型配置更新成功")
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "模型配置更新失败")
        } finally {
            setUpdatingModelKey(null)
        }
    }

    return (
        <div className="h-full bg-slate-50/40">
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent className="sm:max-w-[520px] p-0 gap-0 overflow-hidden">
                    <DialogHeader className="px-6 py-4 border-b">
                        <DialogTitle className="flex items-center gap-2 text-lg font-medium text-slate-800">
                            <div className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-md">
                                <Database size={14} />
                            </div>
                            编辑信息
                        </DialogTitle>
                    </DialogHeader>

                    <div className="p-6 space-y-5">
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-slate-900">名称</label>
                            <Input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="h-10"
                                placeholder="请输入知识库名称"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-slate-900">介绍</label>
                            <Textarea
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                className="min-h-[110px]"
                                placeholder="请输入介绍"
                            />
                        </div>
                    </div>

                    <div className="px-6 py-4 border-t flex items-center justify-end gap-3">
                        <Button variant="outline" onClick={() => setShowEditModal(false)} disabled={editSubmitting}>
                            取消
                        </Button>
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={handleConfirmEdit}
                            disabled={editSubmitting || !editName.trim()}
                        >
                            {editSubmitting ? "提交中..." : "确认"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <div className="h-full grid grid-cols-[1fr_320px]">
                <div className="min-w-0 border-r bg-white">
                    <div className="h-14 px-5 border-b flex items-center gap-2 text-sm text-slate-600">
                        <button className="hover:text-slate-900" onClick={() => navigate("/app/knowledge")}>根目录</button>
                        <span>/</span>
                        <span className="text-slate-900">{detail?.name || "知识库详情"}</span>
                    </div>

                    <div className="h-14 px-5 border-b flex items-center justify-between">
                        <div className="flex items-center gap-6 text-sm">
                            <button className="text-blue-600 font-medium border-b-2 border-blue-600 h-14">数据集</button>
                            <button className="text-slate-500 h-14">搜索测试</button>
                        </div>
                    </div>

                    <div className="p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-sm text-slate-700">
                                <List size={14} />
                                <span>文件({filteredDocuments.length})</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative w-60">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        className="pl-9 h-9"
                                        placeholder="搜索"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                                <HoverCard openDelay={0} closeDelay={120}>
                                    <HoverCardTrigger asChild>
                                        <Button className="h-9 bg-blue-600 hover:bg-blue-700 text-white gap-2 rounded-sm px-4">
                                            <PlusSquare size={14} />
                                            新建/导入
                                        </Button>
                                    </HoverCardTrigger>
                                    <HoverCardContent align="end" className="w-[230px] rounded-2xl p-2">
                                        <button className="flex w-full items-center h-11 rounded-xl text-[15px] text-slate-700 gap-3 px-3 hover:bg-slate-100 transition-colors text-left">
                                            <Folder size={18} className="text-amber-500" />
                                            文件夹
                                        </button>
                                        <button className="mt-1 flex w-full items-center h-11 rounded-xl text-[15px] text-slate-700 gap-3 px-3 hover:bg-slate-100 transition-colors text-left">
                                            <FileText size={18} className="text-slate-500" />
                                            文本数据集
                                        </button>
                                        <button className="mt-1 flex w-full items-center h-11 rounded-xl bg-blue-50 text-blue-600 gap-3 px-3 text-left">
                                            <Database size={18} className="text-blue-600" />
                                            空白数据集
                                        </button>
                                        <div className="my-2 h-px bg-slate-100" />
                                        <button className="flex w-full items-center h-11 rounded-xl text-[15px] text-slate-700 gap-3 px-3 hover:bg-slate-100 transition-colors text-left">
                                            <Layers3 size={18} className="text-slate-500" />
                                            模板导入
                                        </button>
                                        <button className="mt-1 flex w-full items-center h-11 rounded-xl text-[15px] text-slate-700 gap-3 px-3 hover:bg-slate-100 transition-colors text-left">
                                            <Copy size={18} className="text-slate-500" />
                                            备份导入
                                        </button>
                                    </HoverCardContent>
                                </HoverCard>
                            </div>
                        </div>

                        <div className="rounded-md border border-slate-200 overflow-hidden">
                            <div className="grid grid-cols-[40px_2fr_1fr_1fr_1fr_80px] bg-slate-50 text-xs text-slate-500 h-10 items-center px-3">
                                <div />
                                <div>名称</div>
                                <div>处理模式</div>
                                <div>数据量</div>
                                <div>创建/更新时间</div>
                                <div>状态</div>
                            </div>

                            {loading ? (
                                <div className="h-[360px] flex items-center justify-center text-sm text-slate-500">加载中...</div>
                            ) : filteredDocuments.length === 0 ? (
                                <div className="h-[360px] flex flex-col items-center justify-center text-slate-400">
                                    <FileText size={34} />
                                    <div className="mt-3 text-sm">数据库空空如也</div>
                                </div>
                            ) : (
                                <div>
                                    {filteredDocuments.map((doc) => (
                                        <div
                                            key={doc.id}
                                            className="grid grid-cols-[40px_2fr_1fr_1fr_1fr_80px] h-12 items-center px-3 border-t text-sm text-slate-700"
                                        >
                                            <input type="checkbox" />
                                            <div className="truncate">{doc.filename}</div>
                                            <div>-</div>
                                            <div>-</div>
                                            <div>{doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : "-"}</div>
                                            <div>{doc.status || "-"}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50/40 p-4">
                    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
                                    <Database size={14} />
                                </div>
                                <div className="font-medium text-slate-900 truncate">{detail?.name || "知识库"}</div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={openEditModal}>
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
                                onChange={(v) => updateModelConfig("vectorModel", v)}
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
                                onChange={(v) => updateModelConfig("agentModel", v)}
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
                                onChange={(v) => updateModelConfig("vlmModel", v)}
                                options={imageOptions.map((item) => ({ label: renderModelOption(item), value: item.value }))}
                                placeholder="请选择图片理解模型"
                                width="w-full"
                                allowClear={false}
                            />
                        </div>

                        {updatingModelKey && <div className="text-xs text-slate-500">模型配置更新中...</div>}
                    </div>
                </div>
            </div>
        </div>
    )
}

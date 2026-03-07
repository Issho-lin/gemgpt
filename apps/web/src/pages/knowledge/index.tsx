import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Plus, Database, FileText, Clock3, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import CreateKnowledgeModal from "@/components/pages/knowledge/CreateKnowledgeModal"
import CreateApiKnowledgeModal from "@/components/pages/knowledge/CreateApiKnowledgeModal"
import CreateFeishuKnowledgeModal from "@/components/pages/knowledge/CreateFeishuKnowledgeModal"
import CreateYuqueKnowledgeModal from "@/components/pages/knowledge/CreateYuqueKnowledgeModal"
import CreateFolderModal from "@/components/pages/knowledge/CreateFolderModal"
import CreateKnowledgeDropdown from "@/components/pages/knowledge/CreateKnowledgeDropdown"
import { deleteKnowledge, getKnowledgeList, updateKnowledge, type KnowledgeBaseItem } from "@/api/knowledge"
import { getModelList } from "@/api/model"

type ModelItem = {
    name?: string
    model?: string
    modelName?: string
    avatar?: string
    isActive?: boolean
}

type EditKnowledgeDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    name: string
    description: string
    onChangeName: (value: string) => void
    onChangeDescription: (value: string) => void
    submitting: boolean
    onConfirm: () => void
}

type DeleteKnowledgeDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    deletingName?: string
    submitting: boolean
    onCancel: () => void
    onConfirm: () => void
}

function EditKnowledgeDialog({
    open,
    onOpenChange,
    name,
    description,
    onChangeName,
    onChangeDescription,
    submitting,
    onConfirm,
}: EditKnowledgeDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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
                            value={name}
                            onChange={(e) => onChangeName(e.target.value)}
                            className="h-10"
                            placeholder="请输入知识库名称"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-900">介绍</label>
                        <Textarea
                            value={description}
                            onChange={(e) => onChangeDescription(e.target.value)}
                            className="min-h-[110px]"
                            placeholder="请输入介绍"
                        />
                    </div>
                </div>

                <div className="px-6 py-4 border-t flex items-center justify-end gap-3">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
                        取消
                    </Button>
                    <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={onConfirm}
                        disabled={submitting || !name.trim()}
                    >
                        {submitting ? "提交中..." : "确认"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function DeleteKnowledgeDialog({
    open,
    onOpenChange,
    deletingName,
    submitting,
    onCancel,
    onConfirm,
}: DeleteKnowledgeDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[420px] p-0 gap-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle className="text-base font-medium text-slate-800">删除知识库</DialogTitle>
                </DialogHeader>
                <div className="px-6 py-5 text-sm text-slate-600">
                    确认删除知识库「{deletingName}」吗？删除后不可恢复。
                </div>
                <div className="px-6 py-4 border-t flex items-center justify-end gap-3">
                    <Button variant="outline" onClick={onCancel} disabled={submitting}>
                        取消
                    </Button>
                    <Button variant="destructive" onClick={onConfirm} disabled={submitting}>
                        {submitting ? "删除中..." : "确认删除"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default function KnowledgePage() {
    const navigate = useNavigate()
    const [search, setSearch] = useState("")
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showApiModal, setShowApiModal] = useState(false)
    const [showFeishuModal, setShowFeishuModal] = useState(false)
    const [showYuqueModal, setShowYuqueModal] = useState(false)
    const [showFolderModal, setShowFolderModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [list, setList] = useState<KnowledgeBaseItem[]>([])
    const [loading, setLoading] = useState(false)
    const [modelAvatarMap, setModelAvatarMap] = useState<Record<string, string>>({})
    const [editingItem, setEditingItem] = useState<KnowledgeBaseItem | null>(null)
    const [editName, setEditName] = useState("")
    const [editDescription, setEditDescription] = useState("")
    const [editSubmitting, setEditSubmitting] = useState(false)
    const [deletingItem, setDeletingItem] = useState<KnowledgeBaseItem | null>(null)
    const [deleteSubmitting, setDeleteSubmitting] = useState(false)

    const loadKnowledgeList = async () => {
        setLoading(true)
        try {
            const data = await getKnowledgeList()
            setList(Array.isArray(data) ? data : [])
        } catch (error) {
            setList([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadKnowledgeList()
    }, [])

    useEffect(() => {
        const loadModelAvatarMap = async () => {
            try {
                const models = (await getModelList()) as ModelItem[]
                const map = (Array.isArray(models) ? models : []).reduce<Record<string, string>>((acc, model) => {
                    if (!model?.isActive) return acc
                    const key = model.modelName || model.model
                    if (key && model.avatar) {
                        acc[key] = model.avatar
                    }
                    return acc
                }, {})
                setModelAvatarMap(map)
            } catch (error) {
                setModelAvatarMap({})
            }
        }

        loadModelAvatarMap()
    }, [])

    const filteredList = useMemo(() => {
        const keyword = search.trim().toLowerCase()
        if (!keyword) return list
        return list.filter((item) => item.name?.toLowerCase().includes(keyword))
    }, [list, search])

    const openCreateGeneralModal = () => {
        setShowCreateModal(true)
    }

    const openEditModal = (item: KnowledgeBaseItem) => {
        setEditingItem(item)
        setEditName(item.name || "")
        setEditDescription(item.description || "")
        setShowEditModal(true)
    }

    const handleConfirmEdit = async () => {
        if (!editingItem) return
        const name = editName.trim()
        if (!name) return

        setEditSubmitting(true)
        try {
            await updateKnowledge(editingItem.id, {
                name,
                description: editDescription.trim(),
            })
            setShowEditModal(false)
            setEditingItem(null)
            await loadKnowledgeList()
        } finally {
            setEditSubmitting(false)
        }
    }

    const handleDelete = (item: KnowledgeBaseItem) => {
        setDeletingItem(item)
    }

    const handleConfirmDelete = async () => {
        if (!deletingItem) return

        setDeleteSubmitting(true)
        try {
            await deleteKnowledge(deletingItem.id)
            setDeletingItem(null)
            await loadKnowledgeList()
        } finally {
            setDeleteSubmitting(false)
        }
    }

    return (
        <div className="flex flex-col h-full bg-slate-50/50">
            <CreateKnowledgeModal
                open={showCreateModal}
                onOpenChange={setShowCreateModal}
                onCreated={loadKnowledgeList}
            />
            <CreateApiKnowledgeModal open={showApiModal} onOpenChange={setShowApiModal} />
            <CreateFeishuKnowledgeModal open={showFeishuModal} onOpenChange={setShowFeishuModal} />
            <CreateYuqueKnowledgeModal open={showYuqueModal} onOpenChange={setShowYuqueModal} />
            <CreateFolderModal open={showFolderModal} onOpenChange={setShowFolderModal} />

            <EditKnowledgeDialog
                open={showEditModal}
                onOpenChange={setShowEditModal}
                name={editName}
                description={editDescription}
                onChangeName={setEditName}
                onChangeDescription={setEditDescription}
                submitting={editSubmitting}
                onConfirm={handleConfirmEdit}
            />

            <DeleteKnowledgeDialog
                open={!!deletingItem}
                onOpenChange={(open) => !open && setDeletingItem(null)}
                deletingName={deletingItem?.name}
                submitting={deleteSubmitting}
                onCancel={() => setDeletingItem(null)}
                onConfirm={handleConfirmDelete}
            />

            <div className="flex items-center justify-between px-8 py-5 border-b bg-white">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Database size={20} />
                    </div>
                    <h1 className="text-xl font-semibold text-slate-800">我的知识库</h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            className="pl-9 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                            placeholder="知识库名称"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <CreateKnowledgeDropdown
                        onGeneralClick={openCreateGeneralModal}
                        onApiClick={() => setShowApiModal(true)}
                        onFeishuClick={() => setShowFeishuModal(true)}
                        onYuqueClick={() => setShowYuqueModal(true)}
                        onFolderClick={() => setShowFolderModal(true)}
                        contentProps={{ align: "end" }}
                    >
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm gap-2">
                            <Plus size={16} />
                            新建
                        </Button>
                    </CreateKnowledgeDropdown>
                </div>
            </div>

            <div className="flex-1 p-8 overflow-auto">
                {loading ? (
                    <div className="text-sm text-slate-500">正在加载知识库...</div>
                ) : filteredList.length === 0 ? (
                    <div className="h-full flex items-center justify-center pb-24">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 mb-6 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300">
                                <Database size={40} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900 mb-2">还没有知识库</h3>
                            <p className="text-slate-500 mb-8">快去创建一个吧！知识库可以帮助 AI 更好地回答问题。</p>
                            <CreateKnowledgeDropdown
                                onGeneralClick={openCreateGeneralModal}
                                onApiClick={() => setShowApiModal(true)}
                                onFeishuClick={() => setShowFeishuModal(true)}
                                onYuqueClick={() => setShowYuqueModal(true)}
                                onFolderClick={() => setShowFolderModal(true)}
                                contentProps={{
                                    side: "bottom",
                                    align: "center",
                                    className: "w-[340px] p-2 text-left",
                                    avoidCollisions: false,
                                }}
                            >
                                <Button variant="outline" className="gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                                    <Plus size={16} />
                                    立即创建
                                </Button>
                            </CreateKnowledgeDropdown>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredList.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => navigate(`/app/knowledge/detail?id=${item.id}`)}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                            <Database size={16} />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-medium text-slate-900 truncate">{item.name}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">{item.type === "general" ? "通用知识库" : item.type}</div>
                                        </div>
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-slate-500"
                                                disabled={deleteSubmitting && deletingItem?.id === item.id}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <MoreHorizontal size={16} />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-32" onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenuItem
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    openEditModal(item)
                                                }}
                                            >
                                                <Pencil size={14} />
                                                编辑
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-red-600 focus:text-red-600"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleDelete(item)
                                                }}
                                            >
                                                <Trash2 size={14} />
                                                删除
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className="mt-3 text-sm text-slate-600 line-clamp-2 min-h-10">
                                    {item.description || "暂无描述"}
                                </div>

                                {item.config?.vectorModel && (
                                    <div className="mt-3 flex items-center gap-2 min-w-0">
                                        <Avatar className="h-5 w-5 shrink-0">
                                            <AvatarImage src={modelAvatarMap[item.config.vectorModel]} />
                                            <AvatarFallback className="text-[10px]">
                                                {item.config.vectorModel?.charAt(0)?.toUpperCase() || "M"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="text-xs text-slate-500 truncate">{item.config.vectorModel}</div>
                                    </div>
                                )}

                                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                                    <div className="flex items-center gap-1">
                                        <FileText size={14} />
                                        <span>文档 {item._count?.documents || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock3 size={14} />
                                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

import { useEffect, useMemo, useState } from "react"
import CreateKnowledgeModal from "@/components/pages/knowledge/create/CreateKnowledgeModal"
import EditKnowledgeDialog from "@/components/pages/knowledge/dialogs/EditKnowledgeDialog"
import DeleteKnowledgeDialog from "@/components/pages/knowledge/dialogs/DeleteKnowledgeDialog"
import CreateApiKnowledgeModal from "@/components/pages/knowledge/create/CreateApiKnowledgeModal"
import CreateFeishuKnowledgeModal from "@/components/pages/knowledge/create/CreateFeishuKnowledgeModal"
import CreateYuqueKnowledgeModal from "@/components/pages/knowledge/create/CreateYuqueKnowledgeModal"
import CreateFolderModal from "@/components/pages/knowledge/create/CreateFolderModal"
import KnowledgePageHeader from "@/components/pages/knowledge/list/KnowledgePageHeader"
import KnowledgeEmptyState from "@/components/pages/knowledge/list/KnowledgeEmptyState"
import KnowledgeCard from "@/components/pages/knowledge/list/KnowledgeCard"
import { deleteKnowledge, getKnowledgeList, updateKnowledge, type KnowledgeBaseItem } from "@/api/knowledge"
import { getModelList } from "@/api/model"

type ModelItem = {
    name?: string
    model?: string
    modelName?: string
    avatar?: string
    isActive?: boolean
}

export default function KnowledgePage() {
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

            <KnowledgePageHeader
                search={search}
                onSearchChange={setSearch}
                onGeneralClick={openCreateGeneralModal}
                onApiClick={() => setShowApiModal(true)}
                onFeishuClick={() => setShowFeishuModal(true)}
                onYuqueClick={() => setShowYuqueModal(true)}
                onFolderClick={() => setShowFolderModal(true)}
            />

            <div className="flex-1 p-8 overflow-auto">
                {loading ? (
                    <div className="text-sm text-slate-500">正在加载知识库...</div>
                ) : filteredList.length === 0 ? (
                    <KnowledgeEmptyState
                        onGeneralClick={openCreateGeneralModal}
                        onApiClick={() => setShowApiModal(true)}
                        onFeishuClick={() => setShowFeishuModal(true)}
                        onYuqueClick={() => setShowYuqueModal(true)}
                        onFolderClick={() => setShowFolderModal(true)}
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredList.map((item) => (
                            <KnowledgeCard
                                key={item.id}
                                item={item}
                                modelAvatarMap={modelAvatarMap}
                                isDeleting={deleteSubmitting && deletingItem?.id === item.id}
                                onEdit={openEditModal}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

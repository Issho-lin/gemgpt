import { useEffect, useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import EditKnowledgeDialog from "@/components/pages/knowledge/dialogs/EditKnowledgeDialog"
import ImportSourceDialog from "@/components/pages/knowledge/dialogs/ImportSourceDialog"
import KnowledgeDetailDocumentPanel from "@/components/pages/knowledge/detail/KnowledgeDetailDocumentPanel"
import KnowledgeDetailConfigPanel from "@/components/pages/knowledge/detail/KnowledgeDetailConfigPanel"
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
    const [showImportSourceModal, setShowImportSourceModal] = useState(false)
    const [importSource, setImportSource] = useState<"localFile" | "webLink" | "customText">("localFile")
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

            <ImportSourceDialog
                open={showImportSourceModal}
                onOpenChange={setShowImportSourceModal}
                importSource={importSource}
                onSelectImportSource={setImportSource}
                onConfirm={() => {
                    setShowImportSourceModal(false)
                    navigate(id ? `/app/knowledge/import?id=${id}` : "/app/knowledge/import")
                }}
            />

            <div className="h-full grid grid-cols-[1fr_320px]">
                <KnowledgeDetailDocumentPanel
                    detail={detail}
                    loading={loading}
                    search={search}
                    onSearchChange={setSearch}
                    onBack={() => navigate("/app/knowledge")}
                    onOpenImportSource={() => setShowImportSourceModal(true)}
                />

                <KnowledgeDetailConfigPanel
                    detail={detail}
                    indexOptions={indexOptions}
                    textOptions={textOptions}
                    imageOptions={imageOptions}
                    updatingModelKey={updatingModelKey}
                    onEdit={openEditModal}
                    onUpdateModelConfig={updateModelConfig}
                />
            </div>
        </div>
    )
}

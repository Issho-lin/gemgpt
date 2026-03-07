import { Search, PlusSquare, List, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { type KnowledgeDetailItem } from "@/api/knowledge"

type KnowledgeDetailDocumentPanelProps = {
    detail: KnowledgeDetailItem | null
    loading: boolean
    search: string
    onSearchChange: (value: string) => void
    onBack: () => void
    onOpenImportSource: () => void
}

export default function KnowledgeDetailDocumentPanel({
    detail,
    loading,
    search,
    onSearchChange,
    onBack,
    onOpenImportSource,
}: KnowledgeDetailDocumentPanelProps) {
    const filteredDocuments = (detail?.documents || []).filter((doc) => {
        const keyword = search.trim().toLowerCase()
        if (!keyword) return true
        return doc.filename?.toLowerCase().includes(keyword)
    })

    return (
        <div className="min-w-0 border-r bg-white">
            <div className="h-14 px-5 border-b flex items-center gap-2 text-sm text-slate-600">
                <button className="hover:text-slate-900" onClick={onBack}>根目录</button>
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
                                onChange={(e) => onSearchChange(e.target.value)}
                            />
                        </div>
                        <Button
                            className="h-9 bg-blue-600 hover:bg-blue-700 text-white gap-2 rounded-sm px-4"
                            onClick={onOpenImportSource}
                        >
                            <PlusSquare size={14} />
                            新建/导入
                        </Button>
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
    )
}

import { useNavigate } from "react-router-dom"
import { Database, FileText, Clock3, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { type KnowledgeBaseItem } from "@/api/knowledge"

type KnowledgeCardProps = {
    item: KnowledgeBaseItem
    modelAvatarMap: Record<string, string>
    isDeleting: boolean
    onEdit: (item: KnowledgeBaseItem) => void
    onDelete: (item: KnowledgeBaseItem) => void
}

export default function KnowledgeCard({ item, modelAvatarMap, isDeleting, onEdit, onDelete }: KnowledgeCardProps) {
    const navigate = useNavigate()

    return (
        <div
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
                            disabled={isDeleting}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <MoreHorizontal size={16} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuItem
                            onClick={(e) => {
                                e.stopPropagation()
                                onEdit(item)
                            }}
                        >
                            <Pencil size={14} />
                            编辑
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={(e) => {
                                e.stopPropagation()
                                onDelete(item)
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
    )
}

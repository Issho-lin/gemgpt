import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, FolderPlus, Import } from "lucide-react"
import { WorkspaceCategoryType, WORKSPACE_CATEGORY_LABELS } from "@/constants/workspace"

interface WorkspaceToolContentProps {
    category: WorkspaceCategoryType
}

export default function WorkspaceToolContent({ category }: WorkspaceToolContentProps) {
    const navigate = useNavigate()
    
    // Get display title based on category
    const getTitle = () => {
        return WORKSPACE_CATEGORY_LABELS[category] === "全部" ? "我的工具" : WORKSPACE_CATEGORY_LABELS[category]
    }
    
    const handleCreateClick = () => {
        let type = "workflow"
        if (category === WorkspaceCategoryType.tool_http) {
            type = "http"
        } else if (category === WorkspaceCategoryType.tool_mcp) {
            type = "mcp"
        }
        navigate(`/app/workspace/create/tool?type=${type}`)
    }

    return (
        <div className="flex flex-col h-full w-full">
            {/* Main List Area */}
            <div className="flex-1 flex flex-col px-8 py-6 bg-white">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-lg font-bold text-slate-900">{getTitle()}</h2>
                    <div className="flex items-center gap-3">
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                            <Input placeholder="搜索工具" className="pl-9 h-9 bg-slate-50 border-slate-200" />
                        </div>
                        <Button variant="outline" size="sm" className="h-9 gap-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-700">
                            <FolderPlus size={16} />
                            文件夹
                        </Button>
                        <Button variant="outline" size="sm" className="h-9 gap-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-700">
                            <Import size={16} />
                            导入
                        </Button>
                    </div>
                </div>

                {/* Empty State */}
                <div className="flex-1 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-blue-50/30 to-white border border-dashed border-blue-200 m-4 min-h-[400px]">
                    <div className="flex flex-col items-center gap-8">
                        <div className="flex items-center gap-3 text-2xl font-bold text-slate-700">
                            <span className="text-blue-500 text-3xl">✦</span>
                            创建你的第一个工具
                        </div>
                        <Button 
                            onClick={handleCreateClick}
                            className="h-16 w-80 rounded-xl border-2 border-dashed border-blue-300 bg-white text-blue-500 hover:bg-blue-50 hover:border-blue-400 transition-all shadow-sm flex items-center justify-center"
                        >
                            <Plus size={36} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

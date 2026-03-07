import { Search, Plus, Database } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import CreateKnowledgeDropdown from "@/components/pages/knowledge/create/CreateKnowledgeDropdown"

type KnowledgePageHeaderProps = {
    search: string
    onSearchChange: (value: string) => void
    onGeneralClick: () => void
    onApiClick: () => void
    onFeishuClick: () => void
    onYuqueClick: () => void
    onFolderClick: () => void
}

export default function KnowledgePageHeader({
    search,
    onSearchChange,
    onGeneralClick,
    onApiClick,
    onFeishuClick,
    onYuqueClick,
    onFolderClick,
}: KnowledgePageHeaderProps) {
    return (
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
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
                <CreateKnowledgeDropdown
                    onGeneralClick={onGeneralClick}
                    onApiClick={onApiClick}
                    onFeishuClick={onFeishuClick}
                    onYuqueClick={onYuqueClick}
                    onFolderClick={onFolderClick}
                    contentProps={{ align: "end" }}
                >
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm gap-2">
                        <Plus size={16} />
                        新建
                    </Button>
                </CreateKnowledgeDropdown>
            </div>
        </div>
    )
}

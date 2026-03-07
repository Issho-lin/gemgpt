import { Plus, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import CreateKnowledgeDropdown from "@/components/pages/knowledge/create/CreateKnowledgeDropdown"

type KnowledgeEmptyStateProps = {
    onGeneralClick: () => void
    onApiClick: () => void
    onFeishuClick: () => void
    onYuqueClick: () => void
    onFolderClick: () => void
}

export default function KnowledgeEmptyState({
    onGeneralClick,
    onApiClick,
    onFeishuClick,
    onYuqueClick,
    onFolderClick,
}: KnowledgeEmptyStateProps) {
    return (
        <div className="h-full flex items-center justify-center pb-24">
            <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 mb-6 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300">
                    <Database size={40} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">还没有知识库</h3>
                <p className="text-slate-500 mb-8">快去创建一个吧！知识库可以帮助 AI 更好地回答问题。</p>
                <CreateKnowledgeDropdown
                    onGeneralClick={onGeneralClick}
                    onApiClick={onApiClick}
                    onFeishuClick={onFeishuClick}
                    onYuqueClick={onYuqueClick}
                    onFolderClick={onFolderClick}
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
    )
}

import { useState } from "react"
import { Search, Plus, Database } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import CreateKnowledgeModal from "@/components/pages/knowledge/CreateKnowledgeModal"
import CreateApiKnowledgeModal from "@/components/pages/knowledge/CreateApiKnowledgeModal"
import CreateFeishuKnowledgeModal from "@/components/pages/knowledge/CreateFeishuKnowledgeModal"
import CreateYuqueKnowledgeModal from "@/components/pages/knowledge/CreateYuqueKnowledgeModal"
import CreateFolderModal from "@/components/pages/knowledge/CreateFolderModal"
import CreateKnowledgeDropdown from "@/components/pages/knowledge/CreateKnowledgeDropdown"

export default function KnowledgePage() {
    const [search, setSearch] = useState("")
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showApiModal, setShowApiModal] = useState(false)
    const [showFeishuModal, setShowFeishuModal] = useState(false)
    const [showYuqueModal, setShowYuqueModal] = useState(false)
    const [showFolderModal, setShowFolderModal] = useState(false)

    return (
        <div className="flex flex-col h-full bg-slate-50/50">
            <CreateKnowledgeModal open={showCreateModal} onOpenChange={setShowCreateModal} />
            <CreateApiKnowledgeModal open={showApiModal} onOpenChange={setShowApiModal} />
            <CreateFeishuKnowledgeModal open={showFeishuModal} onOpenChange={setShowFeishuModal} />
            <CreateYuqueKnowledgeModal open={showYuqueModal} onOpenChange={setShowYuqueModal} />
            <CreateFolderModal open={showFolderModal} onOpenChange={setShowFolderModal} />
            {/* Header */}
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
                        onGeneralClick={() => setShowCreateModal(true)}
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

            {/* Content - Empty State */}
            <div className="flex-1 flex items-center justify-center p-8 pb-32">
                <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 mb-6 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300">
                        <Database size={40} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 mb-2">
                        还没有知识库
                    </h3>
                    <p className="text-slate-500 mb-8">
                        快去创建一个吧！知识库可以帮助 AI 更好地回答问题。
                    </p>
                    <CreateKnowledgeDropdown 
                        onGeneralClick={() => setShowCreateModal(true)}
                        onApiClick={() => setShowApiModal(true)}
                        onFeishuClick={() => setShowFeishuModal(true)}
                        onYuqueClick={() => setShowYuqueModal(true)}
                        onFolderClick={() => setShowFolderModal(true)}
                        contentProps={{ 
                            side: "bottom", 
                            align: "center", 
                            className: "w-[340px] p-2 text-left",
                            avoidCollisions: false 
                        }}
                    >
                        <Button variant="outline" className="gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                            <Plus size={16} />
                            立即创建
                        </Button>
                    </CreateKnowledgeDropdown>
                </div>
            </div>
        </div>
    )
}

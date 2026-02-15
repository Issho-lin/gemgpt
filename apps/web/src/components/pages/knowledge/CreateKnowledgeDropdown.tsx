import { Database, Monitor, Book, Folder, Plug, FileText, Feather, Info } from "lucide-react"
import { toast } from "sonner"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"

interface CreateKnowledgeDropdownProps {
    children: React.ReactNode
    onGeneralClick: () => void
    onApiClick?: () => void
    onFeishuClick?: () => void
    onYuqueClick?: () => void
    onFolderClick?: () => void
    contentProps?: React.ComponentPropsWithoutRef<typeof HoverCardContent>
}

export default function CreateKnowledgeDropdown({ 
    children, 
    onGeneralClick, 
    onApiClick,
    onFeishuClick,
    onYuqueClick,
    onFolderClick,
    contentProps 
}: CreateKnowledgeDropdownProps) {
    const showComingSoonToast = (featureName: string) => {
        toast.custom((t) => (
            <div className="bg-white rounded-lg shadow-lg border border-slate-100 p-4 flex items-start gap-3 min-w-[300px]">
                <div className="bg-blue-50 p-2 rounded-full shrink-0">
                    <Info size={18} className="text-blue-600" />
                </div>
                <div className="flex-1">
                    <h3 className="text-sm font-medium text-slate-900 mb-1">
                        {featureName} 即将上线
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        该功能正在紧锣密鼓开发中，敬请期待！我们会尽快为您带来更好的体验。
                    </p>
                </div>
                <button 
                    onClick={() => toast.dismiss(t)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <span className="sr-only">Close</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        ), {
            duration: 3000,
        })
    }

    return (
        <HoverCard openDelay={0} closeDelay={100}>
            <HoverCardTrigger asChild>
                {children}
            </HoverCardTrigger>
            <HoverCardContent className="w-[340px] p-2" {...contentProps}>
                <div className="flex flex-col gap-1">
                    <div onClick={onGeneralClick} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-lg shrink-0">
                            <Database size={20} />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-slate-900">通用知识库</div>
                            <div className="text-xs text-slate-500 mt-0.5">
                                通过导入文件、网页链接或手动录入形式构建知识库
                            </div>
                        </div>
                    </div>
                    
                    <div onClick={() => showComingSoonToast("Web 站点同步")} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group">
                        <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg shrink-0">
                            <Monitor size={20} />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-slate-900">Web 站点同步</div>
                            <div className="text-xs text-slate-500 mt-0.5">
                                通过爬虫，批量爬取网页数据构建知识库
                            </div>
                        </div>
                    </div>

                    <HoverCard openDelay={0} closeDelay={100}>
                        <HoverCardTrigger asChild>
                            <div className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group">
                                <div className="flex items-center justify-center w-10 h-10 bg-pink-100 text-pink-600 rounded-lg shrink-0">
                                    <Book size={20} />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-slate-900">第三方知识库</div>
                                    <div className="text-xs text-slate-500 mt-0.5">
                                        自定义API、飞书、语雀等外部文档作为知识库
                                    </div>
                                </div>
                            </div>
                        </HoverCardTrigger>
                        <HoverCardContent side="left" align="center" sideOffset={18} className="w-[340px] p-2" avoidCollisions={false}>
                            <div className="flex flex-col gap-1">
                                <div onClick={onApiClick || (() => showComingSoonToast("API 文件库"))} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group">
                                    <div className="flex items-center justify-center w-10 h-10 bg-green-100 text-green-600 rounded-lg shrink-0">
                                        <Plug size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-slate-900">API 文件库</div>
                                        <div className="text-xs text-slate-500 mt-0.5">
                                            可以通过 API，使用外部文件库构建知识库
                                        </div>
                                    </div>
                                </div>

                                <div onClick={onFeishuClick || (() => showComingSoonToast("飞书知识库"))} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group">
                                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-lg shrink-0">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-slate-900">飞书知识库</div>
                                        <div className="text-xs text-slate-500 mt-0.5">
                                            可通过配置飞书文档权限，使用飞书文档构建知识库，文档不会进行二次存储
                                        </div>
                                    </div>
                                </div>

                                <div onClick={onYuqueClick || (() => showComingSoonToast("语雀知识库"))} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group">
                                    <div className="flex items-center justify-center w-10 h-10 bg-green-100 text-green-600 rounded-lg shrink-0">
                                        <Feather size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-slate-900">语雀知识库</div>
                                        <div className="text-xs text-slate-500 mt-0.5">
                                            可通过配置语雀文档权限，使用语雀文档构建知识库，文档不会进行二次存储
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </HoverCardContent>
                    </HoverCard>

                    <div className="h-px bg-slate-100 my-1" />

                    <div onClick={onFolderClick} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group">
                        <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 text-yellow-600 rounded-lg shrink-0">
                            <Folder size={20} />
                        </div>
                        <div className="text-sm font-medium text-slate-900">文件夹</div>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}
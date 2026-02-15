import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Search, FolderPlus, Import, Languages } from "lucide-react"
import { toast } from "sonner"
import { WorkspaceCategoryType } from "@/constants/workspace"

interface WorkspaceAgentContentProps {
    category?: WorkspaceCategoryType
}

export default function WorkspaceAgentContent({ category = WorkspaceCategoryType.all }: WorkspaceAgentContentProps) {
    
    // In a real application, this data would be fetched from a backend based on the category
    // For now, we'll use a simple mapping or just show the same templates to simulate the "structure"
    const getTemplates = (cat: WorkspaceCategoryType) => {
        // Logic to fetch/filter templates based on category can be added here
        // For now, we return the same set as requested ("pages are the same"), 
        // but this structure allows for future differentiation.
        return [
            {
                id: 1,
                icon: <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><Languages size={20} /></div>,
                title: "多轮翻译机器人",
                desc: "通过 4 轮翻译，提高翻译英文的..."
            },
            {
                id: 2,
                icon: <div className="bg-white p-2 rounded-lg border shadow-sm">
                    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                        <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                            <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                            <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                            <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                            <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.799 L -6.734 42.379 C -8.804 40.439 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                        </g>
                    </svg>
                </div>,
                title: "谷歌搜索",
                desc: "通过请求谷歌搜索，查询相关内容..."
            },
            {
                id: 3,
                icon: <div className="bg-green-100 p-2 rounded-lg text-green-600"><Languages size={20} /></div>,
                title: "长字幕反思翻译机器人",
                desc: "利用 AI 自我反思提升翻译质量，..."
            }
        ]
    }

    const templates = getTemplates(category)

    const handleCreateClick = () => {
        // Logic to navigate to different creation pages based on category
        switch (category) {
            case WorkspaceCategoryType.all:
                toast.info("跳转到通用创建页面")
                break
            case WorkspaceCategoryType.chat_agent:
                toast.info("跳转到对话 Agent 创建页面")
                break
            case WorkspaceCategoryType.workflow:
                toast.info("跳转到工作流创建页面")
                break
            default:
                break
        }
    }

    return (
        <div className="flex flex-col h-full w-full">
            {/* Template Section */}
            <header className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-white">
                <h1 className="text-xl font-bold text-slate-900">从模板新建</h1>
                <Button variant="ghost" className="text-slate-500 hover:text-slate-900 text-sm">
                    隐藏模板
                </Button>
            </header>

            {/* Template Cards */}
            <div className="px-8 py-6 bg-slate-50/30">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {templates.map(template => (
                        <TemplateCard 
                            key={template.id}
                            icon={template.icon}
                            title={template.title}
                            desc={template.desc}
                        />
                    ))}
                    
                    {/* More Card */}
                    <div className="relative overflow-hidden rounded-xl border border-slate-100 bg-gradient-to-br from-indigo-50 to-blue-50 p-5 cursor-pointer hover:shadow-md transition-shadow group h-full min-h-[100px] flex flex-col justify-center">
                        <div className="absolute right-0 top-0 opacity-20 transform translate-x-1/3 -translate-y-1/3">
                            <div className="w-24 h-24 rounded-full bg-blue-400 blur-2xl"></div>
                        </div>
                        <div className="absolute left-0 bottom-0 opacity-20 transform -translate-x-1/3 translate-y-1/3">
                            <div className="w-20 h-20 rounded-full bg-purple-400 blur-2xl"></div>
                        </div>
                        
                        <div className="relative z-10 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-600 group-hover:text-blue-600 transition-colors">更多</h3>
                            <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-blue-600 transition-all">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14" />
                                    <path d="m12 5 7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                        
                        {/* Decorative elements to match image style */}
                        <div className="absolute right-4 bottom-4 transform rotate-12 opacity-80">
                            <div className="w-8 h-10 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-md shadow-sm transform translate-x-2 translate-y-2"></div>
                            <div className="w-8 h-10 bg-gradient-to-br from-purple-200 to-pink-300 rounded-md shadow-sm absolute top-0 left-0 -translate-x-2 -translate-y-2"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main List Area */}
            <div className="flex-1 flex flex-col px-8 py-6 bg-white">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-lg font-bold text-slate-900">Agent</h2>
                    <div className="flex items-center gap-3">
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                            <Input placeholder="搜索 Agent" className="pl-9 h-9 bg-slate-50 border-slate-200" />
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
                            创建你的第一个 Agent
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

function TemplateCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white group h-full">
            <CardContent className="p-5 flex items-start gap-4 h-full">
                <div className="shrink-0">
                    {icon}
                </div>
                <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 truncate pr-2">{title}</h3>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                                <path d="M7 7h10v10" />
                                <path d="M7 17 17 7" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{desc}</p>
                </div>
            </CardContent>
        </Card>
    )
}
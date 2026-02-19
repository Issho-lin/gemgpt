import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
    Search, 
    Bot, 
    Workflow, 
    Wrench, 
    User, 
    Clock
} from "lucide-react"
import { cn } from "@/lib/utils"

// Types
type TabType = "all" | "agent" | "workflow" | "tool"

interface PortalItem {
    id: string
    type: "agent" | "workflow" | "tool"
    title: string
    desc: string
    author: string
    time: string
    icon: React.ReactNode
}

// Mock Data
const MOCK_DATA: PortalItem[] = [
    {
        id: "1",
        type: "workflow",
        title: "谷歌搜索",
        desc: "暂无介绍",
        author: "Owner",
        time: "昨天",
        icon: (
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border shadow-sm">
                <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                        <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                        <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                        <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                        <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.799 L -6.734 42.379 C -8.804 40.439 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                    </g>
                </svg>
            </div>
        )
    }
]

export default function PortalPage() {
    const [activeTab, setActiveTab] = useState<TabType>("all")
    const [searchQuery, setSearchQuery] = useState("")

    const filteredData = MOCK_DATA.filter(item => {
        const matchesTab = activeTab === "all" || item.type === activeTab
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesTab && matchesSearch
    })

    return (
        <div className="flex flex-col h-full bg-slate-50">
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-8 bg-white border-b border-slate-100 shrink-0">
                {/* Tabs */}
                <div className="flex items-center gap-1">
                    <TabButton 
                        active={activeTab === "all"} 
                        onClick={() => setActiveTab("all")}
                    >
                        全部
                    </TabButton>
                    <TabButton 
                        active={activeTab === "agent"} 
                        onClick={() => setActiveTab("agent")}
                    >
                        对话 Agent
                    </TabButton>
                    <TabButton 
                        active={activeTab === "workflow"} 
                        onClick={() => setActiveTab("workflow")}
                    >
                        工作流
                    </TabButton>
                    <TabButton 
                        active={activeTab === "tool"} 
                        onClick={() => setActiveTab("tool")}
                    >
                        工作流工具
                    </TabButton>
                </div>

                {/* Search */}
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input 
                        placeholder="搜索应用" 
                        className="pl-9 h-9 bg-slate-50 border-slate-200 focus-visible:ring-1 focus-visible:ring-blue-500" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Content Grid */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredData.map(item => (
                        <PortalCard key={item.id} item={item} />
                    ))}
                </div>
            </div>
        </div>
    )
}

function TabButton({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) {
    return (
        <Button
            variant="ghost"
            onClick={onClick}
            className={cn(
                "h-9 px-4 text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900",
                active ? "text-blue-600 bg-blue-50 hover:bg-blue-100" : "text-slate-600"
            )}
        >
            {children}
        </Button>
    )
}

function PortalCard({ item }: { item: PortalItem }) {
    const getTypeLabel = (type: PortalItem["type"]) => {
        switch(type) {
            case "agent": return { icon: <Bot size={12} />, label: "对话 Agent" }
            case "workflow": return { icon: <Workflow size={12} />, label: "工作流" }
            case "tool": return { icon: <Wrench size={12} />, label: "工具" }
        }
    }

    const typeInfo = getTypeLabel(item.type)

    return (
        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group bg-white overflow-hidden flex flex-col">
            <CardHeader className="p-5 pb-0 flex-row items-start gap-4 space-y-0">
                <div className="shrink-0">
                    {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-slate-900 truncate pr-2 text-base">{item.title}</h3>
                        <div className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs flex items-center gap-1 shrink-0">
                            {typeInfo.icon}
                            <span>{typeInfo.label}</span>
                        </div>
                    </div>
                    <p className="text-sm text-slate-400 line-clamp-2 h-10 leading-relaxed">{item.desc}</p>
                </div>
            </CardHeader>
            
            <div className="flex-1" /> {/* Spacer to push footer down */}

            <CardFooter className="p-4 pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400 bg-slate-50/30">
                <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 overflow-hidden">
                        <User size={12} />
                    </div>
                    <span>{item.author}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Clock size={12} />
                    <span>{item.time}</span>
                </div>
            </CardFooter>
        </Card>
    )
}

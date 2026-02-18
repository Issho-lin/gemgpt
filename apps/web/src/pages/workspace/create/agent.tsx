import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
    ChevronLeft, 
    Workflow, 
    Box, 
    Languages, 
    Github, 
    Search,
    LayoutTemplate,
    ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const AgentType = {
    WORKFLOW: "workflow",
    CHAT: "chat"
} as const
type AgentType = typeof AgentType[keyof typeof AgentType]

export default function CreateAgentPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const type = searchParams.get("type")

    const [selectedType, setSelectedType] = useState<AgentType>(() => {
        if (type === "chat") return AgentType.CHAT
        return AgentType.WORKFLOW
    })
    const [name, setName] = useState("")

    const templates = [
        {
            id: "classify-bot",
            icon: <LayoutTemplate className="w-6 h-6" />,
            title: "问题分类 + 知识库",
            desc: "先对用户的问题进行分类，再根据不同类型问题，执行不同的操作",
            color: "bg-purple-100 text-purple-600"
        },
        {
            id: "chinese-new",
            icon: <div className="font-serif font-bold text-lg">解</div>,
            title: "汉语新解",
            desc: "生成汉语释义图",
            color: "bg-white text-slate-800 border"
        },
        {
            id: "trans-bot",
            icon: <Languages className="w-6 h-6" />,
            title: "多轮翻译机器人",
            desc: "通过 4 轮翻译，提高翻译英文的质量",
            color: "bg-yellow-100 text-yellow-600"
        },
        {
            id: "issue-bot",
            icon: <Github className="w-6 h-6" />,
            title: "GitHub Issue 总结机器人",
            desc: "定时获取GitHub Issue信息,使用AI进行总结,并推送...",
            color: "bg-slate-800 text-white"
        },
        {
            id: "google-search",
            icon: <Search className="w-6 h-6" />,
            title: "谷歌搜索",
            desc: "通过请求谷歌搜索，查询相关内容作为模型的参考。",
            color: "bg-blue-100 text-blue-600"
        },
        {
            id: "long-trans",
            icon: <Languages className="w-6 h-6" />,
            title: "长文翻译专家",
            desc: "使用专有名词知识库协助翻译，更适合长文本的翻译机器人",
            color: "bg-green-100 text-green-600"
        }
    ]

    const handleCreate = () => {
        if (!name.trim()) {
            toast.error("请输入 Agent 名称")
            return
        }
        toast.success(`创建 ${selectedType === AgentType.WORKFLOW ? '工作流' : '对话 Agent'} "${name}" 成功`)
        
        if (selectedType === AgentType.CHAT) {
            // In a real app, we would get the ID from the backend response
            const newAppId = "new-chat-agent"
            navigate(`/app/detail/${newAppId}`)
        } else {
            navigate("/app/workspace/agents")
        }
    }

    return (
        <div className="flex flex-col h-full bg-slate-50">
            {/* Header */}
            <div className="flex items-center h-14 px-6 bg-white border-b border-slate-100">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1 text-slate-500 hover:text-slate-900 pl-0"
                    onClick={() => navigate(-1)}
                >
                    <ChevronLeft size={18} />
                    返回
                </Button>
                <div className="h-4 w-px bg-slate-200 mx-4" />
                <h1 className="text-base font-medium text-slate-900">创建 Agent</h1>
            </div>

            <div className="flex-1 overflow-hidden flex">
                {/* Left Column - Configuration */}
                <div className="w-full max-w-[800px] p-8 overflow-y-auto border-r border-slate-100 bg-white">
                    {/* Agent Type Selection */}
                    <div className="mb-8">
                        <h2 className="text-sm font-medium text-slate-900 mb-4">Agent 类型</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div 
                                className={cn(
                                    "relative p-4 rounded-xl border-2 cursor-pointer transition-all",
                                    selectedType === AgentType.WORKFLOW 
                                        ? "border-blue-600 bg-blue-50/30" 
                                        : "border-slate-100 bg-white hover:border-blue-200"
                                )}
                                onClick={() => setSelectedType(AgentType.WORKFLOW)}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                                        <Workflow size={18} />
                                    </div>
                                    <span className="font-medium text-slate-900">工作流</span>
                                </div>
                                <p className="text-xs text-slate-500">拖拽编排与多轮对话</p>
                            </div>

                            <div 
                                className={cn(
                                    "relative p-4 rounded-xl border-2 cursor-pointer transition-all",
                                    selectedType === AgentType.CHAT 
                                        ? "border-blue-600 bg-blue-50/30" 
                                        : "border-slate-100 bg-white hover:border-blue-200"
                                )}
                                onClick={() => setSelectedType(AgentType.CHAT)}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
                                        <Box size={18} />
                                    </div>
                                    <span className="font-medium text-slate-900">对话 Agent</span>
                                </div>
                                <p className="text-xs text-slate-500">快速创建对话 Agent</p>
                            </div>
                        </div>
                    </div>

                    {/* Icon & Name */}
                    <div className="mb-8">
                        <h2 className="text-sm font-medium text-slate-900 mb-4">图标 & 名称</h2>
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 cursor-pointer hover:bg-slate-200 transition-colors">
                                {selectedType === AgentType.WORKFLOW ? (
                                    <Workflow size={20} className="text-blue-600" />
                                ) : (
                                    <Box size={20} className="text-indigo-500" />
                                )}
                            </div>
                            <div className="flex-1 flex gap-2">
                                <Input 
                                    placeholder="未命名" 
                                    className="flex-1"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleCreate}>
                                    创建
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Templates */}
                    {selectedType === AgentType.WORKFLOW && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-medium text-slate-900">从模板创建</h2>
                                <a href="#" className="text-xs text-slate-400 hover:text-blue-600 flex items-center gap-1">
                                    模板市场 <ArrowRight size={12} />
                                </a>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {templates.map(template => (
                                    <div 
                                        key={template.id}
                                        className="p-4 rounded-xl border border-slate-100 hover:shadow-md cursor-pointer transition-all bg-white group"
                                    >
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", template.color)}>
                                                {template.icon}
                                            </div>
                                        </div>
                                        <h3 className="text-sm font-medium text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                                            {template.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 line-clamp-2">
                                            {template.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Preview */}
                <div className="flex-1 bg-slate-50 flex items-center justify-center p-12">
                    <div className="max-w-lg text-center">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">
                            {selectedType === AgentType.WORKFLOW ? "工作流" : "对话 Agent"}
                        </h2>
                        <p className="text-slate-500 mb-12">
                            {selectedType === AgentType.WORKFLOW 
                                ? "支持记忆的复杂多轮对话工作流。" 
                                : "最基础的对话应用，无需复杂配置，快速创建和使用。"
                            }
                        </p>
                        
                        <div className="relative">
                            {/* Abstract Illustration */}
                            <div className="w-[380px] aspect-square max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 p-6 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white" />
                                
                                {selectedType === AgentType.WORKFLOW ? (
                                    // Workflow Illustration
                                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                                        {/* Dashed Line Background */}
                                        <div className="absolute w-full h-px border-t-2 border-dashed border-slate-200" />
                                        
                                        {/* Back Layer (Pink) */}
                                        <div className="absolute w-40 h-40 bg-pink-100 rounded-3xl transform -rotate-6 translate-x-[-10px]" />
                                        
                                        {/* Front Layer (Blue Document) */}
                                        <div className="relative w-40 h-40 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100 rounded-3xl shadow-xl flex flex-col items-center justify-center gap-4 p-4">
                                            <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
                                                <Workflow className="text-white w-8 h-8" />
                                            </div>
                                            <div className="w-20 h-2.5 bg-blue-100 rounded-full" />
                                            <div className="w-12 h-2.5 bg-blue-50 rounded-full" />
                                        </div>
                                    </div>
                                ) : (
                                    // Chat Agent Illustration
                                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                                        <div className="w-40 h-40 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-3xl shadow-2xl flex items-center justify-center transform -rotate-6 z-20">
                                            <Box className="text-white w-20 h-20" />
                                        </div>
                                        <div className="absolute w-40 h-40 bg-slate-100 rounded-3xl transform translate-x-4 translate-y-4 rotate-6 z-10" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

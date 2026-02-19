import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
    ChevronLeft, 
    Workflow, 
    Box, 
    Cloud,
    ArrowRight,
    Image as ImageIcon,
    MessageSquare
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const ToolType = {
    WORKFLOW: "workflow",
    MCP: "mcp",
    HTTP: "http"
} as const
type ToolType = typeof ToolType[keyof typeof ToolType]

export default function CreateToolPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const type = searchParams.get("type")

    const [selectedType, setSelectedType] = useState<ToolType>(() => {
        if (type === ToolType.HTTP) return ToolType.HTTP
        if (type === ToolType.MCP) return ToolType.MCP
        return ToolType.WORKFLOW
    })
    const [name, setName] = useState("")
    
    // MCP State
    const [authType, setAuthType] = useState("none")
    const [mcpUrl, setMcpUrl] = useState("")
    
    // HTTP State
    const [httpCreateMethod, setHttpCreateMethod] = useState<"batch" | "manual">("batch")

    const templates = [
        {
            id: "flux",
            icon: <ImageIcon className="w-6 h-6" />,
            title: "Flux 绘图",
            desc: "通过请求 Flux 接口绘图，需要有 api key",
            color: "bg-purple-100 text-purple-600"
        },
        {
            id: "dalle3",
            icon: <ImageIcon className="w-6 h-6" />,
            title: "Dalle3 绘图",
            desc: "通过请求 Dalle3 接口绘图，需要有 api key",
            color: "bg-slate-100 text-slate-800"
        },
        {
            id: "feishu",
            icon: <MessageSquare className="w-6 h-6" />,
            title: "飞书 webhook 插件",
            desc: "通过 webhook 给飞书机器人发送一条消息",
            color: "bg-blue-100 text-blue-600"
        }
    ]

    const handleCreate = () => {
        if (!name.trim()) {
            toast.error("请输入工具名称")
            return
        }
        toast.success(`创建工具 "${name}" 成功`)
        navigate("/app/workspace/tools")
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
                <h1 className="text-base font-medium text-slate-900">创建工具</h1>
            </div>

            <div className="flex-1 overflow-hidden flex">
                {/* Left Column - Configuration */}
                <div className="w-full max-w-[800px] p-8 overflow-y-auto border-r border-slate-100 bg-white">
                    {/* Tool Type Selection */}
                    <div className="mb-8">
                        <h2 className="text-sm font-medium text-slate-900 mb-4">工具类型</h2>
                        <div className="grid grid-cols-3 gap-4">
                            <div 
                                className={cn(
                                    "relative p-4 rounded-xl border-2 cursor-pointer transition-all",
                                    selectedType === ToolType.WORKFLOW 
                                        ? "border-emerald-500 bg-emerald-50/30" 
                                        : "border-slate-100 bg-white hover:border-emerald-200"
                                )}
                                onClick={() => setSelectedType(ToolType.WORKFLOW)}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                                        <Workflow size={18} />
                                    </div>
                                    <span className="font-medium text-slate-900">工作流工具</span>
                                </div>
                                <p className="text-xs text-slate-500">常用于封装工作流</p>
                            </div>

                            <div 
                                className={cn(
                                    "relative p-4 rounded-xl border-2 cursor-pointer transition-all",
                                    selectedType === ToolType.MCP 
                                        ? "border-blue-600 bg-blue-50/30" 
                                        : "border-slate-100 bg-white hover:border-blue-200"
                                )}
                                onClick={() => setSelectedType(ToolType.MCP)}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-slate-600 flex items-center justify-center text-white">
                                        <Box size={18} />
                                    </div>
                                    <span className="font-medium text-slate-900">MCP 工具</span>
                                </div>
                                <p className="text-xs text-slate-500">连接 MCP 服务</p>
                            </div>

                            <div 
                                className={cn(
                                    "relative p-4 rounded-xl border-2 cursor-pointer transition-all",
                                    selectedType === ToolType.HTTP 
                                        ? "border-pink-500 bg-pink-50/30" 
                                        : "border-slate-100 bg-white hover:border-pink-200"
                                )}
                                onClick={() => setSelectedType(ToolType.HTTP)}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-pink-400 flex items-center justify-center text-white">
                                        <Cloud size={18} />
                                    </div>
                                    <span className="font-medium text-slate-900">HTTP 工具</span>
                                </div>
                                <p className="text-xs text-slate-500">批量导入 API 工具</p>
                            </div>
                        </div>
                    </div>

                    {/* Icon & Name */}
                    <div className="mb-8">
                        <h2 className="text-sm font-medium text-slate-900 mb-4">图标 & 名称</h2>
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 cursor-pointer hover:bg-slate-200 transition-colors">
                                {selectedType === ToolType.WORKFLOW && <Workflow size={20} className="text-emerald-500" />}
                                {selectedType === ToolType.MCP && <Box size={20} className="text-slate-600" />}
                                {selectedType === ToolType.HTTP && <Cloud size={20} className="text-pink-400" />}
                            </div>
                            <div className="flex-1 flex gap-2">
                                <Input 
                                    placeholder="未命名" 
                                    className="flex-1"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                {selectedType === ToolType.WORKFLOW && (
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleCreate}>
                                        创建
                                    </Button>
                                )}
                                {selectedType === ToolType.HTTP && (
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleCreate}>
                                        创建
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Content based on Type */}
                    
                    {/* WORKFLOW Specific */}
                    {selectedType === ToolType.WORKFLOW && (
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

                    {/* MCP Specific */}
                    {selectedType === ToolType.MCP && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-sm font-medium text-slate-900 mb-2">鉴权类型</h2>
                                <Select value={authType} onValueChange={setAuthType}>
                                    <SelectTrigger className="w-full bg-white">
                                        <SelectValue placeholder="选择鉴权类型" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">无</SelectItem>
                                        <SelectItem value="api-key">API Key</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <h2 className="text-sm font-medium text-slate-900 mb-2">MCP 地址</h2>
                                <div className="flex gap-2">
                                    <Input 
                                        placeholder="填入 MCP 地址后，点击解析" 
                                        value={mcpUrl}
                                        onChange={(e) => setMcpUrl(e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button variant="outline">解析</Button>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-sm font-medium text-slate-900 mb-2">工具列表</h2>
                                <div className="h-32 rounded-lg border border-slate-200 border-dashed bg-slate-50 flex items-center justify-center text-slate-400 text-sm">
                                    暂无数据，需先解析 MCP 地址
                                </div>
                            </div>
                            
                            <div className="flex justify-end pt-4">
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8" onClick={handleCreate}>
                                    创建
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* HTTP Specific */}
                    {selectedType === ToolType.HTTP && (
                        <div>
                            <h2 className="text-sm font-medium text-slate-900 mb-4">创建方式</h2>
                            <div className="space-y-3">
                                <div 
                                    className={cn(
                                        "flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all",
                                        httpCreateMethod === "batch" 
                                            ? "border-blue-600 bg-blue-50/30" 
                                            : "border-slate-200 bg-white hover:border-blue-200"
                                    )}
                                    onClick={() => setHttpCreateMethod("batch")}
                                >
                                    <div className={cn(
                                        "w-4 h-4 rounded-full border flex items-center justify-center",
                                        httpCreateMethod === "batch" ? "border-blue-600" : "border-slate-300"
                                    )}>
                                        {httpCreateMethod === "batch" && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                                    </div>
                                    <div>
                                        <div className="font-medium text-slate-900 text-sm">批量创建</div>
                                        <div className="text-xs text-slate-500 mt-0.5">通过 OpenAPI Schema 批量创建工具</div>
                                    </div>
                                </div>

                                <div 
                                    className={cn(
                                        "flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all",
                                        httpCreateMethod === "manual" 
                                            ? "border-blue-600 bg-blue-50/30" 
                                            : "border-slate-200 bg-white hover:border-blue-200"
                                    )}
                                    onClick={() => setHttpCreateMethod("manual")}
                                >
                                    <div className={cn(
                                        "w-4 h-4 rounded-full border flex items-center justify-center",
                                        httpCreateMethod === "manual" ? "border-blue-600" : "border-slate-300"
                                    )}>
                                        {httpCreateMethod === "manual" && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                                    </div>
                                    <div>
                                        <div className="font-medium text-slate-900 text-sm">手动创建</div>
                                        <div className="text-xs text-slate-500 mt-0.5">通过 curl 或手动填写参数创建单个工具</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Preview */}
                <div className="flex-1 bg-slate-50 flex items-center justify-center p-12">
                    <div className="max-w-lg text-center">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">
                            {selectedType === ToolType.WORKFLOW && "工作流工具"}
                            {selectedType === ToolType.MCP && "MCP 工具"}
                            {selectedType === ToolType.HTTP && "HTTP 工具"}
                        </h2>
                        <p className="text-slate-500 mb-12">
                            {selectedType === ToolType.WORKFLOW && "一键输出指定结果。"}
                            {selectedType === ToolType.MCP && "通过输入 MCP 地址，自动解析并批量创建可调用的 MCP 工具"}
                            {selectedType === ToolType.HTTP && "通过 OpenAPI Schema 批量创建工具(兼容GPTs)"}
                        </p>
                        
                        <div className="relative">
                            {/* Abstract Illustration */}
                            
                            {selectedType === ToolType.WORKFLOW && (
                                <div className="w-[380px] aspect-[4/3] max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 p-6 relative overflow-hidden">
                                     <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50" />
                                     <div className="relative z-10 flex items-center justify-center gap-8 h-full">
                                        {/* Node 1 */}
                                        <div className="w-24 h-24 bg-white rounded-xl shadow-lg border border-pink-100 p-3 flex flex-col gap-2">
                                            <div className="w-6 h-6 rounded-md bg-pink-100 flex items-center justify-center">
                                                <div className="w-3 h-3 bg-pink-400 rounded-sm" />
                                            </div>
                                            <div className="w-full h-2 bg-slate-100 rounded-full mt-2" />
                                            <div className="w-2/3 h-2 bg-slate-100 rounded-full" />
                                        </div>
                                        
                                        {/* Connection */}
                                        <div className="flex-1 h-px border-t-2 border-dashed border-slate-300 relative">
                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-4 bg-slate-200 rounded-sm flex items-center justify-center">
                                                <div className="w-1 h-1 bg-slate-400 rounded-full mx-0.5" />
                                                <div className="w-1 h-1 bg-slate-400 rounded-full mx-0.5" />
                                                <div className="w-1 h-1 bg-slate-400 rounded-full mx-0.5" />
                                            </div>
                                        </div>

                                        {/* Node 2 */}
                                        <div className="w-24 h-24 bg-white rounded-xl shadow-lg border border-blue-100 p-3 flex flex-col gap-2">
                                            <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center">
                                                <div className="w-3 h-3 bg-blue-500 rounded-sm" />
                                            </div>
                                            <div className="w-full h-2 bg-slate-100 rounded-full mt-2" />
                                            <div className="w-2/3 h-2 bg-slate-100 rounded-full" />
                                        </div>
                                     </div>
                                </div>
                            )}

                            {selectedType === ToolType.MCP && (
                                <div className="w-[300px] aspect-square mx-auto flex items-center justify-center">
                                    <div className="relative">
                                        {/* Stylized M/Spring shape - approximated with SVG or CSS */}
                                        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-300 opacity-50">
                                            <path d="M40 160V60C40 48.9543 48.9543 40 60 40C71.0457 40 80 48.9543 80 60V140C80 151.046 88.9543 160 100 160C111.046 160 120 151.046 120 140V60C120 48.9543 128.954 40 140 40C151.046 40 160 48.9543 160 60V160" stroke="currentColor" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                </div>
                            )}

                            {selectedType === ToolType.HTTP && (
                                <div className="w-[300px] aspect-square mx-auto flex items-center justify-center relative">
                                    {/* Cloud with HTTP text */}
                                    <div className="w-48 h-32 bg-gradient-to-br from-pink-400 to-rose-400 rounded-[40px] shadow-2xl flex items-center justify-center relative z-10">
                                        <span className="text-white font-bold text-3xl tracking-wider">HTTP</span>
                                    </div>
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-48 bg-slate-100 rounded-[60px] opacity-30 -z-10 blur-xl" />
                                    
                                    <div className="absolute bottom-[-20px] right-[-10px] text-slate-100 font-bold text-6xl opacity-50 select-none pointer-events-none">
                                        HTTP
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

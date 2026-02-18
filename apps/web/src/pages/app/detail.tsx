import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { 
    ChevronLeft, 
    History, 
    MoreHorizontal, 
    Settings, 
    MessageSquare, 
    Bot, 
    Wrench, 
    FileText, 
    Variable, 
    Plus, 
    Eraser, 
    Paperclip, 
    Send,
    Database,
    Code,
    Sparkles,
    Info,
    AudioWaveform,
    Mic,
    Lightbulb,
    Keyboard,
    Edit3,
    User,
    Copy,
    Box
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

const PROMPT_PLACEHOLDER = `模型固定的引导词，通过调整该内容，可以引导模型聊天方向。该内容会被固定在上下文的开头。可通过输入 / 插入选择变量
如果关联了知识库，你还可以通过适当的描述，来引导模型何时去调用知识库搜索。例如:
你是电影《星际穿越》的助手，当用户询问与《星际穿越》相关的内容时，请搜索知识库并结合搜索结果进行回答。`

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
    meta?: {
        contextCount?: number
        latency?: number
    }
}

export default function AppDetail() {
    const navigate = useNavigate()
    // const { appId } = useParams()
    const [activeTab, setActiveTab] = useState("config")
    const [chatInput, setChatInput] = useState("")
    const [messages, setMessages] = useState<Message[]>([])
    const scrollRef = useRef<HTMLDivElement>(null)
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)

    // Mock Data State
    const [appName] = useState("智能客服")
    const [description] = useState("快来给应用用一个介绍~")
    const [model, setModel] = useState("glm-4-air")
    const [prompt, setPrompt] = useState("")
    const [openingStatement, setOpeningStatement] = useState("")
    const [fileUploadEnabled, setFileUploadEnabled] = useState(false)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSave = () => {
        toast.success("应用配置保存成功")
    }

    const handleSend = () => {
        if (!chatInput.trim()) return

        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: chatInput
        }
        
        setMessages(prev => [...prev, userMsg])
        setChatInput("")

        // Simulate AI response
        setTimeout(() => {
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "你好👋！我是人工智能助手智谱清言，很高兴见到你，欢迎问我任何问题。",
                meta: {
                    contextCount: 2,
                    latency: 1.66
                }
            }
            setMessages(prev => [...prev, aiMsg])
        }, 600)
    }

    const handleClearChat = () => {
        setMessages([])
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden bg-white">
                    <DialogHeader className="px-6 py-4 border-b border-slate-100 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white">
                                <Bot size={16} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">应用信息设置</DialogTitle>
                        </div>
                    </DialogHeader>
                    <div className="p-6 space-y-6">
                        {/* Avatar & Name */}
                        <div className="space-y-3">
                            <div className="text-sm font-medium text-slate-700">头像 & 名称</div>
                            <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white shrink-0 cursor-pointer hover:opacity-90 transition-opacity">
                                    <Box size={20} />
                                </div>
                                <Input 
                                    value={appName} 
                                    readOnly 
                                    className="h-10 bg-slate-50 border-slate-200" 
                                />
                            </div>
                        </div>

                        {/* App Intro */}
                        <div className="space-y-3">
                            <div className="text-sm font-medium text-slate-700">应用介绍</div>
                            <Textarea 
                                placeholder="给你的 AI 应用一个介绍"
                                className="min-h-[100px] resize-none bg-slate-50 border-slate-200"
                            />
                        </div>

                        {/* Collaborators */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-medium text-slate-700">协作者</div>
                                <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                                    <Settings size={12} />
                                    管理
                                </Button>
                            </div>
                            <div className="h-20 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 text-sm">
                                暂无协作者
                            </div>
                        </div>
                    </div>
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsSettingsOpen(false)} className="bg-white">关闭</Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setIsSettingsOpen(false)}>保存</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Header */}
            <header className="relative flex items-center justify-between h-14 px-4 bg-white border-b border-slate-200 shrink-0 z-10">
                <div className="flex items-center gap-2">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-1 text-slate-500 hover:text-slate-900 pl-2 pr-3"
                        onClick={() => navigate(-1)}
                    >
                        <ChevronLeft size={18} />
                        全部
                    </Button>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 flex items-center bg-slate-100 p-1 rounded-lg">
                    <TabButton active={activeTab === "config"} onClick={() => setActiveTab("config")}>
                        应用配置
                    </TabButton>
                    <TabButton active={activeTab === "publish"} onClick={() => setActiveTab("publish")}>
                        发布渠道
                    </TabButton>
                    <TabButton active={activeTab === "logs"} onClick={() => setActiveTab("logs")}>
                        对话日志
                    </TabButton>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        未保存
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
                        <History size={18} />
                    </Button>
                    <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700 text-white gap-1 h-8"
                        onClick={handleSave}
                    >
                        保存
                        <ChevronLeft className="rotate-180 w-3 h-3" />
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {activeTab === "config" ? (
                    <>
                        {/* Left Panel - Configuration */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Basic Info Card */}
                    <Card className="border-none shadow-sm">
                        <CardContent className="p-6 flex items-start gap-4">
                            <div className="w-16 h-16 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0">
                                <Bot size={32} />
                            </div>
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-slate-900">{appName}</h2>
                                </div>
                                <p className="text-slate-500 text-sm">{description}</p>
                                <div className="flex items-center gap-2 pt-1">
                                    <Button variant="outline" size="sm" className="h-8 gap-1.5 text-slate-600">
                                        <MessageSquare size={14} />
                                        对话
                                    </Button>
                                    <Button variant="outline" size="sm" className="h-8 gap-1.5 text-slate-600" onClick={() => setIsSettingsOpen(true)}>
                                        <Settings size={14} />
                                        设置
                                    </Button>
                                    <Button variant="outline" size="icon" className="h-8 w-8 text-slate-600">
                                        <MoreHorizontal size={14} />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* AI Config */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                                <Bot size={18} />
                            </div>
                            <h3 className="font-bold text-slate-900">AI 配置</h3>
                        </div>

                        <Card className="border border-slate-200 shadow-sm">
                            <CardContent className="p-5 space-y-6">
                                {/* Model Selection */}
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-slate-700 w-20 shrink-0">AI 模型</span>
                                    <div className="flex-1">
                                        <Select value={model} onValueChange={setModel}>
                                            <SelectTrigger className="w-full bg-slate-50 border-slate-200">
                                                <div className="flex items-center gap-2">
                                                    <Sparkles className="w-4 h-4 text-blue-500" />
                                                    <SelectValue placeholder="选择模型" />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="glm-4-air">glm-4-air</SelectItem>
                                                <SelectItem value="gpt-3.5-turbo">gpt-3.5-turbo</SelectItem>
                                                <SelectItem value="gpt-4">gpt-4</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                        <Settings size={16} />
                                    </Button>
                                </div>

                                {/* Prompt */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-700">提示词</span>
                                        <span className="text-xs text-slate-400">输入 / 可选择变量</span>
                                    </div>
                                    <div className="relative">
                                        <Textarea 
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            className="min-h-[200px] resize-none bg-slate-50 border-slate-200 text-sm leading-relaxed p-4 pr-10"
                                            placeholder={PROMPT_PLACEHOLDER}
                                        />
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="absolute bottom-2 right-2 h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                                        >
                                            <Code size={16} />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Knowledge Base */}
                    <ConfigRow 
                        icon={<Database className="text-purple-600" size={18} />}
                        title="关联知识库"
                        actions={
                            <>
                                <Button variant="ghost" size="sm" className="h-8 text-slate-600 hover:text-slate-900 gap-1 font-normal hover:bg-slate-100"><Plus size={16} /> 选择</Button>
                                <Button variant="ghost" size="sm" className="h-8 text-slate-600 hover:text-slate-900 gap-1 font-normal hover:bg-slate-100"><Edit3 size={16} /> 参数</Button>
                            </>
                        }
                    />

                    {/* Tools */}
                    <ConfigRow 
                        icon={<Wrench className="text-blue-600" size={18} />}
                        title="工具调用"
                        hasInfo
                        actions={
                            <Button variant="ghost" size="sm" className="h-8 text-slate-600 hover:text-slate-900 gap-1 font-normal hover:bg-slate-100"><Plus size={16} /> 选择</Button>
                        }
                    />

                    {/* File Upload */}
                    <ConfigRow 
                        icon={<FileText className="text-green-600" size={18} />}
                        title="文件上传"
                        hasInfo
                        actions={<Switch checked={fileUploadEnabled} onCheckedChange={setFileUploadEnabled} />}
                    />

                    {/* Global Variables */}
                    <ConfigRow 
                        icon={<Variable className="text-orange-600" size={18} />}
                        title="全局变量"
                        hasInfo
                        actions={<Button variant="ghost" size="sm" className="h-8 text-slate-600 hover:text-slate-900 gap-1 font-normal hover:bg-slate-100"><Plus size={16} /> 新增</Button>}
                    />

                    {/* Dialogue Opening */}
                    <div className="space-y-3 pb-2 pt-2">
                        <Card className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden group hover:border-blue-400 transition-colors">
                            <div className="flex items-center gap-3 p-3">
                                <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600">
                                    <MessageSquare size={18} />
                                </div>
                                <div className="flex items-center gap-1">
                                    <h3 className="font-bold text-slate-900">对话开场白</h3>
                                    <Info size={14} className="text-slate-400" />
                                </div>
                            </div>
                            <CardContent className="px-5 space-y-6">
                                <Textarea 
                                    value={openingStatement}
                                    onChange={(e) => setOpeningStatement(e.target.value)}
                                    className="min-h-[200px] resize-none bg-slate-50 border-slate-200 text-sm leading-relaxed p-4 pr-10"
                                    placeholder="每次对话开始前，发送一个初始内容。支持标准 Markdown 语法。可使用的额外标记：[快捷按键]: 用户点击后可以直接发送该问题"
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Extra Configs */}
                    <div className="space-y-4 pb-10">
                        <ConfigRow 
                            icon={<AudioWaveform size={18} className="text-blue-600" />} 
                            title="语音播放" 
                            value="浏览器自带(免费)" 
                            hasInfo
                        />
                        <ConfigRow 
                            icon={<Mic size={18} className="text-orange-500" />} 
                            title="语音输入" 
                            value="关闭" 
                            hasInfo
                        />
                        <ConfigRow 
                            icon={<Lightbulb size={18} className="text-yellow-500" />} 
                            title="猜你想问" 
                            value="关闭" 
                            hasInfo
                        />
                        <ConfigRow 
                            icon={<Keyboard size={18} className="text-purple-500" />} 
                            title="输入引导" 
                            value="关闭" 
                            hasInfo
                        />
                    </div>
                </div>

                {/* Right Panel - Preview */}
                <div className="w-1/2 border-l border-slate-200 bg-white flex flex-col">
                    <div className="h-14 border-b border-slate-100 flex items-center justify-between px-4 shrink-0">
                        <span className="font-bold text-slate-900">调试预览</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600" onClick={handleClearChat}>
                            <Eraser size={16} />
                        </Button>
                    </div>
                    
                    {/* Chat Area */}
                    <div className="flex-1 bg-slate-50 p-4 overflow-y-auto" ref={scrollRef}>
                        {messages.length === 0 ? (
                            /* Empty State */
                            <div className="flex flex-col items-center justify-center h-full text-slate-300 space-y-2">
                                <Bot size={48} className="opacity-20" />
                                <p className="text-sm">预览对话将出现在这里</p>
                            </div>
                        ) : (
                            /* Chat History */
                            <div className="space-y-6">
                                {messages.map((msg) => (
                                    <div 
                                        key={msg.id} 
                                        className={cn(
                                            "flex gap-3",
                                            msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                        )}
                                    >
                                        {/* Avatar */}
                                        <div className={cn(
                                            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                                            msg.role === "user" ? "bg-slate-200 text-slate-500" : "bg-blue-600 text-white"
                                        )}>
                                            {msg.role === "user" ? <User size={18} /> : <Box size={18} />}
                                        </div>

                                        {/* Content */}
                                        <div className={cn(
                                            "max-w-[85%] space-y-2",
                                            msg.role === "user" ? "items-end" : "items-start"
                                        )}>
                                            <div className={cn(
                                                "p-3 rounded-xl text-sm leading-relaxed relative group",
                                                msg.role === "user" 
                                                    ? "bg-blue-600 text-white rounded-tr-none" 
                                                    : "bg-white border border-slate-100 text-slate-900 rounded-tl-none shadow-sm"
                                            )}>
                                                {msg.content}
                                                
                                                {/* AI Message Actions Toolbar */}
                                                {msg.role === "assistant" && (
                                                    <div className="absolute -top-8 right-0 hidden group-hover:flex items-center gap-1 bg-white border border-slate-200 shadow-sm rounded-lg p-1">
                                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-slate-600">
                                                            <Copy size={12} />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-slate-600">
                                                            <AudioWaveform size={12} />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-slate-600">
                                                            <Edit3 size={12} />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* AI Meta Info */}
                                            {msg.role === "assistant" && msg.meta && (
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-600 text-xs rounded border border-green-100">
                                                        {msg.meta.contextCount}条上下文
                                                    </div>
                                                    <div className="flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-600 text-xs rounded border border-purple-100">
                                                        {msg.meta.latency}s
                                                    </div>
                                                    <div className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded cursor-pointer hover:bg-slate-200 transition-colors">
                                                        查看详情
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-slate-100 bg-white">
                        <div className="relative border border-slate-200 rounded-xl bg-slate-50 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                            <Textarea 
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="输入问题，发送 [Enter]/换行 [Ctrl(Alt/Shift) + Enter]"
                                className="min-h-[80px] max-h-[200px] resize-none border-none bg-transparent focus-visible:ring-0 p-3 pr-12 text-sm"
                            />
                            <div className="absolute bottom-2 right-2 flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                    <Paperclip size={18} />
                                </Button>
                                <Button 
                                    size="icon" 
                                    className={cn(
                                        "h-8 w-8 transition-colors",
                                        chatInput.trim() ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                    )}
                                    disabled={!chatInput.trim()}
                                >
                                    <Send size={16} />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                </>
            ) : (
                <div className="flex items-center justify-center flex-1 text-slate-400 bg-slate-50">
                    功能开发中...
                </div>
            )}
            </div>
        </div>
    )
}

function TabButton({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                active ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
        >
            {children}
        </button>
    )
}

function ConfigRow({ icon, title, value, actions, hasInfo = false }: { icon: React.ReactNode, title: string, value?: string, actions?: React.ReactNode, hasInfo?: boolean }) {
    return (
        <div className={cn(
            "flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-blue-400 transition-colors group",
            value ? "cursor-pointer" : ""
        )}>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                    {icon}
                </div>
                <div className="flex items-center gap-1">
                    <span className="font-bold text-slate-900">{title}</span>
                    {hasInfo && <Info size={14} className="text-slate-400" />}
                </div>
            </div>
            {value ? (
                <div className="text-slate-600 text-sm font-medium">
                    {value}
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    {actions}
                </div>
            )}
        </div>
    )
}



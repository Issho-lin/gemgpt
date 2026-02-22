import { useState, useRef, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { 
    Plus, 
    MoreHorizontal, 
    User, 
    Send,
    AudioWaveform,
    Copy,
    Edit3,
    Trash2,
    MessageSquare,
    Search,
    ChevronLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
    meta?: {
        contextCount?: number
        latency?: number
    }
}

interface ChatHistoryItem {
    id: string
    title: string
    time: string
    active?: boolean
}

// Mock Data
const MOCK_HISTORY: ChatHistoryItem[] = [
    { id: "1", title: "今天潮汕往深圳的春节返程情况怎么样", time: "刚刚", active: true },
    { id: "2", title: "如何评价《热辣滚烫》", time: "昨天" },
    { id: "3", title: "写一篇关于人工智能的论文大纲", time: "前天" },
]

export default function ChatPage() {
    const { appId } = useParams()
    const navigate = useNavigate()
    const [chatInput, setChatInput] = useState("")
    const [messages, setMessages] = useState<Message[]>([])
    const scrollRef = useRef<HTMLDivElement>(null)
    const [historyList, setHistoryList] = useState<ChatHistoryItem[]>(MOCK_HISTORY)
    const [searchQuery, setSearchQuery] = useState("")

    // Initialize with a welcome message or load history
    useEffect(() => {
        // Simulating loading history for the active chat
        if (messages.length === 0) {
             const welcomeMsg: Message = {
                id: "0",
                role: "assistant",
                content: "你好👋！我是人工智能助手，很高兴见到你，欢迎问我任何问题。",
            }
            setMessages([welcomeMsg])
        }
    }, [])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

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
                content: "这是一个模拟的回复。在实际应用中，这里会调用后端 API 获取真实的 AI 回复。",
                meta: {
                    contextCount: 2,
                    latency: 1.2
                }
            }
            setMessages(prev => [...prev, aiMsg])
        }, 1000)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const handleNewChat = () => {
        const newId = Date.now().toString()
        const newChat: ChatHistoryItem = {
            id: newId,
            title: "新对话",
            time: "刚刚",
            active: true
        }
        setHistoryList(prev => [newChat, ...prev.map(item => ({ ...item, active: false }))])
        setMessages([{
            id: Date.now().toString(),
            role: "assistant",
            content: "你好👋！我是人工智能助手，很高兴见到你，欢迎问我任何问题。"
        }])
        toast.success("已创建新对话")
    }

    const filteredHistory = historyList.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="flex h-screen bg-white overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 border-r border-slate-200 flex flex-col bg-slate-50/50">
                <div className="p-4 space-y-4">
                    {/* App Header (Logo + Name) */}
                    <div className="flex items-center gap-2 px-2">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 -ml-2 text-slate-500 hover:text-slate-900" 
                            onClick={() => navigate(-1)}
                        >
                            <ChevronLeft size={20} />
                        </Button>
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                            {/* Placeholder Logo */}
                            <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                                    <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                                    <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                                    <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                                    <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.799 L -6.734 42.379 C -8.804 40.439 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                                </g>
                            </svg>
                        </div>
                        <span className="font-bold text-slate-900">谷歌搜索</span>
                    </div>

                    <Button 
                        className="w-full justify-start gap-2 bg-white hover:bg-slate-100 text-blue-600 border border-slate-200 shadow-sm" 
                        variant="outline"
                        onClick={handleNewChat}
                    >
                        <Plus size={16} />
                        新对话
                    </Button>

                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 h-3.5 w-3.5" />
                        <Input 
                            placeholder="搜索历史记录" 
                            className="h-8 pl-8 text-xs bg-white border-slate-200"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* History List */}
                <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
                    {filteredHistory.map(item => (
                        <div 
                            key={item.id}
                            className={cn(
                                "group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-sm",
                                item.active 
                                    ? "bg-white text-blue-600 shadow-sm border border-slate-100" 
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            )}
                            onClick={() => {
                                setHistoryList(prev => prev.map(h => ({ ...h, active: h.id === item.id })))
                                // Ideally load messages for this chat
                            }}
                        >
                            <MessageSquare size={14} className={cn("shrink-0", item.active ? "text-blue-500" : "text-slate-400")} />
                            <span className="flex-1 truncate">{item.title}</span>
                            {item.active && (
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-red-500">
                                        <Trash2 size={12} />
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}
                    {filteredHistory.length === 0 && (
                        <div className="text-center text-xs text-slate-400 py-4">
                            无相关记录
                        </div>
                    )}
                </div>

                {/* User Profile */}
                <div className="p-4 border-t border-slate-200">
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                            <User size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-slate-900 truncate">User</div>
                        </div>
                        <MoreHorizontal size={16} className="text-slate-400" />
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-white relative">
                {/* Header - Mobile only or simple title */}
                <div className="h-14 border-b border-slate-100 flex items-center justify-between px-6 shrink-0 lg:hidden">
                    <span className="font-bold text-slate-900">谷歌搜索</span>
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal size={20} />
                    </Button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6" ref={scrollRef}>
                    <div className="max-w-3xl mx-auto space-y-6">
                        {messages.map((msg) => (
                            <div 
                                key={msg.id} 
                                className={cn(
                                    "flex gap-4",
                                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                )}
                            >
                                {/* Avatar */}
                                <div className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border shadow-sm",
                                    msg.role === "user" ? "bg-white text-slate-500" : "bg-white"
                                )}>
                                    {msg.role === "user" ? (
                                        <User size={18} />
                                    ) : (
                                        // Google Logo
                                        <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                                            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                                                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                                                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                                                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                                                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.799 L -6.734 42.379 C -8.804 40.439 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                                            </g>
                                        </svg>
                                    )}
                                </div>

                                {/* Content */}
                                <div className={cn(
                                    "max-w-[85%] space-y-2",
                                    msg.role === "user" ? "items-end" : "items-start"
                                )}>
                                    <div className={cn(
                                        "p-3 rounded-2xl text-sm leading-relaxed relative group shadow-sm",
                                        msg.role === "user" 
                                            ? "bg-blue-600 text-white rounded-tr-none" 
                                            : "bg-white border border-slate-100 text-slate-900 rounded-tl-none"
                                    )}>
                                        {msg.content}
                                        
                                        {/* Actions Toolbar */}
                                        {msg.role === "assistant" && (
                                            <div className="absolute -bottom-8 left-0 hidden group-hover:flex items-center gap-1">
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-600">
                                                    <Copy size={14} />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-600">
                                                    <AudioWaveform size={14} />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-600">
                                                    <Edit3 size={14} />
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Meta Info */}
                                    {msg.role === "assistant" && msg.meta && (
                                        <div className="flex items-center gap-2 pl-1 pt-1">
                                            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-green-50 text-green-600 text-[10px] rounded border border-green-100">
                                                {msg.meta.contextCount}条上下文
                                            </div>
                                            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-purple-50 text-purple-600 text-[10px] rounded border border-purple-100">
                                                {msg.meta.latency}s
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-4 sm:p-6 bg-white shrink-0">
                    <div className="max-w-3xl mx-auto relative">
                        <div className="relative border border-slate-200 rounded-xl bg-white focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                            <Textarea 
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="输入问题，发送 [Enter]/换行 [Ctrl(Alt/Shift) + Enter]"
                                className="min-h-[52px] max-h-[200px] rounded-xl w-full resize-none border-0 bg-transparent py-3 px-4 focus-visible:ring-0 text-sm shadow-none"
                            />
                            <div className="flex items-center justify-between px-2 py-2">
                                <div className="flex items-center gap-1">
                                    {/* Attachments buttons could go here */}
                                </div>
                                <Button 
                                    size="icon" 
                                    className={cn(
                                        "h-8 w-8 transition-all rounded-lg",
                                        chatInput.trim() ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                                    )}
                                    onClick={handleSend}
                                    disabled={!chatInput.trim()}
                                >
                                    <Send size={16} />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
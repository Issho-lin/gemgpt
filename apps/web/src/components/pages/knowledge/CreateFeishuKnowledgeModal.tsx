import { useState } from "react"
import { HelpCircle, Sparkles, Bot, Image as ImageIcon, FileText, BookOpen } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface CreateFeishuKnowledgeModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function CreateFeishuKnowledgeModal({ open, onOpenChange }: CreateFeishuKnowledgeModalProps) {
    const [name, setName] = useState("")
    const [indexModel, setIndexModel] = useState("text-embedding-v4")
    const [textModel, setTextModel] = useState("glm-4-air")
    const [imageModel, setImageModel] = useState("doubao-seed-1-6-thinking-250615")
    const [appId, setAppId] = useState("")
    const [appSecret, setAppSecret] = useState("")
    const [folderToken, setFolderToken] = useState("")

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between space-y-0">
                    <DialogTitle className="flex items-center gap-2 text-lg font-medium text-slate-800">
                        <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-md">
                            <FileText size={14} />
                        </div>
                        创建一个飞书知识库
                    </DialogTitle>
                </DialogHeader>

                <div className="p-6 space-y-5">
                    {/* Name Input */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-base font-medium text-slate-900">取个名字</label>
                            <a href="#" className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
                                <BookOpen className="w-4 h-4" />
                                使用说明
                            </a>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-lg shrink-0">
                                <FileText size={20} />
                            </div>
                            <Input 
                                placeholder="名称" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-10 focus-visible:ring-1 focus-visible:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Index Model */}
                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                        <div className="flex items-center gap-1 text-sm font-medium text-slate-900">
                            索引模型
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <HelpCircle size={14} className="text-slate-400" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>选择用于构建知识库索引的模型</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <Select value={indexModel} onValueChange={setIndexModel}>
                            <SelectTrigger className="h-10 bg-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="text-embedding-v4">
                                    <div className="flex items-center gap-2">
                                        <Sparkles size={16} className="text-purple-500" />
                                        <span>text-embedding-v4</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Text Model */}
                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                        <div className="flex items-center gap-1 text-sm font-medium text-slate-900">
                            文本理解模型
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <HelpCircle size={14} className="text-slate-400" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>用于理解和处理文本内容的模型</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <Select value={textModel} onValueChange={setTextModel}>
                            <SelectTrigger className="h-10 bg-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="glm-4-air">
                                    <div className="flex items-center gap-2">
                                        <Bot size={16} className="text-blue-500" />
                                        <span>glm-4-air</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Image Model */}
                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                        <div className="text-sm font-medium text-slate-900">
                            图片理解模型
                        </div>
                        <Select value={imageModel} onValueChange={setImageModel}>
                            <SelectTrigger className="h-10 bg-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="doubao-seed-1-6-thinking-250615">
                                    <div className="flex items-center gap-2">
                                        <ImageIcon size={16} className="text-green-500" />
                                        <span>doubao-seed-1-6-thinking-250615</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* App ID */}
                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                        <div className="text-sm font-medium text-slate-900">
                            App ID
                        </div>
                        <Input 
                            placeholder="App ID" 
                            value={appId}
                            onChange={(e) => setAppId(e.target.value)}
                            className="h-10 bg-slate-50 border-slate-200"
                        />
                    </div>

                    {/* App Secret */}
                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                        <div className="text-sm font-medium text-slate-900">
                            App Secret
                        </div>
                        <Input 
                            placeholder="App Secret" 
                            value={appSecret}
                            onChange={(e) => setAppSecret(e.target.value)}
                            className="h-10 bg-slate-50 border-slate-200"
                        />
                    </div>

                    {/* Folder Token */}
                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                        <div className="text-sm font-medium text-slate-900">
                            Folder Token
                        </div>
                        <Input 
                            placeholder="Folder Token" 
                            value={folderToken}
                            onChange={(e) => setFolderToken(e.target.value)}
                            className="h-10 bg-white border-blue-400 focus-visible:ring-1 focus-visible:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="p-6 pt-2 pb-6 bg-white flex items-center justify-end gap-3">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="h-9 px-4">
                        关闭
                    </Button>
                    <Button className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white">
                        确认创建
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
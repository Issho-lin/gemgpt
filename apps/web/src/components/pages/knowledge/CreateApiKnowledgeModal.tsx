import { useState } from "react"
import { Plug, HelpCircle, Sparkles, Bot, Image as ImageIcon, Database } from "lucide-react"
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

interface CreateApiKnowledgeModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function CreateApiKnowledgeModal({ open, onOpenChange }: CreateApiKnowledgeModalProps) {
    const [name, setName] = useState("")
    const [indexModel, setIndexModel] = useState("text-embedding-v4")
    const [textModel, setTextModel] = useState("glm-4-air")
    const [imageModel, setImageModel] = useState("doubao-seed-1-6-thinking-250615")
    const [apiUrl, setApiUrl] = useState("")
    const [auth, setAuth] = useState("")

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between space-y-0">
                    <DialogTitle className="flex items-center gap-2 text-lg font-medium text-slate-800">
                        <div className="flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-md">
                            <Plug size={14} />
                        </div>
                        创建一个API 文件库
                    </DialogTitle>
                </DialogHeader>

                <div className="p-6 space-y-5">
                    {/* Name Input */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-base font-medium text-slate-900">取个名字</label>
                            <a href="#" className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
                                <BookIcon className="w-4 h-4" />
                                使用说明
                            </a>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-green-100 text-green-600 rounded-lg shrink-0">
                                <Plug size={20} />
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

                    {/* API Address */}
                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                        <div className="text-sm font-medium text-slate-900">
                            <span className="text-red-500 mr-1">*</span>接口地址
                        </div>
                        <Input 
                            placeholder="接口地址" 
                            value={apiUrl}
                            onChange={(e) => setApiUrl(e.target.value)}
                            className="h-10 bg-slate-50 border-slate-200"
                        />
                    </div>

                    {/* Authorization */}
                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                        <div className="text-sm font-medium text-slate-900">
                            <span className="text-red-500 mr-1">*</span>Authorization
                        </div>
                        <Input 
                            placeholder="请求头参数，会自动补充 Bearer" 
                            value={auth}
                            onChange={(e) => setAuth(e.target.value)}
                            className="h-10 bg-slate-50 border-slate-200"
                        />
                    </div>

                    {/* Base URL */}
                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                        <div className="text-sm font-medium text-slate-900">
                            Base URL
                        </div>
                        <div className="flex items-center justify-between h-10 px-3 rounded-md border border-slate-200 bg-white text-sm text-slate-500">
                            <span>/根目录</span>
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100">
                                选择
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t bg-white flex items-center justify-end gap-3">
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

function BookIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
    )
}

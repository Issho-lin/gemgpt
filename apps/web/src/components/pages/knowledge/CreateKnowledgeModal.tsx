import { useState } from "react"
import { Database, HelpCircle, Sparkles, Bot, Image as ImageIcon } from "lucide-react"
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

interface CreateKnowledgeModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function CreateKnowledgeModal({ open, onOpenChange }: CreateKnowledgeModalProps) {
    const [name, setName] = useState("")
    const [indexModel, setIndexModel] = useState("text-embedding-v4")
    const [textModel, setTextModel] = useState("glm-4-air")
    const [imageModel, setImageModel] = useState("doubao-seed-1-6-thinking-250615")

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between space-y-0">
                    <DialogTitle className="flex items-center gap-2 text-lg font-medium text-slate-800">
                        <div className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-md">
                            <Database size={14} />
                        </div>
                        创建一个通用知识库
                    </DialogTitle>
                    {/* Close button is handled by DialogPrimitive, but we can customize or let default handle it. 
                        Default DialogContent has a Close button. We might want to hide it and make our own if needed, 
                        but standard is fine. The image shows an X.
                    */}
                </DialogHeader>

                <div className="p-6 space-y-6">
                    {/* Name Input */}
                    <div className="space-y-3">
                        <label className="text-base font-medium text-slate-900">取个名字</label>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-lg shrink-0">
                                <Database size={20} />
                            </div>
                            <Input 
                                placeholder="名称" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-10 border-blue-500 focus-visible:ring-0" // Simulating focus state from image
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Index Model */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-slate-900">索引模型</label>
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
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-slate-900">文本理解模型</label>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <HelpCircle size={14} className="text-slate-400" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>选择用于理解和处理文本的模型</p>
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
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-900">图片理解模型</label>
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
                </div>

                <div className="px-6 py-4 flex items-center justify-end gap-3">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        关闭
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        确认创建
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
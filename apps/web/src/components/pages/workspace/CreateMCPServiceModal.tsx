import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Key, HelpCircle, Package } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useState } from "react"
import AppSelectionModal from "./AppSelectionModal"

interface CreateMCPServiceModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function CreateMCPServiceModal({
    open,
    onOpenChange,
}: CreateMCPServiceModalProps) {
    const [isAppSelectionOpen, setIsAppSelectionOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                        <Key className="w-5 h-5 text-slate-600" />
                        创建 MCP 服务
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-6 py-4">
                    {/* Name Input */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-1 text-sm font-medium text-slate-700">
                            <span className="text-red-500">*</span>
                            取个名字
                        </div>
                        <Input 
                            placeholder="" 
                            className="bg-slate-50 border-slate-200 focus-visible:ring-1 focus-visible:ring-blue-500"
                        />
                    </div>

                    {/* Exposed Apps */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-slate-700">暴露的应用</div>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 px-3 text-slate-600 border-slate-200 bg-white hover:bg-slate-50"
                                onClick={() => setIsAppSelectionOpen(true)}
                            >
                                管理
                            </Button>
                        </div>

                        {/* Table */}
                        <div className="rounded-lg border border-slate-100 overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center bg-slate-50 px-4 py-2 border-b border-slate-100">
                                <div className="w-[200px] flex items-center gap-1 text-xs font-medium text-slate-500">
                                    工具名
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <HelpCircle size={14} className="text-slate-400 cursor-help" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>对外暴露的工具名称</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <div className="w-[200px] text-xs font-medium text-slate-500">应用名</div>
                                <div className="flex-1 text-xs font-medium text-slate-500">应用描述</div>
                            </div>

                            {/* Empty State */}
                            <div className="flex flex-col items-center justify-center py-16 bg-white min-h-[200px]">
                                <div className="p-4 rounded-full bg-slate-50 mb-3 border border-slate-100/50">
                                    <Package size={32} strokeWidth={1} className="text-slate-300" />
                                </div>
                                <span className="text-sm text-slate-400">没有更多了~</span>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-2">
                    <Button 
                        variant="outline" 
                        onClick={() => onOpenChange(false)}
                        className="h-9 px-4 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    >
                        取消
                    </Button>
                    <Button 
                        className="h-9 px-4 bg-blue-100 text-blue-600 hover:bg-blue-200 border-none shadow-none font-medium"
                        onClick={() => onOpenChange(false)}
                    >
                        确认
                    </Button>
                </DialogFooter>
            </DialogContent>
            
            <AppSelectionModal 
                open={isAppSelectionOpen} 
                onOpenChange={setIsAppSelectionOpen}
            />
        </Dialog>
    )
}

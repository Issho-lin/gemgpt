import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, UserPlus } from "lucide-react"
import { useState } from "react"

interface AppSelectionModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm?: (selectedApps: any[]) => void
}

export default function AppSelectionModal({
    open,
    onOpenChange,
    onConfirm,
}: AppSelectionModalProps) {
    const [selectedApps, setSelectedApps] = useState<any[]>([])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[600px] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b border-slate-100 flex-shrink-0">
                    <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                        <UserPlus className="w-5 h-5 text-blue-600" />
                        应用选择
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-1 overflow-hidden">
                    {/* Left Pane - App List */}
                    <div className="flex-1 flex flex-col border-r border-slate-100 bg-white">
                        <div className="p-4 border-b border-slate-50">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                                <Input 
                                    placeholder="搜索应用" 
                                    className="pl-9 h-10 bg-slate-50 border-slate-200 focus-visible:ring-1 focus-visible:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2">
                            {/* App list would go here - currently empty as per screenshot */}
                        </div>
                    </div>

                    {/* Right Pane - Selected Apps */}
                    <div className="flex-1 flex flex-col bg-slate-50/30">
                        <div className="p-4 border-b border-slate-100/50">
                            <div className="text-sm font-medium text-slate-700">
                                已选择: {selectedApps.length}
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2">
                            {/* Selected apps list would go here */}
                        </div>
                    </div>
                </div>

                <DialogFooter className="px-6 py-4 border-t border-slate-100 flex-shrink-0">
                    <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white min-w-[80px]"
                        onClick={() => {
                            onConfirm?.(selectedApps)
                            onOpenChange(false)
                        }}
                    >
                        确认
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

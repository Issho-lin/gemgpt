import { useState } from "react"
import { Folder } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface CreateFolderModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function CreateFolderModal({ open, onOpenChange }: CreateFolderModalProps) {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] p-0 gap-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between space-y-0">
                    <DialogTitle className="flex items-center gap-2 text-lg font-medium text-slate-800">
                        <div className="flex items-center justify-center w-6 h-6 bg-yellow-100 text-yellow-600 rounded-md">
                            <Folder size={14} />
                        </div>
                        创建文件夹
                    </DialogTitle>
                </DialogHeader>

                <div className="p-6 space-y-5">
                    {/* Name Input */}
                    <div className="space-y-3">
                        <label className="text-base font-medium text-slate-900">取个名字</label>
                        <Input 
                            placeholder="" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-10 focus-visible:ring-1 focus-visible:ring-blue-500 border-blue-400"
                        />
                    </div>

                    {/* Description Input */}
                    <div className="space-y-3">
                        <label className="text-base font-medium text-slate-900">文件夹描述</label>
                        <Textarea 
                            placeholder="" 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="min-h-[100px] resize-none focus-visible:ring-1 focus-visible:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="p-6 pt-2 pb-6 bg-white flex items-center justify-end gap-3">
                    <Button className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white w-20">
                        确认
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
import { Database } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

type EditKnowledgeDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    name: string
    description: string
    onChangeName: (value: string) => void
    onChangeDescription: (value: string) => void
    submitting: boolean
    onConfirm: () => void
}

export default function EditKnowledgeDialog({
    open,
    onOpenChange,
    name,
    description,
    onChangeName,
    onChangeDescription,
    submitting,
    onConfirm,
}: EditKnowledgeDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[520px] p-0 gap-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle className="flex items-center gap-2 text-lg font-medium text-slate-800">
                        <div className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-md">
                            <Database size={14} />
                        </div>
                        编辑信息
                    </DialogTitle>
                </DialogHeader>

                <div className="p-6 space-y-5">
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-900">名称</label>
                        <Input
                            value={name}
                            onChange={(e) => onChangeName(e.target.value)}
                            className="h-10"
                            placeholder="请输入知识库名称"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-900">介绍</label>
                        <Textarea
                            value={description}
                            onChange={(e) => onChangeDescription(e.target.value)}
                            className="min-h-[110px]"
                            placeholder="请输入介绍"
                        />
                    </div>
                </div>

                <div className="px-6 py-4 border-t flex items-center justify-end gap-3">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
                        取消
                    </Button>
                    <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={onConfirm}
                        disabled={submitting || !name.trim()}
                    >
                        {submitting ? "提交中..." : "确认"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

type DeleteKnowledgeDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    deletingName?: string
    submitting: boolean
    onCancel: () => void
    onConfirm: () => void
}

export default function DeleteKnowledgeDialog({
    open,
    onOpenChange,
    deletingName,
    submitting,
    onCancel,
    onConfirm,
}: DeleteKnowledgeDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[420px] p-0 gap-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle className="text-base font-medium text-slate-800">删除知识库</DialogTitle>
                </DialogHeader>
                <div className="px-6 py-5 text-sm text-slate-600">
                    确认删除知识库「{deletingName}」吗？删除后不可恢复。
                </div>
                <div className="px-6 py-4 border-t flex items-center justify-end gap-3">
                    <Button variant="outline" onClick={onCancel} disabled={submitting}>
                        取消
                    </Button>
                    <Button variant="destructive" onClick={onConfirm} disabled={submitting}>
                        {submitting ? "删除中..." : "确认删除"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

type ImportSource = "localFile" | "webLink" | "customText"

type ImportSourceDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    importSource: ImportSource
    onSelectImportSource: (source: ImportSource) => void
    onConfirm: () => void
}

export default function ImportSourceDialog({
    open,
    onOpenChange,
    importSource,
    onSelectImportSource,
    onConfirm,
}: ImportSourceDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[720px] p-0 gap-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle className="flex items-center gap-2 text-lg font-medium text-slate-800">
                        <div className="flex items-center justify-center w-6 h-6 bg-blue-50 text-blue-600 rounded-md">
                            <CheckCircle2 size={14} />
                        </div>
                        选择来源
                    </DialogTitle>
                </DialogHeader>

                <div className="p-6 space-y-4">
                    <button
                        className={`w-full rounded-xl border p-4 text-left transition-colors ${
                            importSource === "localFile" ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white hover:bg-slate-50"
                        }`}
                        onClick={() => onSelectImportSource("localFile")}
                    >
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 h-5 w-5 rounded-full border-2 border-blue-500 flex items-center justify-center">
                                {importSource === "localFile" && <div className="h-2 w-2 rounded-full bg-blue-500" />}
                            </div>
                            <div>
                                <div className="text-base font-medium text-slate-900">本地文件</div>
                                <div className="mt-1 text-sm text-slate-500">上传 PDF、TXT、DOCX 等格式的文件</div>
                            </div>
                        </div>
                    </button>

                    <button
                        className={`w-full rounded-xl border p-4 text-left transition-colors ${
                            importSource === "webLink" ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white hover:bg-slate-50"
                        }`}
                        onClick={() => onSelectImportSource("webLink")}
                    >
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 h-5 w-5 rounded-full border-2 border-slate-300 flex items-center justify-center">
                                {importSource === "webLink" && <div className="h-2 w-2 rounded-full bg-blue-500" />}
                            </div>
                            <div>
                                <div className="text-base font-medium text-slate-900">网页链接</div>
                                <div className="mt-1 text-sm text-slate-500">读取静态网页内容作为数据集</div>
                            </div>
                        </div>
                    </button>

                    <button
                        className={`w-full rounded-xl border p-4 text-left transition-colors ${
                            importSource === "customText" ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white hover:bg-slate-50"
                        }`}
                        onClick={() => onSelectImportSource("customText")}
                    >
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 h-5 w-5 rounded-full border-2 border-slate-300 flex items-center justify-center">
                                {importSource === "customText" && <div className="h-2 w-2 rounded-full bg-blue-500" />}
                            </div>
                            <div>
                                <div className="text-base font-medium text-slate-900">自定义文本</div>
                                <div className="mt-1 text-sm text-slate-500">手动输入一段文本作为数据集</div>
                            </div>
                        </div>
                    </button>
                </div>

                <div className="px-6 py-4 border-t flex justify-end">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onConfirm}>
                        确认
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

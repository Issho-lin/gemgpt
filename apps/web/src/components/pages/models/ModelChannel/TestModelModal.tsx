import { Send } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { DataTable, type ColumnDef } from "@/components/common/DataTable"
import { useMemo } from "react"


export interface TestModelItem {
    name: string
    id: string
    status: "waiting" | "success" | "failed"
}

const MOCK_TEST_MODELS: TestModelItem[] = [
    { name: "hunyuan-standard", id: "hunyuan-standard", status: "waiting" },
    { name: "qwen3-8b", id: "qwen3-8b", status: "waiting" },
    { name: "glm-4-air", id: "glm-4-air", status: "waiting" },
]

export default function TestModelModal({
    open,
    onOpenChange,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
}) {

    const columns: ColumnDef<TestModelItem>[] = useMemo(() => [
        {
            title: "模型名",
            key: "name",
            render: (_, item) => <span className="text-slate-700">{item.name}</span>
        },
        {
            title: "模型ID",
            key: "id",
            render: (_, item) => <span className="text-slate-500">{item.id}</span>
        },
        {
            title: "状态",
            key: "status",
            render: () => (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
                    等待测试
                </span>
            )
        },
        {
            title: "",
            key: "action",
            width: 60,
            render: () => (
                <button className="text-slate-400 hover:text-blue-500 transition-colors cursor-pointer">
                    <Send size={16} />
                </button>
            )
        }
    ], [])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-[800px] flex flex-col gap-0 p-0 overflow-hidden"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-7 h-7 bg-white text-slate-700">
                            <Send size={20} />
                        </span>
                        模型测试
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 min-h-0 bg-white p-6">
                    <div className="bg-slate-50 rounded-lg border border-slate-100 overflow-hidden">
                        <DataTable
                            columns={columns}
                            dataSource={MOCK_TEST_MODELS}
                            rowKey="id"
                            className="bg-transparent"
                            rowClassName="hover:bg-white transition-colors"
                        />
                    </div>
                </div>

                <DialogFooter className="px-6 py-4 border-t bg-white">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="h-9 px-4">
                        取消
                    </Button>
                    <Button className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white">
                        批量测试3个模型
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

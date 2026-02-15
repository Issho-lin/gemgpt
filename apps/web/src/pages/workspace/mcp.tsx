import { Button } from "@/components/ui/button"
import { DataTable, type ColumnDef } from "@/components/common/DataTable"
import { Package } from "lucide-react"
import { useState } from "react"
import CreateMCPServiceModal from "@/components/pages/workspace/CreateMCPServiceModal"

interface MCPService {
    id: string
    name: string
    appCount: number
}

export default function MCPServicePage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    const columns: ColumnDef<MCPService>[] = [
        {
            title: "MCP 服务名",
            dataIndex: "name",
            key: "name",
            headerClassName: "pl-8",
            className: "pl-8",
        },
        {
            title: "关联应用数量",
            dataIndex: "appCount",
            key: "appCount",
            headerClassName: "pl-8",
            className: "pl-8",
        }
    ]

    const EmptyState = (
        <div className="flex flex-col items-center justify-center py-10 text-slate-400">
            <div className="p-4 rounded-full bg-slate-50 mb-3">
                <Package size={32} strokeWidth={1.5} className="text-slate-300" />
            </div>
            <span className="text-sm">没有更多了~</span>
        </div>
    )

    return (
        <div className="flex flex-col h-full w-full bg-white">
            <div className="flex flex-col px-8 py-6 gap-6">
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-xl font-bold text-slate-900">MCP 服务</h1>
                        <p className="text-sm text-slate-500">
                            允许你选择部分应用，以 MCP 的协议对外提供使用。由于 MCP 协议的不成熟，该功能仍处于测试阶段。
                        </p>
                    </div>
                    <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        新建服务
                    </Button>
                </div>

                <div className="">
                    <DataTable 
                        columns={columns} 
                        dataSource={[]} 
                        rowKey="id"
                        emptyText={EmptyState}
                        className="border-t border-slate-100"
                    />
                </div>
            </div>
            
            <CreateMCPServiceModal 
                open={isCreateModalOpen} 
                onOpenChange={setIsCreateModalOpen} 
            />
        </div>
    )
}

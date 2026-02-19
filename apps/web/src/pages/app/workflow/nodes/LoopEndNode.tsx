import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CornerUpRight, ChevronDown } from "lucide-react";
import { TargetHandle, NodeHoverActions } from '../components/NodeCommon';

export default function LoopEndNode() {

    return (
        <div className="group relative flex items-start gap-2">
            <Card className="w-[300px] border-none shadow-md bg-white ring-1 ring-slate-200 group-hover:ring-2 group-hover:ring-purple-500/50 transition-all relative">
                <CardHeader className="custom-drag-handle flex flex-row items-center space-y-0 p-3 rounded-t-lg border-b border-slate-100 bg-gradient-to-r from-purple-50/50 to-transparent cursor-move">
                    <div className="w-6 h-6 rounded bg-purple-500 flex items-center justify-center mr-2 shrink-0">
                        <CornerUpRight className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-sm font-bold text-slate-800">结束</CardTitle>
                        <p className="text-[10px] text-slate-400">这个节点没有介绍</p>
                    </div>
                </CardHeader>

                <CardContent className="p-4">
                    <div className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded-md hover:border-purple-400 cursor-pointer group/select">
                        <span className="text-sm text-slate-400">选择引用变量</span>
                        <ChevronDown className="w-4 h-4 text-slate-400 group-hover/select:text-purple-500" />
                    </div>
                </CardContent>

                <TargetHandle />
            </Card>

            <NodeHoverActions />
        </div>
    );
}

import { useState } from 'react';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CornerDownRight } from "lucide-react";
import { SourceHandle, NodePlusButton, NodeHoverActions, NodeMenuWrapper } from '../components/NodeCommon';

export default function LoopStartNode({ id, data }: { id: string, data: any }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="group relative flex items-start gap-2">
            <Card className="w-[300px] border-none shadow-md bg-white ring-1 ring-slate-200 group-hover:ring-2 group-hover:ring-purple-500/50 transition-all relative">
                <CardHeader className="custom-drag-handle flex flex-row items-center space-y-0 p-3 rounded-t-lg border-b border-slate-100 bg-gradient-to-r from-purple-50/50 to-transparent cursor-move">
                    <div className="w-6 h-6 rounded bg-purple-500 flex items-center justify-center mr-2 shrink-0">
                        <CornerDownRight className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-sm font-bold text-slate-800">开始</CardTitle>
                        <p className="text-[10px] text-slate-400">这个节点没有介绍</p>
                    </div>
                </CardHeader>

                <div className="p-0">
                    <div className="grid grid-cols-2 bg-slate-50/50 px-4 py-2 text-xs text-slate-500 font-medium border-b border-slate-100">
                        <div>变量名</div>
                        <div>数据类型</div>
                    </div>
                    <div className="px-4 py-3 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1.5">
                                <span className="text-blue-600 font-bold text-xs">[A]</span>
                                <span className="text-slate-700">下标</span>
                            </div>
                            <span className="text-slate-500 text-xs">Number</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1.5">
                                <span className="text-blue-600 font-bold text-xs">[A]</span>
                                <span className="text-slate-700">数组元素</span>
                            </div>
                            <span className="text-slate-500 text-xs">Any</span>
                        </div>
                    </div>
                </div>

                <SourceHandle />
                
                <NodePlusButton 
                    isMenuOpen={isMenuOpen} 
                    onClick={() => setIsMenuOpen(!isMenuOpen)} 
                />
            </Card>

            <NodeHoverActions />

            <NodeMenuWrapper 
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                onSelect={(type) => {
                    if (data.onAddNode) {
                        data.onAddNode(type, id);
                    }
                    setIsMenuOpen(false);
                }}
            />
        </div>
    );
}

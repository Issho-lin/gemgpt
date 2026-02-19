import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TargetHandle, NodePlusButton, NodeHoverActions, NodeMenuWrapper, SourceHandle } from '../components/NodeCommon';
import { NODE_CONFIG } from '../constants';
import { 
    MoreHorizontal, 
    BookOpen,
    HelpCircle,
    ChevronDown
} from "lucide-react";

export default function ParseDocNode({ id, data, type }: { id: string, data: any, type?: string }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const config = NODE_CONFIG['parseDoc'];
    const Icon = config.icon;

    return (
        <div className="group relative flex items-start gap-2">
            <Card className="w-[400px] border-none shadow-md bg-white ring-1 ring-slate-200 group-hover:ring-2 group-hover:ring-blue-500/50 transition-all relative">
                {/* Header */}
                <CardHeader className={cn("flex flex-row items-center space-y-0 p-4 rounded-t-lg border-b border-slate-100", config.headerGradient)}>
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mr-3 shrink-0", config.iconBg)}>
                        <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-bold text-slate-800">{config.label}</CardTitle>
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-blue-500">
                                    <BookOpen className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-blue-500">
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{config.description}</p>
                    </div>
                </CardHeader>

                <CardContent className="p-4 space-y-6">
                    {/* Input Section */}
                    <div>
                        <div className="flex items-center mb-4">
                            <div className="w-1 h-3.5 bg-blue-500 rounded-full mr-2"></div>
                            <span className="font-bold text-sm text-slate-700">输入</span>
                        </div>

                        {/* Document Link */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-sm font-medium text-slate-700">文档链接</span>
                                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">Array&lt;string&gt;</span>
                                </div>
                                <div className="flex items-center gap-1 bg-blue-50 rounded px-2 py-0.5 text-xs text-blue-600 border border-blue-100 cursor-pointer">
                                    <span className="font-mono">{'{x}'}</span>
                                    变量引用
                                    <ChevronDown className="w-3 h-3" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded-md hover:border-emerald-400 cursor-pointer group/select">
                                <span className="text-sm text-slate-400">选择引用变量</span>
                                <ChevronDown className="w-4 h-4 text-slate-400 group-hover/select:text-emerald-500" />
                            </div>
                        </div>
                    </div>

                    {/* Output Section */}
                    <div>
                        <div className="flex items-center mb-2">
                            <div className="w-1 h-3.5 bg-blue-500 rounded-full mr-2"></div>
                            <span className="font-bold text-sm text-slate-700">输出</span>
                        </div>
                        
                        <div className="space-y-2">
                            {/* Parse Result */}
                            <div className="relative">
                                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-emerald-400 transition-colors">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                                        <span className="text-sm text-slate-600">文档解析结果</span>
                                        <span className="text-xs text-slate-400 bg-slate-100 px-1.5 rounded">String</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-red-500 transition-colors">
                                            <div className="w-3 h-0.5 bg-current"></div>
                                        </button>
                                    </div>
                                </div>
                                <SourceHandle id="result" className="!top-1/2 -translate-y-1/2" />
                            </div>

                            {/* Original Response */}
                            <div className="relative">
                                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-emerald-400 transition-colors">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                                        <span className="text-sm text-slate-600">原始响应</span>
                                        <span className="text-xs text-slate-400 bg-slate-100 px-1.5 rounded">Array&lt;object&gt;</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-red-500 transition-colors">
                                            <div className="w-3 h-0.5 bg-current"></div>
                                        </button>
                                    </div>
                                </div>
                                <SourceHandle id="response" className="!top-1/2 -translate-y-1/2" />
                            </div>
                        </div>
                    </div>

                </CardContent>

                <TargetHandle />
            </Card>

            <NodeHoverActions />
            
            <NodePlusButton 
                isMenuOpen={isMenuOpen} 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
            />
            
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

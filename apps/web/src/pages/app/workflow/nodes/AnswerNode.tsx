import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { TargetHandle, NodePlusButton, NodeHoverActions, NodeMenuWrapper } from '../components/NodeCommon';
import { NODE_CONFIG } from '../constants';
import { 
    MoreHorizontal, 
    BookOpen,
    HelpCircle,
    ChevronDown
} from "lucide-react";

export default function AnswerNode({ id, data, type }: { id: string, data: any, type?: string }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const config = NODE_CONFIG['answer'];
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
                    {/* Reply Content */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-red-500 font-bold">*</span>
                                <span className="text-sm font-medium text-slate-700">回复的内容</span>
                                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                                
                                <div className="flex items-center gap-1 bg-blue-50 rounded px-2 py-0.5 text-xs text-blue-600 border border-blue-100 cursor-pointer">
                                    <span className="font-mono">T</span>
                                    手动输入
                                    <ChevronDown className="w-3 h-3" />
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                                <span className="text-xs text-slate-400">输入'/'可选变量</span>
                            </div>
                        </div>
                        <div className="relative">
                            <Textarea 
                                className="w-full h-32 p-3 text-sm bg-slate-50 border border-slate-200 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400 leading-relaxed"
                                placeholder={`可以使用 \\n 来实现连续换行。
可以通过外部模块输入实现回复，外部模块输入时会覆盖当前填写的内容。
如传入非字符串类型数据将会自动转成字符串`}
                            />
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

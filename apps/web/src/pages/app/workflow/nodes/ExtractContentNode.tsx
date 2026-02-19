import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { SourceHandle, TargetHandle, NodePlusButton, NodeHoverActions, NodeMenuWrapper, NodeSectionHeader } from '../components/NodeCommon';
import { NODE_CONFIG } from '../constants';
import { 
    FileText, 
    Settings, 
    HelpCircle, 
    MoreHorizontal, 
    ChevronDown,
    BookOpen,
    Bot,
    Plus,
    Type
} from "lucide-react";

export default function ExtractContentNode({ id, data, type }: { id: string, data: any, type?: string }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // Always use extractContent config for this node
    const config = NODE_CONFIG['extractContent'];
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
                        <NodeSectionHeader title="输入" />
                        
                        <div className="space-y-4">
                            {/* AI Model */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-sm font-medium text-slate-700"><span className="text-red-500">*</span>AI 模型</span>
                                    </div>
                                    <div className="flex items-center gap-1 bg-slate-100 rounded px-2 py-0.5 text-xs text-slate-600">
                                        <Bot className="w-3 h-3" />
                                        手动选择
                                        <ChevronDown className="w-3 h-3" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-md hover:border-blue-400 cursor-pointer">
                                    <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
                                        <Bot className="w-3 h-3 text-white" />
                                    </div>
                                    <span className="text-sm text-slate-700 flex-1">glm-4-air</span>
                                    <ChevronDown className="w-4 h-4 text-slate-400" />
                                </div>
                            </div>

                            {/* Extraction Description */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-sm font-medium text-slate-700">提取要求描述</span>
                                        <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                                    </div>
                                    <div className="flex items-center gap-1 bg-slate-100 rounded px-2 py-0.5 text-xs text-slate-600">
                                        <span className="font-mono">T</span>
                                        手动输入
                                        <ChevronDown className="w-3 h-3" />
                                    </div>
                                </div>
                                <div className="text-xs text-slate-400 text-right">输入'/'可选变量</div>
                                <div className="relative">
                                    <textarea 
                                        className="w-full h-32 p-3 text-xs bg-slate-50 border border-slate-200 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-400 leading-relaxed"
                                        placeholder={`例如：1. 当前时间为：{{cTime}}。你是一个实验室预约助手，你的任务是帮助用户预约实验室，从文本中获取对应的预约信息。
2. 你是谷歌搜索助手，需要从文本中提取出合适的搜索词。`}
                                    />
                                </div>
                            </div>

                            {/* Chat History */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-sm font-medium text-slate-700"><span className="text-red-500">*</span>聊天记录</span>
                                        <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                                    </div>
                                    <div className="flex items-center gap-1 bg-slate-100 rounded px-2 py-0.5 text-xs text-slate-600">
                                        <div className="flex gap-0.5">
                                            <div className="w-3 h-3 bg-slate-400 rounded-[1px]"></div>
                                            <div className="w-3 h-3 bg-slate-400 rounded-[1px] opacity-50"></div>
                                        </div>
                                        手动输入
                                        <ChevronDown className="w-3 h-3" />
                                    </div>
                                </div>
                                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-md px-2 py-1.5">
                                    <input 
                                        type="number" 
                                        defaultValue={6}
                                        className="w-full bg-transparent text-sm focus:outline-none text-slate-700" 
                                    />
                                    <div className="flex flex-col gap-0.5">
                                        <div className="w-3 h-3 bg-slate-200 hover:bg-slate-300 rounded cursor-pointer flex items-center justify-center text-[8px] text-slate-600">▲</div>
                                        <div className="w-3 h-3 bg-slate-200 hover:bg-slate-300 rounded cursor-pointer flex items-center justify-center text-[8px] text-slate-600">▼</div>
                                    </div>
                                </div>
                            </div>

                            {/* Text to Extract */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-sm font-medium text-slate-700"><span className="text-red-500">*</span>需要提取的文本</span>
                                        <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">String</span>
                                        <div className="flex items-center gap-1 bg-blue-50 rounded px-1.5 py-0.5 text-xs text-blue-600 border border-blue-100 cursor-pointer">
                                            <span className="font-mono">{'{x}'}</span>
                                            变量引用
                                            <ChevronDown className="w-3 h-3" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded-md hover:border-blue-400 cursor-pointer group/select">
                                    <span className="text-sm text-slate-400">选择引用变量</span>
                                    <ChevronDown className="w-4 h-4 text-slate-400 group-hover/select:text-blue-500" />
                                </div>
                            </div>

                            {/* Target Fields */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-700">目标字段</span>
                                    <div className="flex items-center gap-1 text-xs text-slate-600 cursor-pointer hover:text-blue-600">
                                        <Plus className="w-3 h-3" />
                                        新增字段
                                    </div>
                                </div>
                                <div className="border border-slate-200 rounded-lg overflow-hidden">
                                    <div className="grid grid-cols-12 bg-slate-50 p-2 text-xs text-slate-500 border-b border-slate-200">
                                        <div className="col-span-4 pl-2">字段名</div>
                                        <div className="col-span-6">字段描述</div>
                                        <div className="col-span-2 text-center">必须</div>
                                    </div>
                                    <div className="p-8 flex flex-col items-center justify-center text-slate-400 gap-2">
                                        {/* Empty state placeholder or rows */}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Output Section */}
                    <div>
                        <NodeSectionHeader 
                            title="输出" 
                            rightContent={
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500">报错捕获</span>
                                    <Switch className="scale-75" />
                                </div>
                            }
                        />
                        
                        <div className="space-y-3">
                            <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-between border border-slate-100">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-700"><span className="text-red-500">*</span>字段完全提取</span>
                                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                                </div>
                                <span className="text-xs bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">Boolean</span>
                            </div>
                            
                            <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-between border border-slate-100">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-700"><span className="text-red-500">*</span>完整提取结果</span>
                                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                                </div>
                                <span className="text-xs bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">String</span>
                            </div>
                        </div>
                    </div>
                </CardContent>

                <TargetHandle />
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
import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SourceHandle, TargetHandle, NodePlusButton, NodeHoverActions, NodeMenuWrapper } from '../components/NodeCommon';
import { NODE_CONFIG } from '../constants';
import { 
    Bot, 
    Settings, 
    HelpCircle, 
    MoreHorizontal, 
    ChevronDown,
    BookOpen
} from "lucide-react";

export default function AIChatNode({ id, data, type }: { id: string, data: any, type?: string }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const nodeType = type || 'aiChat';
    const config = NODE_CONFIG[nodeType] || NODE_CONFIG['aiChat'];
    const Icon = config.icon;

    return (
        <div className="group relative flex items-start gap-2">
            <Card className="w-[340px] border-none shadow-md bg-white ring-1 ring-slate-200 group-hover:ring-2 group-hover:ring-blue-500/50 transition-all relative">
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
                        <p className="text-xs text-slate-500 mt-0.5">{config.description}</p>
                    </div>
                </CardHeader>

                <CardContent className="p-4 space-y-6">
                    {/* Input Section */}
                    <div>
                        <div className="flex items-center mb-4">
                            <div className="w-1 h-3.5 bg-blue-500 rounded-full mr-2"></div>
                            <span className="font-bold text-sm text-slate-700">输入</span>
                        </div>
                        
                        <div className="space-y-4">
                            {/* AI Model */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-sm font-medium text-slate-700">AI 模型</span>
                                    </div>
                                    <div className="flex items-center gap-1 bg-slate-100 rounded px-2 py-0.5 text-xs text-slate-600">
                                        <Bot className="w-3 h-3" />
                                        手动选择
                                        <ChevronDown className="w-3 h-3" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-md">
                                    <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
                                        <Bot className="w-3 h-3 text-white" />
                                    </div>
                                    <span className="text-sm text-slate-700 flex-1">glm-4-air</span>
                                    <Settings className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-600" />
                                </div>
                            </div>

                            {/* Prompt */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-sm font-medium text-slate-700">提示词</span>
                                        <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                                    </div>
                                    <div className="flex items-center gap-1 bg-slate-100 rounded px-2 py-0.5 text-xs text-slate-600">
                                        <span className="font-mono">T</span>
                                        手动输入
                                        <ChevronDown className="w-3 h-3" />
                                    </div>
                                </div>
                                <div className="relative">
                                    <textarea 
                                        className="w-full h-24 p-2 text-sm bg-slate-50 border border-slate-200 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400"
                                        placeholder="在此输入提示词"
                                    />
                                    <div className="absolute bottom-2 right-2 text-blue-500 cursor-pointer bg-blue-50 p-1 rounded hover:bg-blue-100">
                                        <span className="text-xs font-mono">{'{ }'}</span>
                                    </div>
                                </div>
                                <div className="text-xs text-slate-400 text-right">输入'/'可选变量</div>
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

                            {/* Knowledge Base */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-sm font-medium text-slate-700">知识库引用</span>
                                        <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">知识库引用</span>
                                        <Settings className="w-3.5 h-3.5 text-slate-400" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded-md hover:border-blue-400 cursor-pointer group/select">
                                    <span className="text-sm text-slate-400">选择引用变量</span>
                                    <ChevronDown className="w-4 h-4 text-slate-400 group-hover/select:text-blue-500" />
                                </div>
                            </div>

                            {/* File Links */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-sm font-medium text-slate-700">文件链接</span>
                                        <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">Array&lt;string&gt;</span>
                                    </div>
                                    <div className="flex items-center gap-1 bg-blue-50 rounded px-2 py-0.5 text-xs text-blue-600">
                                        <span className="font-mono">{'{ }'}</span>
                                        变量引用
                                        <ChevronDown className="w-3 h-3" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded-md hover:border-blue-400 cursor-pointer group/select">
                                    <span className="text-sm text-slate-400">选择引用变量</span>
                                    <ChevronDown className="w-4 h-4 text-slate-400 group-hover/select:text-blue-500" />
                                </div>
                            </div>

                            {/* User Question */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-sm font-medium text-slate-700"><span className="text-red-500">*</span>用户问题</span>
                                        <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">String</span>
                                    </div>
                                    <div className="flex items-center gap-1 bg-blue-50 rounded px-2 py-0.5 text-xs text-blue-600">
                                        <span className="font-mono">{'{ }'}</span>
                                        变量引用
                                        <ChevronDown className="w-3 h-3" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-2 bg-white border border-blue-500 rounded-md cursor-pointer">
                                    <div className="w-5 h-5 rounded bg-blue-500 flex items-center justify-center shrink-0">
                                        <Bot className="w-3 h-3 text-white" />
                                    </div>
                                    <span className="text-sm text-slate-700 flex-1 truncate">流程开始 › 用户问题</span>
                                    <ChevronDown className="w-4 h-4 text-slate-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Output Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <div className="w-1 h-3.5 bg-blue-500 rounded-full mr-2"></div>
                                <span className="font-bold text-sm text-slate-700">输出</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500">报错捕获</span>
                                <div className="w-8 h-4 bg-slate-200 rounded-full relative cursor-pointer">
                                    <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-between border border-slate-100">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-700"><span className="text-red-500">*</span>新的上下文</span>
                                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                                </div>
                                <span className="text-xs bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">历史记录</span>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-between border border-slate-100">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-700"><span className="text-red-500">*</span>AI 回复内容</span>
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
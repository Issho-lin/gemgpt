import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SourceHandle, TargetHandle, NodePlusButton, NodeHoverActions, NodeMenuWrapper } from '../components/NodeCommon';
import NodeMenu from '../components/NodeMenu';
import { NODE_CONFIG } from '../constants';
import { Handle, Position, useNodeConnections } from '@xyflow/react';
import { 
    Bot, 
    Settings, 
    HelpCircle, 
    MoreHorizontal, 
    ChevronDown,
    BookOpen,
    Briefcase,
    Plus
} from "lucide-react";

function BottomHandle() {
    const connections = useNodeConnections({
        handleType: 'source',
        handleId: 'tool-connector'
    });
    
    return (
        <Handle 
            type="source" 
            position={Position.Bottom} 
            id="tool-connector"
            className={cn(
                "w-6 h-6 !bg-blue-500 border-4 border-white transition-opacity z-40 rounded-full shadow-sm",
                connections.length > 0 ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}
            style={{ bottom: -12, top: 'auto', left: '50%', transform: 'translate(-50%, 0)' }}
        />
    );
}

export default function ToolNode({ id, data, type }: { id: string, data: any, type?: string }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isBottomMenuOpen, setIsBottomMenuOpen] = useState(false);
    
    const nodeType = type || 'tool';
    const config = NODE_CONFIG[nodeType] || NODE_CONFIG['tool'];
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

                            {/* File Links */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-sm font-medium text-slate-700">文件链接</span>
                                        <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">Array&lt;string&gt;</span>
                                    </div>
                                    <div className="flex items-center gap-1 bg-blue-50 rounded px-2 py-0.5 text-xs text-blue-600 border border-blue-100 cursor-pointer">
                                        <span className="font-mono">{'{x}'}</span>
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
                                        <div className="flex items-center gap-1 bg-blue-50 rounded px-2 py-0.5 text-xs text-blue-600 border border-blue-100 cursor-pointer">
                                            <span className="font-mono">{'{x}'}</span>
                                            变量引用
                                            <ChevronDown className="w-3 h-3" />
                                        </div>
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

                        <div className="relative">
                            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-blue-400 transition-colors">
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                                    <span className="text-sm text-slate-600">AI 回复内容</span>
                                    <span className="text-xs text-slate-400 bg-slate-100 px-1.5 rounded">String</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-red-500 transition-colors">
                                        <div className="w-3 h-0.5 bg-current"></div>
                                    </button>
                                </div>
                            </div>
                            <SourceHandle className="!top-1/2 -translate-y-1/2" />
                        </div>
                    </div>

                    <Button variant="outline" className="w-full flex items-center gap-2 text-slate-600 border-slate-200 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50">
                        <Briefcase className="w-4 h-4" />
                        选择工具
                    </Button>
                </CardContent>

                <TargetHandle />

                {/* Bottom Connector */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-0 z-50">
                    <BottomHandle />
                    
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center group/connector">
                        <div 
                            className={cn(
                                "w-6 h-6 bg-white border border-slate-300 rotate-45 flex items-center justify-center cursor-pointer transition-all shadow-sm z-10",
                                "hover:scale-110 hover:border-blue-500 hover:text-blue-500",
                                isBottomMenuOpen ? "border-blue-500 text-blue-500 scale-110" : "text-slate-400"
                            )}
                            onClick={() => setIsBottomMenuOpen(!isBottomMenuOpen)}
                        >
                            <Plus className="w-4 h-4 -rotate-45" />
                        </div>
                        
                        {/* Menu */}
                        {isBottomMenuOpen && (
                            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-[100]">
                                <NodeMenu 
                                    onClose={() => setIsBottomMenuOpen(false)}
                                    onSelect={(type) => {
                                        if (data.onAddNode) {
                                            data.onAddNode(type, id, 'tool-connector', 'bottom');
                                        }
                                        setIsBottomMenuOpen(false);
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
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

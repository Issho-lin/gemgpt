import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { SourceHandle, TargetHandle, NodePlusButton, NodeHoverActions, NodeMenuWrapper, NodeSectionHeader } from '../components/NodeCommon';
import { NODE_CONFIG } from '../constants';
import { 
    Database, 
    Settings, 
    HelpCircle, 
    MoreHorizontal, 
    ChevronDown,
    BookOpen,
    MousePointerClick,
    Sparkles,
    Search,
    Bot
} from "lucide-react";

export default function DatasetSearchNode({ id, data, type }: { id: string, data: any, type?: string }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // Always use searchDataset config for this node
    const config = NODE_CONFIG['searchDataset'];
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
                            {/* Select Knowledge Base */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-sm font-medium text-slate-700"><span className="text-red-500">*</span>选择知识库</span>
                                    </div>
                                    <div className="flex items-center gap-1 bg-slate-100 rounded px-2 py-0.5 text-xs text-slate-600">
                                        <Database className="w-3 h-3" />
                                        手动选择
                                        <ChevronDown className="w-3 h-3" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-end gap-2 mb-2">
                                    <span className="text-xs text-slate-500">使用者鉴权</span>
                                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                                    <Switch className="scale-75" />
                                </div>
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2 h-9">
                                    <MousePointerClick className="w-4 h-4" />
                                    选择
                                </Button>
                            </div>

                            {/* Search Parameters */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-sm font-medium text-slate-700">搜索参数设置</span>
                                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                                </div>
                                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                                    <div className="grid grid-cols-4 gap-4 text-xs text-slate-500 mb-1">
                                        <div>搜索方式</div>
                                        <div>引用上限</div>
                                        <div>最低相关度</div>
                                        <div>问题优化</div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-4 text-xs text-slate-700 font-medium items-center">
                                        <div className="flex items-center gap-1 text-blue-600">
                                            <Search className="w-3 h-3" />
                                            语义检索
                                        </div>
                                        <div>5000</div>
                                        <div>0.4</div>
                                        <div>glm-4-air</div>
                                    </div>
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
                            {/* Knowledge Base Reference */}
                            <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-between border border-slate-100">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-700 font-medium">知识库引用</span>
                                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-xs text-slate-400 bg-slate-200/50 px-1.5 py-0.5 rounded">知识库引用</span>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-slate-300"></div>
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
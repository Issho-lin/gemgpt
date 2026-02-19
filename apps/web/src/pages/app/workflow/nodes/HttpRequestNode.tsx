import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { TargetHandle, NodePlusButton, NodeHoverActions, NodeMenuWrapper, SourceHandle } from '../components/NodeCommon';
import { NODE_CONFIG } from '../constants';
import { 
    MoreHorizontal, 
    BookOpen,
    HelpCircle,
    ChevronDown,
    Settings
} from "lucide-react";

export default function HttpRequestNode({ id, data, type }: { id: string, data: any, type?: string }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'Params' | 'Body' | 'Headers'>('Params');
    
    const config = NODE_CONFIG['httpRequest'];
    const Icon = config.icon;

    return (
        <div className="group relative flex items-start gap-2">
            <Card className="w-[480px] border-none shadow-md bg-white ring-1 ring-slate-200 group-hover:ring-2 group-hover:ring-blue-500/50 transition-all relative">
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

                        {/* Custom Variables */}
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-1.5">
                                <span className="text-sm font-medium text-slate-700">自定义变量</span>
                                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                            </div>
                            <div className="grid grid-cols-12 gap-2 text-xs text-slate-500 mb-1">
                                <div className="col-span-4">变量名</div>
                                <div className="col-span-4">引用变量</div>
                                <div className="col-span-4">数据类型</div>
                            </div>
                            <div className="grid grid-cols-12 gap-2">
                                <div className="col-span-4">
                                    <Input className="h-8 text-xs bg-slate-50" placeholder="变量名" />
                                </div>
                                <div className="col-span-4">
                                    <div className="h-8 flex items-center justify-between px-2 bg-white border border-slate-200 rounded-md text-xs text-slate-400 cursor-pointer hover:border-blue-400">
                                        <span>选择引用变量</span>
                                        <ChevronDown className="w-3 h-3" />
                                    </div>
                                </div>
                                <div className="col-span-4">
                                    <Input className="h-8 text-xs bg-slate-50" placeholder="Any" readOnly />
                                </div>
                            </div>
                        </div>

                        {/* Request Config */}
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-700">请求配置</span>
                                <span className="text-xs text-slate-500 cursor-pointer hover:text-blue-600">cURL 导入</span>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-24 shrink-0">
                                    <div className="h-9 flex items-center justify-between px-3 bg-white border border-slate-200 rounded-md text-sm cursor-pointer hover:border-blue-400">
                                        <span className="font-medium text-slate-700">POST</span>
                                        <ChevronDown className="w-4 h-4 text-slate-400" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <Input className="h-9 text-sm" placeholder='请求地址，输入"/"可选择变量' />
                                </div>
                            </div>
                        </div>

                        {/* Timeout */}
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-slate-700">超时时长</span>
                            <div className="w-20">
                                <div className="h-8 flex items-center justify-center px-2 bg-white border border-slate-200 rounded-md text-sm">
                                    <span>30 s</span>
                                </div>
                            </div>
                        </div>

                        {/* Request Params */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-sm font-medium text-slate-700">请求参数</span>
                                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                                </div>
                                <div className="flex items-center gap-1 text-xs text-slate-500 cursor-pointer hover:text-blue-600">
                                    <Settings className="w-3 h-3" />
                                    <span>鉴权配置</span>
                                </div>
                            </div>
                            
                            {/* Tabs */}
                            <div className="flex border-b border-slate-200 mb-2">
                                {['Params', 'Body', 'Headers'].map((tab) => (
                                    <div 
                                        key={tab}
                                        className={cn(
                                            "flex-1 text-center py-2 text-sm cursor-pointer border-b-2 transition-colors",
                                            activeTab === tab 
                                                ? "border-blue-500 text-blue-600 font-medium" 
                                                : "border-transparent text-slate-500 hover:text-slate-700"
                                        )}
                                        onClick={() => setActiveTab(tab as any)}
                                    >
                                        {tab}
                                    </div>
                                ))}
                            </div>

                            {/* Params Table */}
                            <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                                <div className="grid grid-cols-2 gap-px bg-slate-200">
                                    <div className="bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500">参数名</div>
                                    <div className="bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500">参数值</div>
                                </div>
                                <div className="grid grid-cols-2 gap-px bg-slate-200">
                                    <div className="bg-white">
                                        <Input className="h-9 border-none bg-transparent focus-visible:ring-0 text-xs" placeholder='输入"/"可选择变量' />
                                    </div>
                                    <div className="bg-white">
                                        <Input className="h-9 border-none bg-transparent focus-visible:ring-0 text-xs" placeholder='输入"/"可选择变量' />
                                    </div>
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

                        {/* Output Field Extraction */}
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-1.5">
                                <span className="text-sm font-medium text-slate-700">输出字段提取</span>
                                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                            </div>
                            <div className="grid grid-cols-12 gap-2 text-xs text-slate-500 mb-1">
                                <div className="col-span-7">变量名</div>
                                <div className="col-span-5">数据类型</div>
                            </div>
                            <div className="grid grid-cols-12 gap-2">
                                <div className="col-span-7">
                                    <Input className="h-8 text-xs bg-white" placeholder="变量名" />
                                </div>
                                <div className="col-span-5">
                                    <div className="h-8 flex items-center justify-between px-2 bg-white border border-slate-200 rounded-md text-xs text-slate-400 cursor-pointer hover:border-blue-400">
                                        <span>Any</span>
                                        <ChevronDown className="w-3 h-3" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Original Response */}
                        <div className="relative">
                            <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-md">
                                <span className="text-red-500 font-bold">*</span>
                                <span className="text-sm text-slate-700">原始响应</span>
                                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                                <span className="text-xs text-slate-400 bg-slate-200 px-1.5 rounded">Any</span>
                            </div>
                            <SourceHandle className="!top-1/2 -translate-y-1/2" />
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

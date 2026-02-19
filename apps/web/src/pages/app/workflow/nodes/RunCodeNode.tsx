import { useState, useCallback } from 'react';
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
    Trash2,
    Code as CodeIcon,
    Maximize2
} from "lucide-react";

interface VariableItem {
    id: string;
    name: string;
    reference: string;
    type: string;
}

export default function RunCodeNode({ id, data, type }: { id: string, data: any, type?: string }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [inputVars, setInputVars] = useState<VariableItem[]>([
        { id: '1', name: 'data1', reference: '', type: 'String' },
        { id: '2', name: 'data2', reference: '', type: 'String' }
    ]);
    const [outputVars, setOutputVars] = useState<VariableItem[]>([
        { id: '1', name: 'result', reference: '', type: 'String' },
        { id: '2', name: 'data2', reference: '', type: 'String' }
    ]);
    
    const config = NODE_CONFIG['runCode'];
    const Icon = config.icon;

    const handleAddInputVar = useCallback(() => {
        setInputVars(prev => [...prev, { id: Date.now().toString(), name: '', reference: '', type: 'Any' }]);
    }, []);

    const handleDeleteInputVar = useCallback((itemId: string) => {
        setInputVars(prev => prev.filter(item => item.id !== itemId));
    }, []);

    const handleAddOutputVar = useCallback(() => {
        setOutputVars(prev => [...prev, { id: Date.now().toString(), name: '', reference: '', type: 'Any' }]);
    }, []);

    const handleDeleteOutputVar = useCallback((itemId: string) => {
        setOutputVars(prev => prev.filter(item => item.id !== itemId));
    }, []);

    return (
        <div className="group relative flex items-start gap-2">
            <Card className="w-[500px] border-none shadow-md bg-white ring-1 ring-slate-200 group-hover:ring-2 group-hover:ring-emerald-500/50 transition-all relative">
                {/* Header */}
                <CardHeader className={cn("flex flex-row items-center space-y-0 p-4 rounded-t-lg border-b border-slate-100", config.headerGradient)}>
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mr-3 shrink-0", config.iconBg)}>
                        <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-bold text-slate-800">{config.label}</CardTitle>
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-emerald-500">
                                    <BookOpen className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-emerald-500">
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
                                <div className="col-span-3">变量名</div>
                                <div className="col-span-5">引用变量</div>
                                <div className="col-span-3">数据类型</div>
                                <div className="col-span-1"></div>
                            </div>
                            <div className="space-y-2">
                                {inputVars.map((item) => (
                                    <div key={item.id} className="grid grid-cols-12 gap-2 group/item relative">
                                        <div className="col-span-3">
                                            <Input 
                                                className="h-8 text-xs bg-slate-50" 
                                                placeholder="变量名" 
                                                defaultValue={item.name}
                                            />
                                        </div>
                                        <div className="col-span-5">
                                            <div className="h-8 flex items-center justify-between px-2 bg-white border border-slate-200 rounded-md text-xs text-slate-400 cursor-pointer hover:border-emerald-400">
                                                <span>选择引用变量</span>
                                                <ChevronDown className="w-3 h-3" />
                                            </div>
                                        </div>
                                        <div className="col-span-3">
                                            <div className="h-8 flex items-center justify-between px-2 bg-white border border-slate-200 rounded-md text-xs text-slate-700 cursor-pointer hover:border-emerald-400">
                                                <span>{item.type}</span>
                                                <ChevronDown className="w-3 h-3 text-slate-400" />
                                            </div>
                                        </div>
                                        <div className="col-span-1 flex items-center justify-center">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-6 w-6 text-slate-300 hover:text-red-500"
                                                onClick={() => handleDeleteInputVar(item.id)}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {/* Add Input Var Row */}
                                <div className="grid grid-cols-12 gap-2">
                                    <div className="col-span-3">
                                        <Input className="h-8 text-xs bg-slate-50" placeholder="变量名" />
                                    </div>
                                    <div className="col-span-5">
                                        <div className="h-8 flex items-center justify-between px-2 bg-white border border-slate-200 rounded-md text-xs text-slate-400 cursor-pointer hover:border-emerald-400">
                                            <span>选择引用变量</span>
                                            <ChevronDown className="w-3 h-3" />
                                        </div>
                                    </div>
                                    <div className="col-span-3">
                                        <div className="h-8 flex items-center justify-between px-2 bg-white border border-slate-200 rounded-md text-xs text-slate-400 cursor-pointer hover:border-emerald-400">
                                            <span>Any</span>
                                            <ChevronDown className="w-3 h-3" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Code Editor Mock */}
                        <div className="rounded-lg border border-slate-200 overflow-hidden">
                            <div className="flex items-center justify-between bg-slate-50 px-3 py-2 border-b border-slate-200">
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded px-2 py-0.5 text-xs text-slate-600 cursor-pointer hover:border-blue-400">
                                        <span>JavaScript</span>
                                        <ChevronDown className="w-3 h-3" />
                                    </div>
                                </div>
                                <span className="text-xs text-blue-600 cursor-pointer hover:underline">还原模板</span>
                            </div>
                            <div className="relative bg-slate-50 min-h-[160px] p-2 font-mono text-xs">
                                <div className="absolute top-2 right-2">
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-slate-600">
                                        <Maximize2 className="w-3 h-3" />
                                    </Button>
                                </div>
                                <div className="flex gap-2">
                                    <div className="text-slate-400 text-right select-none flex flex-col gap-0.5">
                                        <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span>
                                    </div>
                                    <div className="text-slate-700 whitespace-pre">
                                        <span className="text-blue-600">function</span> <span className="text-yellow-600">main</span>({'{'}data1, data2{'}'}) {'{'}{'\n'}
                                        {'\n'}
                                        {'  '}<span className="text-purple-600">return</span> {'{'}{'\n'}
                                        {'    '}result: data1,{'\n'}
                                        {'    '}data2{'\n'}
                                        {'  '}{'}'}{'\n'}
                                        {'}'}
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

                        {/* Custom Output */}
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-1.5">
                                <span className="text-sm font-medium text-slate-700">自定义输出</span>
                                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                            </div>
                            <div className="grid grid-cols-12 gap-2 text-xs text-slate-500 mb-1">
                                <div className="col-span-7">变量名</div>
                                <div className="col-span-4">数据类型</div>
                                <div className="col-span-1"></div>
                            </div>
                            <div className="space-y-2">
                                {outputVars.map((item) => (
                                    <div key={item.id} className="grid grid-cols-12 gap-2 group/item">
                                        <div className="col-span-7">
                                            <Input 
                                                className="h-8 text-xs bg-white" 
                                                placeholder="变量名" 
                                                defaultValue={item.name}
                                            />
                                        </div>
                                        <div className="col-span-4">
                                            <div className="h-8 flex items-center justify-between px-2 bg-white border border-slate-200 rounded-md text-xs text-slate-700 cursor-pointer hover:border-emerald-400">
                                                <span>{item.type}</span>
                                                <ChevronDown className="w-3 h-3 text-slate-400" />
                                            </div>
                                        </div>
                                        <div className="col-span-1 flex items-center justify-center">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-6 w-6 text-slate-300 hover:text-red-500"
                                                onClick={() => handleDeleteOutputVar(item.id)}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {/* Add Output Var Row */}
                                <div className="grid grid-cols-12 gap-2">
                                    <div className="col-span-7">
                                        <Input className="h-8 text-xs bg-white" placeholder="变量名" />
                                    </div>
                                    <div className="col-span-4">
                                        <div className="h-8 flex items-center justify-between px-2 bg-white border border-slate-200 rounded-md text-xs text-slate-400 cursor-pointer hover:border-emerald-400">
                                            <span>Any</span>
                                            <ChevronDown className="w-3 h-3" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Complete Response */}
                        <div className="relative">
                            <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-md">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-700">完整响应数据</span>
                                    <span className="text-xs text-slate-400 bg-slate-200 px-1.5 rounded">Object</span>
                                </div>
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

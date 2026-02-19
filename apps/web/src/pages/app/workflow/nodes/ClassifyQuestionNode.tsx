import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { TargetHandle, NodePlusButton, NodeHoverActions, NodeMenuWrapper, SourceHandle } from '../components/NodeCommon';
import { NODE_CONFIG } from '../constants';
import { 
    HelpCircle, 
    MoreHorizontal, 
    ChevronDown,
    BookOpen,
    Bot,
    MinusCircle
} from "lucide-react";

type Category = {
    id: string;
    value: string;
};

export default function ClassifyQuestionNode({ id, data, type }: { id: string, data: any, type?: string }) {
    // Separate menu state for each category handle
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    
    // Categories state
    const [categories, setCategories] = useState<Category[]>([
        { id: 'class-1', value: 'Greeting' },
        { id: 'class-2', value: 'Question regarding xxx' },
        { id: 'class-3', value: 'Other Questions' },
    ]);
    
    const config = NODE_CONFIG['classifyQuestion'];
    const Icon = config.icon;

    const handleAddCategory = () => {
        const newId = `class-${Date.now()}`;
        setCategories([...categories, { id: newId, value: '' }]);
    };

    const handleRemoveCategory = (catId: string) => {
        setCategories(categories.filter(c => c.id !== catId));
    };

    const handleCategoryChange = (catId: string, newValue: string) => {
        setCategories(categories.map(c => c.id === catId ? { ...c, value: newValue } : c));
    };

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

                    {/* Background Knowledge */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <span className="text-sm font-medium text-slate-700">背景知识</span>
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
                                className="w-full h-32 p-3 text-xs bg-slate-50 border border-slate-200 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder:text-slate-400 leading-relaxed"
                                placeholder={`例如：
1. AIGC（人工智能生成内容）是指使用人工智能技术自动或半自动地生成数字内容，如文本、图像、音频、视频等。
2. AIGC 技术包括但不限于自然语言处理、计算机视觉、机器学习和深度学习。这些技术可以创建新内容或修改现有内容，以满足特定的创意、教育、娱乐或信息需求。`}
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

                    {/* User Question */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <span className="text-sm font-medium text-slate-700"><span className="text-red-500">*</span>用户问题</span>
                                <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">String</span>
                                <div className="flex items-center gap-1 bg-blue-50 rounded px-1.5 py-0.5 text-xs text-blue-600 border border-blue-100 cursor-pointer">
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

                    {/* Classification Categories */}
                    <div className="space-y-3 pt-2">
                        {categories.map((category, index) => (
                            <div key={category.id} className="relative">
                                <div className="flex items-center gap-2 mb-1">
                                    <MinusCircle 
                                        className="w-4 h-4 text-slate-400 cursor-pointer hover:text-red-500"
                                        onClick={() => handleRemoveCategory(category.id)}
                                    />
                                    <span className="text-sm text-slate-700 font-medium">分类{index + 1}</span>
                                </div>
                                <div className="relative group/item">
                                    <Textarea 
                                        className="min-h-[60px] resize-none text-sm bg-slate-50 border-slate-200 focus:ring-purple-500 pr-8"
                                        value={category.value}
                                        onChange={(e) => handleCategoryChange(category.id, e.target.value)}
                                        placeholder="输入分类描述"
                                    />
                                    {/* Source Handle for this category */}
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10">
                                        <SourceHandle id={category.id} className="opacity-0 group-hover/item:opacity-100" style={{ right: 0 }} />
                                    </div>
                                    {/* Add Node Button for this category */}
                                    <NodePlusButton 
                                        isMenuOpen={activeMenuId === category.id} 
                                        onClick={() => setActiveMenuId(activeMenuId === category.id ? null : category.id)}
                                        handleId={`plus-${category.id}`}
                                        className="!right-[-28px]"
                                    />
                                    
                                    <NodeMenuWrapper 
                                        isOpen={activeMenuId === category.id}
                                        onClose={() => setActiveMenuId(null)}
                                        onSelect={(type) => {
                                            if (data.onAddNode) {
                                                // Pass the category ID as the source handle ID
                                                data.onAddNode(type, id, category.id);
                                            }
                                            setActiveMenuId(null);
                                        }}
                                    />
                                </div>
                            </div>
                        ))}

                        <Button 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={handleAddCategory}
                        >
                            添加问题类型
                        </Button>
                    </div>

                </CardContent>

                <TargetHandle />
            </Card>

            <NodeHoverActions />
        </div>
    );
}
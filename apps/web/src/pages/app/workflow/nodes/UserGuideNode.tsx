import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { TargetHandle, NodePlusButton, NodeHoverActions, NodeMenuWrapper, SourceHandle } from '../components/NodeCommon';
import { NODE_CONFIG } from '../constants';
import { 
    MoreHorizontal, 
    BookOpen,
    HelpCircle,
    MinusCircle,
    Plus
} from "lucide-react";

type Option = {
    id: string;
    value: string;
};

export default function UserGuideNode({ id, data, type }: { id: string, data: any, type?: string }) {
    // Separate menu state for each option handle
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);
    
    // Options state
    const [options, setOptions] = useState<Option[]>([
        { id: 'opt-1', value: 'Confirm' },
        { id: 'opt-2', value: 'Cancel' },
    ]);
    
    const config = NODE_CONFIG['userGuide'];
    const Icon = config.icon;

    const handleAddOption = () => {
        const newId = `opt-${Date.now()}`;
        setOptions([...options, { id: newId, value: '' }]);
    };

    const handleRemoveOption = (optId: string) => {
        setOptions(options.filter(o => o.id !== optId));
    };

    const handleOptionChange = (optId: string, newValue: string) => {
        setOptions(options.map(o => o.id === optId ? { ...o, value: newValue } : o));
    };

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
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{config.description}</p>
                    </div>
                </CardHeader>

                <CardContent className="p-4 space-y-6">
                    {/* Description Text */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <span className="text-sm font-medium text-slate-700">说明文字</span>
                                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                            </div>
                            <div className="text-xs text-slate-400">输入'/'可选变量</div>
                        </div>
                        <div className="relative">
                            <Textarea 
                                className="w-full h-24 p-3 text-sm bg-slate-50 border border-slate-200 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-400 leading-relaxed"
                                placeholder={`例如：
冰箱里是否有西红柿？`}
                            />
                        </div>
                    </div>

                    {/* Options List */}
                    <div className="space-y-3">
                        {options.map((option, index) => (
                            <div key={option.id} className="relative">
                                <div className="flex items-center gap-2 mb-1">
                                    <MinusCircle 
                                        className="w-4 h-4 text-slate-400 cursor-pointer hover:text-red-500"
                                        onClick={() => handleRemoveOption(option.id)}
                                    />
                                    <span className="text-sm text-slate-700 font-medium">选项{index + 1}</span>
                                </div>
                                <div className="relative group/item">
                                    <Input 
                                        className="h-9 text-sm bg-slate-50 border-slate-200 focus:ring-emerald-500 pr-8"
                                        value={option.value}
                                        onChange={(e) => handleOptionChange(option.id, e.target.value)}
                                        placeholder="输入选项内容"
                                    />
                                    {/* Source Handle for this option */}
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10">
                                        <SourceHandle id={option.id} className="opacity-0 group-hover/item:opacity-100" style={{ right: 0 }} />
                                    </div>
                                    {/* Add Node Button for this option */}
                                    <NodePlusButton 
                                        isMenuOpen={activeMenuId === option.id} 
                                        onClick={() => setActiveMenuId(activeMenuId === option.id ? null : option.id)}
                                        handleId={`plus-${option.id}`}
                                        className="!right-[-28px]"
                                    />
                                    
                                    <NodeMenuWrapper 
                                        isOpen={activeMenuId === option.id}
                                        onClose={() => setActiveMenuId(null)}
                                        onSelect={(type) => {
                                            if (data.onAddNode) {
                                                // Pass the option ID as the source handle ID
                                                data.onAddNode(type, id, option.id);
                                            }
                                            setActiveMenuId(null);
                                        }}
                                    />
                                </div>
                            </div>
                        ))}

                        <Button 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                            onClick={handleAddOption}
                        >
                            <Plus className="w-4 h-4" />
                            添加选项
                        </Button>
                    </div>

                    {/* Output Section */}
                    <div>
                        <div className="flex items-center mb-2">
                            <div className="w-1 h-3.5 bg-emerald-500 rounded-full mr-2"></div>
                            <span className="font-bold text-sm text-slate-700">输出</span>
                        </div>
                        
                        <div className="relative">
                            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <span className="text-red-500 font-bold">*</span>
                                    <span className="text-sm text-slate-600">选择结果</span>
                                    <span className="text-xs text-slate-400 bg-slate-100 px-1.5 rounded">String</span>
                                </div>
                            </div>
                            {/* This is just a visual output, or maybe a default handle? 
                                Usually user selection IS the flow control. 
                                But maybe we need a handle for the variable itself?
                                The image shows "Select Result" string.
                                I'll add a SourceHandle for it just in case, or leave it visual.
                                If it's just a variable, it might not need a handle unless variables are connected.
                                In FastGPT, variables are usually referenced, not connected via edges.
                                So I will NOT put a handle here for now, unless requested.
                                But wait, `ExtractContentNode` has handles for outputs.
                                Let's check `ExtractContentNode`.
                            */}
                        </div>
                    </div>

                </CardContent>

                <TargetHandle />
            </Card>

            <NodeHoverActions />
            
            {/* Main Node Plus Button - usually adds to 'source' handle, but here we have specific handles. 
                Maybe we don't need the main plus button if all outputs are via options?
                But for consistency, maybe keep it or hide it.
                If I hide it, I remove NodePlusButton and NodeMenuWrapper at root level.
                However, usually there's a default "source" handle.
                In UserGuide, the flow MUST go through one of the options.
                So I will omit the main root-level NodePlusButton.
            */}
        </div>
    );
}

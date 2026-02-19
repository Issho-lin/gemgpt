import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { TargetHandle, NodePlusButton, NodeHoverActions, NodeMenuWrapper, SourceHandle } from '../components/NodeCommon';
import { NODE_CONFIG } from '../constants';
import { 
    MoreHorizontal, 
    BookOpen,
    HelpCircle,
    MinusCircle,
    Plus,
    Trash2
} from "lucide-react";

type FormField = {
    id: string;
    label: string;
    description: string;
    required: boolean;
};

export default function FormInputNode({ id, data, type }: { id: string, data: any, type?: string }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // Form fields state
    const [fields, setFields] = useState<FormField[]>([
        { id: 'field-1', label: '', description: '', required: true },
    ]);
    
    const config = NODE_CONFIG['formInput'];
    const Icon = config.icon;

    const handleAddField = () => {
        const newId = `field-${Date.now()}`;
        setFields([...fields, { id: newId, label: '', description: '', required: false }]);
    };

    const handleRemoveField = (fieldId: string) => {
        setFields(fields.filter(f => f.id !== fieldId));
    };

    const handleFieldChange = (fieldId: string, key: keyof FormField, value: any) => {
        setFields(fields.map(f => f.id === fieldId ? { ...f, [key]: value } : f));
    };

    return (
        <div className="group relative flex items-start gap-2">
            <Card className="w-[460px] border-none shadow-md bg-white ring-1 ring-slate-200 group-hover:ring-2 group-hover:ring-blue-500/50 transition-all relative">
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
                    {/* Input Section Header */}
                    <div className="flex items-center">
                        <div className="w-1 h-3.5 bg-blue-500 rounded-full mr-2"></div>
                        <span className="font-bold text-sm text-slate-700">输入</span>
                    </div>

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
                                className="w-full h-24 p-3 text-sm bg-slate-50 border border-slate-200 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder:text-slate-400 leading-relaxed"
                                placeholder={`例如：
补充您的信息`}
                            />
                        </div>
                    </div>

                    {/* Form Configuration */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700">表单配置</span>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 text-xs text-slate-500 hover:text-purple-600 px-2"
                                onClick={handleAddField}
                            >
                                <Plus className="w-3 h-3 mr-1" />
                                新增输入
                            </Button>
                        </div>

                        <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-slate-100 border-b border-slate-200 text-xs text-slate-500 font-medium">
                                <div className="col-span-4">标题</div>
                                <div className="col-span-5">描述</div>
                                <div className="col-span-2 text-center">必填</div>
                                <div className="col-span-1 text-center">操作</div>
                            </div>
                            
                            {/* Table Body */}
                            <div className="divide-y divide-slate-100">
                                {fields.map((field) => (
                                    <div key={field.id} className="grid grid-cols-12 gap-2 px-3 py-2 items-center group/row hover:bg-white transition-colors">
                                        <div className="col-span-4">
                                            <Input 
                                                className="h-7 text-xs px-2 border-slate-200 focus:border-purple-500 focus:ring-0"
                                                value={field.label}
                                                onChange={(e) => handleFieldChange(field.id, 'label', e.target.value)}
                                                placeholder="输入标题"
                                            />
                                        </div>
                                        <div className="col-span-5">
                                            <Input 
                                                className="h-7 text-xs px-2 border-slate-200 focus:border-purple-500 focus:ring-0"
                                                value={field.description}
                                                onChange={(e) => handleFieldChange(field.id, 'description', e.target.value)}
                                                placeholder="输入描述"
                                            />
                                        </div>
                                        <div className="col-span-2 flex justify-center">
                                            <Checkbox 
                                                checked={field.required}
                                                onCheckedChange={(checked) => handleFieldChange(field.id, 'required', checked)}
                                                className="w-4 h-4 border-slate-300 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                                            />
                                        </div>
                                        <div className="col-span-1 flex justify-center">
                                            <Trash2 
                                                className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-red-500 transition-colors opacity-0 group-hover/row:opacity-100"
                                                onClick={() => handleRemoveField(field.id)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Output Section */}
                    <div>
                        <div className="flex items-center mb-2">
                            <div className="w-1 h-3.5 bg-blue-500 rounded-full mr-2"></div>
                            <span className="font-bold text-sm text-slate-700">输出</span>
                        </div>
                        
                        <div className="relative">
                            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-purple-400 transition-colors">
                                <div className="flex items-center gap-2">
                                    <span className="text-red-500 font-bold">*</span>
                                    <span className="text-sm text-slate-600">用户完整输入结果</span>
                                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-xs text-slate-400 bg-slate-100 px-1.5 rounded">Object</span>
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

import { useState, useCallback } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { TargetHandle, NodePlusButton, NodeHoverActions, NodeMenuWrapper } from '../components/NodeCommon';
import { NODE_CONFIG } from '../constants';
import { 
    MoreHorizontal, 
    BookOpen,
    ChevronDown,
    Plus,
    Trash2,
    Type
} from "lucide-react";

interface UpdateItem {
    id: string;
    variable: string;
    value: string;
}

export default function UpdateVarNode({ id, data, type }: { id: string, data: any, type?: string }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [items, setItems] = useState<UpdateItem[]>([
        { id: '1', variable: '', value: '' }
    ]);
    
    const config = NODE_CONFIG['updateVar'];
    const Icon = config.icon;

    const handleAddItem = useCallback(() => {
        setItems(prev => [...prev, { id: Date.now().toString(), variable: '', value: '' }]);
    }, []);

    const handleDeleteItem = useCallback((itemId: string) => {
        setItems(prev => prev.filter(item => item.id !== itemId));
    }, []);

    return (
        <div className="group relative flex items-start gap-2">
            <Card className="w-[400px] border-none shadow-md bg-white ring-1 ring-slate-200 group-hover:ring-2 group-hover:ring-orange-500/50 transition-all relative">
                {/* Header */}
                <CardHeader className={cn("flex flex-row items-center space-y-0 p-4 rounded-t-lg border-b border-slate-100", config.headerGradient)}>
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mr-3 shrink-0", config.iconBg)}>
                        <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-bold text-slate-800">{config.label}</CardTitle>
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-orange-500">
                                    <BookOpen className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-orange-500">
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{config.description}</p>
                    </div>
                </CardHeader>

                <CardContent className="p-4 space-y-4">
                    <div className="space-y-3">
                        {items.map((item, index) => (
                            <div key={item.id} className="relative p-3 bg-slate-50 rounded-lg border border-slate-200 group/item hover:border-orange-300 transition-colors">
                                <div className="grid grid-cols-[60px_1fr] gap-2 items-center mb-2">
                                    <span className="text-sm text-slate-500 text-right">变量</span>
                                    <div className="flex items-center justify-between px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm text-slate-400 cursor-pointer hover:border-orange-400 transition-colors">
                                        <span>选择引用变量</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[60px_1fr] gap-2 items-center">
                                    <div className="flex items-center justify-end gap-1">
                                        <span className="text-sm text-slate-500">值</span>
                                        <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center text-white text-[10px] font-mono">T</div>
                                    </div>
                                    <Input className="h-8 bg-white" />
                                </div>
                                
                                {items.length > 1 && (
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="absolute -right-2 -top-2 h-6 w-6 bg-white border border-slate-200 rounded-full shadow-sm text-slate-400 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity"
                                        onClick={() => handleDeleteItem(item.id)}
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    <Button 
                        variant="outline" 
                        className="w-full border-dashed border-slate-300 text-slate-500 hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50"
                        onClick={handleAddItem}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        新增
                    </Button>
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

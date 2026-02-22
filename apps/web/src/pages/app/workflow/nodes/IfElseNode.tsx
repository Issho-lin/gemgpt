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
    ChevronDown,
    Plus,
    Trash2,
    Type
} from "lucide-react";

interface Condition {
    id: string;
    variable: string;
    operator: string;
    value: string;
}

interface Branch {
    id: string;
    label: string;
    conditions: Condition[];
}

export default function IfElseNode({ id, data }: { id: string, data: any, type?: string }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [branches, setBranches] = useState<Branch[]>([
        { 
            id: 'if', 
            label: 'IF', 
            conditions: [
                { id: 'c1', variable: '', operator: '', value: '' }
            ] 
        },
        { 
            id: 'else', 
            label: 'ELSE', 
            conditions: [] 
        }
    ]);
    
    const config = NODE_CONFIG['ifElse'];
    const Icon = config.icon;

    const handleAddCondition = useCallback((branchId: string) => {
        setBranches(prev => prev.map(branch => {
            if (branch.id === branchId) {
                return {
                    ...branch,
                    conditions: [
                        ...branch.conditions,
                        { id: Date.now().toString(), variable: '', operator: '', value: '' }
                    ]
                };
            }
            return branch;
        }));
    }, []);

    const handleAddBranch = useCallback(() => {
        setBranches(prev => {
            const newBranchId = Date.now().toString();
            // Insert before the last element (ELSE)
            const newBranches = [...prev];
            const elseBranch = newBranches.pop();
            newBranches.push({
                id: newBranchId,
                label: 'ELSE IF',
                conditions: [{ id: Date.now().toString(), variable: '', operator: '', value: '' }]
            });
            if (elseBranch) newBranches.push(elseBranch);
            return newBranches;
        });
    }, []);

    const handleDeleteBranch = useCallback((branchId: string) => {
        setBranches(prev => prev.filter(b => b.id !== branchId));
    }, []);

    const handleDeleteCondition = useCallback((branchId: string, conditionId: string) => {
        setBranches(prev => prev.map(branch => {
            if (branch.id === branchId) {
                return {
                    ...branch,
                    conditions: branch.conditions.filter(c => c.id !== conditionId)
                };
            }
            return branch;
        }));
    }, []);

    return (
        <div className="group relative flex items-start gap-2">
            <Card className="w-[600px] border-none shadow-md bg-white ring-1 ring-slate-200 group-hover:ring-2 group-hover:ring-emerald-500/50 transition-all relative">
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

                <CardContent className="p-4 space-y-4 bg-slate-50/50">
                    {branches.map((branch, index) => (
                        <div key={branch.id} className="relative group/branch">
                            <div className="bg-white rounded-lg border border-slate-200 p-4 hover:border-emerald-400 transition-colors">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-medium text-slate-700">{branch.label}</span>
                                    {branch.id !== 'if' && branch.id !== 'else' && (
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-6 w-6 text-slate-400 hover:text-red-500 opacity-0 group-hover/branch:opacity-100 transition-opacity"
                                            onClick={() => handleDeleteBranch(branch.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>

                                {branch.conditions.length > 0 && (
                                    <div className="space-y-2 mb-3">
                                        {branch.conditions.map((condition) => (
                                            <div key={condition.id} className="flex items-center gap-2 group/condition">
                                                <div className="flex-1 grid grid-cols-12 gap-2">
                                                    <div className="col-span-4">
                                                        <div className="h-9 flex items-center justify-between px-3 bg-white border border-slate-200 rounded-md text-sm text-slate-400 cursor-pointer hover:border-emerald-400 transition-colors">
                                                            <span>选择引用变量</span>
                                                            <ChevronDown className="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                    <div className="col-span-3">
                                                        <div className="h-9 flex items-center justify-between px-3 bg-white border border-slate-200 rounded-md text-sm text-slate-700 cursor-pointer hover:border-emerald-400 transition-colors">
                                                            <span>选择条件</span>
                                                            <ChevronDown className="w-4 h-4 text-slate-400" />
                                                        </div>
                                                    </div>
                                                    <div className="col-span-5 relative">
                                                        <div className="absolute left-0 top-0 bottom-0 w-9 flex items-center justify-center border-r border-slate-200">
                                                            <Type className="w-4 h-4 text-blue-500" />
                                                        </div>
                                                        <Input className="h-9 pl-10 text-sm" placeholder="输入值" />
                                                    </div>
                                                </div>
                                                {branch.conditions.length > 1 && (
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-8 w-8 text-slate-400 hover:text-red-500 shrink-0 opacity-0 group-hover/condition:opacity-100 transition-opacity"
                                                        onClick={() => handleDeleteCondition(branch.id, condition.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {branch.id !== 'else' && (
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 pl-1 pr-2 h-8"
                                        onClick={() => handleAddCondition(branch.id)}
                                    >
                                        <Plus className="w-4 h-4 mr-1" />
                                        添加条件
                                    </Button>
                                )}
                            </div>
                            
                            {/* Branch Source Handle */}
                            <SourceHandle 
                                id={`source-${branch.id}`} 
                                className="!top-1/2 -translate-y-1/2" 
                            />
                            
                            {/* Connector Line */}
                            {index < branches.length - 1 && (
                                <div className="absolute left-1/2 bottom-0 top-full w-px bg-slate-200 h-4 -translate-x-1/2 z-0" />
                            )}
                        </div>
                    ))}

                    <Button 
                        variant="outline" 
                        className="w-full border-dashed border-slate-300 text-slate-500 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"
                        onClick={handleAddBranch}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        添加分支
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

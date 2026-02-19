import { useState, useCallback, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SourceHandle, TargetHandle, NodePlusButton, NodeHoverActions, NodeMenuWrapper, NodeSectionHeader } from '../components/NodeCommon';
import { NODE_CONFIG } from '../constants';
import { ReactFlow, Background, useNodesState, useEdgesState, addEdge, type Node, type Edge, type Connection, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
    MoreHorizontal, 
    BookOpen,
    ChevronDown
} from "lucide-react";

// Import nodes for nested flow
import AIChatNode from './AIChatNode';
import DatasetSearchNode from './DatasetSearchNode';
import ExtractContentNode from './ExtractContentNode';
import ClassifyQuestionNode from './ClassifyQuestionNode';
import ToolNode from './ToolNode';
import UserGuideNode from './UserGuideNode';
import FormInputNode from './FormInputNode';
import ConcatStringNode from './ConcatStringNode';
import AnswerNode from './AnswerNode';
import ParseDocNode from './ParseDocNode';
import HttpRequestNode from './HttpRequestNode';
import IfElseNode from './IfElseNode';
import UpdateVarNode from './UpdateVarNode';
import RunCodeNode from './RunCodeNode';
import LoopStartNode from './LoopStartNode';
import LoopEndNode from './LoopEndNode';
import CustomEdge from '../components/CustomEdge';

const nodeTypes = {
  aiChat: AIChatNode,
  searchDataset: DatasetSearchNode,
  extractContent: ExtractContentNode,
  classifyQuestion: ClassifyQuestionNode,
  tool: ToolNode,
  userGuide: UserGuideNode,
  formInput: FormInputNode,
  concatString: ConcatStringNode,
  answer: AnswerNode,
  parseDoc: ParseDocNode,
  httpRequest: HttpRequestNode,
  ifElse: IfElseNode,
  updateVar: UpdateVarNode,
  runCode: RunCodeNode,
  loopStart: LoopStartNode,
  loopEnd: LoopEndNode
};

const edgeTypes = {
  custom: CustomEdge,
};

type BatchNodeData = {
    label: string;
    onAddNode?: (type: string, sourceNodeId: string, sourceHandleId?: string, direction?: 'right' | 'bottom') => void;
    [key: string]: any;
};

const initialNestedNodes: Node<BatchNodeData>[] = [
  { id: 'loop-start', type: 'loopStart', position: { x: 50, y: 50 }, data: { label: 'Start' } },
  { id: 'loop-end', type: 'loopEnd', position: { x: 50, y: 300 }, data: { label: 'End' } },
];

export default function BatchExecuteNode({ id, data }: { id: string, data: any }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // Always use batchExecute config for this node
    const config = NODE_CONFIG['batchExecute'];
    const Icon = config.icon;

    // Nested flow state
    const [nodes, setNodes, onNodesChange] = useNodesState<Node<BatchNodeData>>(initialNestedNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

    const onConnect = useCallback(
        (params: Connection) => {
             // If connected from a "plus-" handle, force it to use the main handle (strip "plus-")
            if (params.sourceHandle?.startsWith('plus-')) {
                // @ts-ignore
                params.sourceHandle = params.sourceHandle.replace('plus-', '');
            }
            // If connected to "plus-" (unlikely for source handles but just in case)
            if (params.targetHandle?.startsWith('plus-')) {
                return; // Don't allow connections to source handles
            }
            setEdges((eds) => addEdge({ ...params, type: 'custom', animated: false, style: { stroke: '#94a3b8', strokeWidth: 2 } }, eds));
        },
        [setEdges],
    );

    const onAddNode = useCallback(function onAddNodeCallback(type: string, sourceNodeId: string, sourceHandleId: string = 'source', direction: 'right' | 'bottom' = 'right') {
        const id = Date.now().toString();
        // @ts-ignore
        const label = NODE_CONFIG[type]?.label || 'New Node';
    
        setNodes((nds) => {
          const sourceNode = nds.find((n) => n.id === sourceNodeId);
          let position = { x: 900, y: 100 };
          
          if (sourceNode) {
            if (direction === 'bottom') {
                position = { x: sourceNode.position.x, y: sourceNode.position.y + 600 };
            } else {
                position = { x: sourceNode.position.x + 500, y: sourceNode.position.y };
            }
          }
    
          const newNode: Node<BatchNodeData> = {
            id,
            type,
            position,
            data: { label, onAddNode: onAddNodeCallback },
          };
    
          return nds.concat(newNode);
        });

        if (sourceNodeId) {
            setEdges((eds) => eds.concat({ 
                id: `e-${sourceNodeId}-${id}`, 
                source: sourceNodeId, 
                target: id,
                sourceHandle: sourceHandleId,
                targetHandle: 'target',
                type: 'custom',
                animated: false,
                style: { stroke: '#94a3b8', strokeWidth: 2 } 
            }));
        }
      }, [setNodes, setEdges]);

    // Inject onAddNode into initial nodes data if needed
    useEffect(() => {
        setNodes((nds) => nds.map(node => {
            if (node.data.onAddNode) return node;
            return {
                ...node,
                data: {
                    ...node.data,
                    onAddNode
                }
            };
        }));
    }, [onAddNode, setNodes]);

    // Calculate container width based on nested nodes
    const [containerWidth, setContainerWidth] = useState(800);

    useEffect(() => {
        if (nodes.length > 0) {
            // Find the rightmost node edge
            const rightMostX = Math.max(...nodes.map(n => {
                // Use measured width if available, otherwise estimate based on node type
                const width = n.measured?.width || (n.type === 'loopEnd' ? 300 : 400); 
                return n.position.x + width;
            }));
            
            // Base padding: 50px left padding + 50px right padding
            // Ensure minimum width of 800px
            const newWidth = Math.max(800, rightMostX + 100);
            
            setContainerWidth(newWidth);
        }
    }, [nodes]);

    return (
        <div className="group relative flex items-start gap-2">
            <Card 
                className="border-none shadow-md bg-white ring-1 ring-slate-200 group-hover:ring-2 group-hover:ring-purple-500/50 transition-all relative"
                style={{ width: `${containerWidth}px` }}
            >
                {/* Header */}
                <CardHeader className={cn("flex flex-row items-center space-y-0 p-4 rounded-t-lg border-b border-slate-100", config.headerGradient)}>
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mr-3 shrink-0", config.iconBg)}>
                        <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-bold text-slate-800">{config.label}</CardTitle>
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-purple-500">
                                    <BookOpen className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-purple-500">
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
                        <NodeSectionHeader title="输入" iconColor="bg-purple-500" />
                        
                        <div className="space-y-2">
                            <div className="flex items-center gap-1.5">
                                <span className="text-sm font-medium text-slate-700"><span className="text-red-500">*</span>数组</span>
                                <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">Array</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded-md hover:border-purple-400 cursor-pointer group/select">
                                <span className="text-sm text-slate-400">选择引用变量</span>
                                <ChevronDown className="w-4 h-4 text-slate-400 group-hover/select:text-purple-500" />
                            </div>
                        </div>
                    </div>

                    {/* Loop Body Section - Nested Canvas */}
                    <div>
                        <div className="flex items-center gap-1.5 mb-2">
                            <span className="text-sm font-medium text-slate-700"><span className="text-red-500">*</span>循环体</span>
                        </div>
                        
                        <div className="bg-slate-50/80 rounded-xl border border-slate-200 p-0 h-[600px] overflow-hidden relative">
                            <ReactFlowProvider>
                                <ReactFlow
                                    nodes={nodes}
                                    edges={edges}
                                    onNodesChange={onNodesChange}
                                    onEdgesChange={onEdgesChange}
                                    onConnect={onConnect}
                                    nodeTypes={nodeTypes}
                                    edgeTypes={edgeTypes}
                                    fitView
                                    fitViewOptions={{ padding: 0.5, maxZoom: 0.8 }}
                                    className="bg-slate-50"
                                    minZoom={0.1}
                                    maxZoom={1.5}
                                    panOnScroll
                                    selectionOnDrag
                                    panOnDrag={[1, 2]}
                                >
                                    <Background color="#e2e8f0" gap={20} size={1} />
                                </ReactFlow>
                            </ReactFlowProvider>
                        </div>
                    </div>

                    {/* Output Section */}
                    <div>
                        <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                            <span className="text-sm text-slate-700 font-medium">数组执行结果</span>
                            <span className="text-xs bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">Array</span>
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

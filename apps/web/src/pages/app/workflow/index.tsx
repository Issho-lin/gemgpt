import { useCallback, useEffect } from 'react';
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import SystemConfigNode from './nodes/SystemConfigNode';
import StartNode from './nodes/StartNode';
import AIChatNode from './nodes/AIChatNode';
import DatasetSearchNode from './nodes/DatasetSearchNode';
import ExtractContentNode from './nodes/ExtractContentNode';
import ClassifyQuestionNode from './nodes/ClassifyQuestionNode';
import ToolNode from './nodes/ToolNode';
import UserGuideNode from './nodes/UserGuideNode';
import FormInputNode from './nodes/FormInputNode';
import ConcatStringNode from './nodes/ConcatStringNode';
import AnswerNode from './nodes/AnswerNode';
import ParseDocNode from './nodes/ParseDocNode';
import HttpRequestNode from './nodes/HttpRequestNode';
import IfElseNode from './nodes/IfElseNode';
import UpdateVarNode from './nodes/UpdateVarNode';
import RunCodeNode from './nodes/RunCodeNode';
import BatchExecuteNode from './nodes/BatchExecuteNode';
import CustomEdge from './components/CustomEdge';
import Header from './components/Header';
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { NODE_CONFIG } from './constants';

const nodeTypes = {
  systemConfig: SystemConfigNode,
  start: StartNode,
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
  batchExecute: BatchExecuteNode,
  ...Object.keys(NODE_CONFIG).reduce((acc, key) => {
    if (!['aiChat', 'searchDataset', 'extractContent', 'classifyQuestion', 'tool', 'userGuide', 'formInput', 'concatString', 'answer', 'parseDoc', 'httpRequest', 'ifElse', 'updateVar', 'runCode', 'batchExecute'].includes(key)) {
        acc[key] = AIChatNode;
    }
    return acc;
  }, {} as Record<string, any>),
};

const edgeTypes = {
  custom: CustomEdge,
};

const initialNodes = [
  { id: '1', type: 'systemConfig', position: { x: 100, y: 100 }, data: { label: 'System Config' } },
  { id: '2', type: 'start', position: { x: 460, y: 100 }, data: { label: 'Start' } },
];
const initialEdges: any[] = [];

export default function WorkflowPage() {
  // @ts-ignore
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  // @ts-ignore
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => {
        // If connected from a "plus-" handle, force it to use the main handle (strip "plus-")
        if (params.sourceHandle?.startsWith('plus-')) {
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

      const newNode = {
        id,
        type,
        position,
        data: { 
            label,
            onAddNode: onAddNodeCallback
        },
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

  // Pass onAddNode to all non-system nodes
  useEffect(() => {
    setNodes((nds) => 
      nds.map((node) => {
        if (node.type !== 'systemConfig') {
          return {
            ...node,
            data: {
              ...node.data,
              onAddNode,
            },
          };
        }
        return node;
      })
    );
  }, [onAddNode, setNodes]);

  return (
    <div className="h-screen w-full flex flex-col bg-slate-50">
      <Header />
      <div className="flex-1 flex relative">
        {/* Sidebar Tools */}
        <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
            <Button size="icon" className="rounded-full h-10 w-10 bg-black text-white hover:bg-slate-800 shadow-lg">
                <Plus className="h-5 w-5" />
            </Button>
            <Button size="icon" variant="outline" className="rounded-full h-10 w-10 bg-white text-slate-500 hover:text-slate-900 shadow-sm border-slate-200">
                <Search className="h-5 w-5" />
            </Button>
        </div>

        <div className="flex-1 h-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            >
                <Background color="#aaa" gap={16} />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
      </div>
    </div>
  );
}

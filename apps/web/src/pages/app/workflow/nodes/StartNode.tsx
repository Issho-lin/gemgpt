import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Edit2 } from "lucide-react";
import { SourceHandle, NodePlusButton, NodeHoverActions, NodeMenuWrapper } from '../components/NodeCommon';

export default function StartNode({ id, data }: { id: string, data: any }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="group relative flex items-start gap-2">
      <Card className="w-[340px] border-none shadow-md bg-white group-hover:ring-2 group-hover:ring-blue-500/50 transition-all relative">
        <CardHeader className="flex flex-row items-center space-y-0 p-4 bg-blue-50/50 rounded-t-lg border-b border-blue-100/50">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center mr-3 shrink-0">
            <Play className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
                <CardTitle className="text-base font-bold text-slate-800">流程开始</CardTitle>
                <Edit2 className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-blue-500" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">这个节点没有介绍</p>
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-6">
          
          {/* Output Section */}
          <div>
              <div className="flex items-center mb-3">
                  <div className="w-1 h-3.5 bg-blue-500 rounded-full mr-2"></div>
                  <span className="font-bold text-sm text-slate-700">输出</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-between border border-slate-100">
                  <span className="text-sm text-slate-600">用户问题</span>
                  <span className="text-xs bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono">String</span>
              </div>
          </div>

          {/* Global Variables Section */}
          <div>
              <div className="flex items-center mb-3">
                  <div className="w-1 h-3.5 bg-blue-500 rounded-full mr-2"></div>
                  <span className="font-bold text-sm text-slate-700">全局变量</span>
              </div>
              <div className="space-y-3">
                  <VariableItem label="使用者 ID" type="String" required />
                  <VariableItem label="应用 ID" type="String" required />
                  <VariableItem label="当前对话 ID" type="String" required />
                  <VariableItem label="AI 回复的 ID" type="String" required />
                  <VariableItem label="历史记录" type="历史记录" required />
                  <VariableItem label="当前时间" type="String" required />
              </div>
          </div>

        </CardContent>
        
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

function VariableItem({ label, type, required }: { label: string, type: string, required?: boolean }) {
    return (
        <div className="flex items-center justify-between p-1">
             <div className="flex items-center">
                {required && <span className="text-red-500 mr-1">*</span>}
                <span className="text-sm text-slate-600">{label}</span>
             </div>
             <span className="text-xs bg-slate-100 border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded font-mono">{type}</span>
        </div>
    )
}

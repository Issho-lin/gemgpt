import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Search, FolderPlus, Import, Globe, Languages, Captions } from "lucide-react"

export default function WorkspacePage() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-white">
        <h1 className="text-xl font-bold text-slate-900">从模板新建</h1>
        <Button variant="ghost" className="text-slate-500 hover:text-slate-900 text-sm">
           隐藏模板
        </Button>
      </header>

      {/* Template Cards */}
      <div className="px-8 py-6 bg-slate-50/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <TemplateCard 
              icon={<div className="bg-purple-500 p-2 rounded-lg"><Globe className="text-white h-5 w-5" /></div>}
              title="问题分类 + 知识库"
              desc="先对用户的问题进行分类，再根据..."
           />
           <TemplateCard 
              icon={<div className="bg-yellow-500 p-2 rounded-lg"><Languages className="text-white h-5 w-5" /></div>}
              title="长文翻译专家"
              desc="使用专有名词知识库协助翻译，更..."
           />
           <TemplateCard 
              icon={<div className="bg-green-500 p-2 rounded-lg"><Captions className="text-white h-5 w-5" /></div>}
              title="长字幕反思翻译机器人"
              desc="利用 AI 自我反思提升翻译质量，..."
           />
        </div>
      </div>

      {/* Main Agent List Area */}
      <div className="flex-1 flex flex-col px-8 py-6 bg-white">
         <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-slate-900">Agent</h2>
            <div className="flex items-center gap-3">
               <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input placeholder="搜索 Agent" className="pl-9 h-9 bg-slate-50 border-slate-200" />
               </div>
               <Button variant="outline" size="sm" className="h-9 gap-2 border-slate-200 bg-white hover:bg-slate-50">
                  <FolderPlus size={16} />
                  文件夹
               </Button>
               <Button variant="outline" size="sm" className="h-9 gap-2 border-slate-200 bg-white hover:bg-slate-50">
                  <Import size={16} />
                  导入
               </Button>
            </div>
         </div>

         {/* Empty State */}
         <div className="flex-1 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-blue-50/50 to-white border border-dashed border-blue-200/50 m-4 min-h-[300px]">
            <div className="flex flex-col items-center gap-6">
               <div className="flex items-center gap-2 text-xl font-bold text-slate-700">
                  <span className="text-blue-500 text-2xl">✦</span>
                  创建你的第一个 Agent
               </div>
               <Button className="h-14 w-64 rounded-xl border-2 border-dashed border-blue-300 bg-white text-blue-500 hover:bg-blue-50 hover:border-blue-400 transition-all shadow-sm">
                  <Plus size={32} />
               </Button>
            </div>
         </div>
      </div>
    </div>
  )
}

function TemplateCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
   return (
      <Card className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white group">
         <CardContent className="p-5 flex items-start gap-4">
            {icon}
            <div className="flex-1 space-y-1">
               <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">{title}</h3>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                        <path d="M7 7h10v10" />
                        <path d="M7 17 17 7" />
                     </svg>
                  </div>
               </div>
               <p className="text-sm text-slate-500 line-clamp-1">{desc}</p>
            </div>
         </CardContent>
      </Card>
   )
}

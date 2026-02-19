import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
    MessageSquare, 
    FileText, 
    Mic, 
    Clock, 
    Zap, 
    Keyboard, 
    HelpCircle,
    AudioWaveform,
    Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SystemConfigNode({ data }: { data: any }) {
  return (
    <Card className="w-[340px] border-none shadow-md bg-white overflow-hidden">
      {/* Header */}
      <CardHeader className="flex flex-row items-center space-y-0 p-4 bg-pink-50/50 border-b border-pink-100/50">
        <div className="w-8 h-8 rounded-lg bg-pink-500 flex items-center justify-center mr-3 shrink-0">
          <MessageSquare className="w-5 h-5 text-white" />
        </div>
        <div>
          <CardTitle className="text-base font-bold text-slate-800 flex items-center">
            系统配置
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">可以配置应用的系统参数</p>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-6">
        
        {/* Special Item: Dialogue Opening */}
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center">
                    <MessageSquare className="w-3.5 h-3.5 text-pink-500" />
                </div>
                <span className="text-sm font-medium text-slate-700">对话开场白</span>
                <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-help" />
            </div>
            
            <div className="relative">
                <Textarea 
                    className="min-h-[100px] text-xs bg-slate-50 border-slate-200 resize-none focus-visible:ring-1 focus-visible:ring-pink-500"
                    placeholder={`每次对话开始前，发送一个初始内容。支持标准 Markdown 语法，可使用的额外标记：
[快捷按键]：用户点击后可以直接发送该问题`}
                />
            </div>
        </div>

        {/* List Items */}
        <div className="space-y-5">
            <ConfigItem 
                icon={<div className="text-blue-500 font-bold text-xs">{`{x}`}</div>}
                iconBg="bg-blue-100"
                label="全局变量"
                action={<span className="text-slate-600 hover:text-blue-600 font-medium">+ 新增</span>}
            />

            <ConfigItem 
                icon={<FileText className="w-3.5 h-3.5 text-emerald-500" />}
                iconBg="bg-emerald-100"
                label="文件上传"
                action={<span className="text-slate-500">关闭</span>}
            />

            <ConfigItem 
                icon={<AudioWaveform className="w-3.5 h-3.5 text-blue-500" />}
                iconBg="bg-blue-100"
                label="语音播放"
                action={<span className="text-slate-500">浏览器自带(免费)</span>}
            />

            <ConfigItem 
                icon={<Mic className="w-3.5 h-3.5 text-orange-500" />}
                iconBg="bg-orange-100"
                label="语音输入"
                action={<span className="text-slate-500">关闭</span>}
            />

            <ConfigItem 
                icon={<Sparkles className="w-3.5 h-3.5 text-blue-500" />}
                iconBg="bg-blue-100"
                label="猜你相问"
                action={<span className="text-slate-500">关闭</span>}
            />

            <ConfigItem 
                icon={<Clock className="w-3.5 h-3.5 text-red-500" />}
                iconBg="bg-red-100"
                label="定时执行"
                action={<span className="text-slate-500">未开启</span>}
            />

            <ConfigItem 
                icon={<Zap className="w-3.5 h-3.5 text-purple-500" />}
                iconBg="bg-purple-100"
                label="自动执行"
                action={<span className="text-slate-500">关闭</span>}
            />

            <ConfigItem 
                icon={<Keyboard className="w-3.5 h-3.5 text-purple-500" />}
                iconBg="bg-purple-100"
                label="输入引导"
                action={<span className="text-slate-500">关闭</span>}
            />
        </div>

      </CardContent>
    </Card>
  );
}

function ConfigItem({ icon, iconBg, label, action }: { icon: React.ReactNode, iconBg: string, label: string, action: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-2">
                <div className={cn("w-6 h-6 rounded-full flex items-center justify-center shrink-0", iconBg)}>
                    {icon}
                </div>
                <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-slate-700">{label}</span>
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </div>
            <div className="text-xs px-2 py-1 rounded-md transition-colors hover:bg-slate-100">
                {action}
            </div>
        </div>
    )
}

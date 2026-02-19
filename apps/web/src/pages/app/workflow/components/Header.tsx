import { useNavigate } from "react-router-dom";
import {
    ChevronLeft,
    History,
    Play
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WorkflowHeader() {
    const navigate = useNavigate();

    return (
        <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-10 relative">
            {/* Left: Back & Title */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-500 hover:text-slate-900"
                    onClick={() => navigate(-1)}
                >
                    <ChevronLeft className="h-5 w-5" />
                </Button>

                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                            <path d="M7 7h10" />
                            <path d="M7 12h10" />
                            <path d="M7 17h10" />
                        </svg>
                    </div>
                    <div className="flex items-center gap-1 cursor-pointer hover:bg-slate-50 px-2 py-1 rounded-md transition-colors">
                        <span className="font-bold text-slate-900">测试工作流</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 ml-2"></div>
                        <span className="text-xs text-slate-400">未保存</span>
                        <ChevronLeft className="h-4 w-4 rotate-270 text-slate-400 ml-1" />
                    </div>
                </div>
            </div>

            {/* Center: Tabs */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center bg-slate-100 p-1 rounded-lg">
                <Button variant="ghost" size="sm" className="h-7 px-4 bg-white shadow-sm text-slate-900 rounded-md">
                    应用配置
                </Button>
                <Button variant="ghost" size="sm" className="h-7 px-4 text-slate-500 hover:text-slate-900">
                    发布渠道
                </Button>
                <Button variant="ghost" size="sm" className="h-7 px-4 text-slate-500 hover:text-slate-900">
                    对话日志
                </Button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full border-slate-200">
                    <History className="h-4 w-4 text-slate-600" />
                </Button>

                <Button variant="outline" size="sm" className="h-8 gap-2 border-slate-200 text-slate-700">
                    <Play className="h-3.5 w-3.5" />
                    运行
                </Button>

                <Button size="sm" className="h-8 gap-2 bg-black text-white hover:bg-slate-800">
                    保存
                    <ChevronLeft className="h-3 w-3 -rotate-90" />
                </Button>
            </div>
        </header>
    );
}

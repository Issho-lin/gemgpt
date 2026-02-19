import { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { 
    LayoutGrid,
    Wrench,
    User
} from "lucide-react";
import { NODE_CONFIG, MENU_ITEMS } from "../constants";

type TabKey = 'basic' | 'system' | 'tools' | 'agent';

export default function NodeMenu({ onClose, onSelect }: { onClose?: () => void; onSelect?: (type: string) => void }) {
    const [activeTab, setActiveTab] = useState<TabKey>('basic');

    const handleSelect = (type: string) => {
        if (onSelect) {
            onSelect(type);
        }
        if (onClose) {
            onClose();
        }
    };

    const basicMenuItems = MENU_ITEMS.map(section => ({
        category: section.category,
        items: section.items.map(key => ({
            ...NODE_CONFIG[key],
            type: key
        }))
    }));

    const tabs = [
        { key: 'basic', label: '基础功能', icon: LayoutGrid },
        { key: 'tools', label: '我的工具', icon: Wrench },
        { key: 'agent', label: 'Agent', icon: User },
    ];

    return (
        <Card 
            className="w-[400px] h-[520px] bg-white shadow-xl border-slate-200 flex flex-col overflow-hidden nopan nowheel nodrag"
            onWheel={(e) => e.stopPropagation()}
        >
            {/* Tabs Header */}
            <div className="flex items-center p-2 border-b border-slate-100 bg-slate-50/50 gap-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as TabKey)}
                        className={cn(
                            "flex items-center justify-center flex-1 gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                            activeTab === tab.key 
                                ? "bg-white text-blue-600 shadow" 
                                : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                        )}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {activeTab === 'basic' ? (
                    <div className="space-y-6">
                        {basicMenuItems.map((section, idx) => (
                            <div key={idx}>
                                <h3 className="text-sm font-medium text-slate-500 mb-3 pl-1">{section.category}</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {section.items.map((item, itemIdx) => (
                                        <div 
                                            key={itemIdx}
                                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer group transition-colors border border-transparent hover:border-slate-100"
                                            onClick={() => handleSelect(item.type)}
                                        >
                                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", item.bgColor)}>
                                                <item.icon className={cn("w-5 h-5", item.color)} />
                                            </div>
                                            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 whitespace-nowrap">
                                                {item.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm">
                        暂无内容
                    </div>
                )}
            </div>
        </Card>
    );
}

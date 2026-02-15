import { useState } from "react"
import {
    Bot,
    Grid,
    MessageSquare,
    Workflow,
    Wrench,
    LayoutTemplate,
    Server,
    ChevronDown,
    ChevronRight,
    Globe,
    Sparkles,
    Image,
    Search,
    Smile,
    Briefcase
} from "lucide-react"
import { cn } from "@/lib/utils"
import { WorkspaceCategoryType, WORKSPACE_CATEGORY_LABELS } from "@/constants/workspace"
import { useNavigate } from "react-router-dom"

export default function WorkspaceSidebar({ 
    activeItem, 
    onSelect 
}: { 
    activeItem?: WorkspaceCategoryType
    onSelect?: (item: WorkspaceCategoryType) => void
} = {}) {
    const navigate = useNavigate()
    const [expandedGroups, setExpandedGroups] = useState<string[]>(["Agent", "我的工具"])
    
    // Use activeItem from props (controlled by URL in parent)
    const currentActive = activeItem
    
    const handleSelect = (item: WorkspaceCategoryType) => {
        if (onSelect) {
            onSelect(item)
            return
        }

        let targetPath = '/app/workspace/agents'
        if (item.startsWith('tool_')) {
            targetPath = '/app/workspace/tools'
        } else if (item.startsWith('template_')) {
            targetPath = '/app/workspace/templates'
        } else if (item === WorkspaceCategoryType.mcp_services) {
            navigate('/app/workspace/mcp')
            return
        }
        
        navigate(`${targetPath}?type=${item}`)
    }

    const toggleGroup = (group: string) => {
        setExpandedGroups(prev => 
            prev.includes(group) 
                ? prev.filter(g => g !== group)
                : [...prev, group]
        )
    }

    return (
        <aside className="w-[240px] h-full bg-white border-r border-slate-100 flex flex-col py-4 overflow-y-auto">
            <div className="px-4 mb-2">
                <h2 className="text-xs font-medium text-slate-500 mb-2">工作台</h2>
            </div>
            
            <div className="flex flex-col gap-1 px-3">
                {/* Agent Group */}
                <SidebarGroup 
                    title="Agent" 
                    icon={<Bot size={18} />} 
                    expanded={expandedGroups.includes("Agent")}
                    onToggle={() => toggleGroup("Agent")}
                >
                    <SidebarItem 
                        icon={<Grid size={16} />} 
                        label={WORKSPACE_CATEGORY_LABELS[WorkspaceCategoryType.all]}
                        active={currentActive === WorkspaceCategoryType.all}
                        onClick={() => handleSelect(WorkspaceCategoryType.all)}
                    />
                    <SidebarItem 
                        icon={<MessageSquare size={16} />} 
                        label={WORKSPACE_CATEGORY_LABELS[WorkspaceCategoryType.chat_agent]}
                        active={currentActive === WorkspaceCategoryType.chat_agent}
                        onClick={() => handleSelect(WorkspaceCategoryType.chat_agent)}
                    />
                    <SidebarItem 
                        icon={<Workflow size={16} />} 
                        label={WORKSPACE_CATEGORY_LABELS[WorkspaceCategoryType.workflow]}
                        active={currentActive === WorkspaceCategoryType.workflow}
                        onClick={() => handleSelect(WorkspaceCategoryType.workflow)}
                    />
                </SidebarGroup>

                {/* Other Groups */}
                <SidebarGroup 
                    title="我的工具" 
                    icon={<Wrench size={18} />} 
                    expanded={expandedGroups.includes("我的工具")}
                    onToggle={() => toggleGroup("我的工具")}
                >
                    <SidebarItem 
                        icon={<Grid size={16} />} 
                        label={WORKSPACE_CATEGORY_LABELS[WorkspaceCategoryType.tool_all]}
                        active={currentActive === WorkspaceCategoryType.tool_all}
                        onClick={() => handleSelect(WorkspaceCategoryType.tool_all)}
                    />
                    <SidebarItem 
                        icon={<Workflow size={16} />} 
                        label={WORKSPACE_CATEGORY_LABELS[WorkspaceCategoryType.tool_workflow]}
                        active={currentActive === WorkspaceCategoryType.tool_workflow}
                        onClick={() => handleSelect(WorkspaceCategoryType.tool_workflow)}
                    />
                    <SidebarItem 
                        icon={<Globe size={16} />} 
                        label={WORKSPACE_CATEGORY_LABELS[WorkspaceCategoryType.tool_http]}
                        active={currentActive === WorkspaceCategoryType.tool_http}
                        onClick={() => handleSelect(WorkspaceCategoryType.tool_http)}
                    />
                    <SidebarItem 
                        icon={<Server size={16} />} 
                        label={WORKSPACE_CATEGORY_LABELS[WorkspaceCategoryType.tool_mcp]}
                        active={currentActive === WorkspaceCategoryType.tool_mcp}
                        onClick={() => handleSelect(WorkspaceCategoryType.tool_mcp)}
                    />
                </SidebarGroup>

                <SidebarGroup 
                    title="模板市场" 
                    icon={<LayoutTemplate size={18} />} 
                    expanded={expandedGroups.includes("模板市场")}
                    onToggle={() => toggleGroup("模板市场")}
                >
                    <SidebarItem 
                        icon={<Sparkles size={16} />} 
                        label={WORKSPACE_CATEGORY_LABELS[WorkspaceCategoryType.template_recommended]}
                        active={currentActive === WorkspaceCategoryType.template_recommended}
                        onClick={() => handleSelect(WorkspaceCategoryType.template_recommended)}
                    />
                    <SidebarItem 
                        icon={<Image size={16} />} 
                        label={WORKSPACE_CATEGORY_LABELS[WorkspaceCategoryType.template_image_generation]}
                        active={currentActive === WorkspaceCategoryType.template_image_generation}
                        onClick={() => handleSelect(WorkspaceCategoryType.template_image_generation)}
                    />
                    <SidebarItem 
                        icon={<Search size={16} />} 
                        label={WORKSPACE_CATEGORY_LABELS[WorkspaceCategoryType.template_web_search]}
                        active={currentActive === WorkspaceCategoryType.template_web_search}
                        onClick={() => handleSelect(WorkspaceCategoryType.template_web_search)}
                    />
                    <SidebarItem 
                        icon={<Smile size={16} />} 
                        label={WORKSPACE_CATEGORY_LABELS[WorkspaceCategoryType.template_roleplay]}
                        active={currentActive === WorkspaceCategoryType.template_roleplay}
                        onClick={() => handleSelect(WorkspaceCategoryType.template_roleplay)}
                    />
                    <SidebarItem 
                        icon={<Briefcase size={16} />} 
                        label={WORKSPACE_CATEGORY_LABELS[WorkspaceCategoryType.template_office_services]}
                        active={currentActive === WorkspaceCategoryType.template_office_services}
                        onClick={() => handleSelect(WorkspaceCategoryType.template_office_services)}
                    />
                </SidebarGroup>

                {/* MCP Services Item */}
                <div 
                    className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                        currentActive === WorkspaceCategoryType.mcp_services && "bg-blue-50 text-blue-600 hover:bg-blue-50 hover:text-blue-600"
                    )}
                    onClick={() => handleSelect(WorkspaceCategoryType.mcp_services)}
                >
                    <Server size={18} />
                    <span className="text-sm font-medium">{WORKSPACE_CATEGORY_LABELS[WorkspaceCategoryType.mcp_services]}</span>
                </div>
            </div>
        </aside>
    )
}

function SidebarGroup({ 
    title, 
    icon, 
    expanded, 
    onToggle, 
    children 
}: { 
    title: string
    icon: React.ReactNode
    expanded: boolean
    onToggle: () => void
    children?: React.ReactNode
}) {
    return (
        <div className="flex flex-col">
            <div 
                className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors group"
                onClick={onToggle}
            >
                <div className="flex items-center gap-2">
                    {icon}
                    <span className="text-sm font-medium">{title}</span>
                </div>
                {expanded ? (
                    <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                ) : (
                    <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                )}
            </div>
            
            {expanded && children && (
                <div className="flex flex-col gap-1 mt-1 mb-2 pl-4 border-l border-slate-100 ml-5">
                    {children}
                </div>
            )}
        </div>
    )
}

function SidebarItem({ 
    icon, 
    label, 
    active, 
    onClick 
}: { 
    icon?: React.ReactNode
    label: string
    active?: boolean
    onClick?: () => void
}) {
    return (
        <div 
            className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors",
                active 
                    ? "bg-blue-50 text-blue-600" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            )}
            onClick={onClick}
        >
            {icon ? icon : <div className="w-4 h-4" />}
            <span className="text-sm">{label}</span>
        </div>
    )
}
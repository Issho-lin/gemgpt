export const WorkspaceCategoryType = {
    all: "all",
    chat_agent: "chat_agent",
    workflow: "workflow",
    my_tools: "my_tools",
    template_market: "template_market",
    mcp_services: "mcp_services",
    // My Tools
    tool_all: "tool_all",
    tool_workflow: "tool_workflow",
    tool_http: "tool_http",
    tool_mcp: "tool_mcp",
    // Template Market
    template_recommended: "template_recommended",
    template_image_generation: "template_image_generation",
    template_web_search: "template_web_search",
    template_roleplay: "template_roleplay",
    template_office_services: "template_office_services"
} as const

export type WorkspaceCategoryType = typeof WorkspaceCategoryType[keyof typeof WorkspaceCategoryType]

export const WORKSPACE_CATEGORY_LABELS: Record<WorkspaceCategoryType, string> = {
    [WorkspaceCategoryType.all]: "全部",
    [WorkspaceCategoryType.chat_agent]: "对话 Agent",
    [WorkspaceCategoryType.workflow]: "工作流",
    [WorkspaceCategoryType.my_tools]: "我的工具",
    [WorkspaceCategoryType.template_market]: "模板市场",
    [WorkspaceCategoryType.mcp_services]: "MCP 服务",
    // My Tools Labels
    [WorkspaceCategoryType.tool_all]: "全部",
    [WorkspaceCategoryType.tool_workflow]: "工作流工具",
    [WorkspaceCategoryType.tool_http]: "HTTP 工具",
    [WorkspaceCategoryType.tool_mcp]: "MCP 工具",
    // Template Market Labels
    [WorkspaceCategoryType.template_recommended]: "推荐",
    [WorkspaceCategoryType.template_image_generation]: "图片生成",
    [WorkspaceCategoryType.template_web_search]: "联网搜索",
    [WorkspaceCategoryType.template_roleplay]: "角色扮演",
    [WorkspaceCategoryType.template_office_services]: "办公服务"
}

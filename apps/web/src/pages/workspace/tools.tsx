import WorkspaceToolContent from "@/components/pages/workspace/WorkspaceToolContent"
import { WorkspaceCategoryType } from "@/constants/workspace"
import { useSearchParams } from "react-router-dom"

export default function WorkspaceToolPage() {
  const [searchParams] = useSearchParams()
  const type = searchParams.get("type")
  
  // Default to tool_all if no type provided, or cast type to WorkspaceCategoryType
  const activeItem = (type as WorkspaceCategoryType) || WorkspaceCategoryType.tool_all

  return (
    <>
        {(activeItem === WorkspaceCategoryType.tool_all || 
          activeItem === WorkspaceCategoryType.tool_workflow || 
          activeItem === WorkspaceCategoryType.tool_http || 
          activeItem === WorkspaceCategoryType.tool_mcp) ? (
          <WorkspaceToolContent category={activeItem} />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">
            {activeItem} 页面开发中...
          </div>
        )}
    </>
  )
}

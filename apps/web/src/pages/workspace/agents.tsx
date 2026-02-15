import WorkspaceAgentContent from "@/components/pages/workspace/WorkspaceAgentContent"
import { WorkspaceCategoryType } from "@/constants/workspace"
import { useSearchParams } from "react-router-dom"

export default function WorkspaceAgentsPage() {
  const [searchParams] = useSearchParams()
  const type = searchParams.get("type")
  const activeItem = (type as WorkspaceCategoryType) || WorkspaceCategoryType.all

  return (
    <>
        {activeItem === WorkspaceCategoryType.all && (
          <WorkspaceAgentContent />
        )}

        {activeItem === WorkspaceCategoryType.chat_agent && (
          <WorkspaceAgentContent category={WorkspaceCategoryType.chat_agent} />
        )}

        {activeItem === WorkspaceCategoryType.workflow && (
          <WorkspaceAgentContent category={WorkspaceCategoryType.workflow} />
        )}
        
        {activeItem !== WorkspaceCategoryType.all && 
         activeItem !== WorkspaceCategoryType.chat_agent && 
         activeItem !== WorkspaceCategoryType.workflow && 
         !activeItem.startsWith("tool_") && (
          <div className="flex items-center justify-center h-full text-slate-400">
            {activeItem} 页面开发中...
          </div>
        )}
    </>
  )
}

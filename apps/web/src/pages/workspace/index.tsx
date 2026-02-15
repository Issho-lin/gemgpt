import WorkspaceSidebar from "@/components/pages/workspace/WorkspaceSidebar"
import { WorkspaceCategoryType } from "@/constants/workspace"
import { useSearchParams, useLocation, Outlet } from "react-router-dom"

export default function WorkspaceLayout() {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const type = searchParams.get("type")
  
  // Determine active item based on URL
  let activeItem: WorkspaceCategoryType = WorkspaceCategoryType.all
  
  if (type) {
    activeItem = type as WorkspaceCategoryType
  } else if (location.pathname.includes('/tools')) {
    activeItem = WorkspaceCategoryType.tool_all
  } else if (location.pathname.includes('/templates')) {
    activeItem = WorkspaceCategoryType.template_recommended
  } else if (location.pathname.includes('/mcp')) {
    activeItem = WorkspaceCategoryType.mcp_services
  } else {
    activeItem = WorkspaceCategoryType.all
  }

  return (
    <div className="flex h-screen w-full bg-slate-50">
      <WorkspaceSidebar activeItem={activeItem} />
      
      <main className="flex-1 h-full overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}

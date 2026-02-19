import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "@/pages/login"
import WorkspaceLayout from "@/pages/workspace"
import WorkspaceAgentsPage from "@/pages/workspace/agents"
import WorkspaceToolPage from "@/pages/workspace/tools"
import WorkspaceTemplatesPage from "@/pages/workspace/templates"
import CreateAgentPage from "@/pages/workspace/create/agent"
import CreateToolPage from "@/pages/workspace/create/tool"
import MCPServicePage from "@/pages/workspace/mcp"
import AppDetailPage from "@/pages/app/detail"
import WorkflowPage from "@/pages/app/workflow"
import PortalPage from "@/pages/portal"
import KnowledgePage from "@/pages/knowledge"
import AccountLayout from "@/pages/account"
import ProfilePage from "@/pages/account/profile"
import ModelsPage from "@/pages/account/models"
import MainLayout from "@/components/layout/MainLayout"
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        {/* Workflow Page (No Layout) */}
        <Route path="/app/workflow/:appId" element={<WorkflowPage />} />

        <Route path="/app" element={<MainLayout />}>
          <Route index element={<Navigate to="/app/workspace" replace />} />
          <Route path="portal" element={<PortalPage />} />
          
          <Route path="workspace/create/agent" element={<CreateAgentPage />} />
          <Route path="workspace/create/tool" element={<CreateToolPage />} />
          <Route path="detail/:appId" element={<AppDetailPage />} />
          <Route path="workspace" element={<WorkspaceLayout />}>
            <Route index element={<Navigate to="/app/workspace/agents" replace />} />
            <Route path="agents" element={<WorkspaceAgentsPage />} />
            <Route path="tools" element={<WorkspaceToolPage />} />
            <Route path="templates" element={<WorkspaceTemplatesPage />} />
            <Route path="mcp" element={<MCPServicePage />} />
          </Route>

          <Route path="knowledge" element={<KnowledgePage />} />
          <Route path="account" element={<AccountLayout />}>
            <Route index element={<Navigate to="/app/account/profile" replace />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="models" element={<ModelsPage />} />
          </Route>
        </Route>

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

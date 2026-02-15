import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "@/pages/login"
import WorkspacePage from "@/pages/workspace"
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
        <Route path="/app" element={<MainLayout />}>
          <Route index element={<Navigate to="/app/workspace" replace />} />
          <Route path="portal" element={<PortalPage />} />
          <Route path="workspace" element={<WorkspacePage />} />
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


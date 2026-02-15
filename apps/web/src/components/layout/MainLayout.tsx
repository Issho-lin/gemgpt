import {
   Bot,
   LayoutDashboard,
   User,
   Github,
   Database
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Outlet, Link, useLocation } from "react-router-dom"

export default function MainLayout() {
   const location = useLocation()

   return (
      <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
         {/* 1. Primary Sidebar (Global Nav) */}
         <aside className="flex w-[64px] flex-col items-center py-6 z-20 shadow-sm" style={{ backgroundColor: '#f9fafc' }}>
            {/* Logo */}
            <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl text-blue-600">
               <img src="/logo.png" alt="FastGPT" className="h-[48px] w-[36px]" />
            </div>

            {/* Primary Nav Items */}
            <div className="flex flex-1 flex-col gap-2 w-full px-2">
               <PrimaryNavItem icon={<LayoutDashboard size={20} />} label="门户" to="/app/portal" active={location.pathname.startsWith("/app/portal")} />
               <PrimaryNavItem icon={<Bot size={20} />} label="工作台" to="/app/workspace" active={location.pathname.startsWith("/app/workspace")} />
               <PrimaryNavItem icon={<Database size={20} />} label="知识库" to="/app/knowledge" active={location.pathname.startsWith("/app/knowledge")} />
               <PrimaryNavItem icon={<User size={20} />} label="账号" to="/app/account" active={location.pathname.startsWith("/app/account")} />
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col gap-4 items-center mb-2 w-full px-2">
               <div className="h-px w-8 bg-slate-200 my-1" />
               <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors">
                  <Github size={20} />
               </a>
               <Avatar className="h-8 w-8 cursor-pointer border hover:border-blue-400 transition-all">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
               </Avatar>
            </div>
         </aside>

         {/* Main Content Area */}
         <main className="flex-1 flex flex-col min-w-0 bg-white">
            <Outlet />
         </main>
      </div>
   )
}

function PrimaryNavItem({ icon, label, to, active }: { icon: React.ReactNode, label: string, to: string, active?: boolean }) {
   return (
      <Link to={to} className="no-underline">
         <div className={cn(
            "group relative flex flex-col items-center justify-center gap-1 rounded-lg py-2 cursor-pointer transition-all",
            active ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
         )}>
            {icon}
            <span className="text-[10px] font-medium scale-90">{label}</span>
            {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-blue-600 rounded-r-full" />}
         </div>
      </Link>
   )
}



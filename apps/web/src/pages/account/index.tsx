import { User, Box, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Outlet, Link, useLocation } from "react-router-dom"

export default function AccountLayout() {
    const location = useLocation()

    return (
        <div className="h-full w-full pr-4 pt-4 pb-4 bg-slate-50">
            <div className="flex h-full w-full rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                {/* Secondary Sidebar */}
                <aside className="flex w-[180px] flex-col border-r bg-slate-50/50 py-4">
                    <nav className="flex flex-col gap-1 px-3">
                        <SecondaryNavItem
                            icon={<User size={16} />}
                            label="个人信息"
                            to="/app/account/profile"
                            active={location.pathname.startsWith("/app/account/profile") || location.pathname === "/app/account"}
                        />
                        <SecondaryNavItem
                            icon={<Box size={16} />}
                            label="模型管理"
                            to="/app/account/models"
                            active={location.pathname.startsWith("/app/account/models")}
                        />
                        <SecondaryNavItem
                            icon={<LogOut size={16} />}
                            label="登出"
                            to="/login"
                            active={false}
                        />
                    </nav>

                    {/* Version */}
                    <div className="mt-auto px-4 py-2">
                        <span className="flex items-center gap-1.5 text-xs text-slate-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                            V4.14.4
                        </span>
                    </div>
                </aside>

                {/* Content */}
                <div className="flex-1 overflow-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

function SecondaryNavItem({ icon, label, to, active }: { icon: React.ReactNode, label: string, to: string, active: boolean }) {
    return (
        <Link to={to} className="no-underline">
            <div className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium cursor-pointer transition-colors",
                active ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}>
                {icon}
                <span>{label}</span>
            </div>
        </Link>
    )
}

import { useRef, useState } from "react"
import { Camera } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProfilePage() {
    const [avatarUrl, setAvatarUrl] = useState<string | null>("https://github.com/shadcn.png")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleAvatarClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setAvatarUrl(url)
        }
    }

    return (
        <div className="p-8 max-w-2xl">
            {/* 通用信息 */}
            <section className="mb-8">
                <h2 className="flex items-center gap-2 text-base font-semibold text-slate-800 mb-4">
                    <span>📋</span> 通用信息
                </h2>

                {/* 账号 */}
                <div className="flex items-center gap-4 py-3 border-b border-slate-100">
                    <span className="text-sm text-slate-500 w-16">账号</span>
                    <span className="text-sm text-slate-900">root</span>
                </div>

                {/* 头像 */}
                <div className="flex items-center gap-4 py-3 border-b border-slate-100">
                    <span className="text-sm text-slate-500 w-16">头像</span>
                    <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                        <Avatar className="h-14 w-14 border-2 border-slate-200 group-hover:border-blue-400 transition-all">
                            <AvatarImage src={avatarUrl ?? undefined} />
                            <AvatarFallback className="bg-slate-100 text-slate-400 text-lg">U</AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera size={18} className="text-white" />
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>
            </section>

            {/* Action Cards */}
            <div className="space-y-3 max-w-md">
                <div className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors">
                    <span>📖</span> 帮助文档
                </div>
            </div>
        </div>
    )
}

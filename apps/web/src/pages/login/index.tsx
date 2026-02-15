import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import LoginBg from "@/components/pages/LoginBg"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "@/lib/api"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!username || !password) {
      setError("请输入用户名和密码")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await api.post('/auth/login', { username, password })
      localStorage.setItem('token', response.data.access_token)
      navigate('/workspace')
    } catch (err) {
      setError("登录失败，请检查用户名或密码")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-blue-50 flex items-center justify-center font-sans selection:bg-blue-100">
      <LoginBg />
      {/* 登录卡片 */}
      <Card className="z-10 w-full max-w-[440px] shadow-2xl border-none bg-white/95 backdrop-blur-md rounded-2xl">
        <CardHeader className="flex flex-col items-center space-y-6 pt-12 pb-8">
          <div className="flex items-center gap-3">
             <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                <img src="/logo.png" alt="FastGPT" className="h-8 w-8" />
             </div>
             <span className="text-3xl font-bold text-slate-900 tracking-tight">GemGPT</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 px-10 pb-12">
           <div className="space-y-5">
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              <div className="space-y-2">
                 <Input 
                    placeholder="用户名" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-12 bg-slate-50 border-slate-200 text-base px-4 focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 transition-all rounded-xl" 
                  />
              </div>
              <div className="space-y-2">
                 <Input 
                    type="password" 
                    placeholder="密码" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 bg-slate-50 border-slate-200 text-base px-4 focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 transition-all rounded-xl" 
                 />
              </div>
           </div>
           
           <Button 
            className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-600/30 rounded-xl"
            onClick={handleLogin}
            disabled={loading}
           >
              {loading ? "登录中..." : "登录"}
           </Button>
        </CardContent>
      </Card>
    </div>
  )
}

import { Bot, Database, MessageSquare, Puzzle } from "lucide-react"

const LoginBg = () => {
  return (
    <div className="absolute inset-0 overflow-hidden select-none pointer-events-none">
       {/* 背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-blue-50 to-blue-100/50" />
      
      {/* 透视网格背景 */}
      <div className="absolute inset-0 overflow-hidden perspective-[1000px]">
         <div className="absolute inset-0 [transform:rotateX(20deg)_scale(1.5)] bg-[linear-gradient(to_right,#3b82f61a_1px,transparent_1px),linear-gradient(to_bottom,#3b82f61a_1px,transparent_1px)] bg-[size:60px_60px] origin-top" 
              style={{ 
                maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)',
                WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)'
              }} 
         />
      </div>

      {/* 中心光晕 */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-blue-400/20 blur-[120px]" />

      {/* 悬浮图标 */}
      
      {/* 右上角 - 机器人图标 */}
       <div className="absolute right-[15%] top-[15%] hidden lg:block animate-bounce duration-[6000ms]">
        <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-blue-400 to-blue-600 shadow-xl shadow-blue-500/20 rotate-[12deg] transform transition-transform hover:scale-110 border border-white/20">
           <Bot size={40} className="text-white fill-white/20" />
        </div>
      </div>

      {/* 左侧 - 聊天图标 */}
      <div className="absolute left-[10%] top-[40%] hidden lg:block animate-bounce duration-[5000ms] delay-1000">
        <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-blue-400 to-blue-600 shadow-xl shadow-blue-500/20 rotate-[-12deg] transform transition-transform hover:scale-110 border border-white/20">
           <MessageSquare size={48} className="text-white fill-white/20" />
        </div>
      </div>
      
      {/* 左下角 - 数据库图标 */}
       <div className="absolute left-[5%] bottom-[10%] hidden lg:block animate-bounce duration-[7000ms] delay-500">
        <div className="flex h-28 w-28 items-center justify-center rounded-[2.2rem] bg-gradient-to-br from-sky-400 to-blue-500 shadow-xl shadow-sky-500/20 rotate-[6deg] transform transition-transform hover:scale-110 border border-white/20">
           <Database size={56} className="text-white fill-white/20" />
        </div>
      </div>
      
      {/* 右下角 - 拼图图标 */}
      <div className="absolute right-[5%] bottom-[20%] hidden lg:block animate-bounce duration-[5500ms] delay-200">
        <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-blue-400 to-blue-600 shadow-xl shadow-blue-500/20 rotate-[-6deg] transform transition-transform hover:scale-110 border border-white/20">
           <Puzzle size={48} className="text-white fill-white/20" />
        </div>
      </div>
    </div>
  )
}

export default LoginBg

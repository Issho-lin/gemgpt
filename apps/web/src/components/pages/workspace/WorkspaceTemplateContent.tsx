import { Input } from "@/components/ui/input"
import { Search, Sparkles, Briefcase, Languages, Database, Github } from "lucide-react"
import { WorkspaceCategoryType } from "@/constants/workspace"
import { useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { SelectDropdown } from "@/components/common/SelectDropdown"

export default function WorkspaceTemplateContent() {
    const [searchParams] = useSearchParams()
    const type = searchParams.get("type") as WorkspaceCategoryType
    const [filterType, setFilterType] = useState<string>("")

    // Scroll to section when type changes
    useEffect(() => {
        if (type) {
            const element = document.getElementById(type)
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" })
            }
        }
    }, [type])

    const filterOptions = [
        { label: "全部", value: "" },
        { label: "工作流", value: "workflow" },
        { label: "对话 Agent", value: "chat_agent" },
        { label: "工作流工具", value: "tool_workflow" }
    ]

    return (
        <div className="flex flex-col h-full w-full bg-slate-50">
            {/* Header */}
            <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-6 bg-white border-b border-slate-100">
                <h1 className="text-xl font-bold text-slate-900">模板市场</h1>
                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <Input placeholder="搜索模板" className="pl-9 h-9 bg-slate-50 border-slate-200" />
                    </div>
                    <SelectDropdown
                        value={filterType}
                        onChange={setFilterType}
                        options={filterOptions}
                        placeholder="全部"
                        width="w-[120px]"
                        allowClear={false}
                    />
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-8 py-6 pb-20 scroll-smooth">
                <div className="flex flex-col gap-10 max-w-7xl mx-auto">
                    
                    {/* Recommended Section */}
                    <TemplateSection 
                        id={WorkspaceCategoryType.template_recommended}
                        title="推荐"
                        cards={[
                            {
                                icon: <GoogleIcon />,
                                title: "谷歌搜索",
                                desc: "通过请求谷歌搜索，查询相关内容作为模型的参考。",
                                type: "tool"
                            },
                            {
                                icon: <OpenAIIcon />,
                                title: "Dalle3 绘图",
                                desc: "通过请求 Dalle3 接口绘图，需要有 api key",
                                type: "tool"
                            },
                            {
                                icon: <FeishuIcon />,
                                title: "飞书 webhook 插件",
                                desc: "通过 webhook 给飞书机器人发送一条消息",
                                type: "tool"
                            }
                        ]}
                    />

                    {/* Image Generation Section */}
                    <TemplateSection 
                        id={WorkspaceCategoryType.template_image_generation}
                        title="图片生成"
                        cards={[
                            {
                                icon: <FalIcon />,
                                title: "Flux 绘图",
                                desc: "通过请求 Flux 接口绘图，需要有 api key",
                                type: "tool"
                            },
                            {
                                icon: <OpenAIIcon />,
                                title: "Dalle3 绘图",
                                desc: "通过请求 Dalle3 接口绘图，需要有 api key",
                                type: "tool"
                            }
                        ]}
                    />

                    {/* Web Search Section */}
                    <TemplateSection 
                        id={WorkspaceCategoryType.template_web_search}
                        title="联网搜索"
                        cards={[
                            {
                                icon: <GoogleIcon />,
                                title: "谷歌搜索",
                                desc: "通过请求谷歌搜索，查询相关内容作为模型的参考。",
                                type: "tool"
                            }
                        ]}
                    />

                    {/* Roleplay Section */}
                    <TemplateSection 
                        id={WorkspaceCategoryType.template_roleplay}
                        title="角色扮演"
                        cards={[
                            {
                                icon: <BookIcon />,
                                title: "汉语新解",
                                desc: "用新颖的角度解读汉语词汇...",
                                type: "app"
                            }
                        ]}
                    />
                    
                     {/* Office Services Section */}
                     <TemplateSection 
                        id={WorkspaceCategoryType.template_office_services}
                        title="办公服务"
                        cards={[
                            {
                                icon: <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><Database size={20} /></div>,
                                title: "问题分类 + 知识库",
                                desc: "先对用户的问题进行分类，再根据不同类型问题，...",
                                type: "app"
                            },
                            {
                                icon: <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><Languages size={20} /></div>,
                                title: "多轮翻译机器人",
                                desc: "通过 4 轮翻译，提高翻译英文的质量",
                                type: "app"
                            },
                            {
                                icon: <div className="bg-slate-800 p-2 rounded-lg text-white"><Github size={20} /></div>,
                                title: "GitHub Issue 总结机器人",
                                desc: "定时获取GitHub Issue信息,使用AI进行总结,并推送...",
                                type: "app"
                            },
                            {
                                icon: <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><Languages size={20} /></div>,
                                title: "长文翻译专家",
                                desc: "使用专有名词知识库协助翻译,更适合长文本的翻译...",
                                type: "app"
                            },
                            {
                                icon: <FeishuIcon />,
                                title: "飞书 webhook 插件",
                                desc: "通过 webhook 给飞书机器人发送一条消息",
                                type: "tool"
                            },
                            {
                                icon: <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><Languages size={20} /></div>,
                                title: "长字幕反思翻译机器人",
                                desc: "利用 AI 自我反思提升翻译质量，同时循环迭代执行 ...",
                                type: "app"
                            }
                        ]}
                    />
                </div>
            </div>
        </div>
    )
}

function TemplateSection({ id, title, cards }: { id: string, title: string, cards: any[] }) {
    return (
        <div id={id} className="scroll-mt-24">
            <h2 className="text-sm font-bold text-slate-700 mb-4">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map((card, index) => (
                    <TemplateCard key={index} {...card} />
                ))}
            </div>
        </div>
    )
}

function TemplateCard({ icon, title, desc, type }: { icon: React.ReactNode, title: string, desc: string, type: "app" | "tool" }) {
    return (
        <div className="group relative flex flex-col p-5 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer h-full">
            <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-100 overflow-hidden">
                    {icon}
                </div>
                <div className="p-1 rounded bg-slate-100 text-slate-500">
                    {type === "app" ? <Sparkles size={14} /> : <Briefcase size={14} />}
                </div>
            </div>
            
            <h3 className="text-base font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-sm text-slate-500 line-clamp-2 mb-8 flex-1">{desc}</p>
            
            <div className="mt-auto flex justify-end">
                <span className="text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    立即搭建
                </span>
            </div>
        </div>
    )
}

// Simple Icons
function GoogleIcon() {
    return (
        <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.799 L -6.734 42.379 C -8.804 40.439 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
            </g>
        </svg>
    )
}

function OpenAIIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.2819 9.82116C22.1842 9.15552 21.9482 8.51505 21.5907 7.94436C21.2332 7.37367 20.7628 6.88647 20.2125 6.51703C19.6621 6.14759 19.0452 5.90479 18.4051 5.80572C17.765 5.70664 17.1174 5.75367 16.5074 5.94353L16.5074 5.94364C16.4385 5.3411 16.2341 4.76175 15.9096 4.24838C15.5851 3.73502 15.1488 3.30095 14.6335 2.97852C14.1183 2.65609 13.5376 2.45366 12.9348 2.38631C12.3319 2.31897 11.7225 2.38843 11.1517 2.58953L3.89973 5.14441C2.55938 5.6166 1.48866 6.57711 0.880467 7.85246C0.272276 9.12781 0.166763 10.6343 0.583009 11.9837C0.680695 12.6493 0.916723 13.2898 1.27419 13.8605C1.63166 14.4312 2.10212 14.9184 2.65243 15.2878C3.20275 15.6573 3.8197 15.9 4.45976 15.9991C5.09983 16.0982 5.74744 16.0511 6.35741 15.8613L6.35741 15.8612C6.4263 16.4637 6.63073 17.0431 6.95525 17.5564C7.27977 18.0698 7.71607 18.5039 8.23133 18.8263C8.74659 19.1487 9.32726 19.3512 9.93012 19.4185C10.533 19.4859 11.1424 19.4164 11.7132 19.2153L18.9652 16.6604C20.3055 16.1882 21.3762 15.2277 21.9844 13.9524C22.5926 12.677 22.6981 11.1705 22.2819 9.82116ZM11.4324 4.54228C11.666 4.46001 11.9152 4.43159 12.1616 4.45911C12.4081 4.48664 12.6454 4.56939 12.856 4.70119C13.0666 4.833 13.2449 5.01043 13.3776 5.22026C13.5102 5.43009 13.5938 5.66687 13.6219 5.91316L13.8797 8.3265L9.36622 10.6865L6.68532 5.67228L11.4324 4.54228ZM4.68533 6.91891C5.0357 6.79549 5.41838 6.79796 5.76742 6.92583L8.60447 12.2319L3.9221 13.8815L3.35624 9.24525C3.32811 8.99896 3.3727 8.74955 3.48669 8.51543C3.60069 8.28131 3.78114 8.06835 4.0145 7.8923C4.24786 7.71624 4.52814 7.58156 4.83452 7.49832C5.14089 7.41508 5.4656 7.38543 5.7844 7.41162L4.68533 6.91891ZM6.34586 14.1565L6.08809 11.7432L10.6015 9.38316L13.2824 14.3974L8.53535 15.5274C8.30172 15.6097 8.05252 15.6381 7.8061 15.6106C7.55968 15.5831 7.32237 15.5003 7.11179 15.4185C6.9012 15.2867 6.72287 15.1093 6.59024 14.8995C6.45761 14.6896 6.37404 14.4528 6.34586 14.1565ZM18.1804 13.1492C18.0664 13.3834 17.886 13.5963 17.6526 13.7724C17.4192 13.9484 17.139 14.0831 16.8326 14.1664C16.5262 14.2496 16.2015 14.2793 15.8827 14.2531L16.9818 14.7458C16.6314 14.8692 16.2487 14.8667 15.8997 14.7389L13.0626 9.43276L17.745 7.78316L18.3109 12.4194C18.339 12.6657 18.2944 12.9151 18.1804 13.1492ZM16.4851 6.13645C16.7188 6.05412 16.968 6.0257 17.2144 6.05323C17.4608 6.08075 17.6981 6.1635 17.9087 6.29531C18.1193 6.42711 18.2976 6.60454 18.4302 6.81437C18.5629 7.0242 18.6464 7.261 18.6746 7.55729L18.9324 9.97063L14.4189 12.3307L11.738 7.31643L16.4851 6.13645ZM11.1322 10.3753L12.5938 13.109L9.75677 14.1082L8.29519 11.3745L11.1322 10.3753Z" fill="currentColor"/>
        </svg>
    )
}

function FalIcon() {
    return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#7C3AED" />
            <path d="M2 17L12 22L22 17" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12L12 17L22 12" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function FeishuIcon() {
    return (
        <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <path fill="#00D6B9" d="M20.62 9.07C19.72 9.07 18.99 8.34 18.99 7.44V3.88C18.99 2.98 19.72 2.25 20.62 2.25C21.52 2.25 22.25 2.98 22.25 3.88V7.44C22.25 8.34 21.52 9.07 20.62 9.07Z"/>
            <path fill="#3370FF" d="M11.66 18.16C10.76 18.16 10.03 17.43 10.03 16.53V3.88C10.03 2.98 10.76 2.25 11.66 2.25C12.56 2.25 13.29 2.98 13.29 3.88V16.53C13.29 17.43 12.56 18.16 11.66 18.16Z"/>
            <path fill="#3370FF" d="M2.7 13.27C1.8 13.27 1.07 12.54 1.07 11.64V8.38C1.07 7.48 1.8 6.75 2.7 6.75C3.6 6.75 4.33 7.48 4.33 8.38V11.64C4.33 12.54 3.6 13.27 2.7 13.27Z"/>
            <path fill="#00D6B9" d="M7.18 21.75C6.28 21.75 5.55 21.02 5.55 20.12V8.38C5.55 7.48 6.28 6.75 7.18 6.75C8.08 6.75 8.81 7.48 8.81 8.38V20.12C8.81 21.02 8.08 21.75 7.18 21.75Z"/>
            <path fill="#3370FF" d="M16.14 16.03C15.24 16.03 14.51 15.3 14.51 14.4V8.38C14.51 7.48 15.24 6.75 16.14 6.75C17.04 6.75 17.77 7.48 17.77 8.38V14.4C17.77 15.3 17.04 16.03 16.14 16.03Z"/>
        </svg>
    )
}

function BookIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 19.5C4 18.837 4.53726 18.3 5.2 18.3H19.6C20.3732 18.3 21 17.6732 21 16.9V5.7C21 4.76112 20.2389 4 19.3 4H18.5C17.6716 4 17 4.67157 17 5.5V17.5" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17 5.5H5.2C4.53726 5.5 4 6.03726 4 6.7V19.5" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17 5.5L4 19.5" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}

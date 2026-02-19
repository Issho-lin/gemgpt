import { 
    Bot, 
    Database, 
    GitFork, 
    FileText, 
    Briefcase, 
    CheckSquare, 
    LayoutTemplate, 
    Link, 
    MessageSquare, 
    FileSearch, 
    Globe, 
    Scale, 
    RefreshCw, 
    Code, 
    Layers, 
    Merge, 
    Sparkles
} from "lucide-react";

export const NODE_CONFIG: Record<string, {
    icon: any;
    label: string;
    description: string;
    color: string;
    bgColor: string;
    headerGradient: string;
    iconBg: string;
}> = {
    'aiChat': {
        icon: Bot,
        label: "AI 对话",
        description: "AI 大模型对话",
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        headerGradient: "bg-gradient-to-b from-blue-50 to-blue-100/50",
        iconBg: "bg-blue-600"
    },
    'searchDataset': {
        icon: Database,
        label: "知识库搜索",
        description: "调用“语义检索”和“全文检索”能力，从“知识库”中查找可能与问题相关的参考内容",
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        headerGradient: "bg-gradient-to-b from-blue-50 to-blue-100/50",
        iconBg: "bg-blue-600"
    },
    'classifyQuestion': {
        icon: GitFork,
        label: "问题分类",
        description: "根据用户的历史记录和当前问题判断该次提问的类型。可以添加多组问题类型，下面是一个模板例子：类型1：打招呼 类型2：关于商品“使用”问题 类型3：关于商品“购买”问题 类型4：其他问题",
        color: "text-purple-600",
        bgColor: "bg-purple-100",
        headerGradient: "bg-gradient-to-b from-purple-50 to-purple-100/50",
        iconBg: "bg-purple-600"
    },
    'extractContent': {
        icon: FileText,
        label: "文本内容提取",
        description: "可从文本中提取指定的数据，例如：sql语句、搜索关键词、代码等",
        color: "text-emerald-600",
        bgColor: "bg-emerald-100",
        headerGradient: "bg-gradient-to-b from-emerald-50 to-emerald-100/50",
        iconBg: "bg-emerald-600"
    },
    'tool': {
        icon: Briefcase,
        label: "工具调用",
        description: "由 AI 自主决定工具调用。",
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        headerGradient: "bg-gradient-to-b from-blue-50 to-blue-100/50",
        iconBg: "bg-blue-600"
    },
    'userGuide': {
        icon: CheckSquare,
        label: "用户选择",
        description: "引导用户进行选择",
        color: "text-emerald-600",
        bgColor: "bg-emerald-100",
        headerGradient: "bg-gradient-to-b from-emerald-50 to-emerald-100/50",
        iconBg: "bg-emerald-600"
    },
    'formInput': {
        icon: LayoutTemplate,
        label: "表单输入",
        description: "收集用户表单输入",
        color: "text-purple-600",
        bgColor: "bg-purple-100",
        headerGradient: "bg-gradient-to-b from-purple-50 to-purple-100/50",
        iconBg: "bg-purple-600"
    },
    'concatString': {
        icon: Link,
        label: "文本拼接",
        description: "拼接多个文本变量",
        color: "text-orange-600",
        bgColor: "bg-orange-100",
        headerGradient: "bg-gradient-to-b from-orange-50 to-orange-100/50",
        iconBg: "bg-orange-600"
    },
    'answer': {
        icon: MessageSquare,
        label: "指定回复",
        description: "直接回复用户内容",
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        headerGradient: "bg-gradient-to-b from-blue-50 to-blue-100/50",
        iconBg: "bg-blue-600"
    },
    'parseDoc': {
        icon: FileSearch,
        label: "文档解析",
        description: "解析本轮对话上传的文档，并返回对应文档内容",
        color: "text-emerald-600",
        bgColor: "bg-emerald-100",
        headerGradient: "bg-gradient-to-b from-emerald-50 to-emerald-100/50",
        iconBg: "bg-emerald-600"
    },
    'httpRequest': {
        icon: Globe,
        label: "HTTP 请求",
        description: "发起 HTTP 请求",
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        headerGradient: "bg-gradient-to-b from-blue-50 to-blue-100/50",
        iconBg: "bg-blue-600"
    },
    'ifElse': {
        icon: Scale,
        label: "判断器",
        description: "根据一定的条件，执行不同的分支。",
        color: "text-emerald-600",
        bgColor: "bg-emerald-100",
        headerGradient: "bg-gradient-to-b from-emerald-50 to-emerald-100/50",
        iconBg: "bg-emerald-600"
    },
    'updateVar': {
        icon: RefreshCw,
        label: "变量更新",
        description: "可以更新指定节点的输出值或更新全局变量",
        color: "text-orange-600",
        bgColor: "bg-orange-100",
        headerGradient: "bg-gradient-to-b from-orange-50 to-orange-100/50",
        iconBg: "bg-orange-600"
    },
    'runCode': {
        icon: Code,
        label: "代码运行",
        description: "执行一段简单的脚本代码，通常用于进行复杂的数据处理。",
        color: "text-emerald-600",
        bgColor: "bg-emerald-100",
        headerGradient: "bg-gradient-to-b from-emerald-50 to-emerald-100/50",
        iconBg: "bg-emerald-600"
    },
    'batchExecute': {
        icon: Layers,
        label: "批量执行",
        description: "输入一个数组，遍历数组并将每一个数组元素作为输入元素，执行工作流。",
        color: "text-purple-600",
        bgColor: "bg-purple-100",
        headerGradient: "bg-gradient-to-b from-purple-50 to-purple-100/50",
        iconBg: "bg-purple-600"
    },
    'mergeRef': {
        icon: Merge,
        label: "知识库搜索引用合并",
        description: "合并多个知识库引用",
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        headerGradient: "bg-gradient-to-b from-blue-50 to-blue-100/50",
        iconBg: "bg-blue-600"
    },
    'optimizeQuestion': {
        icon: Sparkles,
        label: "问题优化",
        description: "优化用户提问",
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        headerGradient: "bg-gradient-to-b from-blue-50 to-blue-100/50",
        iconBg: "bg-blue-600"
    }
};

export const MENU_ITEMS = [
    {
        category: "AI能力",
        items: ['aiChat', 'searchDataset', 'classifyQuestion', 'extractContent', 'tool']
    },
    {
        category: "交互",
        items: ['userGuide', 'formInput']
    },
    {
        category: "工具",
        items: ['concatString', 'answer', 'parseDoc', 'httpRequest', 'ifElse', 'updateVar', 'runCode', 'batchExecute']
    },
    {
        category: "其他",
        items: ['mergeRef', 'optimizeQuestion']
    }
];
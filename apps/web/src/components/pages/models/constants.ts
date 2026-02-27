export type ModelType = "llm" | "embedding" | "tts" | "stt" | "rerank"

export interface ModelItem {
    name: string
    provider: string
    providerIcon: string
    avatar?: string
    type: ModelType
    typeLabel: string
    usedTokens: number
    tagColor: string
}

export interface ConfigModelItem {
    id: string
    name: string
    modelName: string    // 真实模型标识符，如 "gpt-4o"
    provider: string
    providerIcon: string
    avatar?: string      // Provider 头像 URL（来自 FastGPT Plugin）
    type: ModelType
    typeLabel: string
    tagColor: string
    contextLength?: string
    capabilities?: string[]
    contextToken?: number
    vision?: boolean
    toolChoice?: boolean
    isActive: boolean
}

export const MOCK_MODELS: ModelItem[] = [
    {
        name: "qwen3-max",
        provider: "Qwen",
        providerIcon: "🔮",
        type: "llm",
        typeLabel: "语言模型",
        usedTokens: 128350,
        tagColor: "blue",
    },
    {
        name: "qwen3-8b",
        provider: "Qwen",
        providerIcon: "🔮",
        type: "llm",
        typeLabel: "语言模型",
        usedTokens: 45620,
        tagColor: "blue",
    },
    {
        name: "text-embedding-v4",
        provider: "Qwen",
        providerIcon: "🔮",
        type: "embedding",
        typeLabel: "索引模型",
        usedTokens: 562100,
        tagColor: "yellow",
    },
    {
        name: "doubao-seed-1-6-thinking-250615",
        provider: "Doubao",
        providerIcon: "🌊",
        type: "llm",
        typeLabel: "语言模型",
        usedTokens: 89200,
        tagColor: "blue",
    },
    {
        name: "deepseek-chat",
        provider: "DeepSeek",
        providerIcon: "🐋",
        type: "llm",
        typeLabel: "语言模型",
        usedTokens: 210800,
        tagColor: "blue",
    },
    {
        name: "deepseek-reasoner",
        provider: "DeepSeek",
        providerIcon: "🐋",
        type: "llm",
        typeLabel: "语言模型",
        usedTokens: 175400,
        tagColor: "blue",
    },
    {
        name: "glm-4-air",
        provider: "ChatGLM",
        providerIcon: "🧊",
        type: "llm",
        typeLabel: "语言模型",
        usedTokens: 33500,
        tagColor: "blue",
    },
    {
        name: "hunyuan-standard",
        provider: "Hunyuan",
        providerIcon: "💎",
        type: "llm",
        typeLabel: "语言模型",
        usedTokens: 12750,
        tagColor: "blue",
    },
]

export const MOCK_CONFIG_MODELS: ConfigModelItem[] = [
    {
        id: "mock-1",
        name: "gpt-5.2",
        modelName: "gpt-5.2",
        provider: "OpenAI",
        providerIcon: "🤖",
        type: "llm",
        typeLabel: "语言模型",
        tagColor: "blue",
        contextLength: "400k",
        capabilities: ["视觉", "工具调用"],
        isActive: true,
    },
    {
        id: "mock-2",
        name: "text-embedding-v3",
        modelName: "text-embedding-v3",
        provider: "OpenAI",
        providerIcon: "🔮",
        type: "embedding",
        typeLabel: "索引模型",
        tagColor: "yellow",
        contextLength: "8k",
        capabilities: ["向量化"],
        isActive: true,
    },
    {
        id: "mock-3",
        name: "tts-1-hd",
        modelName: "tts-1-hd",
        provider: "OpenAI",
        providerIcon: "🔊",
        type: "tts",
        typeLabel: "语音合成",
        tagColor: "green",
        contextLength: "-",
        capabilities: ["语音合成"],
        isActive: true,
    },
    {
        id: "mock-4",
        name: "Whisper1",
        modelName: "whisper-1",
        provider: "OpenAI",
        providerIcon: "👂",
        type: "stt",
        typeLabel: "语音识别",
        tagColor: "purple",
        contextLength: "-",
        capabilities: ["语音识别"],
        isActive: false,
    },
    {
        id: "mock-5",
        name: "bge-reranker-v2-m3",
        modelName: "bge-reranker-v2-m3",
        provider: "OpenAI",
        providerIcon: "🔄",
        type: "rerank",
        typeLabel: "重排模型",
        tagColor: "red",
        contextLength: "16k",
        capabilities: ["重排"],
        isActive: false,
    },
    {
        id: "mock-6",
        name: "gpt-4.1",
        modelName: "gpt-4.1",
        provider: "OpenAI",
        providerIcon: "🤖",
        type: "llm",
        typeLabel: "语言模型",
        tagColor: "blue",
        contextLength: "1000k",
        capabilities: ["视觉", "工具调用"],
        isActive: false,
    },
]

export const PROVIDER_OPTIONS = [
    { label: "全部", value: "" },
    { label: "🔮 Qwen", value: "Qwen" },
    { label: "🌊 Doubao", value: "Doubao" },
    { label: "🐋 DeepSeek", value: "DeepSeek" },
    { label: "🧊 ChatGLM", value: "ChatGLM" },
    { label: "💎 Hunyuan", value: "Hunyuan" },
]

export const MODEL_TYPE_OPTIONS: { label: string; value: ModelType | "" }[] = [
    { label: "全部", value: "" },
    { label: "语言模型", value: "llm" },
    { label: "索引模型", value: "embedding" },
    { label: "语音合成", value: "tts" },
    { label: "语音识别", value: "stt" },
    { label: "重排模型", value: "rerank" },
]

export const TAG_COLORS: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    yellow: "bg-amber-50 text-amber-600 border-amber-200",
    green: "bg-green-50 text-green-600 border-green-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    red: "bg-red-50 text-red-600 border-red-200",
}

export interface ChannelItem {
    id: number
    name: string
    protocol: string
    protocolIcon: string
    status: "enabled" | "disabled"
    priority: number
}

export const MOCK_CHANNELS: ChannelItem[] = [
    {
        id: 5,
        name: "硅基系列",
        protocol: "硅基流动",
        protocolIcon: "🌌",
        status: "enabled",
        priority: 1,
    },
    {
        id: 4,
        name: "智谱系列",
        protocol: "智谱清言",
        protocolIcon: "🧊",
        status: "enabled",
        priority: 1,
    },
    {
        id: 3,
        name: "DeepSeek系列 DeepSeek 系列",
        protocol: "DeepSeek 深搜",
        protocolIcon: "🐋",
        status: "enabled",
        priority: 1,
    },
    {
        id: 2,
        name: "豆包系列",
        protocol: "火山引擎（豆包）",
        protocolIcon: "🌊",
        status: "enabled",
        priority: 1,
    },
    {
        id: 1,
        name: "千问系列",
        protocol: "阿里百炼",
        protocolIcon: "🔮",
        status: "enabled",
        priority: 1,
    },
]

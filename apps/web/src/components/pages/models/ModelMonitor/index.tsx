import { useState } from "react"
import { AreaChartComponent } from "@/components/common/charts/AreaChartComponent"
import { subDays } from "date-fns"
import type { DateRange } from "react-day-picker"
import { DateRangePicker } from "@/components/common/DateRangePicker"
import { SelectDropdown } from "@/components/common/SelectDropdown"
import { TabSwitch } from "@/components/common/TabSwitch"
import { cn } from "@/lib/utils"
import { DataTable } from "@/components/common/DataTable"
import { Button } from "@/components/ui/button"
import { ListFilter, ArrowDown } from "lucide-react"

// Mock Data Generator
const generateMockData = () => {
    const data = []
    const hours = 24
    for (let i = 0; i < hours; i++) {
        const time = `${String(i).padStart(2, '0')}:00`
        data.push({
            time,
            requests: Math.floor(Math.random() * 50) + 10,
            failures: Math.floor(Math.random() * 5),
            failureRate: Math.random() * 0.1,
            tokens: Math.floor(Math.random() * 1000) + 200,
            latency: Math.random() * 2 + 0.5,
            ttft: Math.random() * 0.5 + 0.1,
        })
    }
    // Add a spike
    data[18].requests = 100
    data[18].tokens = 2000
    data[18].latency = 3.5
    return data
}

const MOCK_DATA = generateMockData()

interface MonitorTableItem {
    id: string
    modelName: string
    totalCalls: number
    failedCalls: number
    avgLatency: string
    avgTtft: string
}

const MOCK_TABLE_DATA: MonitorTableItem[] = [
    {
        id: "1",
        modelName: "doubao-seed-1-6-250615",
        totalCalls: 2,
        failedCalls: 2,
        avgLatency: "-",
        avgTtft: "-"
    },
    {
        id: "2",
        modelName: "doubao-seed-1-6-thinking-250615",
        totalCalls: 1,
        failedCalls: 0,
        avgLatency: "2.50",
        avgTtft: "1.04"
    }
]

const CHANNEL_OPTIONS = [
    { label: "千问系列", value: "千问系列" },
    { label: "OpenAI", value: "OpenAI" },
    { label: "Claude", value: "Claude" },
    { label: "硅基流动", value: "硅基流动" },
]

const MODEL_OPTIONS = [
    { label: "qwen3-max", value: "qwen3-max" },
    { label: "gpt-4", value: "gpt-4" },
    { label: "claude-3-opus", value: "claude-3-opus" },
    { label: "deepseek-coder", value: "deepseek-coder" },
    { label: "doubao-seed-1-6-250615", value: "doubao-seed-1-6-250615" },
    { label: "doubao-seed-1-6-thinking-250615", value: "doubao-seed-1-6-thinking-250615" },
]

const GRANULARITY_OPTIONS = [
    { label: "小时", value: "hour" },
    { label: "天", value: "day" },
]

const VIEW_TYPE_OPTIONS = [
    { label: "图表", value: "chart" },
    { label: "表格", value: "table" },
]

const CHART_GRANULARITY_OPTIONS = [
    { label: "分时", value: "hourly" },
    { label: "累积", value: "cumulative" },
]

const TOKEN_TYPE_OPTIONS = [
    { label: "全部", value: "all" },
    { label: "输入", value: "input" },
    { label: "输出", value: "output" },
]

interface ChartCardProps {
    title: string
    children: React.ReactNode
    className?: string
    controls?: React.ReactNode
}

function ChartCard({ title, children, className, controls }: ChartCardProps) {
    return (
        <div className={cn("bg-white rounded-lg border border-slate-200 p-4 flex flex-col h-[300px]", className)}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-slate-900 text-sm">{title}</h3>
                {controls}
            </div>
            <div className="flex-1 min-h-0 text-xs">
                {children}
            </div>
        </div>
    )
}




export default function ModelMonitorTab() {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: subDays(new Date(), 1),
        to: new Date()
    })
    const [channel, setChannel] = useState("")
    const [model, setModel] = useState("")
    const [granularity, setGranularity] = useState("hour")
    const [viewType, setViewType] = useState<"chart" | "table">("chart")

    // Chart Control States
    const [requestsGranularity, setRequestsGranularity] = useState("hourly")
    const [tokensType, setTokensType] = useState("all")
    const [tokensGranularity, setTokensGranularity] = useState("hourly")

    return (
        <div className="flex flex-col h-full gap-4 overflow-y-auto pb-4">
            {/* Filter Bar */}
            {/* Filter Bar */}
            <div className="flex items-center flex-wrap gap-4 bg-white p-1">
                <DateRangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    className="w-auto"
                    allowClear={false}
                />

                <SelectDropdown
                    value={channel}
                    onChange={setChannel}
                    options={CHANNEL_OPTIONS}
                    placeholder="渠道名"
                    width="w-[160px]"
                />

                <SelectDropdown
                    value={model}
                    onChange={setModel}
                    options={MODEL_OPTIONS}
                    placeholder="模型名"
                    width="w-[160px]"
                />

                <SelectDropdown
                    value={granularity}
                    onChange={setGranularity}
                    options={GRANULARITY_OPTIONS}
                    placeholder="时间颗粒度"
                    width="w-[100px]"
                    allowClear={false}
                />

                <div className="flex-1" />

                <TabSwitch
                    value={viewType}
                    onChange={(val) => setViewType(val as "chart" | "table")}
                    options={VIEW_TYPE_OPTIONS}
                    size="md"
                />
            </div>

            {/* Content */}
            {viewType === "chart" ? (
                /* Charts Grid */
                <div className="grid grid-cols-2 gap-4">
                    {/* Request Count */}
                    <div className="col-span-2">
                        <ChartCard
                            title="请求次数"
                            controls={
                                <TabSwitch
                                    value={requestsGranularity}
                                    onChange={setRequestsGranularity}
                                    options={CHART_GRANULARITY_OPTIONS}
                                    size="sm"
                                />
                            }
                        >
                            <AreaChartComponent
                                data={MOCK_DATA}
                                dataKey="requests"
                                name="请求次数"
                                color="#3b82f6"
                                gradientId="colorRequests"
                            />
                        </ChartCard>
                    </div>

                    {/* Failure Count */}
                    <ChartCard title="失败次数">
                        <AreaChartComponent
                            data={MOCK_DATA}
                            dataKey="failures"
                            name="失败次数"
                            color="#f97316"
                            gradientId="colorFailures"
                        />
                    </ChartCard>

                    {/* Failure Rate */}
                    <ChartCard title="失败率">
                        <AreaChartComponent
                            data={MOCK_DATA}
                            dataKey="failureRate"
                            name="失败率"
                            color="#ef4444"
                            gradientId="colorRate"
                            yAxisFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                        />
                    </ChartCard>

                    {/* Tokens Consumption */}
                    <div className="col-span-2">
                        <ChartCard
                            title="Tokens 消耗"
                            controls={
                                <div className="flex items-center gap-2">
                                    <TabSwitch
                                        value={tokensType}
                                        onChange={setTokensType}
                                        options={TOKEN_TYPE_OPTIONS}
                                        size="sm"
                                    />
                                    <TabSwitch
                                        value={tokensGranularity}
                                        onChange={setTokensGranularity}
                                        options={CHART_GRANULARITY_OPTIONS}
                                        size="sm"
                                    />
                                </div>
                            }
                        >
                            <AreaChartComponent
                                data={MOCK_DATA}
                                dataKey="tokens"
                                name="Tokens消耗"
                                color="#3b82f6"
                                gradientId="colorTokens"
                            />
                        </ChartCard>
                    </div>

                    {/* Avg Latency */}
                    <ChartCard title="平均调用时长 (秒)">
                        <AreaChartComponent
                            data={MOCK_DATA}
                            dataKey="latency"
                            name="平均调用时长"
                            color="#22c55e"
                            gradientId="colorLatency"
                        />
                    </ChartCard>

                    {/* Avg TTFT */}
                    <ChartCard title="平均首字时长 (秒)">
                        <AreaChartComponent
                            data={MOCK_DATA}
                            dataKey="ttft"
                            name="平均首字时长"
                            color="#f97316"
                            gradientId="colorTtft"
                        />
                    </ChartCard>
                </div>
            ) : (
                <div className="bg-white rounded-lg overflow-hidden border border-slate-200">
                    <DataTable
                        columns={[
                            {
                                title: "模型",
                                key: "modelName",
                                dataIndex: "modelName",
                                render: (val) => <span className="text-slate-600">{val}</span>
                            },
                            {
                                title: (
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-slate-700">
                                        调用总量
                                        <ArrowDown className="h-3 w-3" />
                                    </div>
                                ),
                                key: "totalCalls",
                                dataIndex: "totalCalls",
                                render: (val) => <span className="text-blue-600 font-medium">{val}</span>
                            },
                            {
                                title: "调用失败量",
                                key: "failedCalls",
                                dataIndex: "failedCalls",
                                render: (val) => <span className={cn("font-medium", val > 0 ? "text-red-600" : "text-slate-600")}>{val}</span>
                            },
                            {
                                title: "平均调用时长 (秒)",
                                key: "avgLatency",
                                dataIndex: "avgLatency",
                                render: (val) => <span className="text-slate-600">{val}</span>
                            },
                            {
                                title: "平均首字时长 (秒)",
                                key: "avgTtft",
                                dataIndex: "avgTtft",
                                render: (val) => <span className="text-slate-600">{val}</span>
                            },
                            {
                                title: "",
                                key: "actions",
                                width: 100,
                                render: (_, record) => (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 px-3 text-xs flex items-center gap-1 bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                                        onClick={() => {
                                            setModel(record.modelName)
                                            setViewType("chart")
                                        }}
                                    >
                                        <ListFilter size={12} />
                                        详情
                                    </Button>
                                )
                            }
                        ]}
                        dataSource={MOCK_TABLE_DATA}
                        rowKey="id"
                        className="w-full"
                        rowClassName="hover:bg-slate-50/50 transition-colors"
                    />
                </div>
            )}
        </div>
    )
}

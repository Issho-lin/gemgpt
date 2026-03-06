import { useState, useMemo, useEffect } from "react"
import { AreaChartComponent } from "@/components/common/charts/AreaChartComponent"
import type { DateRange } from "react-day-picker"
import { DateRangePicker } from "@/components/common/DateRangePicker"
import { SelectDropdown } from "@/components/common/SelectDropdown"
import { TabSwitch } from "@/components/common/TabSwitch"
import { cn } from "@/lib/utils"
import { DataTable, type ColumnDef } from "@/components/common/DataTable"
import { Button } from "@/components/ui/button"
import { ListFilter, ArrowDown } from "lucide-react"

import { getDashboardV2, getChannelList } from "@/api/aiproxy"
import { getModelProviders, getModelList } from "@/api/model"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import dayjs from "dayjs"

interface DashboardDataItemType {
    channel_id?: string;
    model: string;
    request_count?: number;
    exception_count?: number;
    total_time_milliseconds?: number;
    total_ttfb_milliseconds?: number;
    input_tokens?: number;
    output_tokens?: number;
    total_tokens?: number;
    max_rpm?: number;
    max_tpm?: number;
}

const GRANULARITY_OPTIONS = [
    { label: "分钟", value: "minute" },
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

const getDefaultDateRange = (): DateRange => {
    const from = new Date();
    from.setHours(from.getHours() - 24);
    from.setMinutes(0, 0, 0);

    const to = new Date();
    to.setHours(to.getHours() + 1);
    to.setMinutes(0, 0, 0);

    return { from, to };
};

export default function ModelMonitorTab() {
    const [dateRange, setDateRange] = useState<DateRange | undefined>(getDefaultDateRange());
    const [channel, setChannel] = useState("")
    const [model, setModel] = useState("")
    const [granularity, setGranularity] = useState<"minute" | "hour" | "day">("hour")
    const [viewType, setViewType] = useState<"chart" | "table">("chart")

    // Chart Control States
    const [requestsGranularity, setRequestsGranularity] = useState("hourly")
    const [tokensType, setTokensType] = useState("all")
    const [tokensGranularity, setTokensGranularity] = useState("hourly")

    const [channelList, setChannelList] = useState<any[]>([])
    const [allModels, setAllModels] = useState<{ provider: string, model: string }[]>([])
    const [providerList, setProviderList] = useState<any[]>([])

    const [dashboardData, setDashboardData] = useState<{ timestamp: number, summary: DashboardDataItemType[] }[]>([])
    const [loading, setLoading] = useState(false)

    const channelOptions = useMemo(() => {
        return channelList.map(c => ({ label: c.name, value: `${c.id}` }))
    }, [channelList])

    const modelOptions = useMemo(() => {
        const uniqueModels = Array.from(new Map(allModels.map((item: any) => [item.model, item])).values());
        return uniqueModels
            .map((item) => {
                const provider = providerList.find((p: any) => p.provider === item.provider) || {}
                const rawAvatar = provider.avatar
                const finalAvatar = rawAvatar ? (rawAvatar.startsWith('http') || rawAvatar.startsWith('/') ? rawAvatar : `/${rawAvatar}.svg`) : ''

                return {
                    provider: item.provider,
                    label: (
                        <div className="flex items-center gap-2">
                            {finalAvatar && (
                                <Avatar className="h-4 w-4 rounded-none">
                                    <AvatarImage src={finalAvatar} />
                                    <AvatarFallback className="text-[10px] bg-slate-100 text-slate-500">
                                        {(item.model)?.charAt(0) || "M"}
                                    </AvatarFallback>
                                </Avatar>
                            )}
                            <span className="text-slate-700">{item.model}</span>
                        </div>
                    ),
                    value: item.model
                }
            })
            .sort((a, b) => {
                const targetProvider = 'OpenAI'
                if (a.provider === targetProvider && b.provider !== targetProvider) return -1
                if (a.provider !== targetProvider && b.provider === targetProvider) return 1
                return 0
            })
    }, [allModels, providerList])

    useEffect(() => {
        Promise.all([
            getChannelList(),
            getModelProviders(),
            getModelList()
        ]).then(([list, providerData, modelListData]) => {
            setChannelList(list)
            setProviderList(providerData)
            if (Array.isArray(modelListData)) {
                setAllModels(modelListData)
            }
        }).catch(() => { })
    }, [])

    const handleDateRangeChange = (range: DateRange | undefined) => {
        if (!range) {
            setDateRange(undefined);
            return;
        }

        const newRange = { ...range };

        if (newRange.from) {
            newRange.from = new Date(newRange.from.setHours(0, 0, 0, 0));
        }
        if (newRange.to) {
            newRange.to = new Date(newRange.to.setHours(23, 59, 59, 999));
        }

        if (newRange.from && newRange.to) {
            const hoursDiff = dayjs(newRange.to).diff(dayjs(newRange.from), 'hour');
            let newGranularity: "minute" | "hour" | "day" = "day";
            if (hoursDiff < 1) newGranularity = 'minute';
            else if (hoursDiff < 48) newGranularity = 'hour';
            setGranularity(newGranularity);
        }
        setDateRange(newRange);
    }

    useEffect(() => {
        if (!dateRange?.from || !dateRange?.to) return;

        console.log("dateRange", dateRange);

        setLoading(true);
        getDashboardV2({
            channel: channel ? parseInt(channel) : undefined,
            model: model || undefined,
            start_timestamp: Math.floor(dateRange.from.getTime()),
            end_timestamp: Math.floor(dateRange.to.getTime()),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timespan: granularity
        }).then(data => {
            // Fill missing periods
            const startDate = dayjs(dateRange.from!); // DateRange ensures from is defined here
            const currentTime = dayjs();
            const endDate = dayjs(dateRange.to!).isBefore(currentTime) ? dayjs(dateRange.to!) : currentTime;

            let periodCount = 1;
            if (granularity === 'minute') {
                periodCount = endDate.diff(startDate, 'minute') + 1;
            } else if (granularity === 'hour') {
                periodCount = endDate.diff(startDate, 'hour') + 1;
            } else {
                periodCount = endDate.diff(startDate, 'day') + 1;
            }

            const completePeriodList = Array.from({ length: Math.max(0, periodCount) }, (_, i) =>
                startDate.add(i, granularity)
            );

            const existingDataMap = new Map<string, { timestamp: number; summary: DashboardDataItemType[] }>(
                data.map((item: any) => [dayjs(item.timestamp * 1000).format('YYYY-MM-DD HH:mm'), item])
            );

            const filledData: { timestamp: number; summary: DashboardDataItemType[] }[] = completePeriodList.map(period => {
                const periodKey = period.format('YYYY-MM-DD HH:mm');
                const existingItem = existingDataMap.get(periodKey);
                if (existingItem) return existingItem;
                return {
                    timestamp: Math.floor(period.valueOf() / 1000),
                    summary: []
                };
            });

            setDashboardData(filledData);
        }).finally(() => {
            setLoading(false);
        });
    }, [dateRange, channel, model, granularity]);

    const chartData = useMemo(() => {
        let cumulativeRequests = 0;
        let cumulativeTokens = 0;

        return dashboardData.map(item => {
            let dateFormat = "MM-DD"
            if (granularity === "minute") dateFormat = "HH:mm"
            else if (granularity === "hour") dateFormat = "HH:00"

            const time = dayjs(item.timestamp * 1000).format(dateFormat);
            const summary = item.summary || [];

            const totalCalls = summary.reduce((acc, model) => acc + (model.request_count || 0), 0);
            const errorCalls = summary.reduce((acc, model) => acc + (model.exception_count || 0), 0);
            const errorRate = totalCalls === 0 ? 0 : Number((errorCalls / totalCalls).toFixed(2));

            const inputTokens = summary.reduce((acc, model) => acc + (model.input_tokens || 0), 0);
            const outputTokens = summary.reduce((acc, model) => acc + (model.output_tokens || 0), 0);
            const totalTokens = summary.reduce((acc, model) => acc + (model.total_tokens || 0), 0);

            let tokens = totalTokens;
            if (tokensType === "input") tokens = inputTokens;
            if (tokensType === "output") tokens = outputTokens;

            const successCalls = totalCalls - errorCalls;
            const avgResponseTime = successCalls ? summary.reduce((acc, model) => acc + (model.total_time_milliseconds || 0), 0) / successCalls / 1000 : 0;
            const avgTtfb = successCalls ? summary.reduce((acc, model) => acc + (model.total_ttfb_milliseconds || 0), 0) / successCalls / 1000 : 0;

            cumulativeRequests += totalCalls;
            cumulativeTokens += tokens;

            return {
                time,
                requests: requestsGranularity === "cumulative" ? cumulativeRequests : totalCalls,
                failures: errorCalls,
                failureRate: errorRate,
                tokens: tokensGranularity === "cumulative" ? cumulativeTokens : tokens,
                latency: Math.round(avgResponseTime * 100) / 100,
                ttft: Math.round(avgTtfb * 100) / 100
            };
        });
    }, [dashboardData, granularity, tokensType, requestsGranularity, tokensGranularity]);


    const tableData = useMemo(() => {
        const showChannelColumn = !!model;
        const rows: any[] = [];

        const channelIdToNameMap = new Map();
        channelOptions.forEach(c => {
            if (c.value) channelIdToNameMap.set(parseInt(c.value), c.label);
        });

        if (showChannelColumn) {
            const channelMap = new Map();
            dashboardData.forEach(dayData => {
                dayData.summary.forEach(item => {
                    const channelId = `${item.channel_id!}`;
                    const existing = channelMap.get(channelId) || {
                        model: item.model || "-",
                        totalCalls: 0,
                        errorCalls: 0,
                        totalResponseTime: 0,
                        totalTtfb: 0
                    };
                    existing.totalCalls += (item.request_count || 0);
                    existing.errorCalls += (item.exception_count || 0);
                    existing.totalResponseTime += (item.total_time_milliseconds || 0);
                    existing.totalTtfb += (item.total_ttfb_milliseconds || 0);
                    channelMap.set(channelId, existing);
                });
            });

            channelMap.forEach((item, channelId) => {
                const successCalls = item.totalCalls - item.errorCalls;
                rows.push({
                    id: channelId + item.model,
                    channelName: channelIdToNameMap.get(parseInt(channelId)) || "",
                    modelName: item.model,
                    totalCalls: item.totalCalls,
                    failedCalls: item.errorCalls,
                    avgLatency: successCalls > 0 ? (item.totalResponseTime / successCalls / 1000).toFixed(2) : "-",
                    avgTtft: successCalls > 0 ? (item.totalTtfb / successCalls / 1000).toFixed(2) : "-"
                });
            });
        } else {
            const modelMap = new Map();
            dashboardData.forEach(dayData => {
                dayData.summary.forEach(item => {
                    const mName = item.model || "-";
                    const existing = modelMap.get(mName) || {
                        totalCalls: 0,
                        errorCalls: 0,
                        totalResponseTime: 0,
                        totalTtfb: 0
                    };
                    existing.totalCalls += (item.request_count || 0);
                    existing.errorCalls += (item.exception_count || 0);
                    existing.totalResponseTime += (item.total_time_milliseconds || 0);
                    existing.totalTtfb += (item.total_ttfb_milliseconds || 0);
                    modelMap.set(mName, existing);
                });
            });

            modelMap.forEach((item, itemModel) => {
                const successCalls = item.totalCalls - item.errorCalls;
                rows.push({
                    id: itemModel,
                    modelName: itemModel,
                    totalCalls: item.totalCalls,
                    failedCalls: item.errorCalls,
                    avgLatency: successCalls > 0 ? (item.totalResponseTime / successCalls / 1000).toFixed(2) : "-",
                    avgTtft: successCalls > 0 ? (item.totalTtfb / successCalls / 1000).toFixed(2) : "-"
                });
            });
        }

        return rows.sort((a, b) => b.totalCalls - a.totalCalls);

    }, [dashboardData, model, channelOptions]);


    const tableColumns: ColumnDef<any>[] = [
        {
            title: "模型",
            key: "modelName",
            dataIndex: "modelName",
            render: (val: string) => <span className="text-slate-600">{val}</span>
        }
    ];

    if (!!model) {
        tableColumns.push({
            title: "渠道",
            key: "channelName",
            dataIndex: "channelName",
            render: (val: string) => <span className="text-slate-600">{val || '-'}</span>
        });
    }

    tableColumns.push(
        {
            title: (
                <div className="flex items-center gap-1 cursor-pointer hover:text-slate-700">
                    调用总量
                    <ArrowDown className="h-3 w-3" />
                </div>
            ),
            key: "totalCalls",
            dataIndex: "totalCalls",
            render: (val: number) => <span className="text-blue-600 font-medium">{val}</span>
        },
        {
            title: "调用失败量",
            key: "failedCalls",
            dataIndex: "failedCalls",
            render: (val: number) => <span className={cn("font-medium", val > 0 ? "text-red-600" : "text-slate-600")}>{val}</span>
        },
        {
            title: "平均调用时长 (秒)",
            key: "avgLatency",
            dataIndex: "avgLatency",
            render: (val: string) => <span className="text-slate-600">{val}</span>
        },
        {
            title: "平均首字时长 (秒)",
            key: "avgTtft",
            dataIndex: "avgTtft",
            render: (val: string) => <span className="text-slate-600">{val}</span>
        },
        {
            title: "",
            key: "actions",
            width: 100,
            render: (_, record: any) => (
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
    );

    return (
        <div className="flex flex-col h-full gap-4 pb-4">
            <div className="flex items-center flex-wrap gap-4 bg-white p-1">
                <DateRangePicker
                    value={dateRange}
                    onChange={handleDateRangeChange}
                    className="w-auto"
                    allowClear={false}
                />

                <SelectDropdown
                    value={channel}
                    onChange={setChannel}
                    options={channelOptions}
                    placeholder="渠道名称"
                    width="w-[180px]"
                />

                <SelectDropdown
                    value={model}
                    onChange={setModel}
                    options={modelOptions}
                    placeholder="模型名称"
                    width="w-[180px]"
                />

                <SelectDropdown
                    value={granularity}
                    onChange={(val) => setGranularity(val as "minute" | "hour" | "day")}
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

            {viewType === "chart" ? (
                <div className={cn("grid grid-cols-2 gap-4", loading ? "opacity-50 pointer-events-none" : "")}>
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
                                data={chartData}
                                dataKey="requests"
                                name="请求次数"
                                color="#3b82f6"
                                gradientId="colorRequests"
                            />
                        </ChartCard>
                    </div>

                    <ChartCard title="失败次数">
                        <AreaChartComponent
                            data={chartData}
                            dataKey="failures"
                            name="失败次数"
                            color="#f97316"
                            gradientId="colorFailures"
                        />
                    </ChartCard>

                    <ChartCard title="失败率">
                        <AreaChartComponent
                            data={chartData}
                            dataKey="failureRate"
                            name="失败率"
                            color="#ef4444"
                            gradientId="colorRate"
                            yAxisFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                        />
                    </ChartCard>

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
                                data={chartData}
                                dataKey="tokens"
                                name="Tokens消耗"
                                color="#3b82f6"
                                gradientId="colorTokens"
                            />
                        </ChartCard>
                    </div>

                    <ChartCard title="平均调用时长 (秒)">
                        <AreaChartComponent
                            data={chartData}
                            dataKey="latency"
                            name="平均调用时长"
                            color="#22c55e"
                            gradientId="colorLatency"
                        />
                    </ChartCard>

                    <ChartCard title="平均首字时长 (秒)">
                        <AreaChartComponent
                            data={chartData}
                            dataKey="ttft"
                            name="平均首字时长"
                            color="#f97316"
                            gradientId="colorTtft"
                        />
                    </ChartCard>
                </div>
            ) : (
                <div className={cn("bg-white rounded-lg overflow-hidden border border-slate-200", loading ? "opacity-50 pointer-events-none" : "")}>
                    <DataTable
                        columns={tableColumns}
                        dataSource={tableData}
                        rowKey="id"
                        className="w-full"
                        rowClassName="hover:bg-slate-50/50 transition-colors"
                        emptyText="暂无数据"
                    />
                </div>
            )}
        </div>
    )
}

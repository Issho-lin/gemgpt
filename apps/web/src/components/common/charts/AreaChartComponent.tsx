
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts"

interface AreaChartProps {
    data: any[]
    dataKey: string
    name: string
    color: string
    gradientId: string
    yAxisFormatter?: (value: any) => string
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const dateStr = label

        return (
            <div className="bg-white p-4 border border-slate-100 rounded-xl shadow-xl min-w-[180px]">
                <p className="text-base font-medium text-slate-900 mb-3">{dateStr}</p>
                {payload.map((p: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                        <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: p.color || p.stroke || p.fill }}
                        />
                        <span className="text-slate-500">{p.name}</span>
                        <span className="text-slate-900 font-medium ml-1">
                            {typeof p.value === 'number' && p.name.includes('率')
                                ? `${(p.value * 100).toFixed(0)}%`
                                : typeof p.value === 'number' && !Number.isInteger(p.value)
                                    ? p.value.toFixed(2)
                                    : p.value}
                        </span>
                    </div>
                ))}
            </div>
        )
    }
    return null
}

export function AreaChartComponent({
    data,
    dataKey,
    name,
    color,
    gradientId,
    yAxisFormatter
}: AreaChartProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.1} />
                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    dy={10}
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={yAxisFormatter}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                    type="monotone"
                    dataKey={dataKey}
                    name={name}
                    stroke={color}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill={`url(#${gradientId})`}
                />
            </AreaChart>
        </ResponsiveContainer>
    )
}

import { useState } from "react"
import ActiveModelTab from "@/components/pages/models/ActiveModel/index"
import ModelConfigTab from "@/components/pages/models/ModelConfig/index"
import ModelChannelTab from "@/components/pages/models/ModelChannel/index"
import ModelLogTab from "@/components/pages/models/ModelLog/index"
import ModelMonitorTab from "@/components/pages/models/ModelMonitor/index"
import { TabSwitch } from "@/components/common/TabSwitch"

type TabType = "model" | "config" | "channel" | "log" | "dashboard"

const TABS: { label: string; value: TabType }[] = [
    { label: "可用模型", value: "model" },
    { label: "模型配置", value: "config" },
    { label: "模型渠道", value: "channel" },
    { label: "调用日志", value: "log" },
    { label: "监控", value: "dashboard" },
]

export default function ModelsPage() {
    const [activeTab, setActiveTab] = useState<TabType>("model")

    return (
        <div className="flex h-full flex-col gap-4 py-4 px-6">
            {/* Tab Bar */}
            <TabSwitch<TabType>
                size="lg"
                options={TABS}
                value={activeTab}
                onChange={setActiveTab}
            />

            {/* Tab Content */}
            <div className="flex-1 min-h-0">
                {activeTab === "model" && <ActiveModelTab />}
                {activeTab === "config" && <ModelConfigTab />}
                {activeTab === "channel" && <ModelChannelTab />}
                {activeTab === "log" && <ModelLogTab />}
                {activeTab === "dashboard" && <ModelMonitorTab />}
            </div>
        </div>
    )
}

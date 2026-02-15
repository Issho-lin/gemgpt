import { useState } from "react"
import { FileEdit } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { JSONEditor } from "@/components/common/JSONEditor"

const DEFAULT_CONFIG = `{
  "model": "qwen3-max",
  "metadata": {
    "provider": "Qwen",
    "model": "qwen3-max",
    "name": "qwen3-max",
    "type": "llm",
    "maxContext": 1024000,
    "maxTokens": 64000,
    "quoteMaxToken": 1000000,
    "maxTemperature": 1,
    "showTopP": true,
    "responseFormatList": [
      "text",
      "json_object"
    ],
    "showStopSign": true,
    "vision": false,
    "reasoning": false,
    "toolChoice": true,
    "datasetProcess": true,
    "usedInClassify": true,
    "usedInExtractFields": true,
    "usedInToolCall": true,
    "useInEvaluation": true,
    "maxResponse": 64000,
    "isActive": true
  }
}`

export default function ConfigFileModal({
    open,
    onOpenChange,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
}) {
    const [config, setConfig] = useState(DEFAULT_CONFIG)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl h-[60vh] flex flex-col gap-0 p-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-7 h-7 bg-blue-50 text-blue-500 rounded-md">
                            <FileEdit size={16} />
                        </span>
                        配置文件
                    </DialogTitle>
                    <DialogDescription className="mt-1.5 text-sm text-slate-500">
                        通过配置文件配置模型，点击确认后，会使用输入的配置进行全量覆盖，请确保配置文件输入正确。建议操作前，复制当前配置文件进行备份。
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 min-h-0 p-6 bg-slate-50">
                    <JSONEditor
                        value={config}
                        onChange={setConfig}
                        readOnly={true}
                        lineNumbers="off"
                        className="w-full h-full"
                    />
                </div>

                <DialogFooter className="px-6 py-4 border-t bg-white">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="h-9 px-4">
                        取消
                    </Button>
                    <Button onClick={() => onOpenChange(false)} className="h-9 px-4 bg-blue-600 hover:bg-blue-700">
                        确认
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

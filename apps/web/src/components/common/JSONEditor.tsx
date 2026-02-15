import React, { useState } from "react"
import Editor, { type OnMount } from "@monaco-editor/react"
import { cn } from "@/lib/utils"

interface JSONEditorProps {
    value: string
    onChange?: (value: string) => void
    readOnly?: boolean
    lineNumbers?: "on" | "off"
    className?: string
    height?: string
}

export const JSONEditor: React.FC<JSONEditorProps> = ({
    value,
    onChange,
    readOnly = false,
    lineNumbers = "off",
    className,
    height = "100%",
}) => {
    const [isFocused, setIsFocused] = useState(false)

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editor.onDidFocusEditorText(() => setIsFocused(true))
        editor.onDidBlurEditorText(() => setIsFocused(false))

        monaco.editor.defineTheme("custom-theme", {
            base: "vs",
            inherit: true,
            rules: [],
            colors: {
                "editor.background": "#00000000",
                "editor.lineHighlightBackground": "#F9F9F9",
            },
        })
        monaco.editor.setTheme("custom-theme")
    }

    return (
        <div
            className={cn(
                "rounded-md overflow-hidden border transition-colors",
                isFocused
                    ? "border-blue-500 ring-2 ring-blue-100 bg-white"
                    : "border-slate-200 bg-[#f9fafc]",
                className
            )}
            style={{ height }}
        >
            <Editor
                height="100%"
                defaultLanguage="json"
                value={value}
                onChange={(v) => onChange?.(v || "")}
                onMount={handleEditorDidMount}
                options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    lineNumbers: lineNumbers,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    readOnly: readOnly,
                    formatOnPaste: true,
                    formatOnType: true,
                    guides: {
                        indentation: false,
                    },
                    scrollbar: {
                        verticalScrollbarSize: 4,
                        horizontalScrollbarSize: 4,
                    },
                }}
            />
        </div>
    )
}

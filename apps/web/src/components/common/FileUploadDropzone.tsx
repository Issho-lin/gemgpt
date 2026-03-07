import { useRef, useState, type DragEvent, type ChangeEvent } from "react"
import { Upload } from "lucide-react"

type FileUploadDropzoneProps = {
    title?: string
    description?: string
    limitText?: string
    className?: string
    accept?: string
    multiple?: boolean
    disabled?: boolean
    onFilesSelect?: (files: File[]) => void
}

export default function FileUploadDropzone({
    title = "点击或拖拽文件到此处上传",
    description = "支持 txt、doc、csv、xlsx、pdf、md、html、pptx 类型文件",
    limitText = "最多支持 1000 个文件且单个文件最大 500 MB",
    className,
    accept,
    multiple = true,
    disabled = false,
    onFilesSelect
}: FileUploadDropzoneProps) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [isDragging, setIsDragging] = useState(false)

    const emitFiles = (fileList: FileList | null) => {
        if (!fileList || disabled) return
        const nextFiles = Array.from(fileList)
        if (!nextFiles.length) return
        onFilesSelect?.(nextFiles)
    }

    const handleClick = () => {
        if (disabled) return
        inputRef.current?.click()
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        emitFiles(e.target.files)
        e.target.value = ""
    }

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        if (disabled) return
        setIsDragging(true)
    }

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
        emitFiles(e.dataTransfer.files)
    }

    return (
        <div
            role="button"
            tabIndex={disabled ? -1 : 0}
            className={[
                "rounded-lg border border-dashed bg-slate-50/40 min-h-[140px] flex items-center justify-center transition-colors",
                isDragging ? "border-blue-500 bg-blue-50/40" : "border-slate-300",
                disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
                className || ""
            ].join(" ")}
            onClick={handleClick}
            onKeyDown={(e) => {
                if (disabled) return
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    handleClick()
                }
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept={accept}
                multiple={multiple}
                disabled={disabled}
                onChange={handleInputChange}
            />

            <div className="text-center pointer-events-none">
                <div className="mx-auto mb-3 h-9 w-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Upload size={18} />
                </div>
                <div className="text-base font-medium text-slate-700">{title}</div>
                <div className="mt-1 text-xs text-slate-500">{description}</div>
                <div className="text-xs text-slate-500">{limitText}</div>
            </div>
        </div>
    )
}

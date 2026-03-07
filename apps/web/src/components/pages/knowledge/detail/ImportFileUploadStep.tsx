import { useMemo } from 'react';
import { FileText, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FileUploadDropzone from '@/components/common/FileUploadDropzone';
import { DataTable, type ColumnDef } from '@/components/common/DataTable';

export type UploadItem = {
    id: string;
    name: string;
    size: string;
    progress: number;
    isUploading: boolean;
    errorMsg?: string;
    objectKey?: string;
};

interface ImportFileUploadStepProps {
    files: UploadItem[];
    onFilesSelect: (selectedFiles: File[]) => Promise<void>;
    onRemoveFile: (id: string) => void;
    onNext: () => void;
    canNext: boolean;
}

export function ImportFileUploadStep({
    files,
    onFilesSelect,
    onRemoveFile,
    onNext,
    canNext
}: ImportFileUploadStepProps) {

    const nextText = useMemo(() => `共 ${files.length} 个文件 | 下一步`, [files.length]);

    const columns: ColumnDef<UploadItem>[] = [
        {
            title: '文件名',
            key: 'name',
            width: '50%',
            render: (_, file) => (
                <div className="flex items-center gap-2 text-slate-700 min-w-0">
                    <FileText size={14} className="text-slate-500 shrink-0" />
                    <span className="truncate">{file.name}</span>
                </div>
            )
        },
        {
            title: '文件上传进度',
            key: 'progress',
            width: '25%',
            render: (_, file) => (
                <div className="pr-4">
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${file.progress}%` }} />
                    </div>
                    <div className="mt-1 text-xs text-slate-500 flex items-center gap-1">
                        {file.isUploading && <Loader2 size={12} className="animate-spin" />}
                        {file.errorMsg ? <span className="text-red-500 truncate">{file.errorMsg}</span> : `${file.progress}%`}
                    </div>
                </div>
            )
        },
        {
            title: '文件大小',
            dataIndex: 'size',
            key: 'size',
            width: '15%',
            className: 'text-slate-600'
        },
        {
            title: '操作',
            key: 'action',
            width: 80,
            headerClassName: 'text-center',
            className: 'text-center',
            render: (_, file) => (
                <div className="flex justify-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500"
                        onClick={() => onRemoveFile(file.id)}
                    >
                        <Trash2 size={14} />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <>
            <FileUploadDropzone
                accept=".txt,.doc,.docx,.csv,.xlsx,.xls,.pdf,.md,.html,.ppt,.pptx"
                multiple
                onFilesSelect={onFilesSelect}
            />

            {files.length > 0 && (
                <>
                    <div className="rounded-lg border border-slate-200 overflow-hidden">
                        <DataTable
                            columns={columns}
                            dataSource={files}
                            rowKey="id"
                            emptyText="暂无上传文件"
                            className="[&_thead_tr]:h-10 [&_tbody_tr]:h-14 [&_tbody_td]:text-sm"
                        />
                    </div>

                    <div className="flex justify-end">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white" disabled={!canNext} onClick={onNext}>
                            {nextText}
                        </Button>
                    </div>
                </>
            )}
        </>
    );
}

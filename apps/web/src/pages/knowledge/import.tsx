import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, FileText, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Stepper from '@/components/common/Stepper';
import FileUploadDropzone from '@/components/common/FileUploadDropzone';
import { DataTable, type ColumnDef } from '@/components/common/DataTable';
import { createKnowledgeDocument, getKnowledgeUploadPresignedUrl } from '@/api/knowledge';

type UploadItem = {
  id: string;
  name: string;
  size: string;
  progress: number;
  isUploading: boolean;
  errorMsg?: string;
  objectKey?: string;
};

const formatFileSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / 1024 / 1024).toFixed(2)} MB`;
  return `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`;
};

export default function KnowledgeImportPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const knowledgeId = searchParams.get('id') || '';

  const [files, setFiles] = useState<UploadItem[]>([]);

  const isUploading = files.some((item) => item.isUploading);
  const successFiles = files.filter((item) => item.progress === 100 && !item.errorMsg);
  const canNext = successFiles.length > 0 && !isUploading;

  const nextText = useMemo(() => `共 ${files.length} 个文件 | 下一步`, [files.length]);

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const setFileState = (id: string, patch: Partial<UploadItem>) => {
    setFiles((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const uploadSingleFile = async (knowledgeBaseId: string, fileId: string, file: File) => {
    try {
      const presigned = await getKnowledgeUploadPresignedUrl(knowledgeBaseId, {
        filename: file.name,
        contentType: file.type || 'application/octet-stream'
      });

      const formData = new FormData();
      Object.entries(presigned.fields).forEach(([k, v]) => formData.set(k, v));
      formData.set('file', file);

      await axios.post(presigned.url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 5 * 60 * 1000,
        onUploadProgress: (e) => {
          if (!e.total) return;
          const percent = Math.round((e.loaded / e.total) * 100);
          setFileState(fileId, {
            progress: percent
          });
        }
      });

      const objectKey = presigned.fields.key;
      const ext = file.name.includes('.') ? file.name.split('.').pop()?.toLowerCase() : '';

      await createKnowledgeDocument(knowledgeBaseId, {
        filename: file.name,
        fileType: ext || 'unknown',
        objectKey
      });

      setFileState(fileId, {
        progress: 100,
        isUploading: false,
        errorMsg: undefined,
        objectKey
      });
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || error?.message || '上传失败';
      setFileState(fileId, {
        isUploading: false,
        errorMsg: String(errMsg)
      });
    }
  };

  const handleFilesSelect = async (selectedFiles: File[]) => {
    if (!knowledgeId) return;

    const newItems: UploadItem[] = selectedFiles.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}`,
      name: file.name,
      size: formatFileSize(file.size),
      progress: 0,
      isUploading: true
    }));

    const existingIds = new Set(files.map((item) => item.id));
    const filteredItems = newItems.filter((item) => !existingIds.has(item.id));

    if (filteredItems.length === 0) return;

    setFiles((prev) => [...prev, ...filteredItems]);

    await Promise.all(
      filteredItems.map(async (item) => {
        const file = selectedFiles.find(
          (selected) => `${selected.name}-${selected.size}-${selected.lastModified}` === item.id
        );
        if (!file) return;
        await uploadSingleFile(knowledgeId, item.id, file);
      })
    );
  };

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
            onClick={() => removeFile(file.id)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="h-full bg-slate-50 p-4">
      <div className="h-full rounded-xl border border-slate-200 bg-white overflow-hidden flex flex-col">
        <div className="h-14 px-4 border-b flex items-center shrink-0">
          <button
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
            onClick={() => navigate(knowledgeId ? `/app/knowledge/detail?id=${knowledgeId}` : '/app/knowledge')}
          >
            <ArrowLeft size={16} />
            退出
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4">
          <Stepper currentStep={1} steps={['选择文件', '参数设置', '数据预览', '确认上传']} />

          <FileUploadDropzone
            accept=".txt,.doc,.docx,.csv,.xlsx,.xls,.pdf,.md,.html,.ppt,.pptx"
            multiple
            onFilesSelect={handleFilesSelect}
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
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" disabled={!canNext}>
                  {nextText}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

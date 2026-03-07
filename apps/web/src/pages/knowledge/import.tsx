import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import Stepper from '@/components/common/Stepper';
import { createKnowledgeDocument, getKnowledgeUploadPresignedUrl } from '@/api/knowledge';

// Import split components
import { ImportFileUploadStep, type UploadItem } from '@/components/pages/knowledge/detail/ImportFileUploadStep';
import { ImportSettingsStep } from '@/components/pages/knowledge/detail/ImportSettingsStep';
import { ImportPreviewStep } from '@/components/pages/knowledge/detail/ImportPreviewStep';
import { ImportConfirmStep } from '@/components/pages/knowledge/detail/ImportConfirmStep';

const formatFileSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / 1024 / 1024).toFixed(2)} MB`;
  return `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`;
};

const indexSizeOptions = [
  64, 128, 256, 512, 768, 1024, 1536, 2048, 3072, 4096, 5120, 6144, 7168
];

const separatorOptions = [
  { label: '不设置', value: 'none' },
  { label: '1 个换行符', value: '\\n' },
  { label: '2 个换行符', value: '\\n\\n' },
  { label: '句号', value: '.|。' },
  { label: '感叹号', value: '!|！' },
  { label: '问号', value: '?|？' },
  { label: '分号', value: ';|；' },
  { label: '=====', value: '=====' },
  { label: '自定义', value: 'Other' }
];

export default function KnowledgeImportPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const knowledgeId = searchParams.get('id') || '';

  const [files, setFiles] = useState<UploadItem[]>([]);
  const [step, setStep] = useState(1);

  // Settings states
  const [trainingType, setTrainingType] = useState('chunk');
  const [chunkTriggerType, setChunkTriggerType] = useState('minSize');
  const [chunkTriggerMinSize, setChunkTriggerMinSize] = useState('1000');
  const [indexPrefixTitle, setIndexPrefixTitle] = useState(false);
  const [autoIndexes, setAutoIndexes] = useState(false);
  const [imageIndex, setImageIndex] = useState(false);
  const [chunkParams, setChunkParams] = useState('auto'); // auto | custom
  const [customChunkType, setCustomChunkType] = useState('paragraph'); // paragraph | length | separator
  const [llmParagraphMode, setLlmParagraphMode] = useState('disabled');
  const [maxParagraphDepth, setMaxParagraphDepth] = useState('5');
  const [maxChunkSize, setMaxChunkSize] = useState('1000');
  const [indexSize, setIndexSize] = useState('512');
  const [customSeparator, setCustomSeparator] = useState('\\n');
  const [selectedSeparator, setSelectedSeparator] = useState(separatorOptions[1].value);
  const [qaPrompt, setQaPrompt] = useState(`<Context></Context> 标记中是一段文本，学习并分析它，并整理学习成果：
- 提出问题并给出每个问题的答案。
- 答案需详细完整，尽可能保留原文描述，可以适当扩展答案描述。
- 答案可以包含普通文字、链接、代码、表格、公示、媒体链接等 Markdown 元素。
- 最多提出 50 个问题。
- 生成的问题和答案和源文本语言相同。`);

  const isUploading = files.some((item) => item.isUploading);
  const successFiles = files.filter((item) => item.progress === 100 && !item.errorMsg);
  const canNext = step === 1 ? successFiles.length > 0 && !isUploading : true;

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
    } catch (error: unknown) {
      const errMsg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || (error as Error)?.message || '上传失败';
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

  const chunkTriggerOptions = [
    { label: '原文长度大于', value: 'minSize' },
    { label: '原文长度大于文件处理模型最大上下文70%', value: 'maxSize' },
    { label: '强制分块', value: 'forceChunk' }
  ];

  const llmParagraphOptions = [
    {
      value: 'auto',
      label: (
        <div className="flex flex-col py-1">
          <div className="font-medium">自动</div>
          <div className="text-xs text-slate-500 select-desc">当文本内容不含 Markdown 标题时，启用模型识别。</div>
        </div>
      )
    },
    {
      value: 'disabled',
      label: (
        <div className="flex flex-col py-1">
          <div className="font-medium">禁用</div>
          <div className="text-xs text-slate-500 select-desc">强制禁用模型自动识别段落</div>
        </div>
      )
    },
    {
      value: 'force',
      label: (
        <div className="flex flex-col py-1">
          <div className="font-medium">强制处理</div>
          <div className="text-xs text-slate-500 select-desc">强制使用模型自动识别段落，并忽略原文本的段落（如有）</div>
        </div>
      )
    }
  ];

  const indexSizeSelectOptions = useMemo(() =>
    indexSizeOptions.map(size => ({ label: String(size), value: String(size) })),
    []
  );

  const separatorSelectOptions = separatorOptions;

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
          <Stepper currentStep={step} steps={['选择文件', '参数设置', '数据预览', '确认上传']} />

          {step === 1 && (
            <ImportFileUploadStep
              files={files}
              onFilesSelect={handleFilesSelect}
              onRemoveFile={removeFile}
              onNext={() => setStep(2)}
              canNext={canNext}
            />
          )}

          {step === 2 && (
            <ImportSettingsStep
              trainingType={trainingType}
              setTrainingType={setTrainingType}
              chunkTriggerType={chunkTriggerType}
              setChunkTriggerType={setChunkTriggerType}
              chunkTriggerMinSize={chunkTriggerMinSize}
              setChunkTriggerMinSize={setChunkTriggerMinSize}
              indexPrefixTitle={indexPrefixTitle}
              setIndexPrefixTitle={setIndexPrefixTitle}
              autoIndexes={autoIndexes}
              setAutoIndexes={setAutoIndexes}
              imageIndex={imageIndex}
              setImageIndex={setImageIndex}
              chunkParams={chunkParams}
              setChunkParams={setChunkParams}
              customChunkType={customChunkType}
              setCustomChunkType={setCustomChunkType}
              llmParagraphMode={llmParagraphMode}
              setLlmParagraphMode={setLlmParagraphMode}
              maxParagraphDepth={maxParagraphDepth}
              setMaxParagraphDepth={setMaxParagraphDepth}
              maxChunkSize={maxChunkSize}
              setMaxChunkSize={setMaxChunkSize}
              indexSize={indexSize}
              setIndexSize={setIndexSize}
              customSeparator={customSeparator}
              setCustomSeparator={setCustomSeparator}
              selectedSeparator={selectedSeparator}
              setSelectedSeparator={setSelectedSeparator}
              qaPrompt={qaPrompt}
              setQaPrompt={setQaPrompt}
              chunkTriggerOptions={chunkTriggerOptions}
              llmParagraphOptions={llmParagraphOptions}
              indexSizeSelectOptions={indexSizeSelectOptions}
              separatorSelectOptions={separatorSelectOptions}
              onNext={() => setStep(3)}
            />
          )}

          {step === 3 && (
            <ImportPreviewStep onNext={() => setStep(4)} onPrev={() => setStep(2)} />
          )}

          {step === 4 && (
            <ImportConfirmStep onPrev={() => setStep(3)} onConfirm={() => console.log('Confirm')} />
          )}
        </div>
      </div>
    </div >
  );
}

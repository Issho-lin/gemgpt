import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SelectDropdown } from '@/components/common/SelectDropdown';

interface ImportSettingsStepProps {
    trainingType: string;
    setTrainingType: (val: string) => void;
    chunkTriggerType: string;
    setChunkTriggerType: (val: string) => void;
    chunkTriggerMinSize: string;
    setChunkTriggerMinSize: (val: string) => void;
    indexPrefixTitle: boolean;
    setIndexPrefixTitle: (val: boolean) => void;
    autoIndexes: boolean;
    setAutoIndexes: (val: boolean) => void;
    imageIndex: boolean;
    setImageIndex: (val: boolean) => void;
    chunkParams: string;
    setChunkParams: (val: string) => void;
    customChunkType: string;
    setCustomChunkType: (val: string) => void;
    llmParagraphMode: string;
    setLlmParagraphMode: (val: string) => void;
    maxParagraphDepth: string;
    setMaxParagraphDepth: (val: string) => void;
    maxChunkSize: string;
    setMaxChunkSize: (val: string) => void;
    indexSize: string;
    setIndexSize: (val: string) => void;
    customSeparator: string;
    setCustomSeparator: (val: string) => void;
    selectedSeparator: string;
    setSelectedSeparator: (val: string) => void;
    qaPrompt: string;
    setQaPrompt: (val: string) => void;
    chunkTriggerOptions: any[];
    llmParagraphOptions: any[];
    indexSizeSelectOptions: any[];
    separatorSelectOptions: any[];
    onNext: () => void;
}

export function ImportSettingsStep({
    trainingType,
    setTrainingType,
    chunkTriggerType,
    setChunkTriggerType,
    chunkTriggerMinSize,
    setChunkTriggerMinSize,
    indexPrefixTitle,
    setIndexPrefixTitle,
    autoIndexes,
    setAutoIndexes,
    imageIndex,
    setImageIndex,
    chunkParams,
    setChunkParams,
    customChunkType,
    setCustomChunkType,
    llmParagraphMode,
    setLlmParagraphMode,
    maxParagraphDepth,
    setMaxParagraphDepth,
    maxChunkSize,
    setMaxChunkSize,
    indexSize,
    setIndexSize,
    customSeparator,
    setCustomSeparator,
    selectedSeparator,
    setSelectedSeparator,
    qaPrompt,
    setQaPrompt,
    chunkTriggerOptions,
    llmParagraphOptions,
    indexSizeSelectOptions,
    separatorSelectOptions,
    onNext
}: ImportSettingsStepProps) {
    return (
        <div className="max-w-3xl mx-auto rounded-xl border border-slate-200 bg-white p-6 space-y-6 text-slate-700 shadow-sm mt-8">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-blue-500 rounded-full" />
                    <span className="font-semibold text-base">数据处理方式设置</span>
                </div>
            </div>

            {/* 处理方式 */}
            <div className="space-y-3">
                <div className="text-sm font-medium flex items-center">
                    处理方式
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div
                        className={`p-3 border rounded-lg flex items-center gap-2 cursor-pointer transition-colors ${trainingType === 'chunk' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}
                        onClick={() => {
                            setTrainingType('chunk');
                            setMaxChunkSize('1000');
                        }}
                    >
                        <div className={`w-4 h-4 shrink-0 rounded-full border flex justify-center items-center ${trainingType === 'chunk' ? 'border-blue-500' : 'border-slate-300'}`}>
                            {trainingType === 'chunk' && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                        </div>
                        <span className="text-sm">分块存储</span>
                        <TooltipProvider>
                            <Tooltip delayDuration={300}>
                                <TooltipTrigger asChild>
                                    <HelpCircle size={14} className="text-slate-400 ml-auto opacity-70 outline-none" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[280px] p-3 text-sm leading-relaxed" side="top">
                                    将文本按一定的规则进行分段处理后，转成可进行语义搜索的格式，适合绝大多数场景。不需要调用模型额外处理，成本低。
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div
                        className={`p-3 border rounded-lg flex items-center gap-2 cursor-pointer transition-colors ${trainingType === 'qa' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}
                        onClick={() => {
                            setTrainingType('qa');
                            setMaxChunkSize('8000');
                        }}
                    >
                        <div className={`w-4 h-4 shrink-0 rounded-full border flex justify-center items-center ${trainingType === 'qa' ? 'border-blue-500' : 'border-slate-300'}`}>
                            {trainingType === 'qa' && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                        </div>
                        <span className="text-sm">问答对提取</span>
                        <TooltipProvider>
                            <Tooltip delayDuration={300}>
                                <TooltipTrigger asChild>
                                    <HelpCircle size={14} className="text-slate-400 ml-auto opacity-70 outline-none" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[280px] p-3 text-sm leading-relaxed" side="top">
                                    根据一定规则，将文本拆成一段较大的段落，调用 AI 为该段落生成问答对。有非常高的检索精度，但是会丢失很多内容细节。
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </div>

            {/* 分块条件 */}
            {trainingType === 'chunk' && (
                <div className="space-y-3">
                    <div className="text-sm font-medium flex items-center gap-1">
                        分块条件
                        <TooltipProvider>
                            <Tooltip delayDuration={300}>
                                <TooltipTrigger asChild>
                                    <HelpCircle size={14} className="text-slate-400 opacity-70 outline-none" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[280px] p-3 text-sm leading-relaxed" side="top">
                                    当满足一定条件时才触发分块存储，否则会直接完整存储原文
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <SelectDropdown
                                value={chunkTriggerType}
                                onChange={setChunkTriggerType}
                                options={chunkTriggerOptions}
                                width="w-full"
                                allowClear={false}
                            />
                        </div>
                        {chunkTriggerType === 'minSize' && (
                            <div className="flex-1">
                                <Input
                                    type="number"
                                    value={chunkTriggerMinSize}
                                    onChange={(e) => setChunkTriggerMinSize(e.target.value)}
                                    className="bg-white"
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 索引增强 */}
            <div className="space-y-3">
                <div className="text-sm font-medium">
                    索引增强
                </div>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                    <div className="flex items-center gap-2">
                        <Checkbox id="indexPrefixTitle" checked={indexPrefixTitle} onCheckedChange={(checked) => setIndexPrefixTitle(checked as boolean)} />
                        <label htmlFor="indexPrefixTitle" className="text-sm font-medium leading-none cursor-pointer">将标题加入索引</label>
                        <TooltipProvider>
                            <Tooltip delayDuration={300}>
                                <TooltipTrigger asChild>
                                    <HelpCircle size={14} className="text-slate-400 opacity-70 outline-none" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[280px] p-3 text-sm leading-relaxed" side="top">
                                    自动给所有索引加标题名
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    {trainingType === 'chunk' && (
                        <>
                            <div className="flex items-center gap-2">
                                <Checkbox id="autoIndexes" disabled checked={autoIndexes} onCheckedChange={(checked) => setAutoIndexes(checked as boolean)} />
                                <label htmlFor="autoIndexes" className="text-sm font-medium leading-none text-slate-400 cursor-not-allowed">自动生成补充索引</label>
                                <TooltipProvider>
                                    <Tooltip delayDuration={300}>
                                        <TooltipTrigger asChild>
                                            <HelpCircle size={14} className="text-slate-400 opacity-70 outline-none" />
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-[280px] p-3 text-sm leading-relaxed" side="top">
                                            通过大模型进行额外索引生成，提高语义丰富度，提高检索的精度。
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox id="imageIndex" disabled checked={imageIndex} onCheckedChange={(checked) => setImageIndex(checked as boolean)} />
                                <label htmlFor="imageIndex" className="text-sm font-medium leading-none text-slate-400 cursor-not-allowed">图片自动索引</label>
                                <TooltipProvider>
                                    <Tooltip delayDuration={300}>
                                        <TooltipTrigger asChild>
                                            <HelpCircle size={14} className="text-slate-400 opacity-70 outline-none" />
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-[280px] p-3 text-sm leading-relaxed" side="top">
                                            调用 VLM 自动标注文档里的图片，并生成额外的检索索引
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* 分块处理参数 */}
            <div className="space-y-3">
                <div className="text-sm font-medium">
                    分块处理参数
                </div>
                <div className="flex flex-col gap-3">
                    <div
                        className={`p-4 border rounded-xl cursor-pointer flex gap-3 transition-colors ${chunkParams === 'auto' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}
                        onClick={() => setChunkParams('auto')}
                    >
                        <div className="pt-0.5 shrink-0">
                            <div className={`w-4 h-4 rounded-full border flex justify-center items-center ${chunkParams === 'auto' ? 'border-blue-500' : 'border-slate-300'}`}>
                                {chunkParams === 'auto' && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-slate-800">默认</div>
                            <div className="text-xs text-slate-500 mt-1">使用系统默认的参数和规则</div>
                        </div>
                    </div>
                    <div
                        className={`p-4 border rounded-xl flex flex-col gap-4 transition-colors ${chunkParams === 'custom' ? 'border-blue-500 bg-blue-50/10' : 'border-slate-200 hover:bg-slate-50 relative'}`}
                    >
                        <div className="flex gap-3 cursor-pointer" onClick={() => setChunkParams('custom')}>
                            <div className="pt-0.5 shrink-0">
                                <div className={`w-4 h-4 rounded-full border flex justify-center items-center ${chunkParams === 'custom' ? 'border-blue-500' : 'border-slate-300'}`}>
                                    {chunkParams === 'custom' && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-slate-800">自定义</div>
                                <div className="text-xs text-slate-500 mt-1">自定义设置数据处理规则</div>
                            </div>
                        </div>
                        {chunkParams === 'custom' && (
                            <div className="pt-4 border-t border-slate-200/50 space-y-4 text-sm">
                                <div className="flex items-center gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="customChunkType"
                                            value="paragraph"
                                            checked={customChunkType === 'paragraph'}
                                            onChange={(e) => setCustomChunkType(e.target.value)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                        />
                                        <span className="text-slate-700">按段落分块</span>
                                        <TooltipProvider>
                                            <Tooltip delayDuration={300}>
                                                <TooltipTrigger asChild>
                                                    <HelpCircle size={14} className="text-slate-400 opacity-70 outline-none" />
                                                </TooltipTrigger>
                                                <TooltipContent className="max-w-[280px] p-3 text-sm leading-relaxed" side="top">
                                                    优先按 Makdown 标题段落进行分块，如果分块过长，再按长度进行二次分块
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="customChunkType"
                                            value="length"
                                            checked={customChunkType === 'length'}
                                            onChange={(e) => setCustomChunkType(e.target.value)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                        />
                                        <span className="text-slate-700">按长度分块</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="customChunkType"
                                            value="separator"
                                            checked={customChunkType === 'separator'}
                                            onChange={(e) => setCustomChunkType(e.target.value)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                        />
                                        <span className="text-slate-700">按指定分割符分块</span>
                                        <TooltipProvider>
                                            <Tooltip delayDuration={300}>
                                                <TooltipTrigger asChild>
                                                    <HelpCircle size={14} className="text-slate-400 opacity-70 outline-none" />
                                                </TooltipTrigger>
                                                <TooltipContent className="max-w-[280px] p-3 text-sm leading-relaxed" side="top">
                                                    允许你根据自定义的分隔符进行分块。通常用于已处理好的数据，使用特定的分隔符来精确分块。可以使用 | 符号表示多个分割符，例如：“。|.” 表示中英文句号。尽量避免使用正则相关特殊符号，例如: * () [] {"{}"} 等。
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </label>
                                </div>

                                {customChunkType === 'paragraph' && (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="text-slate-600">模型识别段落</div>
                                            <SelectDropdown
                                                value={llmParagraphMode}
                                                onChange={setLlmParagraphMode}
                                                options={llmParagraphOptions}
                                                width="w-full"
                                                allowClear={false}
                                                className="bg-white [&_.select-desc]:hidden"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="text-slate-600">最大段落深度</div>
                                            <Input
                                                type="number"
                                                value={maxParagraphDepth}
                                                onChange={(e) => setMaxParagraphDepth(e.target.value)}
                                                className="bg-white"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="text-slate-600">最大分块大小</div>
                                            <TooltipProvider>
                                                <Tooltip delayDuration={100}>
                                                    <TooltipTrigger asChild>
                                                        <Input
                                                            type="number"
                                                            value={maxChunkSize}
                                                            onChange={(e) => setMaxChunkSize(e.target.value)}
                                                            className="bg-white"
                                                        />
                                                    </TooltipTrigger>
                                                    <TooltipContent side="bottom" className="text-xs">
                                                        范围: {trainingType === 'chunk' ? '64~960000' : '1000~1024000'}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>

                                        {trainingType === 'chunk' && (
                                            <div className="space-y-2">
                                                <div className="text-slate-600 flex items-center gap-1">
                                                    索引大小
                                                    <TooltipProvider>
                                                        <Tooltip delayDuration={100}>
                                                            <TooltipTrigger asChild>
                                                                <HelpCircle size={14} className="text-slate-400 opacity-70 outline-none cursor-help" />
                                                            </TooltipTrigger>
                                                            <TooltipContent className="max-w-[280px] p-3 text-sm leading-relaxed" side="top">
                                                                向量化时内容的长度，系统会自动按该大小对分块进行进一步的分割。
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                                <SelectDropdown
                                                    value={indexSize}
                                                    onChange={setIndexSize}
                                                    options={indexSizeSelectOptions}
                                                    width="w-full"
                                                    allowClear={false}
                                                />
                                            </div>
                                        )}

                                        {trainingType === 'qa' && (
                                            <div className="space-y-2">
                                                <div className="text-slate-600">QA 拆分引导词</div>
                                                <Textarea
                                                    value={qaPrompt}
                                                    onChange={(e) => setQaPrompt(e.target.value)}
                                                    className="bg-slate-50 min-h-[160px] text-xs leading-relaxed text-slate-800 border-slate-200"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {customChunkType === 'length' && (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="text-slate-600">分块大小</div>
                                            <TooltipProvider>
                                                <Tooltip delayDuration={100}>
                                                    <TooltipTrigger asChild>
                                                        <Input
                                                            type="number"
                                                            value={maxChunkSize}
                                                            onChange={(e) => setMaxChunkSize(e.target.value)}
                                                            className="bg-white"
                                                        />
                                                    </TooltipTrigger>
                                                    <TooltipContent side="bottom" className="text-xs">
                                                        范围: {trainingType === 'chunk' ? '64~960000' : '1000~1024000'}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>

                                        {trainingType === 'chunk' && (
                                            <div className="space-y-2">
                                                <div className="text-slate-600 flex items-center gap-1">
                                                    索引大小
                                                    <TooltipProvider>
                                                        <Tooltip delayDuration={100}>
                                                            <TooltipTrigger asChild>
                                                                <HelpCircle size={14} className="text-slate-400 opacity-70 outline-none cursor-help" />
                                                            </TooltipTrigger>
                                                            <TooltipContent className="max-w-[280px] p-3 text-sm leading-relaxed" side="top">
                                                                向量化时内容的长度，系统会自动按该大小对分块进行进一步的分割。
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                                <SelectDropdown
                                                    value={indexSize}
                                                    onChange={setIndexSize}
                                                    options={indexSizeSelectOptions}
                                                    width="w-full"
                                                    allowClear={false}
                                                />
                                            </div>
                                        )}

                                        {trainingType === 'qa' && (
                                            <div className="space-y-2">
                                                <div className="text-slate-600">QA 拆分引导词</div>
                                                <Textarea
                                                    value={qaPrompt}
                                                    onChange={(e) => setQaPrompt(e.target.value)}
                                                    className="bg-slate-50 min-h-[160px] text-xs leading-relaxed text-slate-800 border-slate-200"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {customChunkType === 'separator' && (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="text-slate-600">分隔符</div>
                                            <div className="flex gap-2">
                                                <div className="flex-1">
                                                    <SelectDropdown
                                                        value={selectedSeparator}
                                                        onChange={(val) => {
                                                            setSelectedSeparator(val);
                                                            if (val !== 'Other') {
                                                                setCustomSeparator(val);
                                                            } else {
                                                                setCustomSeparator('');
                                                            }
                                                        }}
                                                        options={separatorSelectOptions}
                                                        width="w-full"
                                                        allowClear={false}
                                                    />
                                                </div>
                                                {selectedSeparator === 'Other' && (
                                                    <div className="flex-1">
                                                        <Input
                                                            value={customSeparator}
                                                            onChange={(e) => setCustomSeparator(e.target.value)}
                                                            className="bg-white"
                                                            placeholder="\n;======;==SPLIT=="
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {trainingType === 'chunk' && (
                                            <div className="space-y-2">
                                                <div className="text-slate-600 flex items-center gap-1">
                                                    索引大小
                                                    <TooltipProvider>
                                                        <Tooltip delayDuration={100}>
                                                            <TooltipTrigger asChild>
                                                                <HelpCircle size={14} className="text-slate-400 opacity-70 outline-none cursor-help" />
                                                            </TooltipTrigger>
                                                            <TooltipContent className="max-w-[280px] p-3 text-sm leading-relaxed" side="top">
                                                                向量化时内容的长度，系统会自动按该大小对分块进行进一步的分割。
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                                <SelectDropdown
                                                    value={indexSize}
                                                    onChange={setIndexSize}
                                                    options={indexSizeSelectOptions}
                                                    width="w-full"
                                                    allowClear={false}
                                                />
                                            </div>
                                        )}

                                        {trainingType === 'qa' && (
                                            <div className="space-y-2">
                                                <div className="text-slate-600">QA 拆分引导词</div>
                                                <Textarea
                                                    value={qaPrompt}
                                                    onChange={(e) => setQaPrompt(e.target.value)}
                                                    className="bg-slate-50 min-h-[160px] text-xs leading-relaxed text-slate-800 border-slate-200"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8" onClick={onNext}>
                        下一步
                    </Button>
                </div>
            </div>
        </div>
    );
}

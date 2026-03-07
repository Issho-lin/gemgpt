import { Button } from '@/components/ui/button';

interface ImportPreviewStepProps {
    onNext: () => void;
    onPrev: () => void;
}

export function ImportPreviewStep({ onNext, onPrev }: ImportPreviewStepProps) {
    return (
        <div className="flex flex-col items-center justify-center p-12 space-y-6">
            <div className="text-lg font-medium text-slate-700">数据分块预览（尚未实现）</div>
            <div className="flex gap-4">
                <Button variant="outline" onClick={onPrev}>上一步</Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onNext}>下一步</Button>
            </div>
        </div>
    );
}

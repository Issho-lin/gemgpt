import { Button } from '@/components/ui/button';

interface ImportConfirmStepProps {
    onPrev: () => void;
    onConfirm: () => void;
}

export function ImportConfirmStep({ onPrev, onConfirm }: ImportConfirmStepProps) {
    return (
        <div className="flex flex-col items-center justify-center p-12 space-y-6">
            <div className="text-lg font-medium text-slate-700">确认上传并开始处理（尚未实现）</div>
            <div className="flex gap-4">
                <Button variant="outline" onClick={onPrev}>上一步</Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onConfirm}>确认上传</Button>
            </div>
        </div>
    );
}

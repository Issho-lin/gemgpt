type StepperProps = {
    currentStep: number
    steps: string[]
    className?: string
}

export default function Stepper({ currentStep, steps, className }: StepperProps) {
    return (
        <div
            className={`rounded-lg border border-slate-200 bg-slate-50/60 px-6 py-4 ${className || ""}`}
        >
            <div className="mx-auto flex w-full max-w-5xl items-center">
                {steps.map((step, index) => {
                    const stepNumber = index + 1
                    const isActive = currentStep === stepNumber
                    const isCompleted = currentStep > stepNumber
                    const isReached = isActive || isCompleted
                    const isLast = index === steps.length - 1

                    return (
                        <div key={`${step}-${stepNumber}`} className="flex items-center flex-1 min-w-0">
                            <div className="inline-flex items-center justify-center gap-2.5 min-w-0">
                                <span
                                    className={[
                                        "h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium shrink-0",
                                        isReached
                                            ? "bg-blue-600 text-white"
                                            : "bg-slate-200 text-slate-500"
                                    ].join(" ")}
                                >
                                    {stepNumber}
                                </span>
                                <span
                                    className={[
                                        "text-sm min-w-0 truncate",
                                        isReached ? "text-slate-800 font-medium" : "text-slate-500"
                                    ].join(" ")}
                                >
                                    {step}
                                </span>
                            </div>

                            {!isLast && (
                                <div
                                    className={[
                                        "mx-4 h-px flex-1 min-w-4",
                                        currentStep > stepNumber ? "bg-blue-300" : "bg-slate-300"
                                    ].join(" ")}
                                />
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

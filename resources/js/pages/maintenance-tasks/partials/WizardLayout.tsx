import { ReactNode } from 'react';
import { useMaintenanceTaskStore } from '@/hooks/useMaintenanceTaskStore';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface Props {
    children: ReactNode;
}

const steps = [
    { number: 1, title: 'Basis' },
    { number: 2, title: 'Verrijking' },
    { number: 3, title: 'Groeperen' },
    { number: 4, title: 'Taaklijst' },
    { number: 5, title: 'Validatie' },
    { number: 6, title: 'Export' },
];

export default function WizardLayout({ children }: Props) {
    const { currentStep, setStep } = useMaintenanceTaskStore();

    return (
        <div className="flex flex-col gap-8">
            {/* Progress Stepper */}
            <div className="relative flex items-center justify-between w-full max-w-4xl mx-auto px-4">
                <div className="absolute left-0 top-1/2 h-0.5 w-full bg-border -z-10" />

                {steps.map((step) => {
                    const isCompleted = step.number < currentStep;
                    const isCurrent = step.number === currentStep;

                    return (
                        <div key={step.number} className="flex flex-col items-center gap-2 bg-background px-2">
                            <div
                                className={cn(
                                    "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                                    isCompleted ? "border-primary bg-primary text-primary-foreground" :
                                        isCurrent ? "border-primary bg-background text-primary" :
                                            "border-muted-foreground text-muted-foreground"
                                )}
                            >
                                {isCompleted ? <Check className="h-4 w-4" /> : step.number}
                            </div>
                            <span className={cn("text-xs font-medium", isCurrent ? "text-primary" : "text-muted-foreground")}>
                                {step.title}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Step Content */}
            <div className="flex-1 w-full max-w-5xl mx-auto">
                {children}
            </div>
        </div>
    );
}

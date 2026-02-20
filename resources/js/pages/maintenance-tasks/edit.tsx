import { useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { MaintenanceTask } from '@/types/maintenance';
import { useMaintenanceTaskStore } from '@/hooks/useMaintenanceTaskStore';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import WizardLayout from './partials/WizardLayout';
import Step2Enrichment from './partials/Step2Enrichment';
import Step3Grouping from './partials/Step3Grouping';
import Step4TaskList from './partials/Step4TaskList';
import Step5Validation from './partials/Step5Validation';
import Step6Export from './partials/Step6Export';

interface Props {
    task: MaintenanceTask;
}

export default function Edit({ task }: Props) {
    const { setTask, currentTask, currentStep, setStep } = useMaintenanceTaskStore();

    useEffect(() => {
        setTask(task);
        // Start at step 2 because Step 1 (Create) is already done
        if (currentStep === 1) setStep(2);
    }, [task]);

    if (!currentTask) return null;

    const renderStep = () => {
        switch (currentStep) {
            case 2: return <Step2Enrichment />;
            case 3: return <Step3Grouping />;
            case 4: return <Step4TaskList />;
            case 5: return <Step5Validation />;
            case 6: return <Step6Export />;
            default: return <Step2Enrichment />;
        }
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Onderhoudstaken', href: '/maintenance-tasks' },
            { title: task.name, href: `/maintenance-tasks/${task.id}` },
        ]}>
            <Head title={`Bewerken: ${task.name}`} />

            <div className="flex h-full flex-col">
                <div className="border-b p-4 bg-background">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/maintenance-tasks">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold">{currentTask.name || 'Naamloze Taak'}</h1>
                            <p className="text-sm text-muted-foreground">
                                {currentTask.status.toUpperCase()} • {currentTask.items?.[0]?.object_id || 'Geen object'} • {currentTask.plan?.frequency_value} {currentTask.plan?.frequency_unit}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-6 bg-muted/10">
                    <div className="mx-auto max-w-5xl space-y-8">
                        <div className="rounded-lg border bg-card p-6 shadow-sm">
                            <WizardLayout>
                                {renderStep()}
                            </WizardLayout>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

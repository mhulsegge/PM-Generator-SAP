import { useMaintenanceTaskStore } from '@/hooks/useMaintenanceTaskStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Download } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function Step6Export() {
    const { currentTask, updateTask, prevStep } = useMaintenanceTaskStore();

    if (!currentTask) return null;

    const handleComplete = () => {
        // Optimistic update
        updateTask({ status: 'ready', is_sap_ready: true });

        // Save to backend
        router.put(route('maintenance-tasks.update', currentTask.id || 0), {
            ...currentTask,
            status: 'ready',
            is_sap_ready: true
        }, {
            onSuccess: () => {
                // Maybe redirect or show toast
            }
        });
    };

    const handleExport = () => {
        // Mock export
        alert("Export gestart... (MVP placeholder)");
        // In real app: window.location.href = route('maintenance-tasks.export', currentTask.id);
    };

    return (
        <div className="max-w-xl mx-auto space-y-8 text-center">

            <div className="flex justify-center mb-6">
                <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="h-12 w-12 text-green-600" />
                </div>
            </div>

            <h1 className="text-3xl font-bold">Klaar voor SAP!</h1>
            <p className="text-muted-foreground text-lg">
                De preventieve onderhoudstaak <strong>{currentTask.name}</strong> is volledig en gevalideerd.
            </p>

            <div className="grid gap-4 max-w-sm mx-auto">
                <Button size="lg" className="w-full gap-2" onClick={handleComplete} disabled={currentTask.status === 'ready'}>
                    {currentTask.status === 'ready' ? 'Status: Gereed' : 'Markeren als Gereed'}
                </Button>

                <Button variant="outline" size="lg" className="w-full gap-2" onClick={handleExport}>
                    <Download className="h-4 w-4" /> Download SAP Upload Package
                </Button>
            </div>

            <div className="pt-8">
                <Button variant="ghost" onClick={prevStep}>Terug naar validatie</Button>
            </div>
        </div>
    );
}

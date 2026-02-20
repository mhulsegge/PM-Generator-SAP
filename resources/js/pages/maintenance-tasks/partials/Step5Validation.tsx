import { useMaintenanceTaskStore } from '@/hooks/useMaintenanceTaskStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function Step5Validation() {
    const { currentTask, updateTask, nextStep, prevStep } = useMaintenanceTaskStore();

    if (!currentTask) return null;

    // Mock validation logic
    const hasPlan = !!currentTask.plan;
    const hasItems = (currentTask.items?.length || 0) > 0;
    const hasOps = (currentTask.task_list?.operations?.length || 0) > 0;
    const allValid = hasPlan && hasItems && hasOps;

    const suggestedName = `${currentTask.plan?.frequency_value}${currentTask.plan?.frequency_unit} - ${currentTask.name} - ${currentTask.items?.[0]?.object_type === 'equipment' ? 'EQ' : 'FL'}`;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Validatie & Naamgeving</CardTitle>
                    <CardDescription>Controleer de data voordat we deze gereedmelden voor SAP.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="font-medium">Compleetheid Check</h3>
                        <div className="grid gap-2">
                            <ValidationItem label="Frequentie & Plan" valid={hasPlan} />
                            <ValidationItem label="Object Link (Equipment/FLOC)" valid={hasItems} />
                            <ValidationItem label="Taaklijst / Operaties" valid={hasOps} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Voorgestelde Naamgeving (Conventie)</Label>
                        <div className="flex gap-2">
                            <Input value={currentTask.name} onChange={(e) => updateTask({ name: e.target.value })} />
                            <Button variant="secondary" onClick={() => updateTask({ name: suggestedName })}>
                                Gebruik suggestie: {suggestedName}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>Terug</Button>
                <Button onClick={nextStep} disabled={!allValid}>
                    Volgende: Afronden
                </Button>
            </div>
        </div>
    );
}

function ValidationItem({ label, valid }: { label: string, valid: boolean }) {
    return (
        <div className="flex items-center gap-2 p-2 rounded border bg-card">
            {valid ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
            )}
            <span className={valid ? '' : 'text-muted-foreground'}>{label}</span>
        </div>
    );
}

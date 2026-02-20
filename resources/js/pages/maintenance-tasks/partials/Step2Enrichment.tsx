import { MaintenanceTask } from '@/types/maintenance';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Lightbulb } from 'lucide-react';
import { useMaintenanceTaskStore } from '@/hooks/useMaintenanceTaskStore';
import { useMasterData } from '@/hooks/useMasterData';

export default function Step2Enrichment() {
    const { currentTask, updateTask, nextStep, prevStep } = useMaintenanceTaskStore();
    const { disciplines, strategies } = useMasterData();

    if (!currentTask) return null;

    const handlePlanUpdate = (field: string, value: any) => {
        if (!currentTask.plan) return;
        updateTask({
            plan: {
                ...currentTask.plan,
                [field]: value
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Plan details verrijken</CardTitle>
                        <CardDescription>Koppel strategie en discipline.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label>Strategie Package (Optioneel)</Label>
                            <Select
                                value={currentTask.plan?.strategy_package || ''}
                                onValueChange={(val) => handlePlanUpdate('strategy_package', val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecteer package..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Geen</SelectItem>
                                    {strategies.map(strategy => (
                                        <SelectItem key={strategy.key} value={strategy.key}>
                                            {strategy.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label>Vakdiscipline</Label>
                            <Select
                                value={(currentTask.plan as any)?.discipline || ''}
                                onValueChange={(val) => handlePlanUpdate('discipline', val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Kies discipline..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {disciplines.map(discipline => (
                                        <SelectItem key={discipline.key} value={discipline.key}>
                                            {discipline.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-muted/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="h-5 w-5 text-yellow-500" />
                            Suggesties
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            Op basis van object <strong>{currentTask.items?.[0]?.object_id}</strong> hebben we deze suggesties:
                        </p>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2 text-sm bg-background p-2 rounded border">
                                <Check className="h-4 w-4 mt-1 text-green-500" />
                                <div>
                                    <strong>Standaard smeerroute</strong>
                                    <p className="text-xs text-muted-foreground">Wordt vaak gebruikt voor dit type pompen.</p>
                                    <Button variant="link" size="sm" className="h-auto p-0 text-primary">Toepassen</Button>
                                </div>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>Terug</Button>
                <Button onClick={nextStep}>Volgende: Samenvoegen</Button>
            </div>
        </div>
    );
}

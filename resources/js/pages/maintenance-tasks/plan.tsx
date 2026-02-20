import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import TaskLayout from './layout';
import { MaintenanceTask } from '@/types/maintenance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface Props {
    task: MaintenanceTask;
    masterData: {
        strategies: any[];
        frequencyUnits: any[];
        orderTypes: any[];
    };
}

export default function MaintenancePlan({ task, masterData }: Props) {
    const { strategies, frequencyUnits, orderTypes } = masterData;

    // We update via simple form posting or Inertia routing.
    const { data, setData, put, processing, errors } = useForm({
        plan: {
            strategy_package: task.plan?.strategy_package || '',
            frequency_unit: task.plan?.frequency_unit || 'WK',
            frequency_value: task.plan?.frequency_value || 1,
            start_date: task.plan?.start_date || '',
            call_horizon_value: task.plan?.call_horizon_value || 100,
            call_horizon_unit: task.plan?.call_horizon_unit || '%',
            scheduling_period_value: (task.plan as any)?.scheduling_period_value || 1,
            scheduling_period_unit: (task.plan as any)?.scheduling_period_unit || 'YR',
            order_type: (task.plan as any)?.order_type || 'PM01',
            completion_requirement: (task.plan as any)?.completion_requirement || false,
            auto_order_generation: (task.plan as any)?.auto_order_generation ?? true,
            is_strategy_plan: task.plan?.is_strategy_plan || false,
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('maintenance-tasks.update', task.id), {
            preserveScroll: true,
        });
    };

    return (
        <TaskLayout task={task} title="Maintenance Plan">
            <div className="space-y-6">
                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Maintenance Plan (Strategieplan)</CardTitle>
                            <CardDescription>
                                Definieer de planningmotor. Hier sturen we aan wanneer en hoe SAP de orders of calls genereert.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            {/* Basis Setup */}
                            <div className="space-y-4 border-b pb-6">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase">Algemene Planningsgegevens</h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Order Type</Label>
                                        <Select
                                            value={data.plan.order_type}
                                            onValueChange={(val) => setData('plan', { ...data.plan, order_type: val })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {orderTypes.map((ot: any) => (
                                                    <SelectItem key={ot.id} value={ot.key}>{ot.key} - {ot.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Maintenance Strategy</Label>
                                        <Select
                                            value={data.plan.strategy_package}
                                            onValueChange={(val) => setData('plan', { ...data.plan, strategy_package: val, is_strategy_plan: val !== 'none' })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Kies een strategie (optioneel)" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">Geen (Single Cycle Plan)</SelectItem>
                                                {strategies.map((strat: any) => (
                                                    <SelectItem key={strat.id} value={strat.name}>
                                                        {strat.name} {strat.description ? `- ${strat.description}` : ''}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* Cycle info (if not strategy) */}
                            {data.plan.strategy_package === 'none' && (
                                <div className="space-y-4 border-b pb-6">
                                    <h3 className="text-sm font-semibold text-muted-foreground uppercase">Single Cycle</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label>Frequentie Waarde</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={data.plan.frequency_value}
                                                onChange={(e) => setData('plan', { ...data.plan, frequency_value: parseInt(e.target.value) })}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Frequentie Eenheid</Label>
                                            <Select
                                                value={data.plan.frequency_unit}
                                                onValueChange={(val) => setData('plan', { ...data.plan, frequency_unit: val })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {frequencyUnits.map((u: any) => (
                                                        <SelectItem key={u.id} value={u.key}>{u.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Scheduling Parameters */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase">Scheduling Parameters</h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Startdatum (Start of Cycle)</Label>
                                        <Input
                                            type="date"
                                            value={data.plan.start_date}
                                            onChange={(e) => setData('plan', { ...data.plan, start_date: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Call Horizon (%)</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={data.plan.call_horizon_value}
                                            onChange={(e) => setData('plan', { ...data.plan, call_horizon_value: parseInt(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Scheduling Period Waarde</Label>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={data.plan.scheduling_period_value}
                                            onChange={(e) => setData('plan', { ...data.plan, scheduling_period_value: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Scheduling Period Eenheid</Label>
                                        <Select
                                            value={data.plan.scheduling_period_unit}
                                            onValueChange={(val) => setData('plan', { ...data.plan, scheduling_period_unit: val })}
                                        >
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="YR">Jaren (YR)</SelectItem>
                                                <SelectItem value="MON">Maanden (MON)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 pt-4">
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="completion"
                                            checked={data.plan.completion_requirement}
                                            onCheckedChange={(checked) => setData('plan', { ...data.plan, completion_requirement: checked })}
                                        />
                                        <Label htmlFor="completion">Completion Requirement</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="auto_order"
                                            checked={data.plan.auto_order_generation}
                                            onCheckedChange={(checked) => setData('plan', { ...data.plan, auto_order_generation: checked })}
                                        />
                                        <Label htmlFor="auto_order">Auto Order Generation</Label>
                                    </div>
                                </div>

                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-4 flex justify-end">
                        <Button type="submit" disabled={processing}>Opslaan</Button>
                    </div>
                </form>
            </div>
        </TaskLayout>
    );
}

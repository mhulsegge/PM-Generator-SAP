import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import TaskLayout from './layout';
import { MaintenanceTask } from '@/types/maintenance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Props {
    task: MaintenanceTask;
    masterData: {
        objects: any[];
        plannerGroups: any[];
        workCenters: any[];
        orderTypes: any[];
    };
}

export default function MaintenanceItems({ task, masterData }: Props) {
    const { objects, plannerGroups, workCenters, orderTypes } = masterData;
    const { data, setData, put, processing } = useForm({
        items: task.items || []
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here we send the items to update on the MaintenanceTask wrapper length
        put(route('maintenance-tasks.update', task.id), {
            preserveScroll: true,
        });
    };

    const handleAddItem = () => {
        setData('items', [
            ...data.items,
            { object_type: 'equipment', object_id: '', planner_group: '', main_work_center: '', order_type: 'PM01', location: '' }
        ]);
    };

    const handleRemoveItem = (index: number) => {
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData('items', newItems);
    };

    const handleItemChange = (index: number, field: string, value: string) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setData('items', newItems);
    };

    return (
        <TaskLayout task={task} title="Maintenance Items">
            <div className="space-y-6">
                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Maintenance Items (PO-Posities)</CardTitle>
                            <CardDescription>
                                Koppel het plan aan de fysieke assets (Equipment of Functional Location) en geef planningsdata (Werkplek, Plannergroep) mee.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {data.items.map((item: any, idx) => (
                                    <div key={idx} className="border p-4 rounded-lg relative bg-card shadow-sm space-y-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <Badge variant="secondary">Item #{idx + 1}</Badge>
                                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleRemoveItem(idx)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label>Object Type</Label>
                                                <Select
                                                    value={item.object_type}
                                                    onValueChange={(val) => handleItemChange(idx, 'object_type', val)}
                                                >
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="equipment">Equipment</SelectItem>
                                                        <SelectItem value="floc">Functionele Locatie</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Object ID / Tag</Label>
                                                <Select
                                                    value={item.object_id || ''}
                                                    onValueChange={(val) => handleItemChange(idx, 'object_id', val)}
                                                >
                                                    <SelectTrigger><SelectValue placeholder="Selecteer Object" /></SelectTrigger>
                                                    <SelectContent>
                                                        {objects.filter(o => o.type === item.object_type).map(o => (
                                                            <SelectItem key={o.id} value={o.object_id}>{o.object_id} - {o.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="grid gap-2">
                                                <Label>Planner Group</Label>
                                                <Select
                                                    value={item.planner_group || ''}
                                                    onValueChange={(val) => handleItemChange(idx, 'planner_group', val)}
                                                >
                                                    <SelectTrigger><SelectValue placeholder="Optioneel" /></SelectTrigger>
                                                    <SelectContent>
                                                        {plannerGroups.map(pg => (
                                                            <SelectItem key={pg.id} value={pg.key}>{pg.key} - {pg.label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Main Work Center</Label>
                                                <Select
                                                    value={item.main_work_center || ''}
                                                    onValueChange={(val) => handleItemChange(idx, 'main_work_center', val)}
                                                >
                                                    <SelectTrigger><SelectValue placeholder="Optioneel" /></SelectTrigger>
                                                    <SelectContent>
                                                        {workCenters.map(wc => (
                                                            <SelectItem key={wc.id} value={wc.key}>{wc.key} - {wc.label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Order Type (Override)</Label>
                                                <Select
                                                    value={item.order_type || ''}
                                                    onValueChange={(val) => handleItemChange(idx, 'order_type', val)}
                                                >
                                                    <SelectTrigger><SelectValue placeholder="Laat leeg voor default" /></SelectTrigger>
                                                    <SelectContent>
                                                        {orderTypes.map(ot => (
                                                            <SelectItem key={ot.id} value={ot.key}>{ot.key} - {ot.label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <Button type="button" variant="outline" className="w-full gap-2 border-dashed" onClick={handleAddItem}>
                                    <Plus className="w-4 h-4" /> Toevoegen
                                </Button>
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

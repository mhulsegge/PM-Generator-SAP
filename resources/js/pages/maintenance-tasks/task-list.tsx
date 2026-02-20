import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import TaskLayout from './layout';
import { MaintenanceTask, TaskList, TaskListOperation } from '@/types/maintenance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Package } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';

interface Props {
    task: MaintenanceTask;
    masterData: {
        strategies: any[];
        controlKeys: any[];
        workCenters: any[];
        plants: any[];
        articles: any[];
    };
}

export default function EditTaskList({ task, masterData }: Props) {
    const { strategies, controlKeys, workCenters, plants, articles } = masterData;
    const [managingMaterialsOpIdx, setManagingMaterialsOpIdx] = useState<number | null>(null);

    const planStrategyName = task.plan?.strategy_package;
    const selectedStrategy = planStrategyName && planStrategyName !== 'none'
        ? strategies.find(s => s.name === planStrategyName)
        : null;
    const availablePackages = selectedStrategy?.packages || [];

    // Convert to form data
    const existingTaskList = task.task_list || {
        type: 'general', status: '1', description: task.name, work_center: '', plant: '', usage: '', strategy_package: task.plan?.strategy_package || 'none', operations: []
    } as TaskList;

    const { data, setData, put, processing } = useForm<{ task_list: TaskList }>({
        task_list: existingTaskList
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Since the current endpoint requires a different shape or a custom update for nested lists,
        // we'll use Inertia. But we would need to build the custom backend logic in MaintenanceTaskController
        // for now we'll submit the `task_list` object.
        put(route('maintenance-tasks.update', task.id), {
            preserveScroll: true,
        });
    };

    const handleAddOp = () => {
        const currentOps: TaskListOperation[] = data.task_list.operations || [];
        const nextNum = currentOps.length > 0 ? currentOps[currentOps.length - 1].operation_number + 10 : 10;
        setData('task_list', {
            ...data.task_list,
            operations: [
                ...currentOps,
                { operation_number: nextNum, short_text: '', work_center: '', duration_normal: 1, duration_unit: 'H', number_of_people: 1, control_key: 'PM01', strategy_package: '' }
            ] as TaskListOperation[]
        });
    };

    const handleRemoveOp = (idx: number) => {
        const newOps = [...(data.task_list.operations || [])];
        newOps.splice(idx, 1);
        setData('task_list', { ...data.task_list, operations: newOps });
    };

    const handleOpChange = (idx: number, field: string, value: any) => {
        const newOps: TaskListOperation[] = [...(data.task_list.operations || [])] as TaskListOperation[];
        newOps[idx] = { ...newOps[idx], [field]: value };
        setData('task_list', { ...data.task_list, operations: newOps });
    };

    const handleAddMaterial = (opIdx: number) => {
        const newOps: TaskListOperation[] = [...(data.task_list.operations || [])] as TaskListOperation[];
        const op = newOps[opIdx];
        const newMats = [...(op.materials || [])];
        newMats.push({ material_number: '', quantity: 1, unit: 'ST' });
        newOps[opIdx] = { ...op, materials: newMats };
        setData('task_list', { ...data.task_list, operations: newOps });
    };

    const handleRemoveMaterial = (opIdx: number, matIdx: number) => {
        const newOps: TaskListOperation[] = [...(data.task_list.operations || [])] as TaskListOperation[];
        const op = newOps[opIdx];
        const newMats = [...(op.materials || [])];
        newMats.splice(matIdx, 1);
        newOps[opIdx] = { ...op, materials: newMats };
        setData('task_list', { ...data.task_list, operations: newOps });
    };

    const handleMaterialChange = (opIdx: number, matIdx: number, field: string, value: any) => {
        const newOps: TaskListOperation[] = [...(data.task_list.operations || [])] as TaskListOperation[];
        const op = newOps[opIdx];
        const newMats = [...(op.materials || [])];
        const updatedMat = { ...newMats[matIdx], [field]: value };
        if (field === 'material_number') {
            const article = articles.find(a => a.article_number === value);
            if (article) {
                updatedMat.description = article.description;
                updatedMat.unit = article.unit;
            }
        }
        newMats[matIdx] = updatedMat;
        newOps[opIdx] = { ...op, materials: newMats };
        setData('task_list', { ...data.task_list, operations: newOps });
    };

    return (
        <TaskLayout task={task} title="Taaklijst">
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Header Data */}
                <Card>
                    <CardHeader>
                        <CardTitle>Taaklijst Header</CardTitle>
                        <CardDescription>De inhoudelijke instructies van het onderhoud.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Beschrijving / Groep</Label>
                                <Input
                                    value={data.task_list.description || ''}
                                    onChange={(e) => setData('task_list', { ...data.task_list, description: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Toepassing (Usage)</Label>
                                <Input
                                    value={data.task_list.usage || ''}
                                    onChange={(e) => setData('task_list', { ...data.task_list, usage: e.target.value })}
                                    placeholder="e.g. 4 voor Plant Maintenance"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label>Main Work Center</Label>
                                <Input
                                    value={data.task_list.work_center || ''}
                                    onChange={(e) => setData('task_list', { ...data.task_list, work_center: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Strategie Referentie</Label>
                                <Select
                                    value={data.task_list.strategy_package || 'none'}
                                    onValueChange={(val) => setData('task_list', { ...data.task_list, strategy_package: val })}
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Geen (Single Cycle plan)</SelectItem>
                                        {strategies.map((strat: any) => (
                                            <SelectItem key={strat.id} value={strat.key}>{strat.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Plant</Label>
                                <Input
                                    value={data.task_list.plant || ''}
                                    onChange={(e) => setData('task_list', { ...data.task_list, plant: e.target.value })}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Operations */}
                <Card>
                    <CardHeader>
                        <CardTitle>Operations (Taakregels)</CardTitle>
                        <CardDescription>
                            Voeg de stappen toe die uitgevoerd moeten worden, specificeer werkcentra, stuurcodes en packages (voor strategie mapping).
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="overflow-hidden border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px]">Op. Nr</TableHead>
                                        <TableHead>Werkcentrum</TableHead>
                                        <TableHead>Control Key</TableHead>
                                        <TableHead>Korte Omschrijving</TableHead>
                                        <TableHead className="w-[100px]">Duur (H)</TableHead>
                                        <TableHead className="w-[100px]">Pakket</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(data.task_list.operations || []).map((op: TaskListOperation, idx: number) => (
                                        <TableRow key={idx}>
                                            <TableCell>
                                                <Input
                                                    className="w-16 p-1 text-sm h-8"
                                                    value={op.operation_number}
                                                    onChange={(e) => handleOpChange(idx, 'operation_number', parseInt(e.target.value))}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    className="p-1 text-sm h-8"
                                                    value={op.work_center || ''}
                                                    onChange={(e) => handleOpChange(idx, 'work_center', e.target.value)}
                                                    placeholder="Default"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    value={op.control_key || 'PM01'}
                                                    onValueChange={(val) => handleOpChange(idx, 'control_key', val)}
                                                >
                                                    <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        {controlKeys.map((k: any) => (
                                                            <SelectItem key={k.id} value={k.key}>{k.key}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    className="p-1 text-sm h-8"
                                                    value={op.short_text || ''}
                                                    onChange={(e) => handleOpChange(idx, 'short_text', e.target.value)}
                                                    placeholder="Vervangen filter..."
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    step="0.1"
                                                    className="w-20 p-1 text-sm h-8"
                                                    value={op.duration_normal || 0}
                                                    onChange={(e) => handleOpChange(idx, 'duration_normal', parseFloat(e.target.value))}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {availablePackages.length > 0 ? (
                                                    <Select
                                                        value={op.strategy_package || ''}
                                                        onValueChange={(val) => handleOpChange(idx, 'strategy_package', val)}
                                                    >
                                                        <SelectTrigger className="h-8"><SelectValue placeholder="Kies package" /></SelectTrigger>
                                                        <SelectContent>
                                                            {availablePackages.map((pkg: any) => (
                                                                <SelectItem key={pkg.id} value={pkg.name}>{pkg.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <Input
                                                        className="p-1 text-sm h-8"
                                                        value={op.strategy_package || ''}
                                                        onChange={(e) => handleOpChange(idx, 'strategy_package', e.target.value)}
                                                        placeholder="e.g. 1M of 1 JR"
                                                        disabled={Boolean(planStrategyName && planStrategyName !== 'none')}
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => setManagingMaterialsOpIdx(idx)}>
                                                        <Package className="h-4 w-4" />
                                                    </Button>
                                                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleRemoveOp(idx)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <Button type="button" variant="outline" className="w-full gap-2 border-dashed" onClick={handleAddOp}>
                            <Plus className="w-4 h-4" /> Regel Toevoegen
                        </Button>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" disabled={processing}>Opslaan</Button>
                </div>

            </form>

            <Dialog open={managingMaterialsOpIdx !== null} onOpenChange={(open) => !open && setManagingMaterialsOpIdx(null)}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Materiaallijst / Componenten</DialogTitle>
                        <DialogDescription>
                            Voeg artikelen toe die nodig zijn voor deze taakregel.
                        </DialogDescription>
                    </DialogHeader>
                    {managingMaterialsOpIdx !== null && (
                        <div className="space-y-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Artikel</TableHead>
                                        <TableHead className="w-[120px]">Aantal</TableHead>
                                        <TableHead className="w-[100px]">Eenheid</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(data.task_list.operations?.[managingMaterialsOpIdx]?.materials || []).map((mat: any, mIdx: number) => (
                                        <TableRow key={mIdx}>
                                            <TableCell>
                                                <Select
                                                    value={mat.material_number}
                                                    onValueChange={(val) => handleMaterialChange(managingMaterialsOpIdx, mIdx, 'material_number', val)}
                                                >
                                                    <SelectTrigger><SelectValue placeholder="Selecteer artikel" /></SelectTrigger>
                                                    <SelectContent>
                                                        {articles.map(a => (
                                                            <SelectItem key={a.id} value={a.article_number}>{a.article_number} - {a.description}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    min="0.1"
                                                    step="0.1"
                                                    className="w-full"
                                                    required
                                                    value={mat.quantity || ''}
                                                    onChange={(e) => handleMaterialChange(managingMaterialsOpIdx, mIdx, 'quantity', parseFloat(e.target.value))}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    className="w-full"
                                                    value={mat.unit || 'ST'}
                                                    disabled
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Button type="button" variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => handleRemoveMaterial(managingMaterialsOpIdx, mIdx)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Button type="button" variant="outline" className="w-full border-dashed" onClick={() => handleAddMaterial(managingMaterialsOpIdx)}>
                                <Plus className="h-4 w-4 mr-2" /> Materiaal Toevoegen
                            </Button>
                        </div>
                    )}
                    <DialogFooter>
                        <Button type="button" onClick={() => setManagingMaterialsOpIdx(null)}>Klaar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </TaskLayout>
    );
}

import { useState } from 'react';
import { useForm, router, Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { TemplateTaskList, TemplateTaskListOperation, TemplateTaskListOperationMaterial } from '@/types/maintenance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, ArrowLeft, Package } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

interface Props {
    template: TemplateTaskList;
    isCreating: boolean;
    masterData: {
        strategies: any[];
        controlKeys: any[];
        workCenters: any[];
        plants: any[];
        articles: any[];
    };
}

export default function EditTemplateTaskList({ template, isCreating, masterData }: Props) {
    const { strategies, controlKeys, workCenters, plants, articles } = masterData;
    const [managingMaterialsOpIdx, setManagingMaterialsOpIdx] = useState<number | null>(null);

    const planStrategyId = template.maintenance_strategy_id;
    const selectedStrategy = planStrategyId
        ? strategies.find(s => s.id === planStrategyId)
        : null;
    const availablePackages = selectedStrategy?.packages || [];

    const { data, setData, post, put, processing } = useForm<TemplateTaskList>({
        ...template,
        operations: template.operations || []
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isCreating) {
            post(route('template-task-lists.store'));
        } else {
            put(route('template-task-lists.update', template.id));
        }
    };

    const handleAddOp = () => {
        const currentOps: TemplateTaskListOperation[] = data.operations || [];
        const nextNum = currentOps.length > 0 ? currentOps[currentOps.length - 1].operation_number + 10 : 10;
        setData('operations', [
            ...currentOps,
            { operation_number: nextNum, short_text: '', work_center: '', duration_normal: 1, duration_unit: 'H', number_of_people: 1, control_key: 'PM01', maintenance_strategy_package_id: null, materials: [] }
        ] as TemplateTaskListOperation[]);
    };

    const handleRemoveOp = (idx: number) => {
        const newOps = [...(data.operations || [])];
        newOps.splice(idx, 1);
        setData('operations', newOps);
    };

    const handleOpChange = (idx: number, field: string, value: any) => {
        const newOps: TemplateTaskListOperation[] = [...(data.operations || [])] as TemplateTaskListOperation[];
        newOps[idx] = { ...newOps[idx], [field]: value };
        setData('operations', newOps);
    };

    const handleAddMaterial = (opIdx: number) => {
        const newOps: TemplateTaskListOperation[] = [...(data.operations || [])] as TemplateTaskListOperation[];
        const op = newOps[opIdx];
        const newMats = [...(op.materials || [])];
        newMats.push({ material_number: '', quantity: 1, unit: 'ST' });
        newOps[opIdx] = { ...op, materials: newMats };
        setData('operations', newOps);
    };

    const handleRemoveMaterial = (opIdx: number, matIdx: number) => {
        const newOps: TemplateTaskListOperation[] = [...(data.operations || [])] as TemplateTaskListOperation[];
        const op = newOps[opIdx];
        const newMats = [...(op.materials || [])];
        newMats.splice(matIdx, 1);
        newOps[opIdx] = { ...op, materials: newMats };
        setData('operations', newOps);
    };

    const handleMaterialChange = (opIdx: number, matIdx: number, field: string, value: any) => {
        const newOps: TemplateTaskListOperation[] = [...(data.operations || [])] as TemplateTaskListOperation[];
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
        setData('operations', newOps);
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Sjablonen', href: '/template-task-lists' },
            { title: isCreating ? 'Nieuw' : 'Bewerken', href: '#' },
        ]}>
            <Head title={isCreating ? "Nieuw Sjabloon" : "Bewerk Sjabloon"} />

            <div className="flex h-full flex-col gap-4 p-4 max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-4 mb-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={route('template-task-lists.index')}>
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">
                        {isCreating ? 'Maak Nieuw Sjabloon' : `Bewerk Sjabloon: ${template.name}`}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Header Data */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Sjabloon Gegevens</CardTitle>
                            <CardDescription>Algemene instellingen voor dit taaklijst sjabloon.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Sjabloon Naam</Label>
                                    <Input
                                        value={data.name || ''}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        placeholder="bijv. Standaard Pomp Onderhoud"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Beschrijving / Groep</Label>
                                    <Input
                                        value={data.description || ''}
                                        onChange={(e) => setData('description', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label>Main Work Center</Label>
                                    <Input
                                        value={data.work_center || ''}
                                        onChange={(e) => setData('work_center', e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Strategie Referentie</Label>
                                    <Select
                                        value={data.maintenance_strategy_id ? data.maintenance_strategy_id.toString() : 'none'}
                                        onValueChange={(val) => setData('maintenance_strategy_id' as any, val === 'none' ? null : parseInt(val))}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Geen (Single Cycle plan)</SelectItem>
                                            {strategies.map((strat: any) => (
                                                <SelectItem key={strat.id} value={strat.id.toString()}>{strat.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Vestiging (Plant)</Label>
                                    <Input
                                        value={data.plant || ''}
                                        onChange={(e) => setData('plant', e.target.value)}
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
                                Voeg de stappen toe die uitgevoerd moeten worden.
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
                                        {(data.operations || []).map((op: TemplateTaskListOperation, idx: number) => (
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
                                                            value={op.maintenance_strategy_package_id ? op.maintenance_strategy_package_id.toString() : 'none'}
                                                            onValueChange={(val) => handleOpChange(idx, 'maintenance_strategy_package_id', val === 'none' ? null : parseInt(val))}
                                                        >
                                                            <SelectTrigger className="h-8"><SelectValue placeholder="Kies package" /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="none">Geen package</SelectItem>
                                                                {availablePackages.map((pkg: any) => (
                                                                    <SelectItem key={pkg.id} value={pkg.id.toString()}>{pkg.name}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    ) : (
                                                        <Input
                                                            className="p-1 text-sm h-8"
                                                            value="Geen Packages"
                                                            disabled
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
            </div>

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
                                    {(data.operations?.[managingMaterialsOpIdx]?.materials || []).map((mat: any, mIdx: number) => (
                                        <TableRow key={mIdx}>
                                            <TableCell>
                                                <Select
                                                    value={mat.material_number}
                                                    onValueChange={(val) => handleMaterialChange(managingMaterialsOpIdx, mIdx, 'material_number', val)}
                                                >
                                                    <SelectTrigger><SelectValue placeholder="Selecteer artikel" /></SelectTrigger>
                                                    <SelectContent>
                                                        {articles?.map((a: any) => (
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

        </AppLayout>
    );
}

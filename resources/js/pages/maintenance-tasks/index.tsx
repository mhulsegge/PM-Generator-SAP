import { useState, useRef, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { MaintenanceTask, MaintenanceItem } from '@/types/maintenance';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ChevronDown, Filter, Trash, Edit2, Layers } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Props {
    tasks: {
        data: MaintenanceTask[];
        links: any[];
    };
}

type ColumnVisibility = {
    planName: boolean;
    assetId: boolean;
    assetDesc: boolean;
    taskDesc: boolean;
    freqValue: boolean;
    freqUnit: boolean;
    status: boolean;
}

type Filters = {
    planName: string;
    assetId: string;
    assetDesc: string;
    taskDesc: string;
    freqValue: string;
    freqUnit: string;
    status: string;
}

export default function Index({ tasks }: Props) {
    const [isImporting, setIsImporting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Filter & Visibility states
    const [showFilters, setShowFilters] = useState(false);
    const [columns, setColumns] = useState<ColumnVisibility>({
        planName: true,
        assetId: true,
        assetDesc: true,
        taskDesc: true,
        freqValue: true,
        freqUnit: true,
        status: true,
    });
    const [filters, setFilters] = useState<Filters>({
        planName: '',
        assetId: '',
        assetDesc: '',
        taskDesc: '',
        freqValue: '',
        freqUnit: '',
        status: '',
    });

    // Selection state
    const [selected, setSelected] = useState<number[]>([]);

    // Merge state
    const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
    const [mergeName, setMergeName] = useState('');
    const [isMerging, setIsMerging] = useState(false);

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        router.post(route('maintenance-tasks.import.upload'), { file }, {
            forceFormData: true,
            preserveScroll: true,
            onStart: () => setIsImporting(true),
            onFinish: () => {
                setIsImporting(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
        });
    };

    const handleDoubleClick = (id: number) => {
        router.get(route('maintenance-tasks.edit', id));
    };

    const toggleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelected(filteredTasks.map(t => t.id!).filter(id => id !== undefined));
        } else {
            setSelected([]);
        }
    };

    const toggleSelect = (id: number, checked: boolean) => {
        if (checked) {
            setSelected(prev => [...prev, id]);
        } else {
            setSelected(prev => prev.filter(i => i !== id));
        }
    };

    const handleBulkDelete = () => {
        if (!confirm('Weet je zeker dat je de geselecteerde taken wilt verwijderen?')) return;
        router.post(route('maintenance-tasks.bulk-delete'), { ids: selected }, {
            onSuccess: () => setSelected([]),
        });
    };

    const handleBulkStatusChange = (status: 'draft' | 'ready' | 'active') => {
        router.post(route('maintenance-tasks.bulk-status'), { ids: selected, status }, {
            onSuccess: () => setSelected([]),
        });
    };

    const handleMergeTasks = () => {
        if (!mergeName.trim()) {
            return; // Needs validation
        }
        setIsMerging(true);
        router.post(route('maintenance-tasks.merge'), {
            ids: selected,
            name: mergeName
        }, {
            onSuccess: () => {
                setIsMergeModalOpen(false);
                setSelected([]);
                setMergeName('');
            },
            onFinish: () => setIsMerging(false),
        });
    };

    // Derived filtering logic
    const filteredTasks = useMemo(() => {
        return tasks.data.filter(task => {
            const planName = task.plan?.name || '';
            const assetId = task.items && task.items.length > 0 ? task.items[0].object_id : '';
            const assetDesc = task.items && task.items.length > 0 ? (task.items[0].object_description || '') : '';
            const tDesc = task.name || '';
            const fValue = task.plan ? String(task.plan.frequency_value) : '';
            const fUnit = task.plan ? task.plan.frequency_unit : '';
            const tStatus = task.status || '';

            return (
                planName.toLowerCase().includes(filters.planName.toLowerCase()) &&
                assetId.toLowerCase().includes(filters.assetId.toLowerCase()) &&
                assetDesc.toLowerCase().includes(filters.assetDesc.toLowerCase()) &&
                tDesc.toLowerCase().includes(filters.taskDesc.toLowerCase()) &&
                fValue.toLowerCase().includes(filters.freqValue.toLowerCase()) &&
                fUnit.toLowerCase().includes(filters.freqUnit.toLowerCase()) &&
                tStatus.toLowerCase().includes(filters.status.toLowerCase())
            );
        });
    }, [tasks.data, filters]);

    const isAllSelected = filteredTasks.length > 0 && selected.length === filteredTasks.length;
    const isSomeSelected = selected.length > 0 && selected.length < filteredTasks.length;

    return (
        <AppLayout breadcrumbs={[
            { title: 'Onderhoudstaken', href: '/maintenance-tasks' },
        ]}>
            <Head title="Preventieve Onderhoudstaken" />

            <div className="flex h-full flex-col gap-4 p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold">Preventieve Onderhoudstaken</h1>
                    <div className="flex items-center gap-2 flex-wrap">
                        {selected.length > 0 && (
                            <>
                                <Button variant="destructive" onClick={handleBulkDelete}>
                                    <Trash className="w-4 h-4 mr-2" />
                                    <span>Verwijder ({selected.length})</span>
                                </Button>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="secondary">
                                            Status wijzigen <ChevronDown className="w-4 h-4 ml-2" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => handleBulkStatusChange('draft')}>Draft</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleBulkStatusChange('ready')}>Ready</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleBulkStatusChange('active')}>Active</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {selected.length > 1 && (
                                    <Button variant="secondary" onClick={() => setIsMergeModalOpen(true)}>
                                        <Layers className="w-4 h-4 mr-2 text-primary" />
                                        <span>Samenvoegen ({selected.length})</span>
                                    </Button>
                                )}
                            </>
                        )}

                        <Button
                            variant={showFilters ? "secondary" : "outline"}
                            onClick={() => setShowFilters(!showFilters)}
                            className="mr-2"
                        >
                            <Filter className="w-4 h-4 mr-2" /> Filters
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="mr-2">
                                    Kolommen <ChevronDown className="w-4 h-4 ml-2" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuCheckboxItem checked={columns.planName} onCheckedChange={(val) => setColumns(prev => ({ ...prev, planName: val }))}>
                                    Onderhoudsplan
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem checked={columns.assetId} onCheckedChange={(val) => setColumns(prev => ({ ...prev, assetId: val }))}>
                                    Asset ID
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem checked={columns.assetDesc} onCheckedChange={(val) => setColumns(prev => ({ ...prev, assetDesc: val }))}>
                                    Asset Omschrijving
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem checked={columns.taskDesc} onCheckedChange={(val) => setColumns(prev => ({ ...prev, taskDesc: val }))}>
                                    Omschrijving Taak
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem checked={columns.freqValue} onCheckedChange={(val) => setColumns(prev => ({ ...prev, freqValue: val }))}>
                                    Frequentie aantal
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem checked={columns.freqUnit} onCheckedChange={(val) => setColumns(prev => ({ ...prev, freqUnit: val }))}>
                                    Frequentie eenheid
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem checked={columns.status} onCheckedChange={(val) => setColumns(prev => ({ ...prev, status: val }))}>
                                    Status
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".csv,.txt,.xlsx,.xls"
                            onChange={handleImport}
                        />
                        <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isImporting}
                        >
                            {isImporting ? 'Importeren...' : 'Importeer CSV / Excel'}
                        </Button>
                        <Button asChild>
                            <Link href={route('maintenance-tasks.create')}>
                                Nieuwe Taak
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="rounded-md border bg-card overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">
                                    <Checkbox
                                        checked={isAllSelected ? true : isSomeSelected ? "indeterminate" : false}
                                        onCheckedChange={(checked) => toggleSelectAll(checked as boolean)}
                                        aria-label="Select all"
                                    />
                                </TableHead>
                                {columns.planName && <TableHead className="min-w-[160px]">Onderhoudsplan</TableHead>}
                                {columns.assetId && <TableHead>Asset ID</TableHead>}
                                {columns.assetDesc && <TableHead>Asset Omschrijving</TableHead>}
                                {columns.taskDesc && <TableHead>Omschrijving Onderhoudstaak</TableHead>}
                                {columns.freqValue && <TableHead>Frequentie aantal</TableHead>}
                                {columns.freqUnit && <TableHead>Frequentie eenheid</TableHead>}
                                {columns.status && <TableHead>Status</TableHead>}
                                <TableHead className="text-right">Acties</TableHead>
                            </TableRow>
                            {showFilters && (
                                <TableRow className="bg-muted/50">
                                    <TableCell></TableCell>
                                    {columns.planName && (
                                        <TableCell className="p-2">
                                            <Input placeholder="Filter..." value={filters.planName} onChange={(e) => setFilters(f => ({ ...f, planName: e.target.value }))} className="h-8 shadow-none" />
                                        </TableCell>
                                    )}
                                    {columns.assetId && (
                                        <TableCell className="p-2">
                                            <Input placeholder="Filter..." value={filters.assetId} onChange={(e) => setFilters(f => ({ ...f, assetId: e.target.value }))} className="h-8 shadow-none" />
                                        </TableCell>
                                    )}
                                    {columns.assetDesc && (
                                        <TableCell className="p-2">
                                            <Input placeholder="Filter..." value={filters.assetDesc} onChange={(e) => setFilters(f => ({ ...f, assetDesc: e.target.value }))} className="h-8 shadow-none" />
                                        </TableCell>
                                    )}
                                    {columns.taskDesc && (
                                        <TableCell className="p-2">
                                            <Input placeholder="Filter..." value={filters.taskDesc} onChange={(e) => setFilters(f => ({ ...f, taskDesc: e.target.value }))} className="h-8 shadow-none" />
                                        </TableCell>
                                    )}
                                    {columns.freqValue && (
                                        <TableCell className="p-2">
                                            <Input placeholder="Filter..." value={filters.freqValue} onChange={(e) => setFilters(f => ({ ...f, freqValue: e.target.value }))} className="h-8 shadow-none" />
                                        </TableCell>
                                    )}
                                    {columns.freqUnit && (
                                        <TableCell className="p-2">
                                            <Input placeholder="Filter..." value={filters.freqUnit} onChange={(e) => setFilters(f => ({ ...f, freqUnit: e.target.value }))} className="h-8 shadow-none" />
                                        </TableCell>
                                    )}
                                    {columns.status && (
                                        <TableCell className="p-2">
                                            <Input placeholder="Filter..." value={filters.status} onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))} className="h-8 shadow-none" />
                                        </TableCell>
                                    )}
                                    <TableCell></TableCell>
                                </TableRow>
                            )}
                        </TableHeader>
                        <TableBody>
                            {filteredTasks.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7 + (Object.values(columns).filter(Boolean).length)} className="h-24 text-center">
                                        Geen taken gevonden.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredTasks.map((task) => {
                                    const assetId = task.items && task.items.length > 0 ? task.items[0].object_id : '-';
                                    const assetDesc = task.items && task.items.length > 0 ? (task.items[0].object_description || '-') : '-';

                                    return (
                                        <TableRow
                                            key={task.id}
                                            onDoubleClick={() => task.id && handleDoubleClick(task.id)}
                                            className="cursor-pointer hover:bg-muted/50"
                                        >
                                            <TableCell onClick={(e) => e.stopPropagation()}>
                                                <Checkbox
                                                    checked={task.id !== undefined && selected.includes(task.id)}
                                                    onCheckedChange={(checked) => task.id && toggleSelect(task.id, checked as boolean)}
                                                    aria-label={`Selecteer taak ${task.id}`}
                                                />
                                            </TableCell>
                                            {columns.planName && (
                                                <TableCell className="font-medium text-primary/90">
                                                    {task.plan?.name || <span className="text-muted-foreground italic">Geen plan</span>}
                                                </TableCell>
                                            )}
                                            {columns.assetId && <TableCell className="font-mono text-sm">{assetId}</TableCell>}
                                            {columns.assetDesc && <TableCell className="text-sm text-muted-foreground">{assetDesc}</TableCell>}
                                            {columns.taskDesc && <TableCell className="font-medium">{task.name || 'Naamloos'}</TableCell>}
                                            {columns.freqValue && <TableCell>{task.plan ? `${task.plan.frequency_value}` : '-'}</TableCell>}
                                            {columns.freqUnit && <TableCell>{task.plan ? `${task.plan.frequency_unit}` : '-'}</TableCell>}
                                            {columns.status && (
                                                <TableCell>
                                                    <Badge variant={task.status === 'active' ? 'default' : 'secondary'}>
                                                        {task.status}
                                                    </Badge>
                                                </TableCell>
                                            )}
                                            <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={route('maintenance-tasks.edit', task.id)}>
                                                        <Edit2 className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Dialog open={isMergeModalOpen} onOpenChange={setIsMergeModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Taken Samenvoegen</DialogTitle>
                        <DialogDescription>
                            Je staat op het punt {selected.length} taken te koppelen aan één nieuw Onderhoudsplan.
                            De taken blijven <strong>intact</strong> in de lijst — ze worden enkel gegroepeerd onder het nieuwe plan.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="mergeName">Naam voor nieuwe Onderhoudsplan</Label>
                            <Input
                                id="mergeName"
                                placeholder="Bijv. Inspectie Luchtbehandeling..."
                                value={mergeName}
                                onChange={(e) => setMergeName(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsMergeModalOpen(false)}>Annuleren</Button>
                        <Button onClick={handleMergeTasks} disabled={isMerging || !mergeName.trim()}>
                            {isMerging ? 'Samenvoegen...' : 'Opslaan & Samenvoegen'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

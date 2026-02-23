import { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { TemplateTaskList } from '@/types/maintenance';
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
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ChevronDown, Filter, Trash, Edit2, Plus } from "lucide-react";

interface Props {
    templates: {
        data: TemplateTaskList[];
        links: any[];
    };
}

type ColumnVisibility = {
    name: boolean;
    description: boolean;
    workCenter: boolean;
    plant: boolean;
    strategyPackage: boolean;
    operationsCount: boolean;
}

type Filters = {
    name: string;
    description: string;
    workCenter: string;
    plant: string;
    strategyPackage: string;
}

export default function Index({ templates }: Props) {
    // Filter & Visibility states
    const [showFilters, setShowFilters] = useState(false);
    const [columns, setColumns] = useState<ColumnVisibility>({
        name: true,
        description: true,
        workCenter: true,
        plant: true,
        strategyPackage: true,
        operationsCount: true,
    });
    const [filters, setFilters] = useState<Filters>({
        name: '',
        description: '',
        workCenter: '',
        plant: '',
        strategyPackage: '',
    });

    // Selection state
    const [selected, setSelected] = useState<number[]>([]);

    const handleDoubleClick = (id: number) => {
        router.get(route('template-task-lists.edit', id));
    };

    const toggleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelected(filteredTemplates.map(t => t.id!).filter(id => id !== undefined));
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

    const handleDelete = (id: number) => {
        if (!confirm('Weet je zeker dat je dit sjabloon wilt verwijderen?')) return;
        router.delete(route('template-task-lists.destroy', id), {
            preserveScroll: true,
            onSuccess: () => setSelected(prev => prev.filter(i => i !== id)),
        });
    };

    // Derived filtering logic
    const filteredTemplates = useMemo(() => {
        return templates.data.filter(template => {
            const tName = template.name || '';
            const tDesc = template.description || '';
            const wc = template.work_center || '';
            const p = template.plant || '';
            const sp = template.strategy_package || '';

            return (
                tName.toLowerCase().includes(filters.name.toLowerCase()) &&
                tDesc.toLowerCase().includes(filters.description.toLowerCase()) &&
                wc.toLowerCase().includes(filters.workCenter.toLowerCase()) &&
                p.toLowerCase().includes(filters.plant.toLowerCase()) &&
                sp.toLowerCase().includes(filters.strategyPackage.toLowerCase())
            );
        });
    }, [templates.data, filters]);

    const isAllSelected = filteredTemplates.length > 0 && selected.length === filteredTemplates.length;
    const isSomeSelected = selected.length > 0 && selected.length < filteredTemplates.length;

    return (
        <AppLayout breadcrumbs={[
            { title: 'Sjablonen', href: '/template-task-lists' },
        ]}>
            <Head title="Sjablonen Taaklijsten" />

            <div className="flex h-full flex-col gap-4 p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold">Taaklijst Sjablonen</h1>
                    <div className="flex items-center gap-2 flex-wrap">
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
                                <DropdownMenuCheckboxItem checked={columns.name} onCheckedChange={(val) => setColumns(prev => ({ ...prev, name: val }))}>
                                    Naam
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem checked={columns.description} onCheckedChange={(val) => setColumns(prev => ({ ...prev, description: val }))}>
                                    Beschrijving
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem checked={columns.workCenter} onCheckedChange={(val) => setColumns(prev => ({ ...prev, workCenter: val }))}>
                                    Werkcentrum
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem checked={columns.plant} onCheckedChange={(val) => setColumns(prev => ({ ...prev, plant: val }))}>
                                    Vestiging
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem checked={columns.strategyPackage} onCheckedChange={(val) => setColumns(prev => ({ ...prev, strategyPackage: val }))}>
                                    Strategie
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem checked={columns.operationsCount} onCheckedChange={(val) => setColumns(prev => ({ ...prev, operationsCount: val }))}>
                                    Aantal regels
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button asChild>
                            <Link href={route('template-task-lists.create')}>
                                <Plus className="w-4 h-4 mr-2" /> Nieuw Sjabloon
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
                                        aria-label="Selecteer alles"
                                    />
                                </TableHead>
                                {columns.name && <TableHead className="min-w-[160px]">Naam</TableHead>}
                                {columns.description && <TableHead>Beschrijving</TableHead>}
                                {columns.workCenter && <TableHead>Werkcentrum</TableHead>}
                                {columns.plant && <TableHead>Vestiging</TableHead>}
                                {columns.strategyPackage && <TableHead>Strategie</TableHead>}
                                {columns.operationsCount && <TableHead>Aantal regels</TableHead>}
                                <TableHead className="text-right">Acties</TableHead>
                            </TableRow>
                            {showFilters && (
                                <TableRow className="bg-muted/50">
                                    <TableCell></TableCell>
                                    {columns.name && (
                                        <TableCell className="p-2">
                                            <Input placeholder="Filter..." value={filters.name} onChange={(e) => setFilters(f => ({ ...f, name: e.target.value }))} className="h-8 shadow-none" />
                                        </TableCell>
                                    )}
                                    {columns.description && (
                                        <TableCell className="p-2">
                                            <Input placeholder="Filter..." value={filters.description} onChange={(e) => setFilters(f => ({ ...f, description: e.target.value }))} className="h-8 shadow-none" />
                                        </TableCell>
                                    )}
                                    {columns.workCenter && (
                                        <TableCell className="p-2">
                                            <Input placeholder="Filter..." value={filters.workCenter} onChange={(e) => setFilters(f => ({ ...f, workCenter: e.target.value }))} className="h-8 shadow-none" />
                                        </TableCell>
                                    )}
                                    {columns.plant && (
                                        <TableCell className="p-2">
                                            <Input placeholder="Filter..." value={filters.plant} onChange={(e) => setFilters(f => ({ ...f, plant: e.target.value }))} className="h-8 shadow-none" />
                                        </TableCell>
                                    )}
                                    {columns.strategyPackage && (
                                        <TableCell className="p-2">
                                            <Input placeholder="Filter..." value={filters.strategyPackage} onChange={(e) => setFilters(f => ({ ...f, strategyPackage: e.target.value }))} className="h-8 shadow-none" />
                                        </TableCell>
                                    )}
                                    {columns.operationsCount && <TableCell></TableCell>}
                                    <TableCell></TableCell>
                                </TableRow>
                            )}
                        </TableHeader>
                        <TableBody>
                            {filteredTemplates.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7 + (Object.values(columns).filter(Boolean).length)} className="h-24 text-center">
                                        Geen sjablonen gevonden.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredTemplates.map((template) => {
                                    return (
                                        <TableRow
                                            key={template.id}
                                            onDoubleClick={() => template.id && handleDoubleClick(template.id)}
                                            className="cursor-pointer hover:bg-muted/50"
                                        >
                                            <TableCell onClick={(e) => e.stopPropagation()}>
                                                <Checkbox
                                                    checked={template.id !== undefined && selected.includes(template.id)}
                                                    onCheckedChange={(checked) => template.id && toggleSelect(template.id, checked as boolean)}
                                                    aria-label={`Selecteer sjabloon ${template.id}`}
                                                />
                                            </TableCell>
                                            {columns.name && <TableCell className="font-medium text-primary/90">{template.name}</TableCell>}
                                            {columns.description && <TableCell className="text-sm text-muted-foreground">{template.description || '-'}</TableCell>}
                                            {columns.workCenter && <TableCell>{template.work_center || '-'}</TableCell>}
                                            {columns.plant && <TableCell>{template.plant || '-'}</TableCell>}
                                            {columns.strategyPackage && <TableCell>{template.strategy_package || '-'}</TableCell>}
                                            {columns.operationsCount && <TableCell>{template.operations_count || 0}</TableCell>}
                                            <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={route('template-task-lists.edit', template.id)}>
                                                            <Edit2 className="w-4 h-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => template.id && handleDelete(template.id)}>
                                                        <Trash className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}

import { useState, useEffect } from 'react';
import { Head, router, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Trash, ArrowLeft, Wrench, Calendar, Clock, Lock, Users, Building2, FileType, Factory, Upload, Pencil } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface MasterDataItem {
    id: number;
    category: string;
    key: string;
    label: string;
    sort_order: number;
    is_active: boolean;
    is_default: boolean;
}

interface Props {
    category: string | null;
    items: MasterDataItem[];
}

const CATEGORIES = [
    { id: 'discipline', label: 'Vakdisciplines', description: 'Beheer de verschillende vakdisciplines (bijv. W, E, I).', icon: Wrench },
    { id: 'frequency_unit', label: 'Frequentie Eenheden', description: 'Onderhoud de mogelijke eenheden voor frequenties en cyclustijden.', icon: Clock },
    { id: 'control_key', label: 'Stuurcodes', description: 'Beheer de stuurcodes die gelden voor onderhoudsbewerkingen.', icon: Lock },
    { id: 'planner_group', label: 'Planner Groups', description: 'Verantwoordelijke planningsgroepen voor onderhoud.', icon: Users },
    { id: 'main_work_center', label: 'Main Work Centers', description: 'Werkcentra die de planning / uitvoering verzorgen.', icon: Building2 },
    { id: 'order_type', label: 'Order Types', description: 'Configuratie van SAP Order Types (PM01, PM03 etc).', icon: FileType },
    { id: 'plant', label: 'Plants', description: 'De vestigingen of fabrieken waarvoor gepland wordt.', icon: Factory },
];

export default function MasterDataIndex({ category, items }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MasterDataItem | null>(null);

    const activeCategory = CATEGORIES.find(c => c.id === category);

    // Form for creating new items
    const { data: createData, setData: setCreateData, post: createPost, processing: createProcessing, reset: createReset, errors: createErrors } = useForm({
        category: category || '',
        key: '',
        label: '',
        sort_order: 0,
    });

    const { data: editData, setData: setEditData, patch: editPatch, processing: editProcessing, reset: editReset, errors: editErrors } = useForm({
        key: '',
        label: '',
        sort_order: 0,
        is_default: false,
    });

    useEffect(() => {
        if (editingItem) {
            setEditData({
                key: editingItem.key,
                label: editingItem.label,
                sort_order: editingItem.sort_order,
                is_default: !!editingItem.is_default,
            });
        }
    }, [editingItem]);

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createData.category = category || ''; // Ensure category is set correctly

        createPost(route('master-data.store'), {
            onSuccess: () => {
                setIsCreateOpen(false);
                createReset();
            }
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;

        editPatch(route('master-data.update', editingItem.id), {
            onSuccess: () => {
                setEditingItem(null);
                editReset();
            },
            preserveScroll: true,
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Weet je zeker dat je dit item wilt verwijderen?')) {
            router.delete(route('master-data.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Stamgegevens', href: '/master-data' },
            ...(activeCategory ? [{ title: activeCategory.label, href: `/master-data?category=${category}` }] : [])
        ]}>
            <Head title="Stamgegevens Beheer" />

            <div className="flex h-full flex-col p-6 gap-6 max-w-6xl mx-auto w-full">
                {!category ? (
                    // Categories Overview
                    <>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight">Stamgegevens</h1>
                            <p className="text-muted-foreground">Selecteer een categorie om de stamgegevens te beheren.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {CATEGORIES.map(cat => {
                                const Icon = cat.icon;
                                return (
                                    <Link key={cat.id} href={route('master-data.index', { category: cat.id })}>
                                        <Card className="hover:border-primary/50 hover:bg-muted/20 transition-all cursor-pointer h-full border-border/50 shadow-sm relative group">
                                            <CardHeader>
                                                <div className="flex items-center gap-3 space-y-0">
                                                    <div className="p-2.5 w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                        <Icon className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-lg">{cat.label}</CardTitle>
                                                    </div>
                                                </div>
                                                <CardDescription className="pt-3 text-sm">
                                                    {cat.description}
                                                </CardDescription>
                                            </CardHeader>
                                        </Card>
                                    </Link>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    // Category Management View
                    <>
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" asChild className="rounded-full">
                                <Link href={route('master-data.index')}>
                                    <ArrowLeft className="h-5 w-5" />
                                </Link>
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold">{activeCategory?.label}</h1>
                                <p className="text-muted-foreground text-sm">{activeCategory?.description}</p>
                            </div>
                        </div>

                        <div className="border rounded-xl bg-card shadow-sm overflow-hidden mt-4">
                            <div className="p-4 flex justify-between items-center bg-muted/20 border-b">
                                <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                                    Items ({items.length})
                                </h2>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" className="gap-2" asChild>
                                        <label className="cursor-pointer">
                                            <Upload className="h-4 w-4" /> Importeer
                                            <input type="file" className="hidden" accept=".csv,.txt,.xlsx,.xls" onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    router.post(route('master-data.import.upload'), { file: e.target.files[0], category: activeCategory?.id });
                                                    e.target.value = '';
                                                }
                                            }} />
                                        </label>
                                    </Button>
                                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                                        <DialogTrigger asChild>
                                            <Button size="sm" className="gap-2">
                                                <Plus className="h-4 w-4" /> Toevoegen
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Nieuw Item Toevoegen</DialogTitle>
                                                <DialogDescription>
                                                    Voeg een nieuwe optie toe aan {activeCategory?.label}.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <form onSubmit={handleCreateSubmit} className="space-y-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="create-key">Code / Sleutel</Label>
                                                    <Input
                                                        id="create-key"
                                                        value={createData.key}
                                                        onChange={e => setCreateData('key', e.target.value)}
                                                        placeholder="bv. W, 1M, WK"
                                                        required
                                                    />
                                                    {createErrors.key && <p className="text-destructive text-sm">{createErrors.key}</p>}
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="create-label">Omschrijving / Label</Label>
                                                    <Input
                                                        id="create-label"
                                                        value={createData.label}
                                                        onChange={e => setCreateData('label', e.target.value)}
                                                        placeholder="bv. Werktuigbouw, Maandelijks"
                                                        required
                                                    />
                                                    {createErrors.label && <p className="text-destructive text-sm">{createErrors.label}</p>}
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="create-sort">Sorteervolgorde</Label>
                                                    <Input
                                                        id="create-sort"
                                                        type="number"
                                                        value={createData.sort_order}
                                                        onChange={e => setCreateData('sort_order', parseInt(e.target.value))}
                                                    />
                                                </div>
                                                <DialogFooter>
                                                    <Button type="submit" disabled={createProcessing}>Opslaan</Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>

                                    {/* Edit Item Dialog */}
                                    <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Item Bewerken</DialogTitle>
                                                <DialogDescription>
                                                    Bewerk de gegevens van dit stamgegeven.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <form onSubmit={handleEditSubmit} className="space-y-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="edit-key">Code / Sleutel</Label>
                                                    <Input
                                                        id="edit-key"
                                                        value={editData.key}
                                                        onChange={e => setEditData('key', e.target.value)}
                                                        required
                                                    />
                                                    {editErrors.key && <p className="text-destructive text-sm">{editErrors.key}</p>}
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="edit-label">Omschrijving / Label</Label>
                                                    <Input
                                                        id="edit-label"
                                                        value={editData.label}
                                                        onChange={e => setEditData('label', e.target.value)}
                                                        required
                                                    />
                                                    {editErrors.label && <p className="text-destructive text-sm">{editErrors.label}</p>}
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="edit-sort">Sorteervolgorde</Label>
                                                    <Input
                                                        id="edit-sort"
                                                        type="number"
                                                        value={editData.sort_order}
                                                        onChange={e => setEditData('sort_order', parseInt(e.target.value) || 0)}
                                                    />
                                                </div>
                                                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                    <div className="space-y-0.5">
                                                        <Label className="text-base">Standaard Waarde</Label>
                                                        <p className="text-sm text-muted-foreground">
                                                            Stel dit item in als de standaard geselecteerde optie.
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        checked={editData.is_default}
                                                        onCheckedChange={checked => setEditData('is_default', checked)}
                                                        aria-label="Set as default"
                                                    />
                                                </div>
                                                <DialogFooter>
                                                    <Button type="submit" disabled={editProcessing}>Wijzigingen Opslaan</Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>

                            <div>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/10 hover:bg-muted/10">
                                            <TableHead className="w-[120px]">Code</TableHead>
                                            <TableHead>Omschrijving</TableHead>
                                            <TableHead className="w-[100px]">Volgorde</TableHead>
                                            <TableHead className="w-[90px] text-center">Standaard</TableHead>
                                            <TableHead className="w-[100px] text-right">Acties</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {items.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center h-32 text-muted-foreground">
                                                    Geen items gevonden in deze categorie.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            items.map((item) => (
                                                <TableRow
                                                    key={item.id}
                                                    onDoubleClick={() => setEditingItem(item)}
                                                    className="cursor-pointer"
                                                    title="Dubbelklik om te bewerken"
                                                >
                                                    <TableCell className="font-mono font-medium text-primary/80">{item.key}</TableCell>
                                                    <TableCell>{item.label}</TableCell>
                                                    <TableCell>{item.sort_order}</TableCell>
                                                    <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                                                        <div className="flex justify-center items-center">
                                                            <Switch
                                                                checked={!!item.is_default}
                                                                onCheckedChange={(checked) =>
                                                                    router.patch(
                                                                        route('master-data.update', item.id),
                                                                        { is_default: checked },
                                                                        { preserveScroll: true, preserveState: true }
                                                                    )
                                                                }
                                                                aria-label="Set as default"
                                                            />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="Bewerken"
                                                            className="text-muted-foreground hover:text-primary"
                                                            onClick={() => setEditingItem(item)}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="Verwijderen"
                                                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                            onClick={() => handleDelete(item.id)}
                                                        >
                                                            <Trash className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AppLayout>
    );
}

import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash, GripVertical } from 'lucide-react';

interface MasterDataItem {
    id: number;
    category: string;
    key: string;
    label: string;
    sort_order: number;
    is_active: boolean;
}

interface Props {
    category: string;
    items: MasterDataItem[];
}

const CATEGORIES = [
    { id: 'discipline', label: 'Vakdisciplines' },
    { id: 'strategy_package', label: 'Strategie Packages' },
    { id: 'frequency_unit', label: 'Frequentie Eenheden' },
    { id: 'control_key', label: 'Stuurcodes' },
];

export default function MasterDataIndex({ category, items }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Form for creating new items
    const { data, setData, post, processing, reset, errors } = useForm({
        category: category,
        key: '',
        label: '',
        sort_order: 0,
    });

    const handleTabChange = (value: string) => {
        router.get(route('master-data.index'), { category: value }, { preserveState: true });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Ensure category is set correctly
        data.category = category;

        post(route('master-data.store'), {
            onSuccess: () => {
                setIsCreateOpen(false);
                reset();
            }
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
        ]}>
            <Head title="Stamgegevens Beheer" />

            <div className="flex h-full flex-col p-4 gap-6">
                <div>
                    <h1 className="text-2xl font-bold">Stamgegevens Beheer</h1>
                    <p className="text-muted-foreground">Beheer de keuzelijsten voor de applicatie.</p>
                </div>

                <div className="flex-1 flex flex-col gap-4">
                    <Tabs value={category} onValueChange={handleTabChange} className="w-full">
                        <TabsList className="w-full justify-start overflow-x-auto">
                            {CATEGORIES.map(cat => (
                                <TabsTrigger key={cat.id} value={cat.id}>
                                    {cat.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <div className="mt-4 border rounded-md bg-card">
                            <div className="p-4 flex justify-between items-center border-b">
                                <h2 className="font-semibold">
                                    {CATEGORIES.find(c => c.id === category)?.label} ({items.length})
                                </h2>
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
                                                Voeg een nieuwe optie toe aan {CATEGORIES.find(c => c.id === category)?.label}.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="key">Code / Sleutel</Label>
                                                <Input
                                                    id="key"
                                                    value={data.key}
                                                    onChange={e => setData('key', e.target.value)}
                                                    placeholder="bv. W, 1M, WK"
                                                    required
                                                />
                                                {errors.key && <p className="text-destructive text-sm">{errors.key}</p>}
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="label">Omschrijving / Label</Label>
                                                <Input
                                                    id="label"
                                                    value={data.label}
                                                    onChange={e => setData('label', e.target.value)}
                                                    placeholder="bv. Werktuigbouw, Maandelijks"
                                                    required
                                                />
                                                {errors.label && <p className="text-destructive text-sm">{errors.label}</p>}
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="sort">Sorteervolgorde</Label>
                                                <Input
                                                    id="sort"
                                                    type="number"
                                                    value={data.sort_order}
                                                    onChange={e => setData('sort_order', parseInt(e.target.value))}
                                                />
                                            </div>
                                            <DialogFooter>
                                                <Button type="submit" disabled={processing}>Opslaan</Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <div className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">Code</TableHead>
                                            <TableHead>Omschrijving</TableHead>
                                            <TableHead className="w-[100px]">Volgorde</TableHead>
                                            <TableHead className="w-[100px] text-right">Acties</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {items.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                                    Geen items gevonden.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            items.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="font-mono font-medium">{item.key}</TableCell>
                                                    <TableCell>{item.label}</TableCell>
                                                    <TableCell>{item.sort_order}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-destructive hover:text-destructive/90"
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
                    </Tabs>
                </div>
            </div>
        </AppLayout>
    );
}

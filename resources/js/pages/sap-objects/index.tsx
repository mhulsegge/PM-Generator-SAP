import { useState } from 'react';
import { Head, router, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash, Edit, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SapObject {
    id: number;
    object_id: string;
    name: string | null;
    type: 'equipment' | 'floc';
    description: string | null;
}

interface Props {
    objects: {
        data: SapObject[];
    };
}

export default function SapObjectsIndex({ objects }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editItem, setEditItem] = useState<SapObject | null>(null);

    const { data, setData, post, put, processing, reset, errors } = useForm({
        object_id: '',
        name: '',
        type: 'equipment',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editItem) {
            put(route('sap-objects.update', editItem.id), {
                onSuccess: () => {
                    setEditItem(null);
                    reset();
                }
            });
        } else {
            post(route('sap-objects.store'), {
                onSuccess: () => {
                    setIsCreateOpen(false);
                    reset();
                }
            });
        }
    };

    const openEdit = (item: SapObject) => {
        setData({
            object_id: item.object_id,
            name: item.name || '',
            type: item.type,
            description: item.description || '',
        });
        setEditItem(item);
    };

    const handleDelete = (id: number) => {
        if (confirm('Weet je zeker dat je dit object wilt verwijderen?')) {
            router.delete(route('sap-objects.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'SAP Objecten', href: '/sap-objects' }]}>
            <Head title="SAP Objecten" />

            <div className="flex h-full flex-col p-6 gap-6 max-w-6xl mx-auto w-full">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">SAP Objecten</h1>
                    <p className="text-muted-foreground">Beheer de Equipment en Functionele Locaties waaraan plannen worden gekoppeld.</p>
                </div>

                <div className="border rounded-xl bg-card shadow-sm overflow-hidden mt-4">
                    <div className="p-4 flex justify-between items-center bg-muted/20 border-b">
                        <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                            Alle Objecten
                        </h2>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="gap-2" asChild>
                                <label className="cursor-pointer">
                                    <Upload className="h-4 w-4" /> Importeer
                                    <input type="file" className="hidden" accept=".csv,.txt,.xlsx,.xls" onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            router.post(route('sap-objects.import.upload'), { file: e.target.files[0] });
                                            e.target.value = '';
                                        }
                                    }} />
                                </label>
                            </Button>
                            <Dialog open={isCreateOpen || !!editItem} onOpenChange={(open) => {
                                if (!open) {
                                    setIsCreateOpen(false);
                                    setEditItem(null);
                                    reset();
                                } else {
                                    setIsCreateOpen(true);
                                }
                            }}>
                                <DialogTrigger asChild>
                                    <Button size="sm" className="gap-2">
                                        <Plus className="h-4 w-4" /> Toevoegen
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{editItem ? 'Object Bewerken' : 'Nieuw Object'}</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid gap-2">
                                            <Label>Type</Label>
                                            <Select value={data.type} onValueChange={(v) => setData('type', v)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="equipment">Equipment</SelectItem>
                                                    <SelectItem value="floc">Functionele Locatie</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.type && <p className="text-destructive text-sm">{errors.type}</p>}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Object ID / Tag</Label>
                                            <Input
                                                value={data.object_id}
                                                onChange={e => setData('object_id', e.target.value)}
                                                placeholder={data.type === 'floc' ? 'bv. FL-01-XX' : 'bv. E-1002'}
                                                required
                                                disabled={!!editItem}
                                            />
                                            {errors.object_id && <p className="text-destructive text-sm">{errors.object_id}</p>}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Naam (Korte Omschrijving)</Label>
                                            <Input
                                                value={data.name}
                                                onChange={e => setData('name', e.target.value)}
                                                placeholder="bv. Centrifugaalpomp PM-1"
                                            />
                                            {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" disabled={processing}>Opslaan</Button>
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
                                    <TableHead className="w-[120px]">Type</TableHead>
                                    <TableHead className="w-[180px]">Object ID</TableHead>
                                    <TableHead>Naam</TableHead>
                                    <TableHead className="w-[120px] text-right">Acties</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {objects.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center h-32 text-muted-foreground">
                                            Nog geen objecten aangemaakt.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    objects.data.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <Badge variant={item.type === 'equipment' ? 'outline' : 'secondary'} className="uppercase text-xs">
                                                    {item.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-mono font-medium text-primary/80">{item.object_id}</TableCell>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={() => openEdit(item)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(item.id)}>
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

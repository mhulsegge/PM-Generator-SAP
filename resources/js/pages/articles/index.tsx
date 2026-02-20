import { useState } from 'react';
import { Head, router, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash, Edit, Upload } from 'lucide-react';

interface Article {
    id: number;
    article_number: string;
    description: string;
    unit: string;
}

interface Props {
    articles: {
        data: Article[];
    };
}

export default function ArticlesIndex({ articles }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editItem, setEditItem] = useState<Article | null>(null);

    const { data, setData, post, put, processing, reset, errors } = useForm({
        article_number: '',
        description: '',
        unit: 'ST',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editItem) {
            put(route('articles.update', editItem.id), {
                onSuccess: () => {
                    setEditItem(null);
                    reset();
                }
            });
        } else {
            post(route('articles.store'), {
                onSuccess: () => {
                    setIsCreateOpen(false);
                    reset();
                }
            });
        }
    };

    const openEdit = (item: Article) => {
        setData({
            article_number: item.article_number,
            description: item.description,
            unit: item.unit,
        });
        setEditItem(item);
    };

    const handleDelete = (id: number) => {
        if (confirm('Weet je zeker dat je dit artikel wilt verwijderen?')) {
            router.delete(route('articles.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Artikelen', href: '/articles' }]}>
            <Head title="Artikelen" />

            <div className="flex h-full flex-col p-6 gap-6 max-w-6xl mx-auto w-full">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Artikelen (Componenten)</h1>
                    <p className="text-muted-foreground">Beheer de materiaallijst voor gebruik in taakregels.</p>
                </div>

                <div className="border rounded-xl bg-card shadow-sm overflow-hidden mt-4">
                    <div className="p-4 flex justify-between items-center bg-muted/20 border-b">
                        <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                            Alle Artikelen
                        </h2>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="gap-2" asChild>
                                <label className="cursor-pointer">
                                    <Upload className="h-4 w-4" /> Importeer
                                    <input type="file" className="hidden" accept=".csv,.txt,.xlsx,.xls" onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            router.post(route('articles.import.upload'), { file: e.target.files[0] });
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
                                        <DialogTitle>{editItem ? 'Artikel Bewerken' : 'Nieuw Artikel'}</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid gap-2">
                                            <Label>Artikelnummer</Label>
                                            <Input
                                                value={data.article_number}
                                                onChange={e => setData('article_number', e.target.value)}
                                                placeholder="bv. 100-2443"
                                                required
                                                disabled={!!editItem}
                                            />
                                            {errors.article_number && <p className="text-destructive text-sm">{errors.article_number}</p>}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Omschrijving</Label>
                                            <Input
                                                value={data.description}
                                                onChange={e => setData('description', e.target.value)}
                                                placeholder="bv. Kogellager"
                                                required
                                            />
                                            {errors.description && <p className="text-destructive text-sm">{errors.description}</p>}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Eenheid (Unit)</Label>
                                            <Input
                                                value={data.unit}
                                                onChange={e => setData('unit', e.target.value)}
                                                required
                                                placeholder="ST of KG"
                                            />
                                            {errors.unit && <p className="text-destructive text-sm">{errors.unit}</p>}
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
                                    <TableHead className="w-[180px]">Artikelnummer</TableHead>
                                    <TableHead>Omschrijving</TableHead>
                                    <TableHead className="w-[100px]">Eenheid</TableHead>
                                    <TableHead className="w-[120px] text-right">Acties</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {articles.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center h-32 text-muted-foreground">
                                            Nog geen artikelen aangemaakt.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    articles.data.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-mono font-medium text-primary/80">{item.article_number}</TableCell>
                                            <TableCell>{item.description}</TableCell>
                                            <TableCell>{item.unit}</TableCell>
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

import { useState } from 'react';
import { Head, router, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Trash, Edit, ArrowLeft, Upload, Network } from 'lucide-react';

interface StrategyPackage {
    id: number;
    maintenance_strategy_id: number;
    name: string;
    cycle_value: number;
    cycle_unit: string;
    hierarchy_short_text: number | null;
}

interface MaintenanceStrategy {
    id: number;
    name: string;
    description: string | null;
    packages?: StrategyPackage[];
}

interface Props {
    strategies: MaintenanceStrategy[];
    activeStrategy: MaintenanceStrategy | null;
}

export default function StrategiesIndex({ strategies, activeStrategy }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editStrategy, setEditStrategy] = useState<MaintenanceStrategy | null>(null);

    const { data: strategyData, setData: setStrategyData, post: postStrategy, put: putStrategy, processing: strategyProcessing, reset: resetStrategy, errors: strategyErrors } = useForm({
        name: '',
        description: '',
    });

    const [isPackageOpen, setIsPackageOpen] = useState(false);
    const [editPackageItem, setEditPackageItem] = useState<StrategyPackage | null>(null);

    const { data: packageData, setData: setPackageData, post: postPackage, put: putPackage, processing: packageProcessing, reset: resetPackage, errors: packageErrors } = useForm({
        name: '',
        cycle_value: 1,
        cycle_unit: 'MON',
        hierarchy_short_text: '',
    });

    const handleStrategySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editStrategy) {
            putStrategy(route('strategies.update', editStrategy.id), {
                onSuccess: () => {
                    setEditStrategy(null);
                    resetStrategy();
                }
            });
        } else {
            postStrategy(route('strategies.store'), {
                onSuccess: () => {
                    setIsCreateOpen(false);
                    resetStrategy();
                }
            });
        }
    };

    const handlePackageSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeStrategy) return;

        if (editPackageItem) {
            putPackage(route('strategies.packages.update', editPackageItem.id), {
                onSuccess: () => {
                    setIsPackageOpen(false);
                    setEditPackageItem(null);
                    resetPackage();
                }
            });
        } else {
            postPackage(route('strategies.packages.store', activeStrategy.id), {
                onSuccess: () => {
                    setIsPackageOpen(false);
                    resetPackage();
                }
            });
        }
    };

    const openEditPackage = (pkg: StrategyPackage) => {
        setPackageData({
            name: pkg.name,
            cycle_value: pkg.cycle_value,
            cycle_unit: pkg.cycle_unit,
            hierarchy_short_text: pkg.hierarchy_short_text ? pkg.hierarchy_short_text.toString() : '',
        });
        setEditPackageItem(pkg);
        setIsPackageOpen(true);
    };

    const openEditStrategy = (item: MaintenanceStrategy) => {
        setStrategyData({
            name: item.name,
            description: item.description || '',
        });
        setEditStrategy(item);
    };

    const handleDeleteStrategy = (id: number) => {
        if (confirm('Weet je zeker dat je deze strategie wilt verwijderen?')) {
            router.delete(route('strategies.destroy', id), {
                preserveScroll: true
            });
        }
    };

    const handleDeletePackage = (id: number) => {
        if (confirm('Verwijderen van deze frequentie?')) {
            router.delete(route('strategies.packages.destroy', id), {
                preserveScroll: true
            });
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Strategies', href: '/strategies' }]}>
            <Head title="Maintenance Strategies" />

            <div className="flex h-full flex-col p-6 gap-6 max-w-6xl mx-auto w-full">
                {!activeStrategy ? (
                    // Master View
                    <>
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tight">Maintenance Strategies</h1>
                                <p className="text-muted-foreground">Beheer de SAP Maintenance Strategies (onderhoudsroutes / intervallen).</p>
                            </div>

                            <Dialog open={isCreateOpen || !!editStrategy} onOpenChange={(open) => {
                                if (!open) {
                                    setIsCreateOpen(false);
                                    setEditStrategy(null);
                                    resetStrategy();
                                } else {
                                    setIsCreateOpen(true);
                                }
                            }}>
                                <DialogTrigger asChild>
                                    <Button className="gap-2">
                                        <Plus className="h-4 w-4" /> Nieuwe Strategie
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{editStrategy ? 'Strategie Bewerken' : 'Nieuwe Strategie'}</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleStrategySubmit} className="space-y-4">
                                        <div className="grid gap-2">
                                            <Label>Naam Strategie</Label>
                                            <Input
                                                value={strategyData.name}
                                                onChange={e => setStrategyData('name', e.target.value)}
                                                placeholder="e.g. STRAT_ALGEMEEN"
                                                required
                                            />
                                            {strategyErrors.name && <p className="text-destructive text-sm">{strategyErrors.name}</p>}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Omschrijving</Label>
                                            <Input
                                                value={strategyData.description}
                                                onChange={e => setStrategyData('description', e.target.value)}
                                                placeholder="Optionele omschrijving"
                                            />
                                            {strategyErrors.description && <p className="text-destructive text-sm">{strategyErrors.description}</p>}
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" disabled={strategyProcessing}>Opslaan</Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                            {strategies.length === 0 && (
                                <p className="text-muted-foreground col-span-full">Nog geen strategieën geconfigureerd.</p>
                            )}

                            {strategies.map((strat) => (
                                <Link key={strat.id} href={route('strategies.index', { strategy_id: strat.id })}>
                                    <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer h-full group relative">
                                        <CardHeader>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 bg-primary/10 text-primary rounded-xl group-hover:scale-110 transition-transform">
                                                    <Network className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg">{strat.name}</CardTitle>
                                                </div>
                                            </div>
                                            <CardDescription className="pt-3 text-sm">
                                                {strat.description || 'Geen omschrijving'}
                                            </CardDescription>
                                        </CardHeader>
                                        <div className="absolute top-4 right-4 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground bg-background rounded-full shadow-sm" onClick={(e) => { e.preventDefault(); openEditStrategy(strat); }}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 bg-background rounded-full shadow-sm" onClick={(e) => { e.preventDefault(); handleDeleteStrategy(strat.id); }}>
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </>
                ) : (
                    // Detail & Packages View
                    <>
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" asChild className="rounded-full">
                                <Link href={route('strategies.index')}>
                                    <ArrowLeft className="h-5 w-5" />
                                </Link>
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold">{activeStrategy.name}</h1>
                                <p className="text-muted-foreground text-sm">{activeStrategy.description}</p>
                            </div>
                        </div>

                        <div className="border rounded-xl bg-card shadow-sm overflow-hidden mt-4">
                            <div className="p-4 flex justify-between items-center bg-muted/20 border-b">
                                <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                                    Frequenties / Packages
                                </h2>

                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" className="gap-2" asChild>
                                        <label className="cursor-pointer">
                                            <Upload className="h-4 w-4" /> Importeer
                                            <input type="file" className="hidden" accept=".csv,.txt,.xlsx,.xls" onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    router.post(route('strategies.import.upload'), { file: e.target.files[0], strategy_id: activeStrategy.id });
                                                    e.target.value = '';
                                                }
                                            }} />
                                        </label>
                                    </Button>

                                    <Dialog open={isPackageOpen} onOpenChange={(open) => {
                                        if (!open) {
                                            setIsPackageOpen(false);
                                            setEditPackageItem(null);
                                            resetPackage();
                                        } else {
                                            setIsPackageOpen(true);
                                        }
                                    }}>
                                        <DialogTrigger asChild>
                                            <Button size="sm" className="gap-2">
                                                <Plus className="h-4 w-4" /> Toevoegen
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>{editPackageItem ? 'Package Bewerken' : 'Nieuw Package Toevoegen'}</DialogTitle>
                                            </DialogHeader>
                                            <form onSubmit={handlePackageSubmit} className="space-y-4">
                                                <div className="grid gap-2">
                                                    <Label>Naam (bijv. 1M of A)</Label>
                                                    <Input
                                                        value={packageData.name}
                                                        onChange={e => setPackageData('name', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="grid gap-2">
                                                        <Label>Cyclus Waarde</Label>
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            value={packageData.cycle_value}
                                                            onChange={e => setPackageData('cycle_value', parseInt(e.target.value))}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label>Cyclus Eenheid (MON/WK)</Label>
                                                        <Input
                                                            value={packageData.cycle_unit}
                                                            onChange={e => setPackageData('cycle_unit', e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label>Hiërarchie / Sorteervolgorde (Optioneel)</Label>
                                                    <Input
                                                        type="number"
                                                        value={packageData.hierarchy_short_text}
                                                        onChange={e => setPackageData('hierarchy_short_text', e.target.value)}
                                                    />
                                                </div>
                                                <DialogFooter>
                                                    <Button type="submit" disabled={packageProcessing}>Opslaan</Button>
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
                                            <TableHead>Naam</TableHead>
                                            <TableHead>Interval / Cyclus</TableHead>
                                            <TableHead>Hierarchie / Sortering</TableHead>
                                            <TableHead className="text-right">Acties</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {!activeStrategy.packages || activeStrategy.packages.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center h-32 text-muted-foreground">
                                                    Nog geen packages toegevoegd aan deze strategie.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            activeStrategy.packages.map((pkg) => (
                                                <TableRow key={pkg.id}>
                                                    <TableCell className="font-medium bg-primary/5">{pkg.name}</TableCell>
                                                    <TableCell>{pkg.cycle_value} {pkg.cycle_unit}</TableCell>
                                                    <TableCell>{pkg.hierarchy_short_text || '-'}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="icon" className="text-muted-foreground mr-1 hover:text-primary" onClick={() => openEditPackage(pkg)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeletePackage(pkg.id)}>
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

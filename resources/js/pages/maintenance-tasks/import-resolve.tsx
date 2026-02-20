import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface MissingAsset {
    object_id: string;
    object_type: string;
    name: string;
    action?: 'create' | 'skip';
}

interface Props {
    filePath: string;
    mapping: Record<string, string>;
    missingAssets: MissingAsset[];
}

export default function ImportResolve({ filePath, mapping, missingAssets: initialMissingAssets }: Props) {
    const [assets, setAssets] = useState<MissingAsset[]>(
        initialMissingAssets.map(a => ({ ...a, action: 'create' }))
    );
    const [processing, setProcessing] = useState(false);

    const handleActionChange = (index: number, action: 'create' | 'skip') => {
        const newAssets = [...assets];
        newAssets[index].action = action;
        setAssets(newAssets);
    };

    const handleNameChange = (index: number, name: string) => {
        const newAssets = [...assets];
        newAssets[index].name = name;
        setAssets(newAssets);
    };

    const handleSubmit = () => {
        setProcessing(true);
        router.post(route('maintenance-tasks.import.execute'), {
            file_path: filePath,
            mapping: mapping as any,
            resolved_assets: assets as any,
        }, {
            onFinish: () => setProcessing(false)
        });
    };

    const createCount = assets.filter(a => a.action === 'create').length;
    const skipCount = assets.filter(a => a.action === 'skip').length;

    return (
        <AppLayout breadcrumbs={[
            { title: 'Onderhoudstaken', href: '/maintenance-tasks' },
            { title: 'Import Validatie', href: '#' }
        ]}>
            <Head title="Import Validatie" />

            <div className="flex h-full flex-col p-6 gap-6 max-w-4xl mx-auto w-full">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Ontbrekende SAP Objecten</h1>
                    <p className="text-muted-foreground">
                        Er zijn {assets.length} SAP Objecten (Assets) in je import bestand gevonden die nog niet in ons systeem staan.
                        Kies per object wat hiermee moet gebeuren voordat de import wordt afgerond.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-primary" /> Objecten aanmaken
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 text-2xl font-bold">
                            {createCount}
                            <p className="text-xs text-muted-foreground font-normal mt-1">Worden nieuw aangemaakt in stamgegevens.</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-destructive/5 border-destructive/20">
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2 text-destructive">
                                <AlertCircle className="h-4 w-4" /> Rijen overslaan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 text-2xl font-bold text-destructive">
                            {skipCount}
                            <p className="text-xs text-muted-foreground font-normal mt-1 text-foreground">Importrijen met dit object worden genegeerd.</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead>Geïmporteerd ID</TableHead>
                                <TableHead>Aanmaak Type</TableHead>
                                <TableHead>Naam of Omschrijving</TableHead>
                                <TableHead className="w-[180px]">Actie</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assets.map((asset, idx) => (
                                <TableRow key={asset.object_id} className={asset.action === 'skip' ? 'opacity-50 bg-muted/20' : ''}>
                                    <TableCell className="font-medium">{asset.object_id}</TableCell>
                                    <TableCell className="capitalize">{asset.object_type}</TableCell>
                                    <TableCell>
                                        <Input
                                            value={asset.name}
                                            onChange={(e) => handleNameChange(idx, e.target.value)}
                                            disabled={asset.action === 'skip'}
                                            className="h-8 shadow-none"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={asset.action}
                                            onValueChange={(val: 'create' | 'skip') => handleActionChange(idx, val)}
                                        >
                                            <SelectTrigger className={`h-8 ${asset.action === 'create' ? 'border-primary/50 text-primary' : 'border-destructive/50 text-destructive'}`}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="create">Bestaand / Maken</SelectItem>
                                                <SelectItem value="skip">Rijen Overslaan</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>

                <div className="flex justify-end gap-4 mt-4">
                    <Button variant="outline" asChild>
                        <a href={route('maintenance-tasks.index')}>Annuleren</a>
                    </Button>
                    <Button onClick={handleSubmit} disabled={processing}>
                        {processing ? 'Bezig...' : 'Import Uitvoeren'}
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
} 

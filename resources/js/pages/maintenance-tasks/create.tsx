import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { FormEventHandler } from 'react';

import { useMasterData } from '@/hooks/useMasterData';

export default function Create() {
    const { frequencyUnits } = useMasterData();
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        frequency_unit: 'WK',
        frequency_value: 1,
        object_type: 'equipment',
        object_id: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('maintenance-tasks.store'));
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Onderhoudstaken', href: '/maintenance-tasks' },
            { title: 'Nieuwe Taak', href: '/maintenance-tasks/create' },
        ]}>
            <Head title="Nieuwe Onderhoudstaak" />

            <div className="flex h-full flex-col items-center justify-center p-4">
                <div className="w-full max-w-2xl space-y-6">
                    <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-bold">Start nieuwe taak</h1>
                        <p className="text-muted-foreground">Definieer de basis voor preventief onderhoud.</p>
                    </div>

                    <form onSubmit={submit} className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Korte Omschrijving</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="bv. Visuele inspectie pomp"
                                    required
                                />
                                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Uitgebreide omschrijving / Opmerking</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Extra context..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Frequentie Eenheid</Label>
                                    <Select
                                        value={data.frequency_unit}
                                        onValueChange={(val) => setData('frequency_unit', val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {frequencyUnits.map(unit => (
                                                <SelectItem key={unit.key} value={unit.key}>
                                                    {unit.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="freq_val">Waarde</Label>
                                    <Input
                                        id="freq_val"
                                        type="number"
                                        min="1"
                                        value={data.frequency_value}
                                        onChange={(e) => setData('frequency_value', parseInt(e.target.value))}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Object Type</Label>
                                    <Select
                                        value={data.object_type}
                                        onValueChange={(val) => setData('object_type', val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="equipment">Equipment</SelectItem>
                                            <SelectItem value="floc">Functionele Locatie</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="object_id">Object ID / Tag</Label>
                                    <Input
                                        id="object_id"
                                        value={data.object_id}
                                        onChange={(e) => setData('object_id', e.target.value)}
                                        placeholder="bv. P-101 of FL-01-02"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button variant="outline" asChild>
                                <Link href={route('maintenance-tasks.index')}>Annuleren</Link>
                            </Button>
                            <Button type="submit" disabled={processing}>
                                Start Inrichting &rarr;
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

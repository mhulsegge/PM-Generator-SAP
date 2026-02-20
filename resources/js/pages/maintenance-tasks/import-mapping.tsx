import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LoaderCircle } from 'lucide-react';

interface Props {
    filePath: string;
    headers: string[];
}

export default function ImportMapping({ filePath, headers }: Props) {
    const { data, setData, post, processing, errors, transform } = useForm({
        file_path: filePath,
        mapping: {
            name: '',
            description: 'none',
            frequency_unit: '',
            frequency_value: '',
            object_type: '',
            object_id: '',
        }
    });

    transform((data) => ({
        ...data,
        mapping: {
            ...data.mapping,
            description: data.mapping.description === 'none' ? '' : data.mapping.description,
        }
    }));

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('maintenance-tasks.import.process'));
    };

    const handleMappingChange = (field: keyof typeof data.mapping, value: string) => {
        setData('mapping', { ...data.mapping, [field]: value });
    };

    const requiredFields = [
        { key: 'name', label: 'Naam / Omschrijving (Verplicht)' },
        { key: 'frequency_unit', label: 'Eenheid (Verplicht, bijv. weken of WK)' },
        { key: 'frequency_value', label: 'Frequentie waarde (Verplicht, bijv. 4)' },
        { key: 'object_type', label: 'Object Type (Verplicht, floc of equipment)' },
        { key: 'object_id', label: 'Object ID (Verplicht, bijv. SAP nummer)' },
    ];

    // Description is optional
    const optionalFields = [
        { key: 'description', label: 'Uitgebreide omschrijving (Optioneel)' },
    ];

    return (
        <AppLayout breadcrumbs={[
            { title: 'Onderhoudstaken', href: '/maintenance-tasks' },
            { title: 'Kolommen Koppelen', href: '#' },
        ]}>
            <Head title="Kolommen Koppelen - Import" />

            <div className="flex h-full flex-col gap-4 p-4 max-w-4xl mx-auto w-full">
                <Card>
                    <CardHeader>
                        <CardTitle>Koppel Data Kolommen</CardTitle>
                        <CardDescription>
                            We hebben het door jou geüploade bestand gelezen. Koppel hieronder de vereiste velden uit ons systeem aan de kolommen in jouw Excel of CSV bestand.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={submit}>
                        <CardContent className="space-y-6">
                            {/* Required fields */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Verplichte Velden</h3>
                                {requiredFields.map((field) => (
                                    <div key={field.key} className="grid grid-cols-1 md:grid-cols-2 gap-2 md:items-center">
                                        <Label htmlFor={field.key} className={(errors as Record<string, string>)[`mapping.${field.key}`] ? "text-destructive" : ""}>
                                            {field.label}
                                        </Label>
                                        <div>
                                            <Select
                                                value={data.mapping[field.key as keyof typeof data.mapping]}
                                                onValueChange={(val) => handleMappingChange(field.key as keyof typeof data.mapping, val)}
                                            >
                                                <SelectTrigger id={field.key} className={(errors as Record<string, string>)[`mapping.${field.key}`] ? "border-destructive ring-destructive" : ""}>
                                                    <SelectValue placeholder="Selecteer een kolom" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {headers.map((header, idx) => (
                                                        <SelectItem key={`${header}-${idx}`} value={header}>
                                                            {header}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {(errors as Record<string, string>)[`mapping.${field.key}`] && (
                                                <p className="text-sm font-medium text-destructive mt-1">Dit veld moet gekoppeld worden.</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Optional fields */}
                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="text-lg font-semibold text-muted-foreground">Optionele Velden</h3>
                                {optionalFields.map((field) => (
                                    <div key={field.key} className="grid grid-cols-1 md:grid-cols-2 gap-2 md:items-center">
                                        <Label htmlFor={field.key} className="text-muted-foreground">
                                            {field.label}
                                        </Label>
                                        <Select
                                            value={data.mapping[field.key as keyof typeof data.mapping]}
                                            onValueChange={(val) => handleMappingChange(field.key as keyof typeof data.mapping, val)}
                                        >
                                            <SelectTrigger id={field.key}>
                                                <SelectValue placeholder="-- Optioneel (geen kolom) --" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">-- Optioneel (geef niets door) --</SelectItem>
                                                {headers.map((header, idx) => (
                                                    <SelectItem key={`${header}-${idx}`} value={header}>
                                                        {header}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t p-6">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => window.history.back()}
                                disabled={processing}
                            >
                                Annuleren
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                Start Import
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}

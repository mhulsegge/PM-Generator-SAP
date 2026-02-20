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
            article_number: '',
            description: '',
            unit: 'none',
        }
    });

    transform((data) => ({
        ...data,
        mapping: {
            ...data.mapping,
            unit: data.mapping.unit === 'none' ? '' : data.mapping.unit,
        }
    }));

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('articles.import.process'));
    };

    const handleMappingChange = (field: keyof typeof data.mapping, value: string) => {
        setData('mapping', { ...data.mapping, [field]: value });
    };

    const requiredFields = [
        { key: 'article_number', label: 'Artikelnummer (Verplicht)' },
        { key: 'description', label: 'Omschrijving (Verplicht)' },
    ];

    const optionalFields = [
        { key: 'unit', label: 'Eenheid (Optioneel, default ST)' },
    ];

    return (
        <AppLayout breadcrumbs={[
            { title: 'Artikelen', href: '/articles' },
            { title: 'Kolommen Koppelen', href: '#' },
        ]}>
            <Head title="Kolommen Koppelen - Import" />

            <div className="flex h-full flex-col gap-4 p-4 max-w-4xl mx-auto w-full">
                <Card>
                    <CardHeader>
                        <CardTitle>Koppel Data Kolommen (Artikelen)</CardTitle>
                        <CardDescription>
                            We hebben het door jou geüploade bestand gelezen. Koppel hieronder de velden.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={submit}>
                        <CardContent className="space-y-6">
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
                                                <SelectValue placeholder="-- Optioneel (geef niets door) --" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">-- Optioneel (geen kolom) --</SelectItem>
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
                            <Button variant="outline" type="button" onClick={() => window.history.back()} disabled={processing}>
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

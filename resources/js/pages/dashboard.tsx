import { Head } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

// UI Components
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Toggle } from '@/components/ui/toggle';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

// Icons
import {
    AlertCircle,
    Bell,
    Bold,
    Check,
    Info,
    Italic,
    Loader2,
    Mail,
    Plus,
    Settings,
    Underline,
    User,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState(false);

    const handleLoadingDemo = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 2000);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-semibold">
                        Component Overzicht
                    </h1>
                    <p className="text-muted-foreground">
                        Een demonstratie van alle beschikbare UI componenten in
                        deze starter kit.
                    </p>
                </div>

                {/* Buttons Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Buttons</CardTitle>
                        <CardDescription>
                            Verschillende button varianten en groottes.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="mb-2 block text-xs text-muted-foreground">
                                Varianten
                            </Label>
                            <div className="flex flex-wrap gap-2">
                                <Button variant="default">Standaard</Button>
                                <Button variant="secondary">Secundair</Button>
                                <Button variant="destructive">
                                    Destructief
                                </Button>
                                <Button variant="outline">Outline</Button>
                                <Button variant="ghost">Ghost</Button>
                                <Button variant="link">Link</Button>
                            </div>
                        </div>
                        <Separator />
                        <div>
                            <Label className="mb-2 block text-xs text-muted-foreground">
                                Groottes
                            </Label>
                            <div className="flex flex-wrap items-center gap-2">
                                <Button size="sm">Klein</Button>
                                <Button size="default">Standaard</Button>
                                <Button size="lg">Groot</Button>
                                <Button size="icon">
                                    <Plus />
                                </Button>
                            </div>
                        </div>
                        <Separator />
                        <div>
                            <Label className="mb-2 block text-xs text-muted-foreground">
                                Staten
                            </Label>
                            <div className="flex flex-wrap items-center gap-2">
                                <Button disabled>Uitgeschakeld</Button>
                                <Button onClick={handleLoadingDemo}>
                                    {loading && (
                                        <Loader2 className="animate-spin" />
                                    )}
                                    {loading ? 'Laden...' : 'Klik voor laden'}
                                </Button>
                                <Button>
                                    <Mail /> Met icoon
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Badges Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Badges</CardTitle>
                        <CardDescription>
                            Labels en status indicatoren.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="default">Standaard</Badge>
                            <Badge variant="secondary">Secundair</Badge>
                            <Badge variant="destructive">Destructief</Badge>
                            <Badge variant="outline">Outline</Badge>
                            <Badge>
                                <Check className="size-3" /> Voltooid
                            </Badge>
                            <Badge variant="secondary">
                                <Bell className="size-3" /> 3 Nieuw
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Alerts Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Alerts</CardTitle>
                        <CardDescription>
                            Meldingen en waarschuwingen voor gebruikers.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert>
                            <Info className="size-4" />
                            <AlertTitle>Informatie</AlertTitle>
                            <AlertDescription>
                                Dit is een informatieve melding voor de
                                gebruiker.
                            </AlertDescription>
                        </Alert>
                        <Alert variant="destructive">
                            <AlertCircle className="size-4" />
                            <AlertTitle>Fout</AlertTitle>
                            <AlertDescription>
                                Er is iets misgegaan. Probeer het opnieuw.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>

                {/* Form Elements */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Inputs */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Invoervelden</CardTitle>
                            <CardDescription>
                                Tekstvelden en labels.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">E-mailadres</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="naam@voorbeeld.nl"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Wachtwoord</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="disabled">Uitgeschakeld</Label>
                                <Input
                                    id="disabled"
                                    disabled
                                    placeholder="Dit veld is uitgeschakeld"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Select & Checkbox */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Selectie</CardTitle>
                            <CardDescription>
                                Dropdowns en checkboxes.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Kies een optie</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecteer..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="optie1">
                                            Optie 1
                                        </SelectItem>
                                        <SelectItem value="optie2">
                                            Optie 2
                                        </SelectItem>
                                        <SelectItem value="optie3">
                                            Optie 3
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Separator />
                            <div className="space-y-3">
                                <Label>Voorkeuren</Label>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="terms"
                                        checked={checked}
                                        onCheckedChange={(c) =>
                                            setChecked(c === true)
                                        }
                                    />
                                    <Label
                                        htmlFor="terms"
                                        className="font-normal"
                                    >
                                        Ik ga akkoord met de voorwaarden
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="newsletter" defaultChecked />
                                    <Label
                                        htmlFor="newsletter"
                                        className="font-normal"
                                    >
                                        Schrijf me in voor de nieuwsbrief
                                    </Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Dialog & Tooltips */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Dialog */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Dialoog</CardTitle>
                            <CardDescription>
                                Modale vensters voor interacties.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Dialog
                                open={dialogOpen}
                                onOpenChange={setDialogOpen}
                            >
                                <DialogTrigger asChild>
                                    <Button>Open Dialoog</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Voorbeeld Dialoog
                                        </DialogTitle>
                                        <DialogDescription>
                                            Dit is een voorbeeld van een modale
                                            dialoog. Je kunt hier formulieren,
                                            bevestigingen of andere content
                                            plaatsen.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Naam</Label>
                                            <Input
                                                id="name"
                                                placeholder="Vul je naam in"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            onClick={() => setDialogOpen(false)}
                                        >
                                            Annuleren
                                        </Button>
                                        <Button
                                            onClick={() => setDialogOpen(false)}
                                        >
                                            Opslaan
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>

                    {/* Tooltips */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Tooltips</CardTitle>
                            <CardDescription>
                                Hover hints voor extra informatie.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" size="icon">
                                            <User />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Bekijk profiel
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" size="icon">
                                            <Settings />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Instellingen
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" size="icon">
                                            <Bell />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Notificaties
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" size="icon">
                                            <Mail />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Berichten</TooltipContent>
                                </Tooltip>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Toggle & Skeleton */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Toggle */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Toggle</CardTitle>
                            <CardDescription>
                                Schakelknoppen voor opties.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                <Toggle aria-label="Toggle bold">
                                    <Bold />
                                </Toggle>
                                <Toggle aria-label="Toggle italic">
                                    <Italic />
                                </Toggle>
                                <Toggle aria-label="Toggle underline">
                                    <Underline />
                                </Toggle>
                                <Separator
                                    orientation="vertical"
                                    className="h-9"
                                />
                                <Toggle variant="outline" aria-label="Outline">
                                    <Settings />
                                </Toggle>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Skeleton */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Skeleton</CardTitle>
                            <CardDescription>
                                Laadstatus placeholders.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-4">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[200px]" />
                                    <Skeleton className="h-4 w-[150px]" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Cards Example */}
                <Card>
                    <CardHeader>
                        <CardTitle>Card Componenten</CardTitle>
                        <CardDescription>
                            Voorbeelden van cards met verschillende inhoud.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base">
                                        Totaal Gebruikers
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">
                                        1.234
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        +12% sinds vorige maand
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base">
                                        Actieve Sessies
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">89</div>
                                    <p className="text-xs text-muted-foreground">
                                        Nu online
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base">
                                        API Verzoeken
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">
                                        45.2K
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Deze week
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                    <CardFooter className="text-sm text-muted-foreground">
                        Laatst bijgewerkt: zojuist
                    </CardFooter>
                </Card>
            </div>
        </AppLayout>
    );
}

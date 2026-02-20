import { Head, Link, usePage } from '@inertiajs/react';
import { MaintenanceTask } from '@/types/maintenance';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';

interface Props {
    tasks: {
        data: MaintenanceTask[];
        links: any[];
    };
}

export default function Index({ tasks }: Props) {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Onderhoudstaken', href: '/maintenance-tasks' },
        ]}>
            <Head title="Preventieve Onderhoudstaken" />

            <div className="flex h-full flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Preventieve Onderhoudstaken</h1>
                    <Button asChild>
                        <Link href={route('maintenance-tasks.create')}>
                            Nieuwe Taak
                        </Link>
                    </Button>
                </div>

                <div className="rounded-md border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Omschrijving</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Acties</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tasks.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        Geen taken gevonden. Maak een nieuwe taak aan.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tasks.data.map((task) => (
                                    <TableRow key={task.id}>
                                        <TableCell className="font-medium">
                                            {task.name || 'Naamloos'}
                                            {task.description && (
                                                <div className="text-xs text-muted-foreground">{task.description}</div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {task.plan ? `${task.plan.frequency_value} ${task.plan.frequency_unit}` : '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={task.status === 'active' ? 'default' : 'secondary'}>
                                                {task.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={route('maintenance-tasks.edit', task.id)}>
                                                    Openen
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}

import { useMaintenanceTaskStore } from '@/hooks/useMaintenanceTaskStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Step3Grouping() {
    const { currentTask, updateTask, nextStep, prevStep } = useMaintenanceTaskStore();

    if (!currentTask) return null;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Objecten Groeperen</CardTitle>
                    <CardDescription>Voeg meerdere objecten toe aan deze taak als ze tegelijkertijd worden uitgevoerd.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Object ID</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Locatie</TableHead>
                                    <TableHead className="text-right">Actie</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentTask.items?.map((item, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell className="font-medium">{item.object_id}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{item.object_type}</Badge>
                                        </TableCell>
                                        <TableCell>{item.location || '-'}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" disabled={idx === 0}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="mt-4 flex justify-center">
                        <Button variant="outline" className="gap-2">
                            <Plus className="h-4 w-4" /> Object Toevoegen
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>Terug</Button>
                <Button onClick={nextStep}>Volgende: Taaklijst</Button>
            </div>
        </div>
    );
}

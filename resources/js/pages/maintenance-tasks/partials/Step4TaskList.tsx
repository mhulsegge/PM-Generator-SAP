import { useMaintenanceTaskStore } from '@/hooks/useMaintenanceTaskStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { TaskListOperation } from '@/types/maintenance';

export default function Step4TaskList() {
    const { currentTask, updateTask, nextStep, prevStep } = useMaintenanceTaskStore();

    if (!currentTask) return null;

    const taskList = currentTask.task_list || {
        type: 'general',
        status: '1',
        operations: []
    };

    const operations = taskList.operations || [];

    const addOperation = () => {
        const newOp: TaskListOperation = {
            operation_number: (operations.length + 1) * 10,
            control_key: 'PM01',
            short_text: '',
            duration_unit: 'H',
            number_of_people: 1,
        };

        const updatedOps = [...operations, newOp];
        // In a real app, we would update the store deeply
        // For MVP mock updates:
        updateTask({
            task_list: {
                ...taskList,
                operations: updatedOps
            } as any
        });
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Taaklijst / Werkinstructie</CardTitle>
                    <CardDescription>Definieer de stappen die de monteur moet uitvoeren.</CardDescription>
                </CardHeader>
                <CardContent>
                    {operations.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground border-dashed border-2 rounded-lg">
                            <p>Nog geen operaties toegevoegd.</p>
                            <Button onClick={addOperation} variant="secondary" className="mt-4">
                                Eerste stap toevoegen
                            </Button>
                        </div>
                    ) : (
                        <Accordion type="single" collapsible className="w-full space-y-2">
                            {operations.map((op, idx) => (
                                <AccordionItem key={idx} value={`item-${idx}`} className="border rounded-md px-4">
                                    <AccordionTrigger className="hover:no-underline">
                                        <div className="flex items-center gap-4 w-full">
                                            <span className="text-muted-foreground w-8">{op.operation_number}</span>
                                            <span className="font-medium">{op.short_text || '(Nieuwe stap)'}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-4 space-y-4">
                                        <div className="grid gap-2">
                                            <Label>Korte Omschrijving</Label>
                                            <Input
                                                value={op.short_text}
                                                onChange={(e) => {
                                                    const newOps = [...operations];
                                                    newOps[idx].short_text = e.target.value;
                                                    updateTask({ task_list: { ...taskList, operations: newOps } as any });
                                                }}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Lange Tekst (Instructie)</Label>
                                            <Textarea
                                                value={op.long_text || ''}
                                                onChange={(e) => {
                                                    const newOps = [...operations];
                                                    newOps[idx].long_text = e.target.value;
                                                    updateTask({ task_list: { ...taskList, operations: newOps } as any });
                                                }}
                                                className="min-h-[100px]"
                                            />
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="grid gap-2 w-1/3">
                                                <Label>Duur (Uur)</Label>
                                                <Input type="number" step="0.1"
                                                    value={op.duration_normal || ''}
                                                    onChange={(e) => {
                                                        const newOps = [...operations];
                                                        newOps[idx].duration_normal = parseFloat(e.target.value);
                                                        updateTask({ task_list: { ...taskList, operations: newOps } as any });
                                                    }}
                                                />
                                            </div>
                                            <div className="grid gap-2 w-1/3">
                                                <Label>Personen</Label>
                                                <Input type="number"
                                                    value={op.number_of_people}
                                                    onChange={(e) => {
                                                        const newOps = [...operations];
                                                        newOps[idx].number_of_people = parseInt(e.target.value);
                                                        updateTask({ task_list: { ...taskList, operations: newOps } as any });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )}

                    {operations.length > 0 && (
                        <Button onClick={addOperation} variant="outline" className="w-full mt-4 gap-2">
                            <Plus className="h-4 w-4" /> Volgende stap toevoegen
                        </Button>
                    )}
                </CardContent>
            </Card>

            <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>Terug</Button>
                <Button onClick={nextStep}>Volgende: Validatie</Button>
            </div>
        </div>
    );
}

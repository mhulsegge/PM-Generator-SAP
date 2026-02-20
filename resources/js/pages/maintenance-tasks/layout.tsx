import { ReactNode, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { MaintenanceTask } from '@/types/maintenance';
import { Button } from '@/components/ui/button';
import { ArrowLeft, GitMerge, FileText, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMaintenanceTaskStore } from '@/hooks/useMaintenanceTaskStore';

interface TaskLayoutProps {
    task: MaintenanceTask;
    children: ReactNode;
    title: string;
}

export default function TaskLayout({ task, children, title }: TaskLayoutProps) {
    const { url } = usePage();
    const { setTask } = useMaintenanceTaskStore();

    useEffect(() => {
        setTask(task);
    }, [task]);

    const navItems = [
        {
            name: 'Maintenance Plan',
            href: route('maintenance-tasks.plan', task.id),
            icon: Settings2,
            active: url.includes('/plan'),
        },
        {
            name: 'Maintenance Items',
            href: route('maintenance-tasks.items', task.id),
            icon: GitMerge,
            active: url.includes('/items'),
        },
        {
            name: 'Taaklijst (Task List)',
            href: route('maintenance-tasks.task-list', task.id),
            icon: FileText,
            active: url.includes('/task-list'),
        }
    ];

    return (
        <AppLayout breadcrumbs={[
            { title: 'Onderhoudstaken', href: '/maintenance-tasks' },
            { title: task.name || 'Nieuwe Taak', href: `/maintenance-tasks/${task.id}/plan` },
            { title: title, href: url },
        ]}>
            <Head title={`${title} - ${task.name}`} />

            <div className="flex h-full flex-col">
                <div className="border-b p-4 bg-background">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/maintenance-tasks">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold">{task.name || 'Naamloze Taak'}</h1>
                            <p className="text-sm text-muted-foreground">
                                {task.status.toUpperCase()} • Modus: Preventief Onderhoud Configureren
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Left side Sub-Navigation */}
                    <aside className="w-64 border-r bg-muted/20 p-4 shrink-0 flex flex-col gap-2">
                        <h2 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-2">
                            Configuratie
                        </h2>
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                                        item.active
                                            ? "bg-primary text-primary-foreground shadow-sm"
                                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1 overflow-auto p-6 bg-muted/5">
                        <div className="mx-auto max-w-4xl">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </AppLayout>
    );
}

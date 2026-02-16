import { Head, Link, router } from '@inertiajs/react';
import { Edit, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DataTable,
    type Column,
    type PaginationData,
} from '@/components/ui/data-table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { BreadcrumbItem } from '@/types';

interface Project {
    id: number;
    name: string;
    description: string | null;
    status: 'concept' | 'actief' | 'voltooid' | 'geannuleerd';
    priority: 'laag' | 'normaal' | 'hoog' | 'urgent';
    budget: number | null;
    start_date: string | null;
    end_date: string | null;
    created_at: string;
}

interface FilterOption {
    value: string;
    label: string;
}

interface Props {
    projects: {
        data: Project[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
    };
    filters: Record<string, string | number | undefined>;
    statuses: FilterOption[];
    priorities: FilterOption[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Projecten',
        href: '/projects',
    },
];

const statusColors: Record<string, string> = {
    concept: 'secondary',
    actief: 'default',
    voltooid: 'outline',
    geannuleerd: 'destructive',
};

const priorityColors: Record<string, string> = {
    laag: 'secondary',
    normaal: 'outline',
    hoog: 'default',
    urgent: 'destructive',
};

export default function ProjectsIndex({
    projects,
    filters,
    statuses,
    priorities,
}: Props) {
    const columns: Column<Project>[] = [
        {
            key: 'name',
            label: 'Naam',
            sortable: true,
            filterable: true,
            filterType: 'text',
            render: (project) => (
                <div>
                    <div className="font-medium">{project.name}</div>
                    {project.description && (
                        <div className="max-w-xs truncate text-sm text-muted-foreground">
                            {project.description}
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            filterable: true,
            filterType: 'select',
            filterOptions: statuses,
            render: (project) => (
                <Badge
                    variant={
                        statusColors[project.status] as
                            | 'default'
                            | 'secondary'
                            | 'destructive'
                            | 'outline'
                    }
                >
                    {project.status.charAt(0).toUpperCase() +
                        project.status.slice(1)}
                </Badge>
            ),
        },
        {
            key: 'priority',
            label: 'Prioriteit',
            sortable: true,
            filterable: true,
            filterType: 'select',
            filterOptions: priorities,
            render: (project) => (
                <Badge
                    variant={
                        priorityColors[project.priority] as
                            | 'default'
                            | 'secondary'
                            | 'destructive'
                            | 'outline'
                    }
                >
                    {project.priority.charAt(0).toUpperCase() +
                        project.priority.slice(1)}
                </Badge>
            ),
        },
        {
            key: 'budget',
            label: 'Budget',
            sortable: true,
            filterable: true,
            filterType: 'number',
            render: (project) =>
                project.budget
                    ? new Intl.NumberFormat('nl-NL', {
                          style: 'currency',
                          currency: 'EUR',
                      }).format(project.budget)
                    : '-',
        },
        {
            key: 'start_date',
            label: 'Startdatum',
            sortable: true,
            filterable: true,
            filterType: 'dateRange',
            render: (project) =>
                project.start_date
                    ? new Date(project.start_date).toLocaleDateString('nl-NL')
                    : '-',
        },
        {
            key: 'created_at',
            label: 'Aangemaakt',
            sortable: true,
            filterable: true,
            filterType: 'dateRange',
            render: (project) =>
                new Date(project.created_at).toLocaleDateString('nl-NL'),
        },
    ];

    const pagination: PaginationData = {
        current_page: projects.current_page,
        last_page: projects.last_page,
        per_page: projects.per_page,
        total: projects.total,
        from: projects.from,
        to: projects.to,
    };

    const handleDelete = (project: Project) => {
        if (
            confirm(`Weet je zeker dat je "${project.name}" wilt verwijderen?`)
        ) {
            router.delete(`/projects/${project.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Projecten" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Projecten</h1>
                        <p className="text-muted-foreground">
                            Beheer je projecten en volg de voortgang.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/projects/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Nieuw Project
                        </Link>
                    </Button>
                </div>

                {/* DataTable */}
                <DataTable
                    data={projects.data}
                    columns={columns}
                    pagination={pagination}
                    currentFilters={filters}
                    baseUrl="/projects"
                    searchPlaceholder="Zoek projecten..."
                    actions={(project) => (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Acties</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link href={`/projects/${project.id}/edit`}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Bewerken
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => handleDelete(project)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Verwijderen
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                />
            </div>
        </AppLayout>
    );
}

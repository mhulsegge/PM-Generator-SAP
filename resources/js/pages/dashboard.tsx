import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Wrench,
    Database,
    Calendar,
    Activity,
    ClipboardList,
    CheckCircle2,
    AlertCircle,
    Clock,
    ChevronRight
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

interface DashboardProps {
    stats: {
        totalTasks: number;
        totalPlans: number;
        totalMasterData: number;
    };
    tasksByStatus: {
        status: string;
        count: number;
    }[];
    recentTasks: {
        id: number;
        name: string;
        description: string;
        status: string;
        created_at: string;
        updated_at: string;
        plan: any;
    }[];
    masterDataByCategory: {
        category: string;
        count: number;
    }[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Dashboard({ stats, tasksByStatus, recentTasks, masterDataByCategory }: DashboardProps) {
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            case 'in_progress': return <Activity className="w-4 h-4 text-blue-500" />;
            case 'pending': return <Clock className="w-4 h-4 text-orange-500" />;
            default: return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'completed': return 'Voltooid';
            case 'in_progress': return 'Bezig';
            case 'pending': return 'In Wachtrij';
            default: return status || 'Onbekend';
        }
    };

    // Format Data for Recharts pie chart
    const pieData = tasksByStatus.map(statusData => ({
        name: getStatusLabel(statusData.status),
        value: statusData.count
    }));

    // Format Data for Recharts Bar chart
    const barData = masterDataByCategory.slice(0, 5).map(catData => ({
        name: catData.category.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()),
        count: catData.count
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Project Overzicht</h1>
                    <p className="text-muted-foreground mt-1">
                        Bekijk de huidige status van je PM-Generator data.
                    </p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link href={route('maintenance-tasks.index')} className="block group">
                        <Card className="transition-all hover:ring-2 hover:ring-primary/50 relative overflow-hidden h-full">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
                                <CardTitle className="text-sm rounded-full font-medium flex items-center gap-2">
                                    Onderhoudstaken
                                    <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                                </CardTitle>
                                <div className="p-2 bg-primary/10 rounded-md">
                                    <ClipboardList className="w-4 h-4 text-primary" />
                                </div>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className="text-3xl font-bold">{stats.totalTasks}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Totaal aantal taken in beheer
                                </p>
                            </CardContent>
                            <div className="absolute right-0 bottom-0 opacity-5 w-24 h-24 translate-x-4 translate-y-4">
                                <ClipboardList className="w-full h-full" />
                            </div>
                        </Card>
                    </Link>

                    <Link href={route('maintenance-tasks.index')} className="block group">
                        <Card className="transition-all hover:ring-2 hover:ring-primary/50 relative overflow-hidden h-full">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    Onderhoudsplannen
                                    <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                                </CardTitle>
                                <div className="p-2 bg-primary/10 rounded-md">
                                    <Calendar className="w-4 h-4 text-primary" />
                                </div>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className="text-3xl font-bold">{stats.totalPlans}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Gecombineerde unieke plannen
                                </p>
                            </CardContent>
                            <div className="absolute right-0 bottom-0 opacity-5 w-24 h-24 translate-x-4 translate-y-4">
                                <Calendar className="w-full h-full" />
                            </div>
                        </Card>
                    </Link>

                    <Link href={route('master-data.index')} className="block group">
                        <Card className="transition-all hover:ring-2 hover:ring-primary/50 relative overflow-hidden h-full">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    Stamgegevens
                                    <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                                </CardTitle>
                                <div className="p-2 bg-primary/10 rounded-md">
                                    <Database className="w-4 h-4 text-primary" />
                                </div>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className="text-3xl font-bold">{stats.totalMasterData}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Master data configuraties
                                </p>
                            </CardContent>
                            <div className="absolute right-0 bottom-0 opacity-5 w-24 h-24 translate-x-4 translate-y-4">
                                <Database className="w-full h-full" />
                            </div>
                        </Card>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Recent Tasks */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Recente Onderhoudstaken</CardTitle>
                            <CardDescription>De 5 laatst aangepaste taken in het platform.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentTasks.length === 0 ? (
                                    <div className="text-center py-6 text-muted-foreground">Geen recente taken gevonden.</div>
                                ) : (
                                    recentTasks.map(task => (
                                        <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg bg-card/50 transition-colors hover:bg-muted/50">
                                            <div className="flex gap-4 items-center">
                                                <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                                                    <Wrench className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <Link href={route('maintenance-tasks.edit', task.id)} className="font-semibold text-sm hover:underline">
                                                        {task.name || 'Naamloze Taak'}
                                                    </Link>
                                                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 max-w-[200px] lg:max-w-md">
                                                        {task.description || 'Geen beschrijving...'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Badge variant="outline" className="flex gap-1.5 items-center bg-background">
                                                    {getStatusIcon(task.status)}
                                                    {getStatusLabel(task.status)}
                                                </Badge>
                                                <div className="text-xs text-muted-foreground text-right w-[110px] hidden sm:block">
                                                    {new Date(task.updated_at).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Breakdown */}
                    <div className="space-y-6">
                        <Card className="flex flex-col">
                            <CardHeader className="pb-2">
                                <CardTitle>Voortgang</CardTitle>
                                <CardDescription>Verdeling van taken op status</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-center">
                                {pieData.length === 0 ? (
                                    <div className="text-sm text-muted-foreground text-center py-8">Nog geen data.</div>
                                ) : (
                                    <>
                                        <div className="h-[200px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={pieData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={60}
                                                        outerRadius={80}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                    >
                                                        {pieData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <RechartsTooltip formatter={(value: any) => [`${value} taken`, 'Aantal']} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 mt-4">
                                            {pieData.map((entry, index) => (
                                                <div key={entry.name} className="flex items-center text-xs">
                                                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                                    <span className="truncate">{entry.name} ({entry.value})</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle>Stamgegevens</CardTitle>
                                <CardDescription>Top 5 aantal registraties per categorie</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {barData.length === 0 ? (
                                    <div className="text-sm text-muted-foreground text-center py-8">Nog geen stamgegevens.</div>
                                ) : (
                                    <div className="h-[180px] w-full mt-4">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                                                <XAxis type="number" hide />
                                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} style={{ fontSize: '10px' }} />
                                                <RechartsTooltip cursor={{ fill: 'transparent' }} formatter={(value: any) => [`${value}`, 'Items']} />
                                                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} maxBarSize={20}>
                                                    {barData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}

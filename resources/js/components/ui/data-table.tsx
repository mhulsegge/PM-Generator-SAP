import * as React from 'react';
import { router } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Calendar,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Filter,
    Search,
    SlidersHorizontal,
    X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export interface Column<T> {
    key: string;
    label: string;
    sortable?: boolean;
    filterable?: boolean;
    filterType?: 'text' | 'select' | 'number' | 'date' | 'dateRange';
    filterOptions?: FilterOption[];
    render?: (item: T) => React.ReactNode;
    className?: string;
}

export interface FilterOption {
    value: string;
    label: string;
}

export interface PaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

export interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    pagination: PaginationData;
    currentFilters: {
        search?: string;
        sort_by?: string;
        sort_direction?: string;
        per_page?: number;
        [key: string]: string | number | undefined;
    };
    baseUrl: string;
    searchPlaceholder?: string;
    onRowClick?: (item: T) => void;
    actions?: (item: T) => React.ReactNode;
}

export function DataTable<T extends { id: number | string }>({
    data,
    columns,
    pagination,
    currentFilters,
    baseUrl,
    searchPlaceholder = 'Zoeken...',
    onRowClick,
    actions,
}: DataTableProps<T>) {
    const [searchValue, setSearchValue] = React.useState(
        currentFilters.search || ''
    );
    const [columnFilters, setColumnFilters] = React.useState<
        Record<string, string>
    >(() => {
        const filters: Record<string, string> = {};
        columns.forEach((col) => {
            if (col.filterable) {
                const filterKey = `filter_${col.key}`;
                const minKey = `${col.key}_min`;
                const maxKey = `${col.key}_max`;
                const fromKey = `${col.key}_from`;
                const toKey = `${col.key}_to`;

                if (currentFilters[filterKey]) {
                    filters[filterKey] = String(currentFilters[filterKey]);
                }
                if (currentFilters[minKey]) {
                    filters[minKey] = String(currentFilters[minKey]);
                }
                if (currentFilters[maxKey]) {
                    filters[maxKey] = String(currentFilters[maxKey]);
                }
                if (currentFilters[fromKey]) {
                    filters[fromKey] = String(currentFilters[fromKey]);
                }
                if (currentFilters[toKey]) {
                    filters[toKey] = String(currentFilters[toKey]);
                }
            }
        });
        return filters;
    });

    const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    const updateFilters = React.useCallback(
        (newFilters: Record<string, string | number | undefined>) => {
            const params: Record<string, string | number> = {};

            // Merge current filters with new filters
            const merged = {
                ...currentFilters,
                ...newFilters,
                page: newFilters.page || 1,
            };

            // Only include non-empty values
            Object.entries(merged).forEach(([key, value]) => {
                if (value !== '' && value !== undefined && value !== null) {
                    params[key] = value;
                }
            });

            router.get(baseUrl, params, {
                preserveState: true,
                preserveScroll: true,
            });
        },
        [currentFilters, baseUrl]
    );

    const handleSearch = React.useCallback(
        (value: string) => {
            setSearchValue(value);

            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }

            searchTimeoutRef.current = setTimeout(() => {
                updateFilters({ search: value || undefined, page: 1 });
            }, 300);
        },
        [updateFilters]
    );

    const handleSort = React.useCallback(
        (column: string) => {
            const isCurrentSort = currentFilters.sort_by === column;
            const newDirection =
                isCurrentSort && currentFilters.sort_direction === 'asc'
                    ? 'desc'
                    : 'asc';

            updateFilters({
                sort_by: column,
                sort_direction: newDirection,
            });
        },
        [currentFilters.sort_by, currentFilters.sort_direction, updateFilters]
    );

    const handleColumnFilter = React.useCallback(
        (key: string, value: string | undefined) => {
            setColumnFilters((prev) => ({
                ...prev,
                [key]: value || '',
            }));
        },
        []
    );

    const applyColumnFilter = React.useCallback(
        (filterUpdates: Record<string, string | undefined>) => {
            const updates: Record<string, string | undefined> = { page: '1' };
            Object.entries(filterUpdates).forEach(([key, value]) => {
                updates[key] = value || undefined;
            });
            updateFilters(updates);
        },
        [updateFilters]
    );

    const handlePerPageChange = React.useCallback(
        (value: string) => {
            updateFilters({ per_page: parseInt(value), page: 1 });
        },
        [updateFilters]
    );

    const handlePageChange = React.useCallback(
        (page: number) => {
            updateFilters({ page });
        },
        [updateFilters]
    );

    const clearAllFilters = React.useCallback(() => {
        setSearchValue('');
        setColumnFilters({});
        router.get(baseUrl, {}, { preserveState: true });
    }, [baseUrl]);

    const getActiveFilterCount = () => {
        let count = 0;
        if (currentFilters.search) count++;
        columns.forEach((col) => {
            if (col.filterable) {
                const filterKey = `filter_${col.key}`;
                const minKey = `${col.key}_min`;
                const maxKey = `${col.key}_max`;
                const fromKey = `${col.key}_from`;
                const toKey = `${col.key}_to`;

                if (currentFilters[filterKey]) count++;
                if (currentFilters[minKey]) count++;
                if (currentFilters[maxKey]) count++;
                if (currentFilters[fromKey]) count++;
                if (currentFilters[toKey]) count++;
            }
        });
        return count;
    };

    const activeFilterCount = getActiveFilterCount();

    const getSortIcon = (column: string) => {
        if (currentFilters.sort_by !== column) {
            return <ArrowUpDown className="ml-2 h-4 w-4" />;
        }
        return currentFilters.sort_direction === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4" />
        ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
        );
    };

    const filterableColumns = columns.filter((col) => col.filterable);

    return (
        <div className="space-y-4">
            {/* Filters Bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                    {/* Search */}
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                        <Input
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    {/* Advanced Filters Popover */}
                    {filterableColumns.length > 0 && (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="h-9">
                                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                                    Filters
                                    {activeFilterCount > 0 && (
                                        <span className="bg-primary text-primary-foreground ml-2 flex h-5 w-5 items-center justify-center rounded-full text-xs">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-96"
                                align="start"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium">
                                            Kolom Filters
                                        </h4>
                                        {activeFilterCount > 0 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={clearAllFilters}
                                                className="h-8 px-2 text-xs"
                                            >
                                                Alles wissen
                                            </Button>
                                        )}
                                    </div>

                                    {filterableColumns.map((column) => (
                                        <ColumnFilter
                                            key={column.key}
                                            column={column}
                                            currentFilters={currentFilters}
                                            columnFilters={columnFilters}
                                            onFilterChange={handleColumnFilter}
                                            onApply={applyColumnFilter}
                                        />
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}

                    {/* Clear All Filters */}
                    {activeFilterCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearAllFilters}
                            className="h-9"
                        >
                            <X className="mr-2 h-4 w-4" />
                            Filters wissen ({activeFilterCount})
                        </Button>
                    )}
                </div>

                {/* Per Page */}
                <Select
                    value={String(currentFilters.per_page || 10)}
                    onValueChange={handlePerPageChange}
                >
                    <SelectTrigger className="w-[100px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Active Filters Display */}
            {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2">
                    {currentFilters.search && (
                        <FilterBadge
                            label={`Zoeken: "${currentFilters.search}"`}
                            onRemove={() => {
                                setSearchValue('');
                                updateFilters({ search: undefined, page: 1 });
                            }}
                        />
                    )}
                    {filterableColumns.map((column) => {
                        const badges: React.ReactNode[] = [];
                        const filterKey = `filter_${column.key}`;
                        const minKey = `${column.key}_min`;
                        const maxKey = `${column.key}_max`;
                        const fromKey = `${column.key}_from`;
                        const toKey = `${column.key}_to`;

                        if (currentFilters[filterKey]) {
                            const option = column.filterOptions?.find(
                                (o) => o.value === currentFilters[filterKey]
                            );
                            badges.push(
                                <FilterBadge
                                    key={filterKey}
                                    label={`${column.label}: ${option?.label || currentFilters[filterKey]}`}
                                    onRemove={() =>
                                        updateFilters({
                                            [filterKey]: undefined,
                                            page: 1,
                                        })
                                    }
                                />
                            );
                        }

                        if (
                            currentFilters[minKey] ||
                            currentFilters[maxKey]
                        ) {
                            const min = currentFilters[minKey];
                            const max = currentFilters[maxKey];
                            let label = `${column.label}: `;
                            if (min && max) {
                                label += `${min} - ${max}`;
                            } else if (min) {
                                label += `≥ ${min}`;
                            } else if (max) {
                                label += `≤ ${max}`;
                            }
                            badges.push(
                                <FilterBadge
                                    key={`${column.key}_range`}
                                    label={label}
                                    onRemove={() =>
                                        updateFilters({
                                            [minKey]: undefined,
                                            [maxKey]: undefined,
                                            page: 1,
                                        })
                                    }
                                />
                            );
                        }

                        if (currentFilters[fromKey] || currentFilters[toKey]) {
                            const from = currentFilters[fromKey];
                            const to = currentFilters[toKey];
                            let label = `${column.label}: `;
                            if (from && to) {
                                label += `${from} t/m ${to}`;
                            } else if (from) {
                                label += `vanaf ${from}`;
                            } else if (to) {
                                label += `t/m ${to}`;
                            }
                            badges.push(
                                <FilterBadge
                                    key={`${column.key}_daterange`}
                                    label={label}
                                    onRemove={() =>
                                        updateFilters({
                                            [fromKey]: undefined,
                                            [toKey]: undefined,
                                            page: 1,
                                        })
                                    }
                                />
                            );
                        }

                        return badges;
                    })}
                </div>
            )}

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => (
                                <TableHead
                                    key={column.key}
                                    className={column.className}
                                >
                                    <div className="flex items-center">
                                        {column.sortable ? (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="-ml-3 h-8 data-[state=open]:bg-accent"
                                                onClick={() =>
                                                    handleSort(column.key)
                                                }
                                            >
                                                {column.label}
                                                {getSortIcon(column.key)}
                                            </Button>
                                        ) : (
                                            column.label
                                        )}
                                    </div>
                                </TableHead>
                            ))}
                            {actions && (
                                <TableHead className="w-[100px]">
                                    Acties
                                </TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={
                                        columns.length + (actions ? 1 : 0)
                                    }
                                    className="h-24 text-center"
                                >
                                    Geen resultaten gevonden.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item) => (
                                <TableRow
                                    key={item.id}
                                    className={cn(
                                        onRowClick && 'cursor-pointer'
                                    )}
                                    onClick={() => onRowClick?.(item)}
                                >
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.key}
                                            className={column.className}
                                        >
                                            {column.render
                                                ? column.render(item)
                                                : (item as Record<string, unknown>)[
                                                      column.key
                                                  ] as React.ReactNode}
                                        </TableCell>
                                    ))}
                                    {actions && (
                                        <TableCell
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {actions(item)}
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-sm">
                    {pagination.from && pagination.to ? (
                        <>
                            {pagination.from} tot {pagination.to} van{' '}
                            {pagination.total} resultaten
                        </>
                    ) : (
                        'Geen resultaten'
                    )}
                </p>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(1)}
                        disabled={pagination.current_page === 1}
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                            handlePageChange(pagination.current_page - 1)
                        }
                        disabled={pagination.current_page === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                        Pagina {pagination.current_page} van{' '}
                        {pagination.last_page}
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                            handlePageChange(pagination.current_page + 1)
                        }
                        disabled={
                            pagination.current_page === pagination.last_page
                        }
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(pagination.last_page)}
                        disabled={
                            pagination.current_page === pagination.last_page
                        }
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Column Filter Component
function ColumnFilter<T>({
    column,
    currentFilters,
    columnFilters,
    onFilterChange,
    onApply,
}: {
    column: Column<T>;
    currentFilters: Record<string, string | number | undefined>;
    columnFilters: Record<string, string>;
    onFilterChange: (key: string, value: string | undefined) => void;
    onApply: (filters: Record<string, string | undefined>) => void;
}) {
    const filterKey = `filter_${column.key}`;
    const minKey = `${column.key}_min`;
    const maxKey = `${column.key}_max`;
    const fromKey = `${column.key}_from`;
    const toKey = `${column.key}_to`;

    const [localMin, setLocalMin] = React.useState(
        String(currentFilters[minKey] || '')
    );
    const [localMax, setLocalMax] = React.useState(
        String(currentFilters[maxKey] || '')
    );
    const [localFrom, setLocalFrom] = React.useState(
        String(currentFilters[fromKey] || '')
    );
    const [localTo, setLocalTo] = React.useState(
        String(currentFilters[toKey] || '')
    );
    const [localText, setLocalText] = React.useState(
        String(currentFilters[filterKey] || '')
    );

    switch (column.filterType) {
        case 'select':
            return (
                <div className="space-y-2">
                    <Label className="text-sm">{column.label}</Label>
                    <Select
                        value={String(currentFilters[filterKey] || '_all')}
                        onValueChange={(value) =>
                            onApply({
                                [filterKey]: value === '_all' ? undefined : value,
                            })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={`Selecteer ${column.label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="_all">Alle</SelectItem>
                            {column.filterOptions?.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            );

        case 'number':
            return (
                <div className="space-y-2">
                    <Label className="text-sm">{column.label}</Label>
                    <div className="flex gap-2">
                        <Input
                            type="number"
                            placeholder="Min"
                            value={localMin}
                            onChange={(e) => setLocalMin(e.target.value)}
                            className="h-8"
                        />
                        <Input
                            type="number"
                            placeholder="Max"
                            value={localMax}
                            onChange={(e) => setLocalMax(e.target.value)}
                            className="h-8"
                        />
                    </div>
                    <Button
                        size="sm"
                        className="w-full"
                        onClick={() =>
                            onApply({
                                [minKey]: localMin || undefined,
                                [maxKey]: localMax || undefined,
                            })
                        }
                    >
                        Toepassen
                    </Button>
                </div>
            );

        case 'date':
            return (
                <div className="space-y-2">
                    <Label className="text-sm">{column.label}</Label>
                    <Input
                        type="date"
                        value={localFrom}
                        onChange={(e) => setLocalFrom(e.target.value)}
                        className="h-8"
                    />
                    <Button
                        size="sm"
                        className="w-full"
                        onClick={() =>
                            onApply({
                                [fromKey]: localFrom || undefined,
                            })
                        }
                    >
                        Toepassen
                    </Button>
                </div>
            );

        case 'dateRange':
            return (
                <div className="space-y-2">
                    <Label className="text-sm">{column.label}</Label>
                    <div className="flex items-center gap-2">
                        <div className="flex-1">
                            <Label className="text-muted-foreground text-xs">
                                Van
                            </Label>
                            <Input
                                type="date"
                                value={localFrom}
                                onChange={(e) => setLocalFrom(e.target.value)}
                                className="h-8"
                            />
                        </div>
                        <div className="flex-1">
                            <Label className="text-muted-foreground text-xs">
                                Tot
                            </Label>
                            <Input
                                type="date"
                                value={localTo}
                                onChange={(e) => setLocalTo(e.target.value)}
                                className="h-8"
                            />
                        </div>
                    </div>
                    <Button
                        size="sm"
                        className="w-full"
                        onClick={() =>
                            onApply({
                                [fromKey]: localFrom || undefined,
                                [toKey]: localTo || undefined,
                            })
                        }
                    >
                        Toepassen
                    </Button>
                </div>
            );

        case 'text':
        default:
            return (
                <div className="space-y-2">
                    <Label className="text-sm">{column.label}</Label>
                    <div className="flex gap-2">
                        <Input
                            placeholder={`Filter ${column.label.toLowerCase()}...`}
                            value={localText}
                            onChange={(e) => setLocalText(e.target.value)}
                            className="h-8"
                        />
                        <Button
                            size="sm"
                            onClick={() =>
                                onApply({
                                    [filterKey]: localText || undefined,
                                })
                            }
                        >
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            );
    }
}

// Filter Badge Component
function FilterBadge({
    label,
    onRemove,
}: {
    label: string;
    onRemove: () => void;
}) {
    return (
        <span className="bg-secondary text-secondary-foreground inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm">
            {label}
            <button
                onClick={onRemove}
                className="hover:bg-secondary-foreground/20 ml-1 rounded-full p-0.5"
            >
                <X className="h-3 w-3" />
            </button>
        </span>
    );
}

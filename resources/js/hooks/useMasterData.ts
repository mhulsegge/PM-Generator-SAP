import { usePage } from '@inertiajs/react';

interface MasterDataItem {
    id: number;
    category: string;
    key: string;
    label: string;
    sort_order: number;
    is_active: boolean;
}

interface MasterDataProps {
    disciplines?: MasterDataItem[];
    strategies?: MasterDataItem[];
    frequencyUnits?: MasterDataItem[];
}

export function useMasterData() {
    const { props } = usePage();
    const masterData = (props.masterData as MasterDataProps) || {};

    // Also check for direct props (like in create page)
    const frequencyUnits = (props.frequencyUnits as MasterDataItem[]) || masterData.frequencyUnits || [];

    return {
        disciplines: masterData.disciplines || [],
        strategies: masterData.strategies || [],
        frequencyUnits,
    };
}

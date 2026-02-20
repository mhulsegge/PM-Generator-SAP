export interface MaintenanceTask {
    id?: number;
    user_id?: number;
    maintenance_plan_id?: number;
    name: string;
    description?: string;
    status: 'draft' | 'ready' | 'active';
    is_sap_ready: boolean;
    plan?: MaintenancePlan;
    items?: MaintenanceItem[];
    task_list?: TaskList;
    created_at?: string;
    updated_at?: string;
}

export interface MaintenancePlan {
    id?: number;
    name?: string;
    frequency_unit: string;
    frequency_value: number;
    call_horizon_unit?: string;
    call_horizon_value?: number;
    start_date?: string;
    is_strategy_plan?: boolean;
    strategy_package?: string;
    scheduling_period_value?: number;
    scheduling_period_unit?: string;
    order_type?: string;
    completion_requirement?: boolean;
    auto_order_generation?: boolean;
}

export interface MaintenanceItem {
    id?: number;
    maintenance_task_id?: number;
    object_type: 'equipment' | 'floc';
    object_id: string;
    object_description?: string;
    location?: string;
    planner_group?: string;
    main_work_center?: string;
    order_type?: string;
}

export interface TaskList {
    id?: number;
    maintenance_task_id?: number;
    type: 'general' | 'equipment' | 'floc';
    description?: string;
    work_center?: string;
    plant?: string;
    status: string;
    group_counter?: string;
    strategy_package?: string;
    usage?: string;
    general_instructions?: string;
    operations?: TaskListOperation[];
}

export interface TaskListOperation {
    id?: number;
    task_list_id?: number;
    operation_number: number;
    control_key: string;
    short_text: string;
    long_text?: string;
    work_center?: string;
    duration_normal?: number;
    duration_unit: string;
    number_of_people: number;
    strategy_package?: string;
    materials?: OperationMaterial[];
    documents?: OperationDocument[];
}

export interface OperationMaterial {
    id?: number;
    task_list_operation_id?: number;
    material_number: string;
    description?: string;
    quantity: number;
    unit: string;
}

export interface OperationDocument {
    id?: number;
    task_list_operation_id?: number;
    document_type: string;
    document_number: string;
    document_part: string;
    document_version: string;
    description?: string;
}

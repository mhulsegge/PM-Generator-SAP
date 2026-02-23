<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$tables = ['maintenance_plans', 'task_lists', 'template_task_lists', 'task_list_operations', 'template_task_list_operations'];

foreach($tables as $t) {
    echo "Table: $t\n";
    $columns = Schema::getColumnListing($t);
    echo implode(", ", $columns) . "\n\n";
}

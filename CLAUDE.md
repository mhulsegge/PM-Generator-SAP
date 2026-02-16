# CLAUDE.md - Pontifexx Starter Kit

This document provides comprehensive guidance for working with this codebase. It covers the technology stack, architecture, coding standards, and best practices.

## Language Requirement - Dutch (Nederlands)

**IMPORTANT: All user-facing text in this application MUST be in Dutch (Nederlands).**

This includes:
- Page titles and headings
- Form labels and placeholders
- Button text
- Error messages
- Success messages
- Navigation items
- Tooltips and descriptions
- Modal content
- Any text visible to end users

### Examples

| English (DO NOT USE) | Dutch (USE THIS) |
|---------------------|------------------|
| Log in | Inloggen |
| Register | Registreren |
| Password | Wachtwoord |
| Email address | E-mailadres |
| Settings | Instellingen |
| Save | Opslaan |
| Cancel | Annuleren |
| Delete | Verwijderen |
| Confirm | Bevestigen |
| Profile | Profiel |
| Dashboard | Dashboard |
| Log out | Uitloggen |
| Forgot password? | Wachtwoord vergeten? |
| Create account | Account aanmaken |
| Continue with Microsoft | Doorgaan met Microsoft |

When adding new features or modifying existing ones, always ensure all text is in Dutch.

## Technology Stack

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| PHP | ^8.2 | Runtime |
| Laravel | 12.x | Backend framework |
| Laravel Fortify | 1.x | Authentication scaffolding |
| Laravel Socialite | 5.x | OAuth authentication (Microsoft SSO) |
| Inertia.js | 2.x | Server-side adapter |
| Laravel Wayfinder | 0.1.x | Type-safe route generation |

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI library |
| TypeScript | 5.7.x | Type-safe JavaScript |
| Inertia.js React | 2.x | Client-side adapter |
| Tailwind CSS | 4.x | Utility-first CSS |
| Radix UI | Various | Accessible UI primitives |
| Vite | 7.x | Build tool |

### AI Integration

| Technology | Purpose |
|------------|---------|
| NeuronAI | PHP Agentic Framework for AI applications |
| Anthropic | Claude AI models |
| OpenAI | GPT models |
| Gemini | Google AI models |
| Mistral | Mistral AI models |
| Ollama | Local AI models |

### Development Tools

| Tool | Purpose |
|------|---------|
| Laravel Pint | PHP code style (Laravel preset) |
| ESLint | JavaScript/TypeScript linting |
| Prettier | Code formatting |
| Pest | PHP testing framework |

## Project Structure

```
pontifexx-template/
├── app/                          # PHP application code
│   ├── Actions/Fortify/          # Authentication action classes
│   ├── Concerns/                 # Shared PHP traits
│   ├── Http/
│   │   ├── Controllers/          # Route controllers
│   │   ├── Middleware/           # HTTP middleware
│   │   └── Requests/             # Form request validation
│   ├── Models/                   # Eloquent models
│   └── Providers/                # Service providers
├── config/                       # Laravel configuration files
├── database/
│   ├── factories/                # Model factories
│   ├── migrations/               # Database migrations
│   └── seeders/                  # Database seeders
├── public/                       # Web-accessible files
│   ├── favicon.ico               # Favicon (ICO format)
│   ├── favicon.svg               # Favicon (SVG format)
│   └── Pontifexx-paddock-logo.svg # Company logo
├── resources/
│   ├── css/
│   │   └── app.css               # Tailwind CSS configuration
│   ├── js/
│   │   ├── app.tsx               # React entry point
│   │   ├── ssr.tsx               # SSR entry point
│   │   ├── components/           # React components
│   │   │   ├── ui/               # Radix UI wrapper components
│   │   │   ├── app-logo.tsx      # Application logo component
│   │   │   └── app-logo-icon.tsx # Logo SVG icon
│   │   ├── hooks/                # Custom React hooks
│   │   ├── layouts/              # Layout components
│   │   ├── pages/                # Inertia page components
│   │   │   ├── auth/             # Authentication pages
│   │   │   ├── settings/         # User settings pages
│   │   │   ├── dashboard.tsx     # Dashboard page
│   │   │   └── welcome.tsx       # Home page
│   │   ├── routes/               # Auto-generated route types
│   │   ├── types/                # TypeScript type definitions
│   │   └── lib/                  # Utility functions
│   └── views/
│       └── app.blade.php         # Main HTML template
├── routes/
│   ├── web.php                   # Web routes
│   └── settings.php              # Settings routes
├── storage/                      # Runtime storage
├── tests/                        # Test files
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── .prettierrc                   # Prettier configuration
├── eslint.config.js              # ESLint configuration
├── pint.json                     # Laravel Pint configuration
├── composer.json                 # PHP dependencies
├── package.json                  # npm dependencies
├── tsconfig.json                 # TypeScript configuration
└── vite.config.ts                # Vite configuration
```

## Development Commands

### Starting Development

```bash
# Full development environment (server + queue + vite)
composer dev

# With SSR enabled
composer dev:ssr
```

### Building

```bash
# Build frontend assets
npm run build

# Build with SSR
npm run build:ssr
```

### Code Quality

```bash
# PHP linting (auto-fix)
composer lint

# PHP lint check (no fix)
composer test:lint

# JavaScript/TypeScript linting (auto-fix)
npm run lint

# Format with Prettier
npm run format

# Check formatting
npm run format:check

# TypeScript type checking
npm run types
```

### Testing

```bash
# Run all tests
composer test

# Run PHP tests only
php artisan test
```

## Coding Standards

### PHP (Laravel Pint)

This project uses Laravel Pint with the `laravel` preset. Key standards:

- PSR-12 coding style
- Laravel-specific conventions
- Automatic import sorting
- Consistent spacing and formatting

```bash
# Auto-fix PHP code style
composer lint
```

### TypeScript/JavaScript (ESLint + Prettier)

#### ESLint Rules

- **Type imports**: Use `type` keyword for type-only imports
  ```typescript
  import type { User } from '@/types';
  import { useState } from 'react';
  ```

- **Import ordering**: Imports are automatically sorted by group
  1. Built-in modules
  2. External packages
  3. Internal modules (`@/`)
  4. Parent/sibling/index imports

- **React**: No need for `import React` (React 17+ JSX transform)

#### Prettier Configuration

| Setting | Value |
|---------|-------|
| Print width | 80 characters |
| Tab width | 4 spaces |
| Semicolons | Yes |
| Single quotes | Yes |
| Trailing commas | ES5 |

Tailwind CSS class sorting is enabled via `prettier-plugin-tailwindcss`.

### TypeScript

- Strict mode enabled
- Path alias: `@/*` maps to `./resources/js/*`
- Use type annotations for function parameters and return types
- Prefer interfaces for object shapes, types for unions/intersections

```typescript
// Good
interface UserProps {
    user: User;
    onUpdate: (user: User) => void;
}

// Good
type Status = 'pending' | 'active' | 'completed';
```

## Architecture Patterns

### Inertia.js Pages

Pages are React components in `resources/js/pages/`. They receive data as props from Laravel controllers.

```typescript
// resources/js/pages/dashboard.tsx
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface DashboardProps {
    stats: { users: number; posts: number };
}

export default function Dashboard({ stats }: DashboardProps) {
    return (
        <AppLayout>
            <Head title="Dashboard" />
            {/* Page content */}
        </AppLayout>
    );
}
```

### Type-Safe Routes (Wayfinder)

Routes are auto-generated in `resources/js/routes/`. Always use these instead of hardcoding URLs.

```typescript
import { dashboard, login, settings } from '@/routes';

// Usage
<Link href={dashboard()}>Dashboard</Link>
<Link href={settings.profile()}>Profile</Link>
```

### Components

#### UI Components (`components/ui/`)

Wrapper components around Radix UI primitives. These are styled with Tailwind and use `class-variance-authority` for variants.

```typescript
import { Button } from '@/components/ui/button';

<Button variant="destructive" size="sm">Delete</Button>
```

#### App Components (`components/`)

Application-specific components like `AppLogo`, `AppSidebar`, `NavUser`, etc.

### Layouts

- `AppLayout`: Main authenticated layout with sidebar
- `AuthLayout`: Layout for authentication pages
- `AppSidebarLayout`: Sidebar variant of app layout

### Hooks

Custom hooks in `resources/js/hooks/`:

- `useAppearance()`: Theme management (light/dark/system)

## Theming

### CSS Variables

Theme colors are defined in `resources/css/app.css` using CSS custom properties:

```css
:root {
    --primary: #1c4571;
    --secondary: #d6ab93;
    --background: #ffffff;
    --foreground: #020817;
    /* ... more variables */
}

.dark {
    --background: #020817;
    --foreground: #f8fafc;
    /* ... dark mode overrides */
}
```

### Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Blue | `#1c4571` / `#203f6c` | Primary actions, logo |
| Secondary Tan | `#d6ab93` / `#dbb298` | Accents, secondary elements |

### Dark Mode

Dark mode is handled via:
1. System preference detection
2. User preference stored in localStorage and cookie
3. `useAppearance()` hook for React components
4. `HandleAppearance` middleware for SSR

## Authentication

Authentication is powered by Laravel Fortify and Laravel Socialite with the following features:

- Login / Logout
- Registration
- Password reset
- Email verification
- Two-factor authentication (TOTP)
- Profile management
- **Microsoft SSO** (OAuth 2.0 via Azure AD)

### Microsoft SSO Setup

The starter kit includes Microsoft OAuth authentication out of the box. To enable it:

1. **Create an Azure AD App Registration**
   - Go to [Azure Portal](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade)
   - Click "New registration"
   - Name your application
   - Set redirect URI to: `{APP_URL}/auth/microsoft/callback`
   - Note the Application (client) ID and Directory (tenant) ID

2. **Create a Client Secret**
   - In your app registration, go to "Certificates & secrets"
   - Create a new client secret
   - Copy the secret value immediately (it won't be shown again)

3. **Configure Environment Variables**
   ```env
   MICROSOFT_CLIENT_ID=your-client-id
   MICROSOFT_CLIENT_SECRET=your-client-secret
   MICROSOFT_TENANT_ID=common
   MICROSOFT_REDIRECT_URI="${APP_URL}/auth/microsoft/callback"
   ```

4. **Tenant Configuration**
   - `common` - Any Microsoft account (personal + work/school)
   - `organizations` - Work/school accounts only
   - `consumers` - Personal Microsoft accounts only
   - `{tenant-id}` - Specific organization only

### OAuth Routes

| Route | Purpose |
|-------|---------|
| `GET /auth/microsoft/redirect` | Redirects to Microsoft login |
| `GET /auth/microsoft/callback` | Handles OAuth callback |

### How OAuth Users Work

- Users can sign in with Microsoft without a password
- If a user exists with the same email, their account is linked to Microsoft
- New users are created automatically with verified email
- User avatars are fetched from Microsoft profile

### Auth Pages

Located in `resources/js/pages/auth/`:
- `login.tsx` - Login with email/password or Microsoft
- `register.tsx` - Register with email/password or Microsoft
- `reset-password.tsx`
- `forgot-password.tsx`
- `verify-email.tsx`
- `two-factor-challenge.tsx`

### Settings Pages

Located in `resources/js/pages/settings/`:
- `profile.tsx` - Profile information
- `password.tsx` - Password change
- `appearance.tsx` - Theme preferences
- `two-factor.tsx` - 2FA setup

## Database

Default configuration uses SQLite for simplicity. For production, configure MySQL/PostgreSQL in `.env`.

```bash
# Run migrations
php artisan migrate

# Fresh migration with seeders
php artisan migrate:fresh --seed
```

## Environment Variables

Key environment variables in `.env`:

```env
APP_NAME="Pontifexx Starter Kit"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://pontifexx-template.test

DB_CONNECTION=sqlite

MAIL_MAILER=log

# Microsoft OAuth (Azure AD)
MICROSOFT_CLIENT_ID=your-client-id
MICROSOFT_CLIENT_SECRET=your-client-secret
MICROSOFT_TENANT_ID=common
MICROSOFT_REDIRECT_URI="${APP_URL}/auth/microsoft/callback"
```

## Best Practices

### Do

- Use type-safe routes from `@/routes`
- Use the `@/` path alias for imports
- Follow the existing component patterns
- Use Radix UI components for accessibility
- Run `composer lint` and `npm run lint` before committing
- Write meaningful commit messages

### Don't

- Hardcode URLs - use Wayfinder routes
- Skip TypeScript types - maintain type safety
- Modify UI components directly - extend with variants
- Commit with linting errors
- Use `any` type without justification

## Troubleshooting

### Common Issues

**Vite not loading assets**
```bash
npm run build
# or restart dev server
npm run dev
```

**Route types not updating**
```bash
php artisan wayfinder:generate
```

**SSR issues**
```bash
npm run build:ssr
php artisan inertia:start-ssr
```

**Database issues**
```bash
php artisan migrate:fresh
```

## AI Integration (NeuronAI)

This starter kit is pre-configured for AI integration using NeuronAI, a PHP Agentic Framework for building AI-powered applications.

### Installation

```bash
composer require neuron-core/neuron-laravel
```

### Supported AI Providers

| Provider | Models | Use Case |
|----------|--------|----------|
| Anthropic | Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku | Best for complex reasoning, coding, analysis |
| OpenAI | GPT-4, GPT-4 Turbo, GPT-3.5 Turbo | General purpose, widely supported |
| Google Gemini | Gemini Pro, Gemini Ultra | Multimodal, Google ecosystem |
| Mistral | Mistral Large, Mistral Medium, Mistral Small | European provider, open weights |
| Ollama | Llama 3, Mistral, CodeLlama, etc. | Local/private deployment |

### Environment Configuration

Add your API keys to `.env`:

```env
# Anthropic (recommended)
ANTHROPIC_API_KEY=sk-ant-...

# OpenAI
OPENAI_API_KEY=sk-...

# Google Gemini
GEMINI_API_KEY=...

# Mistral
MISTRAL_API_KEY=...

# Ollama (local)
OLLAMA_HOST=http://localhost:11434
```

### Artisan Commands

NeuronAI provides artisan commands for scaffolding:

```bash
# Create an AI agent
php artisan neuron:agent MyAgent

# Create a RAG (Retrieval-Augmented Generation) setup
php artisan neuron:rag MyRAG

# Create a custom tool for agents
php artisan neuron:tool MyTool

# Create a workflow
php artisan neuron:workflow MyWorkflow

# Create a workflow node
php artisan neuron:node MyNode
```

### Creating an AI Agent

Example agent using Anthropic Claude:

```php
<?php

namespace App\AI\Agents;

use NeuronAI\Agent;
use NeuronAI\Providers\Anthropic;

class AssistantAgent extends Agent
{
    protected function provider(): Anthropic
    {
        return new Anthropic(
            key: config('services.anthropic.key'),
            model: 'claude-3-5-sonnet-20241022',
        );
    }

    public function instructions(): string
    {
        return 'Je bent een behulpzame Nederlandse assistent die gebruikers helpt met hun vragen.';
    }
}
```

### Using the Agent

```php
use App\AI\Agents\AssistantAgent;

$agent = new AssistantAgent();
$response = $agent->chat('Hoe kan ik een formulier valideren in Laravel?');

echo $response->content;
```

### Best Practices

1. **Store API keys securely** - Never commit API keys to version control
2. **Use environment variables** - All keys should come from `.env`
3. **Implement rate limiting** - Protect against API abuse
4. **Cache responses** - Cache AI responses when appropriate
5. **Handle errors gracefully** - AI APIs can fail or timeout
6. **Monitor usage** - Track API costs and usage
7. **Use appropriate models** - Choose models based on task complexity

### Recommended Directory Structure

```
app/
├── AI/
│   ├── Agents/           # AI agents
│   ├── Tools/            # Custom tools for agents
│   ├── RAG/              # RAG configurations
│   └── Workflows/        # Multi-step workflows
```

### Configuration File

Create `config/ai.php` for centralized AI configuration:

```php
<?php

return [
    'default' => env('AI_PROVIDER', 'anthropic'),

    'providers' => [
        'anthropic' => [
            'key' => env('ANTHROPIC_API_KEY'),
            'model' => env('ANTHROPIC_MODEL', 'claude-3-5-sonnet-20241022'),
        ],
        'openai' => [
            'key' => env('OPENAI_API_KEY'),
            'model' => env('OPENAI_MODEL', 'gpt-4-turbo'),
        ],
        'gemini' => [
            'key' => env('GEMINI_API_KEY'),
            'model' => env('GEMINI_MODEL', 'gemini-pro'),
        ],
        'mistral' => [
            'key' => env('MISTRAL_API_KEY'),
            'model' => env('MISTRAL_MODEL', 'mistral-large-latest'),
        ],
        'ollama' => [
            'host' => env('OLLAMA_HOST', 'http://localhost:11434'),
            'model' => env('OLLAMA_MODEL', 'llama3'),
        ],
    ],
];
```

## CRUD & DataTable

This starter kit includes a complete CRUD example with an advanced DataTable component featuring pagination, search, sorting, and advanced column filtering.

### DataTable Component

Located at: `resources/js/components/ui/data-table.tsx`

Features:
- **Server-side pagination** - Efficient for large datasets
- **Global search** - Debounced search across multiple columns
- **Sorting** - Click column headers to sort ascending/descending
- **Advanced column filters**:
  - **Text filter** - Search within a specific column
  - **Select filter** - Dropdown for enum/status columns
  - **Number filter** - Min/max range for numeric columns
  - **Date filter** - Single date filter
  - **Date range filter** - From/to date range
- **Per-page selection** - 10, 25, 50, or 100 items per page
- **URL state** - Filters persist in URL for bookmarking/sharing
- **Filter badges** - Visual display of active filters with quick remove

### Usage Example

```typescript
import { DataTable, type Column } from '@/components/ui/data-table';

const columns: Column<Project>[] = [
    {
        key: 'name',
        label: 'Naam',
        sortable: true,
        filterable: true,
        filterType: 'text',
        render: (item) => <span className="font-medium">{item.name}</span>,
    },
    {
        key: 'status',
        label: 'Status',
        sortable: true,
        filterable: true,
        filterType: 'select',
        filterOptions: [
            { value: 'actief', label: 'Actief' },
            { value: 'voltooid', label: 'Voltooid' },
        ],
        render: (item) => <Badge>{item.status}</Badge>,
    },
    {
        key: 'budget',
        label: 'Budget',
        sortable: true,
        filterable: true,
        filterType: 'number',
        render: (item) => formatCurrency(item.budget),
    },
    {
        key: 'start_date',
        label: 'Startdatum',
        sortable: true,
        filterable: true,
        filterType: 'dateRange',
        render: (item) => formatDate(item.start_date),
    },
];

<DataTable
    data={projects.data}
    columns={columns}
    pagination={pagination}
    currentFilters={filters}
    baseUrl="/projects"
    searchPlaceholder="Zoek projecten..."
    actions={(item) => <ActionButtons item={item} />}
/>
```

### Filter Types

| Type | Description | URL Parameters |
|------|-------------|----------------|
| `text` | Text search within column | `filter_{column}` |
| `select` | Dropdown with predefined options | `filter_{column}` |
| `number` | Min/max numeric range | `{column}_min`, `{column}_max` |
| `date` | Single date picker | `{column}_from` |
| `dateRange` | From/to date range | `{column}_from`, `{column}_to` |

### Backend Controller Pattern

```php
public function index(Request $request): Response
{
    $query = Project::query()
        ->where('user_id', $request->user()->id)
        ->search($request->input('search'))
        ->status($request->input('status'))
        ->sorted(
            $request->input('sort_by'),
            $request->input('sort_direction', 'desc')
        );

    $projects = $query->paginate($request->input('per_page', 10))
        ->withQueryString();

    return Inertia::render('projects/index', [
        'projects' => $projects,
        'filters' => [
            'search' => $request->input('search', ''),
            'status' => $request->input('status', ''),
            'sort_by' => $request->input('sort_by', ''),
            'sort_direction' => $request->input('sort_direction', 'desc'),
            'per_page' => (int) $request->input('per_page', 10),
        ],
    ]);
}
```

### Model Scopes

Add reusable filter scopes to your models:

```php
public function scopeSearch($query, ?string $search)
{
    if ($search) {
        $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%");
        });
    }
    return $query;
}

public function scopeSorted($query, ?string $sortBy, string $direction = 'asc')
{
    if ($sortBy) {
        $query->orderBy($sortBy, $direction);
    } else {
        $query->latest();
    }
    return $query;
}
```

### Example Files

| File | Description |
|------|-------------|
| `app/Models/Project.php` | Model with filter scopes |
| `app/Http/Controllers/ProjectController.php` | CRUD controller |
| `app/Policies/ProjectPolicy.php` | Authorization policy |
| `resources/js/pages/projects/index.tsx` | List page with DataTable |
| `resources/js/pages/projects/create.tsx` | Create form |
| `resources/js/pages/projects/edit.tsx` | Edit form |

## AI Chat Interface (Vercel AI SDK)

This starter kit includes a pre-built AI chat interface that combines NeuronAI (backend) with the Vercel AI SDK (frontend).

### Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  React Frontend │────▶│  Laravel Backend │────▶│   AI Provider   │
│  (AI SDK)       │◀────│  (NeuronAI)      │◀────│   (Anthropic)   │
└─────────────────┘     └──────────────────┘     └─────────────────┘
     useChat()           POST /api/chat           Streaming Response
```

### Frontend (React + AI SDK)

The chat interface uses the Vercel AI SDK `useChat` hook:

```typescript
import { useChat } from 'ai/react';

const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
});
```

Located at: `resources/js/pages/ai-chat.tsx`

### Backend (Laravel + NeuronAI)

The streaming endpoint handles AI responses:

```php
// app/Http/Controllers/AI/ChatController.php
public function chat(Request $request): StreamedResponse
{
    // Validates messages array
    // Streams response using AI SDK Data Stream Protocol
    // Compatible with useChat hook
}
```

### AI SDK Data Stream Protocol

The backend streams responses in the AI SDK format:

```
0:"Hello "      # Text chunk
0:"world!"      # Text chunk
d:{"finishReason":"stop"}  # Finish message
```

### Integrating with NeuronAI

To use real AI responses, update `ChatController.php`:

```php
use App\AI\Agents\AssistantAgent;

public function chat(Request $request): StreamedResponse
{
    $messages = $request->input('messages');
    $lastMessage = collect($messages)->last()['content'];

    return response()->stream(function () use ($lastMessage) {
        $agent = new AssistantAgent();
        
        foreach ($agent->stream($lastMessage) as $chunk) {
            echo '0:"' . addslashes($chunk->content) . "\"\n";
            ob_flush();
            flush();
        }
        
        echo "d:{\"finishReason\":\"stop\"}\n";
    }, 200, [
        'Content-Type' => 'text/plain; charset=utf-8',
        'Cache-Control' => 'no-cache',
    ]);
}
```

### Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/ai-chat` | GET | Chat interface page |
| `/api/chat` | POST | Streaming chat endpoint |

## Resources

- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://react.dev)
- [Inertia.js Documentation](https://inertiajs.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [NeuronAI Documentation](https://neuron-ai.dev)
- [Anthropic Documentation](https://docs.anthropic.com)
- [OpenAI Documentation](https://platform.openai.com/docs)
- [Vercel AI SDK Documentation](https://ai-sdk.dev)

import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import type { SharedData } from '@/types';
import AppLogoIcon from '@/components/app-logo-icon';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welkom">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-col bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                {/* Header */}
                <header className="border-b border-[#e3e3e0] px-6 py-2 dark:border-[#3E3E3A]">
                    <div className="mx-auto flex max-w-6xl items-center justify-between">
                        <AppLogoIcon className="h-16 w-auto" />
                        <nav className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-block rounded-md bg-[#203f6c] px-5 py-2 text-sm font-medium text-white hover:bg-[#1a3459]"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="inline-block rounded-md px-5 py-2 text-sm font-medium text-[#1b1b18] hover:bg-[#f5f5f4] dark:text-[#EDEDEC] dark:hover:bg-[#1a1a1a]"
                                    >
                                        Inloggen
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="inline-block rounded-md bg-[#203f6c] px-5 py-2 text-sm font-medium text-white hover:bg-[#1a3459]"
                                        >
                                            Registreren
                                        </Link>
                                    )}
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="border-b border-[#e3e3e0] px-6 py-16 dark:border-[#3E3E3A]">
                    <div className="mx-auto max-w-6xl text-center">
                        <h1 className="mb-4 text-4xl font-semibold tracking-tight lg:text-5xl">
                            Pontifexx Starter Kit
                        </h1>
                        <p className="mx-auto mb-8 max-w-2xl text-lg text-[#706f6c] dark:text-[#A1A09A]">
                            Een moderne, productieklare starter kit gebouwd met
                            Laravel 12, React 19, Inertia.js en Tailwind CSS.
                            Alles wat je nodig hebt om mooie, snelle
                            webapplicaties te bouwen.
                        </p>
                        <div className="flex justify-center gap-4">
                            <a
                                href="#features"
                                className="inline-block rounded-md bg-[#203f6c] px-6 py-3 text-sm font-medium text-white hover:bg-[#1a3459]"
                            >
                                Ontdek Functies
                            </a>
                            <a
                                href="#stack"
                                className="inline-block rounded-md border border-[#e3e3e0] px-6 py-3 text-sm font-medium hover:bg-[#f5f5f4] dark:border-[#3E3E3A] dark:hover:bg-[#1a1a1a]"
                            >
                                Bekijk Stack
                            </a>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section
                    id="features"
                    className="border-b border-[#e3e3e0] px-6 py-16 dark:border-[#3E3E3A]"
                >
                    <div className="mx-auto max-w-6xl">
                        <h2 className="mb-12 text-center text-3xl font-semibold">
                            Wat zit erin
                        </h2>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            <FeatureCard
                                title="Authenticatie"
                                description="Compleet authenticatiesysteem met inloggen, registratie, wachtwoord reset, e-mailverificatie en tweefactorauthenticatie aangedreven door Laravel Fortify."
                            />
                            <FeatureCard
                                title="Donkere Modus"
                                description="Ingebouwde ondersteuning voor donkere modus met systeemvoorkeur detectie en gebruikersoverschrijving. Naadloos geïntegreerd met SSR voor flikkervrije themawisseling."
                            />
                            <FeatureCard
                                title="Type-veilige Routing"
                                description="Automatisch gegenereerde TypeScript route definities met Wayfinder. Nooit meer een verkeerde route schrijven met volledige IDE autocomplete ondersteuning."
                            />
                            <FeatureCard
                                title="UI Componenten"
                                description="Voorgebouwde, toegankelijke UI componenten met Radix UI primitieven. Inclusief knoppen, dialogen, dropdowns, formulieren en meer."
                            />
                            <FeatureCard
                                title="Server-Side Rendering"
                                description="SSR standaard ingeschakeld voor betere SEO en snellere initiële pagina laadtijden. Geconfigureerd en klaar voor productie."
                            />
                            <FeatureCard
                                title="Gebruikersinstellingen"
                                description="Complete instellingenpagina's voor profielbeheer, wachtwoordwijzigingen, weergavevoorkeuren en tweefactorauthenticatie setup."
                            />
                            <FeatureCard
                                title="Microsoft SSO"
                                description="Ingebouwde OAuth authenticatie met Microsoft Azure AD. Gebruikers kunnen inloggen met hun Microsoft account, zowel persoonlijk als zakelijk."
                            />
                            <FeatureCard
                                title="AI Integratie"
                                description="Klaar voor AI met NeuronAI framework. Ondersteunt Anthropic Claude, OpenAI, Google Gemini, Mistral en lokale Ollama modellen."
                            />
                            <FeatureCard
                                title="Nederlandse Taal"
                                description="Volledig in het Nederlands vertaalde gebruikersinterface. Alle labels, buttons, foutmeldingen en teksten zijn in het Nederlands."
                            />
                        </div>
                    </div>
                </section>

                {/* Stack Section */}
                <section
                    id="stack"
                    className="border-b border-[#e3e3e0] px-6 py-16 dark:border-[#3E3E3A]"
                >
                    <div className="mx-auto max-w-6xl">
                        <h2 className="mb-12 text-center text-3xl font-semibold">
                            De Stack
                        </h2>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <StackCard
                                category="Backend"
                                items={[
                                    {
                                        name: 'Laravel 12',
                                        description:
                                            'Het PHP framework voor web artisans',
                                    },
                                    {
                                        name: 'Laravel Fortify',
                                        description:
                                            'Backend authenticatie scaffolding',
                                    },
                                    {
                                        name: 'SQLite / MySQL',
                                        description:
                                            'Flexibele database ondersteuning',
                                    },
                                ]}
                            />
                            <StackCard
                                category="Frontend"
                                items={[
                                    {
                                        name: 'React 19',
                                        description:
                                            'De bibliotheek voor het bouwen van gebruikersinterfaces',
                                    },
                                    {
                                        name: 'Inertia.js',
                                        description:
                                            'De moderne monoliet aanpak',
                                    },
                                    {
                                        name: 'TypeScript 5.7',
                                        description: 'Type-veilig JavaScript',
                                    },
                                ]}
                            />
                            <StackCard
                                category="Styling"
                                items={[
                                    {
                                        name: 'Tailwind CSS 4',
                                        description:
                                            'Utility-first CSS framework',
                                    },
                                    {
                                        name: 'Radix UI',
                                        description:
                                            'Ongestyle, toegankelijke componenten',
                                    },
                                    {
                                        name: 'Lucide Icons',
                                        description:
                                            'Mooie & consistente iconen',
                                    },
                                ]}
                            />
                            <StackCard
                                category="Tooling"
                                items={[
                                    {
                                        name: 'Vite 7',
                                        description:
                                            'Volgende generatie frontend tooling',
                                    },
                                    {
                                        name: 'ESLint & Prettier',
                                        description:
                                            'Code kwaliteit en formattering',
                                    },
                                    {
                                        name: 'Laravel Pint',
                                        description: 'PHP code style fixer',
                                    },
                                ]}
                            />
                            <StackCard
                                category="AI Providers"
                                items={[
                                    {
                                        name: 'NeuronAI',
                                        description:
                                            'PHP Agentic Framework voor AI',
                                    },
                                    {
                                        name: 'Anthropic Claude',
                                        description:
                                            'Beste voor complexe taken',
                                    },
                                    {
                                        name: 'OpenAI / Gemini / Mistral',
                                        description:
                                            'Meerdere providers ondersteund',
                                    },
                                ]}
                            />
                            <StackCard
                                category="Authenticatie"
                                items={[
                                    {
                                        name: 'Laravel Fortify',
                                        description:
                                            'Backend authenticatie scaffolding',
                                    },
                                    {
                                        name: 'Laravel Socialite',
                                        description:
                                            'OAuth authenticatie (Microsoft)',
                                    },
                                    {
                                        name: 'Tweefactor (2FA)',
                                        description:
                                            'TOTP authenticatie ingebouwd',
                                    },
                                ]}
                            />
                        </div>
                    </div>
                </section>

                {/* Getting Started Section */}
                <section
                    id="getting-started"
                    className="border-b border-[#e3e3e0] px-6 py-16 dark:border-[#3E3E3A]"
                >
                    <div className="mx-auto max-w-3xl">
                        <h2 className="mb-12 text-center text-3xl font-semibold">
                            Aan de slag
                        </h2>
                        <div className="space-y-6">
                            <Step
                                number={1}
                                title="Clone de repository"
                                code="git clone <repository-url> my-project"
                            />
                            <Step
                                number={2}
                                title="Installeer dependencies"
                                code="composer install && npm install"
                            />
                            <Step
                                number={3}
                                title="Stel de omgeving in"
                                code="cp .env.example .env && php artisan key:generate"
                            />
                            <Step
                                number={4}
                                title="Voer migraties uit"
                                code="php artisan migrate"
                            />
                            <Step
                                number={5}
                                title="Start ontwikkeling"
                                code="composer dev"
                            />
                        </div>
                    </div>
                </section>

                {/* Project Structure Section */}
                <section
                    id="structure"
                    className="border-b border-[#e3e3e0] px-6 py-16 dark:border-[#3E3E3A]"
                >
                    <div className="mx-auto max-w-4xl">
                        <h2 className="mb-12 text-center text-3xl font-semibold">
                            Project Structuur
                        </h2>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="rounded-lg border border-[#e3e3e0] p-6 dark:border-[#3E3E3A]">
                                <h3 className="mb-4 font-semibold">
                                    Backend (Laravel)
                                </h3>
                                <pre className="overflow-x-auto text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                    {`app/
├── Actions/      # Fortify acties
├── Http/
│   ├── Controllers/
│   └── Middleware/
├── Models/       # Eloquent modellen
└── Providers/    # Service providers

config/           # Configuratie bestanden
routes/           # Route definities
database/         # Migraties & seeders`}
                                </pre>
                            </div>
                            <div className="rounded-lg border border-[#e3e3e0] p-6 dark:border-[#3E3E3A]">
                                <h3 className="mb-4 font-semibold">
                                    Frontend (React)
                                </h3>
                                <pre className="overflow-x-auto text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                    {`resources/js/
├── components/   # React componenten
│   └── ui/       # Radix UI wrappers
├── hooks/        # Custom React hooks
├── layouts/      # Layout componenten
├── pages/        # Inertia pagina's
│   ├── auth/     # Auth pagina's
│   └── settings/ # Instellingen
├── routes/       # Gegenereerde routes
└── types/        # TypeScript types`}
                                </pre>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Documentation Links */}
                <section className="border-b border-[#e3e3e0] px-6 py-16 dark:border-[#3E3E3A]">
                    <div className="mx-auto max-w-6xl">
                        <h2 className="mb-12 text-center text-3xl font-semibold">
                            Documentatie
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <DocLink
                                href="https://laravel.com/docs"
                                title="Laravel"
                                description="Backend framework documentatie"
                            />
                            <DocLink
                                href="https://react.dev"
                                title="React"
                                description="Frontend bibliotheek documentatie"
                            />
                            <DocLink
                                href="https://inertiajs.com"
                                title="Inertia.js"
                                description="De moderne monoliet"
                            />
                            <DocLink
                                href="https://tailwindcss.com/docs"
                                title="Tailwind CSS"
                                description="Utility-first CSS framework"
                            />
                            <DocLink
                                href="https://neuron-ai.dev"
                                title="NeuronAI"
                                description="PHP Agentic AI Framework"
                            />
                            <DocLink
                                href="https://docs.anthropic.com"
                                title="Anthropic"
                                description="Claude AI documentatie"
                            />
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="px-6 py-8">
                    <div className="mx-auto max-w-6xl text-center text-sm text-[#706f6c] dark:text-[#A1A09A]">
                        <p>
                            Met zorg gebouwd door Pontifexx Paddock. Klaar voor
                            je volgende project.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}

function FeatureCard({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="rounded-lg border border-[#e3e3e0] p-6 dark:border-[#3E3E3A]">
            <h3 className="mb-2 font-semibold">{title}</h3>
            <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                {description}
            </p>
        </div>
    );
}

function StackCard({
    category,
    items,
}: {
    category: string;
    items: { name: string; description: string }[];
}) {
    return (
        <div className="rounded-lg border border-[#e3e3e0] p-6 dark:border-[#3E3E3A]">
            <h3 className="mb-4 text-lg font-semibold text-[#203f6c] dark:text-[#dbb298]">
                {category}
            </h3>
            <ul className="space-y-3">
                {items.map((item) => (
                    <li key={item.name}>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                            {' '}
                            - {item.description}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function Step({
    number,
    title,
    code,
}: {
    number: number;
    title: string;
    code: string;
}) {
    return (
        <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#203f6c] text-sm font-semibold text-white">
                {number}
            </div>
            <div className="flex-1">
                <h3 className="mb-2 font-medium">{title}</h3>
                <code className="block rounded-md bg-[#f5f5f4] px-4 py-2 font-mono text-sm dark:bg-[#1a1a1a]">
                    {code}
                </code>
            </div>
        </div>
    );
}

function DocLink({
    href,
    title,
    description,
}: {
    href: string;
    title: string;
    description: string;
}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-lg border border-[#e3e3e0] p-4 transition-colors hover:border-[#203f6c] dark:border-[#3E3E3A] dark:hover:border-[#dbb298]"
        >
            <h3 className="mb-1 font-medium group-hover:text-[#203f6c] dark:group-hover:text-[#dbb298]">
                {title}
                <span className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">
                    &rarr;
                </span>
            </h3>
            <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                {description}
            </p>
        </a>
    );
}

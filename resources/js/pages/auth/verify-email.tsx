// Components
import { Form, Head } from '@inertiajs/react';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <AuthLayout
            title="E-mail verifiëren"
            description="Verifieer je e-mailadres door op de link te klikken die we je zojuist hebben gemaild."
        >
            <Head title="E-mail verificatie" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    Een nieuwe verificatielink is verzonden naar het e-mailadres
                    dat je hebt opgegeven tijdens de registratie.
                </div>
            )}

            <Form {...send.form()} className="space-y-6 text-center">
                {({ processing }) => (
                    <>
                        <Button disabled={processing} variant="secondary">
                            {processing && <Spinner />}
                            Verificatie e-mail opnieuw versturen
                        </Button>

                        <TextLink
                            href={logout()}
                            className="mx-auto block text-sm"
                        >
                            Uitloggen
                        </TextLink>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}

import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type SharedData } from '@/types';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';

export default function SubscriptionSettings() {
    const { auth } = usePage<SharedData>().props;
    const subscriptionTier = auth.user.tier ?? 'free';

    return (
        <AppLayout>
            <SettingsLayout>
                <Head title="Subscription Settings" />

                <section className="space-y-6">
                    <HeadingSmall
                        title="Subscription Settings"
                        description="Manage or upgrade your subscription plan."
                    />

                    <div className="space-y-4">
                        <p>
                            Current subscription tier: <strong>{subscriptionTier}</strong>
                        </p>

                        {subscriptionTier === 'free' ? (
                            <Button onClick={() => window.location.href = route('subscribe')}>
                                Upgrade Now
                            </Button>
                        ) : (
                            <Link href={route('subscription.manage')} className="underline">
                                Manage Subscription
                            </Link>
                        )}
                    </div>
                </section>
            </SettingsLayout>
        </AppLayout>
    );
}

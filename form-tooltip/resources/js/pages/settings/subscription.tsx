import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';

export default function SubscriptionSettings() {
    const { auth } = usePage().props;
    const subscriptionTier = auth?.user?.tier ?? 'free';
    console.log('Subscription Tier:', auth?.user?.tier);
    // Instead of a static Payment Link, call our route
    const handleUpgradeClick = (tier) => {
        window.location.href = route('subscription.upgrade', tier);
    };

    return (
        <AppLayout>
            <SettingsLayout>
                <Head title="Subscription Settings" />
                <section className="space-y-6">
                    <HeadingSmall
                        title="Subscription Settings"
                        description="Manage or upgrade your subscription plan."
                    />

                    <p className="mt-4">
                        Your current subscription tier: <strong>{subscriptionTier}</strong>
                    </p>

                    <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-3">
                        {/* FREE PLAN */}
                        <div className="border rounded-lg p-6 flex flex-col items-start">
                            <h2 className="text-xl font-semibold mb-2">Free</h2>
                            <p className="text-2xl font-bold">$0</p>
                            <ul className="list-disc list-inside mt-3 mb-6 text-sm text-gray-700 space-y-1">
                                {/* ... */}
                            </ul>

                            {subscriptionTier === 'free' && (
                                <Button variant="outline" disabled>
                                    Current Plan
                                </Button>
                            )}
                        </div>

                        {/* PRO PLAN (Tier 2) */}
                        <div className="border rounded-lg p-6 flex flex-col items-start">
                            <h2 className="text-xl font-semibold mb-2">Pro</h2>
                            <p className="text-2xl font-bold">$5/month</p>
                            <ul className="list-disc list-inside mt-3 mb-6 text-sm text-gray-700 space-y-1">
                                {/* ... */}
                            </ul>

                            {subscriptionTier === 'pro' ? (
                                <Button variant="outline" disabled>
                                    Current Plan
                                </Button>
                            ) : (
                                <Button onClick={() => handleUpgradeClick('pro')}>
                                    Choose Plan
                                </Button>
                            )}
                        </div>

                        {/* UNLIMITED PLAN (Tier 3) */}
                        <div className="border rounded-lg p-6 flex flex-col items-start">
                            <h2 className="text-xl font-semibold mb-2">Unlimited</h2>
                            <p className="text-2xl font-bold">$10/month</p>
                            <ul className="list-disc list-inside mt-3 mb-6 text-sm text-gray-700 space-y-1">
                                {/* ... */}
                            </ul>

                            {subscriptionTier === 'unlimited' ? (
                                <Button variant="outline" disabled>
                                    Current Plan
                                </Button>
                            ) : (
                                <Button onClick={() => handleUpgradeClick('unlimited')}>
                                    Choose Plan
                                </Button>
                            )}
                        </div>
                    </div>
                </section>
            </SettingsLayout>
        </AppLayout>
    );
}

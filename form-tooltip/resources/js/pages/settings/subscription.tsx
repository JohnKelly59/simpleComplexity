import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';

export default function Subscription() {
    const { auth } = usePage().props;
    const subscriptionTier = auth?.user?.tier ?? 'free';
    // Use the cancellation flag provided by the server
    const isSubscriptionCancelled = auth?.user?.subscription_cancelled ?? false;
    const { post, processing } = useForm();
    const [alertMessage, setAlertMessage] = useState('');

    const handleUpgradeClick = (tier) => {
        window.location.href = route('subscription.upgrade', tier);
    };

    const handleCancelSubscription = (e) => {
        e.preventDefault();
        if (
            confirm(
                "Are you sure you want to cancel your subscription? Your subscription will remain active until the end of your billing period."
            )
        ) {
            post(route('subscription.cancel-subscription'), {
                preserveState: true,
                preserveScroll: true,
                onSuccess: (page) => {
                    console.log('Subscription cancelled successfully');
                    if (page.props.flash?.success) {
                        setAlertMessage(page.props.flash.success);
                    }
                },
            });
        }
    };

    return (
        <AppLayout>
            <SettingsLayout>
                <Head title="Subscription Settings" />
                <div className="space-y-6">
                    <HeadingSmall
                        title="Subscription Settings"
                        description="Manage or upgrade your subscription plan."
                    />

                    {alertMessage && (
                        <div
                            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                            role="alert"
                        >
                            <span className="block sm:inline">{alertMessage}</span>
                            <span
                                className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
                                onClick={() => setAlertMessage('')}
                            >
                                <svg
                                    className="fill-current h-6 w-6 text-red-500"
                                    role="button"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                >
                                    <title>Close</title>
                                    <path d="M14.348 5.652a1 1 0 0 0-1.414-1.414L10 7.172 7.066 4.238A1 1 0 0 0 5.652 5.652L8.586 8.586 5.652 11.52a1 1 0 1 0 1.414 1.414L10 9.828l2.934 2.934a1 1 0 0 0 1.414-1.414L11.414 8.586z" />
                                </svg>
                            </span>
                        </div>
                    )}

                    <p className="mt-4 text-lg">
                        Your current subscription tier: <strong>{subscriptionTier}</strong>
                    </p>

                    <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-3">
                        {/* FREE PLAN */}
                        <div className="border rounded-lg p-6 flex flex-col items-start">
                            <h2 className="text-xl font-semibold mb-2">Free</h2>
                            <p className="text-2xl font-bold">$0</p>
                            <ul className="list-disc list-inside mt-3 mb-6 text-sm text-gray-700 space-y-1">
                                <li>Unlimited database‑mapped tooltips</li>
                                <li>Real‑time updates</li>
                                <li>Includes “Powered by Our Brand” label</li>
                            </ul>
                            {subscriptionTier === 'free' && (
                                <Button variant="outline" disabled>
                                    Current Plan
                                </Button>
                            )}
                        </div>

                        {/* PRO PLAN */}
                        <div className="border rounded-lg p-6 flex flex-col items-start">
                            <h2 className="text-xl font-semibold mb-2">Pro</h2>
                            <p className="text-2xl font-bold">$5/month</p>
                            <ul className="list-disc list-inside mt-3 mb-6 text-sm text-gray-700 space-y-1">
                                <li>Up to 5,000 tooltips per month</li>
                                <li>AI‑generated tooltips</li>
                                <li>No branding</li>
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

                        {/* UNLIMITED PLAN */}
                        <div className="border rounded-lg p-6 flex flex-col items-start">
                            <h2 className="text-xl font-semibold mb-2">Unlimited</h2>
                            <p className="text-2xl font-bold">$10/month</p>
                            <ul className="list-disc list-inside mt-3 mb-6 text-sm text-gray-700 space-y-1">
                                <li>Unlimited AI‑generated tooltips</li>
                                <li>Priority support</li>
                                <li>No branding</li>
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

                    {/* Render the Cancel Subscription button only if the user is not on a free plan and the subscription is active */}
                    {subscriptionTier !== 'free' && !isSubscriptionCancelled && (
                        <div className="mt-6">
                            <form onSubmit={handleCancelSubscription} className="flex items-center">
                                <Button type="submit" disabled={processing} variant="destructive">
                                    {processing ? 'Cancelling...' : 'Cancel Subscription'}
                                </Button>
                            </form>
                        </div>
                    )}
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}

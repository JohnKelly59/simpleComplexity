import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    // Use Inertia's usePage to access user data from Laravel Sanctum
    const { auth: { user } } = usePage().props;

    const greetings = [
        "Hello",
        "Hi there",
        "Greetings",
        "Howdy",
        "Hey",
        "Salutations",
    ];
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

    // Use dynamic user data, falling back if necessary
    const firstName = user.name ?? "User";
    const subscriptionTier = user?.tier ?? 'free';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Top cards grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Greeting Card */}
                    <div className="flex flex-col items-center justify-center rounded-xl bg-[var(--card)] p-6 shadow-lg">
                        <section className="text-center">
                            <h1 className="text-2xl font-bold mb-2 text-[var(--card-foreground)]">
                                {randomGreeting}, {firstName}!
                            </h1>
                            <p className="text-[var(--card-foreground)]">
                                Your current subscription tier is: <strong>{subscriptionTier}</strong>
                            </p>
                        </section>
                    </div>

                    {/* Quick Links & Tips Card */}
                    <div className="flex flex-col items-center justify-center rounded-xl bg-[var(--card)] p-6 shadow-lg">
                        <section className="text-center">
                            <h2 className="text-xl font-semibold mb-2 text-[var(--card-foreground)]">
                                Quick Links &amp; Tips
                            </h2>
                            <p className="text-[var(--card-foreground)]">
                                Use the sidebar to navigate between Dashboard and Settings. Explore new features and customize your form experience with ease!
                            </p>
                        </section>
                    </div>

                    {/* Upgrade Card */}
                    <div className="flex flex-col items-center justify-center rounded-xl bg-[var(--card)] p-6 shadow-lg">
                        <section className="text-center">
                            <h2 className="text-xl font-semibold mb-2 text-[var(--card-foreground)]">
                                Upgrade for More Features!
                            </h2>
                            <p className="mb-2 text-[var(--card-foreground)]">
                                Upgrade your subscription to unlock premium features such as:
                            </p>
                            <ul className="list-disc list-inside mb-2 text-left text-[var(--card-foreground)]">
                                <li>Customizable tooltip questions and styles.</li>
                                <li>Advanced analytics on form interactions.</li>
                                <li>Priority support and regular updates.</li>
                            </ul>
                            <div>
                                <Link
                                    href={route('settings.subscription')}
                                    className="mt-4 inline-block rounded bg-primary px-4 py-2 text-white hover:opacity-90"
                                >
                                    Manage Subscription
                                </Link>
                            </div>

                        </section>

                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-hidden rounded-xl bg-[var(--card)] p-6 shadow-lg">
                    <section className="mb-6">
                        <h2 className="text-2xl font-bold mb-4 text-[var(--card-foreground)]">
                            What is Form Tooltip?
                        </h2>
                        <p className="mb-4 text-[var(--card-foreground)]">
                            Form Tooltip is an innovative extension designed to help users fill out forms more easily.
                            It automatically adds a small help icon beside each form field. Hover over the icon to view
                            simplified descriptions and helpful tips.
                        </p>
                        <p className="font-semibold mb-2 text-[var(--card-foreground)]">
                            Accessibility Benefits:
                        </p>
                        <ul className="list-disc list-inside mb-4 text-[var(--card-foreground)]">
                            <li>
                                <span className="font-semibold">Clear Guidance:</span> Each tooltip provides concise explanations of what is required in each field, reducing confusion.
                            </li>
                            <li>
                                <span className="font-semibold">Keyboard &amp; Screen Reader Friendly:</span> With proper ARIA labels (each help icon has an aria-label="Help"), the tooltips are designed to be accessible to users relying on assistive technologies.
                            </li>
                            <li>
                                <span className="font-semibold">Visual Contrast:</span> The tooltip design uses high-contrast colors ensuring readability for users with visual impairments.
                            </li>
                        </ul>
                        <p className="text-[var(--card-foreground)]">
                            The extension works on any web page by injecting tooltips near input fields. It is built with
                            accessibility in mind, making it easier for all users—including those with disabilities—to understand form requirements.
                        </p>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}

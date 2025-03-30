import { type SharedData } from '@/types'
import { Head, Link, usePage } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import scColorLogo from '../../../public/SC_COLOR_white_text.png'

export default function Welcome() {
    const { auth } = usePage<SharedData>().props
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setLoaded(true), 200)
        return () => clearTimeout(timer)
    }, [])

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>

            <div className="flex min-h-screen flex-col bg-gradient-to-r from-[#116530] to-[#134E8E] text-white">
                <header className="flex w-full justify-end p-4">
                    <nav className="flex items-center gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="rounded-sm border border-white/30 px-5 py-1.5 text-sm leading-normal text-white hover:border-white/50"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-white hover:border-white/30"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-sm border border-white/30 px-5 py-1.5 text-sm leading-normal text-white hover:border-white/50"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                <div
                    className={`
                        flex flex-1 items-center justify-center p-6
                        transition-opacity duration-1000
                        ${loaded ? 'opacity-100' : 'opacity-0'}
                    `}
                >
                    <main className="max-w-md text-center">
                        <img
                            src={scColorLogo}
                            alt="SC Logo"
                            className="mx-auto mb-4 w-60"
                        />
                        <h1 className="mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
                            Understand Any Form. Instantly.
                        </h1>
                        <p className="mb-6 text-base sm:text-lg">
                            Auto-generated tooltips that simplify and translate confusing
                            form questions — in real time.
                        </p>
                    </main>
                </div>
            </div>
        </>
    )
}

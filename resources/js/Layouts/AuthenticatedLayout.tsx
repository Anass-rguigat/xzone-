import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    console.log(user)
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <nav className="border-b border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    Dashboard
                                </NavLink>
                                <NavLink
                                href={route('brands.index')}  
                                active={route().current('brands.index')}  
                            >
                                Brands
                            </NavLink>
                            <NavLink
                                href={route('hard-drives.index')}  
                                active={route().current('hard-drives.index')}  
                            >
                                Hard Drives
                            </NavLink>
                            <NavLink
                                href={route('processors.index')}  
                                active={route().current('processors.index')}  
                            >
                                Processors
                            </NavLink>
                            <NavLink
                                href={route('power-supplies.index')}  
                                active={route().current('power-supplies.index')}  
                            >
                                Power Supply
                            </NavLink>
                            <NavLink
                                href={route('motherboards.index')}  
                                active={route().current('motherboards.index')}  
                            >
                                MotherBoards
                            </NavLink>
                            <NavLink
                                href={route('network-cards.index')}  
                                active={route().current('network-cards.index')}  
                            >
                                Network cards
                            </NavLink>
                            <NavLink
                                href={route('raid-controllers.index')}  
                                active={route().current('raid-controllers.index')}  
                            >
                                Raid Controllers
                            </NavLink>
                            <NavLink
                                href={route('cooling-solutions.index')}  
                                active={route().current('cooling-solutions.index')}  
                            >
                                Cooling solution
                            </NavLink>
                            <NavLink
                                href={route('chassis.index')}  
                                active={route().current('chassis.index')}  
                            >
                                Chassis
                            </NavLink>
                            <NavLink
                                href={route('graphic-cards.index')}  
                                active={route().current('graphic-cards.index')}  
                            >
                                Graphic Cards
                            </NavLink>
                            <NavLink
                                href={route('fiber-optic-cards.index')}  
                                active={route().current('fiber-optic-cards.index')}  
                            >
                                Fiber Optic
                            </NavLink>
                            <NavLink
                                href={route('expansion-cards.index')}  
                                active={route().current('expansion-cards.index')}  
                            >
                                Expansion Cards
                            </NavLink>
                            <NavLink
                                href={route('cable-connectors.index')}  
                                active={route().current('cable-connectors.index')}  
                            >
                                cable connectors
                            </NavLink>
                            <NavLink
                                href={route('batteries.index')}  
                                active={route().current('batteries.index')}  
                            >
                                batteries
                            </NavLink>
                            <NavLink
                                href={route('rams.index')}  
                                active={route().current('rams.index')}  
                            >
                                Rams
                            </NavLink>
                            <NavLink
                                href={route('servers.index')}  
                                active={route().current('servers.index')}  
                            >
                                servers
                            </NavLink>
                            <NavLink
                                href={route('discounts.index')}  
                                active={route().current('discounts.index')}  
                            >
                                discounts Servers
                            </NavLink>
                            <NavLink
                                href={route('discountComponents.index')}  
                                active={route().current('discountComponents.index')}  
                            >
                                discounts Rams
                            </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none dark:text-gray-500 dark:hover:bg-gray-900 dark:hover:text-gray-400 dark:focus:bg-gray-900 dark:focus:text-gray-400"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4 dark:border-gray-600">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow dark:bg-gray-800">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}

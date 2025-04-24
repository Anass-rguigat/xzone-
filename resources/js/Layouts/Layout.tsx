import { AppSidebar } from '@/components/app-sidebar'
import { Navbar } from '@/Components/navbar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { usePage } from '@inertiajs/react';
import React from 'react'
import { Toaster } from 'react-hot-toast';

interface LayoutProps {
    children: React.ReactNode;
    header?: React.ReactNode;
}

export const Layout = ({children, header}: LayoutProps) => {
    const user = usePage().props.auth.user;
    console.log(user)
    return (
        <SidebarProvider>
            <AppSidebar/>
            <SidebarInset>
                <Navbar />
                <main className='p-5'>
                    {header && (
                        <div className="mb-4">
                            {header}
                        </div>
                    )}
                    <Toaster 
                        position="top-right" 
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: '#fff',
                                color: '#374151',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }
                        }}
                    />
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
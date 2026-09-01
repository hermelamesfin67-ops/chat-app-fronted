"use client"
import BottomNav from '@/components/bottom-nav'
import { routes } from '@/lib/routes'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { data: session } = useSession()
    if (!session) router.replace(routes.signIn)

    return (
        <div className='relative max-w-lg mx-auto w-full'>
            {children}
            <BottomNav />
        </div>
    )
}


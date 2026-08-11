import BottomNav from '@/components/bottom-nav'
import React from 'react'

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <div className='relative max-w-md mx-auto w-full'>
            {children}
            <BottomNav />
        </div>
    )
}


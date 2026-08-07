import BottomNav from '@/components/bottom-nav'
import React from 'react'

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <div className='relative'>
            {children}
            <BottomNav />
        </div>
    )
}


"use client"
import BottomNav from '@/components/bottom-nav'
import React from 'react'

export default function layout({ children }: { children: React.ReactNode }) {
    const isChatPage = window.location.pathname.startsWith('/chats/');
    return (
        <div className='relative max-w-xl mx-auto w-full'>
            {children}
            {!isChatPage && <BottomNav />}
        </div>
    )
}


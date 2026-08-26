import React from 'react'

function AuthWrapper({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="h-screen w-full flex flex-col gap-5 items-center justify-center max-w-xl mx-auto p-4">
            <div className="flex flex-col gap-1">
                <p className="text-center font-bold text-3xl text-primary">Chatty</p>
                <p className="text-center text-sm font-normal">{title}</p>
            </div>
            {children}
        </div>
    )
}

export default AuthWrapper
import Image from 'next/image'
import React, { useState } from 'react'

function ChatLists() {
    const [randomNumbers] = useState(() =>
        Array(10).fill(0).map(() => Math.floor(Math.random() * 10) + 1)
    );

    const users = ["Ehte", "Saved Messages", "John", "Jane", "Liam", "Noah", "Oliver", "James", "Elijah", "Brook"]
    const profiles = ["/pp1.jpeg", "/pp.jpeg", "/pp2.jpeg", "/pp3.jpeg", "/pp4.jpeg", "/profile.jpeg"]
    const messageAt = ["22:10", "08:30", "MON", "TUE", "18:18", "10:37", "WED", "THU", "23:19", "10:37", "FRI", "SAT", "SUN", "09:50", "07:32"]

    return (
        <div className='grid gap-2 p-1'>
            {randomNumbers.map((random, i) => {
                return (
                    <ChatListRow
                        sentAt={messageAt[i % messageAt.length]}
                        avatar={profiles[i % profiles.length]}
                        online={random}
                        title={users[i % users.length]}
                        message="Lorem ipsum dolor sit amet consectetur adipisicing elit."
                        key={i}
                    />
                )
            })}
        </div>

    )
}

export default ChatLists

type Props = { title: string, message: string, sentAt: string, avatar: string, online: number }

const ChatListRow = ({ title, message, sentAt, avatar, online }: Props) => {
    return (
        <div className='flex gap-3 items-center shadow p-3 rounded-3xl'>
            <div className="relative p-0.5 shrink-0" >
                <div className='border rounded-full w-12 h-12 bg-gray-50 overflow-hidden'>
                    <Image src={avatar} alt='avatar' className='object-cover' width={100} height={100} />
                </div>
                {online % 2 === 0 &&
                    <div className='bg-primary w-3 h-3 rounded-full absolute right-0 bottom-0' />}
            </div>

            <div className='fle flex-col gap-1'>
                <div className='flex justify-between gap-2'>
                    <p className='font-semibold capitalize text-sm'>{title}</p>
                    <div>
                        <p className='text-sm text-black/70'>{sentAt}</p>
                    </div>
                </div>
                <p className='font-medium text-black/30 line-clamp-1 text-xs'>
                    {message}
                </p>
            </div>
        </div>
    )
}
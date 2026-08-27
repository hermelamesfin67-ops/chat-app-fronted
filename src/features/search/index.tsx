import ChatListLoader from '@/components/loader/chat-list';
import { routes } from '@/lib/routes';
import Image from 'next/image';
import Link from 'next/link';

function SearchPage({ data, isLoading }: { data: { id: string, username: string, profile_picture: string, is_online: boolean }[], isLoading: boolean }) {
    if (isLoading) return <ChatListLoader />;

    return (
        <div className="grid gap-2 p-1">
            {data?.map((user) => (
                <ChatListRow key={user.id} id={user.id} title={user?.username} avatar={user?.profile_picture} lastSeen={user?.is_online} />
            ))}
        </div>
    )
}

export default SearchPage

type Props = {
    id: string, title: string, avatar: string, lastSeen: boolean
}

const ChatListRow = ({ id, title, avatar, lastSeen }: Props) => {
    return (
        <Link href={routes.chatRoom(id)} className="flex gap-3 items-center shadow p-3 rounded-3xl">
            <div className="relative p-0.5 shrink-0">
                <div className="border rounded-full w-12 h-12 bg-gray-50 overflow-hidden">
                    <Image
                        src={avatar}
                        alt="avatar"
                        className="object-cover"
                        width={100}
                        height={100}
                    />
                </div>
                {lastSeen && (
                    <div className="bg-primary w-3 h-3 rounded-full absolute right-0 bottom-0" />
                )}
            </div>

            <div className="fle flex-col gap-1 w-full">
                <div className="flex justify-between w-full gap-2">
                    <p className="font-semibold capitalize text-sm">{title}</p>
                </div>
            </div>
        </Link>
    );
};
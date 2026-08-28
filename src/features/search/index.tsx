import EmptyData from '@/components/empty-data';
import ChatListLoader from '@/components/loader/chat-list';
import useDynamicMutation from '@/lib/api/use-post-data';
import { routes } from '@/lib/routes';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Props = {
    data: { id: string, conversationId: string, username: string, profile_picture: string, is_online: boolean }[],
    isLoading: boolean
}

function SearchPage({ data, isLoading }: Props) {
    if (isLoading) return <ChatListLoader />;

    return (
        <div className="grid gap-2 p-1">
            {data?.length ? data?.map((user) => (
                <ChatListRow
                    key={user.id}
                    id={user.id}
                    conversationId={user.conversationId}
                    title={user?.username}
                    avatar={user?.profile_picture}
                    lastSeen={user?.is_online}
                />
            ))
                : <EmptyData title={"Search result appears here."} />
            }
        </div>
    )
}

export default SearchPage

type RowProps = {
    id: string, conversationId: string, title: string, avatar: string, lastSeen: boolean
}

const ChatListRow = ({ id, conversationId, title, avatar, lastSeen }: RowProps) => {
    const router = useRouter()
    const { data: session } = useSession()
    const postMutation = useDynamicMutation({})

    async function createConversation() {
        try {
            await postMutation.mutateAsync({
                url: "conversations/",
                method: "POST",
                body: {
                    "participants": [session?.user?.user?.id, id]
                },
                onSuccess: (res) => {
                    router.push(routes.chatRoom(res?.id))
                },
            });
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div onClick={() => {
            if (conversationId) router.push(routes.chatRoom(conversationId))
            else createConversation()
        }}
            className="flex gap-3 items-center shadow p-3 rounded-3xl">
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
        </div>
    );
};
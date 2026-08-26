"use client"
import ChatListLoader from "@/components/loader/chat-list";
import { MessageTime } from "@/components/message-time";
import { queryKeys } from "@/lib/api/query-keys";
import { useFetchData } from "@/lib/api/use-fetch-data";
import { routes } from "@/lib/routes";
import Image from "next/image";
import Link from "next/link";

type ChatListType = {
  id: string;
  user: {
    id: number;
    name: string;
    avatar: string;
  };
  last_message: string;
  created_at: Date;
};

function ChatLists() {
  const getChats = useFetchData([queryKeys.getChats], `chats/`);
  const chats: ChatListType[] = getChats.data;

  if (getChats.isFetching) return <ChatListLoader />;

  return (
    <div className="grid gap-2 p-1">
      {chats?.length &&
        chats?.map((chat) => {
          return (
            <ChatListRow
              id={chat.id}
              messageAt={chat.created_at}
              avatar={chat.user?.avatar || "/profile.jpeg"}
              online={1}
              title={chat?.user?.name}
              message={chat?.last_message}
              key={chat?.id}
            />
          );
        })}
    </div>
  );
}

export default ChatLists;

type Props = {
  id: string;
  title: string;
  message: string;
  messageAt: Date;
  avatar: string;
  online: number;
};

const ChatListRow = ({ id, title, message, messageAt, avatar, online }: Props) => {
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
        {online % 2 === 0 && (
          <div className="bg-primary w-3 h-3 rounded-full absolute right-0 bottom-0" />
        )}
      </div>

      <div className="fle flex-col gap-1 w-full">
        <div className="flex justify-between w-full gap-2">
          <p className="font-semibold capitalize text-sm">{title}</p>
          <div className="text-sm text-black/50">
            <MessageTime date={messageAt} />
          </div>
        </div>
        <p className="font-medium text-black/30 line-clamp-1 text-xs">
          {message}
        </p>
      </div>
    </Link>
  );
};

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { queryKeys } from "@/lib/api/query-keys";
import { useFetchData } from "@/lib/api/use-fetch-data";
import { useSession } from "next-auth/react";
import { routes } from "@/lib/routes";
import ChatRoomLoader from "@/components/loader/chat-room";
import { cn } from "@/lib/utils";
import { MessageTime } from "@/components/message-time";
import { Input } from "@/components/ui/input";
import useDynamicMutation from "@/lib/api/use-post-data";
import { formatDateSeparator } from "@/utils/date";
interface Message {
  conversation: string,
  sender: string,
  text: string,
  created_at: Date,
  is_read: boolean,
  message_type: string
}

interface ChatRoomProps {
  conversationId: string;
}

export default function ChatRoom({ conversationId }: ChatRoomProps) {
  const router = useRouter();
  const { data: session } = useSession()
  const postMutation = useDynamicMutation({})
  const token = session?.user?.access
  const id = session?.user?.user?.id

  const [text, setText] = useState("");

  const [connected, setConnected] = useState(false);

  const socketRef = useRef<WebSocket | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  /*
   * Get old messages
   */

  const getChatRoom = useFetchData(
    [queryKeys.getChats, conversationId],
    `messages/?conversation=${conversationId}`,
  );

  const roomMessages = getChatRoom.data ?? [];
  const [liveMessages, setLiveMessages] = useState<Message[]>([]);

  const messages: Message[] = useMemo(
    () => [...roomMessages, ...liveMessages],
    [roomMessages, liveMessages],
  );

  /*
   * WebSocket
   */

  useEffect(() => {

    if (!token) {
      console.error("No access token");

      router.push(routes.signIn);

      return;
    }

    const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

    const socket = new WebSocket(
      `${WS_URL}ws/chat/${conversationId}/?token=${token}`,
    );

    socketRef.current = socket;

    /*
     * Connected
     */

    socket.onopen = () => {
      console.log("WebSocket connected");

      setConnected(true);
    };

    /*
     * Receive message
     */

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        console.log("WebSocket message:", data);

        const newMessage = data.message ?? data;

        setLiveMessages((previous) => [...previous, newMessage]);
      } catch (error) {
        console.error("Invalid WebSocket data:", error);
      }
    };

    /*
     * Disconnect
     */

    socket.onclose = () => {
      console.log("WebSocket disconnected");

      setConnected(false);
    };

    /*
     * Error
     */

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);

      setConnected(false);
    };

    /*
     * Cleanup
     */

    return () => {
      socket.close();

      socketRef.current = null;
    };
  }, [conversationId, router]);

  /*
   * Scroll to bottom
   */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  /*
   * Send message
   */

  async function sendMessage(event: React.FormEvent) {
    try {
      await postMutation.mutateAsync({
        url: "conversations/",
        method: "POST",
        body: {
        },
        onSuccess: (res) => {

        },
      });
    } catch (err) {
      console.log(err);
    }
    // event.preventDefault();
    // const message = text.trim();
    // if (!message) {
    //   return;
    // }
    // const socket = socketRef.current;
    // if (!socket || socket.readyState !== WebSocket.OPEN) {
    //   console.error("WebSocket is not connected");
    //   return;
    // }
    // socket.send(
    //   JSON.stringify({
    //     message: message,
    //   }),
    // );
    // setText("");
  }

  if (getChatRoom.isFetching) return <ChatRoomLoader />;

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}

      <div className="h-16 border-b flex items-center px-4 gap-3">
        <button onClick={() => router.push(routes.home)} className="text-xl">
          ←
        </button>

        <div>
          <h1 className="font-bold">Chat</h1>

          <div className="text-xs">
            {connected ? (
              <span className="text-green-500">Online</span>
            ) : (
              <span className="text-blue-500">Connecting</span>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {messages.map((message, index) => {
            const messageDate = new Date(message.created_at);

            const currentDate = messageDate.toLocaleDateString("en-GB");

            const previousDate =
              index > 0
                ? new Date(messages[index - 1].created_at).toLocaleDateString("en-GB")
                : null;

            const showDateSeparator = currentDate !== previousDate;

            return (
              <React.Fragment key={message.conversation ?? `message-${index}`}>
                {showDateSeparator && (
                  <div className="flex justify-center py-3">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">
                      {formatDateSeparator(message.created_at)}
                    </span>
                  </div>
                )}

                <div className="flex">
                  <div
                    className={cn(
                      "min-w-44 max-w-md px-4 py-1 rounded-lg",
                      id === message.sender
                        ? "ml-auto bg-[#E2E8F0]"
                        : "mr-auto bg-[#FDF8F6] pe-10"
                    )}
                  >
                    {message.text}

                    <p
                      className={cn(
                        "text-end text-xs text-black/30",
                        id !== message.sender && "-me-7"
                      )}
                    >
                      <MessageTime date={message.created_at} />
                    </p>
                  </div>
                </div>
              </React.Fragment>
            );
          })}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message input */}

      <form onSubmit={sendMessage} className="border-t p-3 flex gap-2">
        <Input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Write a message..."
          className="flex-1 border rounded-lg px-4 py-2 outline-none"
        />
        <button
          type="submit"
          disabled={!connected}
          className="bg-blue-500 text-white px-5 py-2 rounded-lg disabled:bg-gray-400"
        >
          Send
        </button>
      </form>
    </div>
  );
}

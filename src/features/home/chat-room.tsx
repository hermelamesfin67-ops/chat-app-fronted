"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { queryKeys } from "@/lib/api/query-keys";
import { useFetchData } from "@/lib/api/use-fetch-data";
import { RefreshCw } from "lucide-react";

interface Message {
  id?: number;
  sender?: {
    id: number;
    username: string;
  };
  content: string;
  created_at?: string;
  message_type?: string;
}

interface ChatRoomProps {
  conversationId: string;
}

export default function ChatRoom({ conversationId }: ChatRoomProps) {
  const router = useRouter();

  const [text, setText] = useState("");

  const [connected, setConnected] = useState(false);

  const socketRef = useRef<WebSocket | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  /*
   * Get old messages
   */

  const getChatRoom = useFetchData(
    [queryKeys.getChats, conversationId],
    `/messages/?conversation=${conversationId}`,
  );

  const roomMessages = getChatRoom.data ?? [];
  const [liveMessages, setLiveMessages] = useState<Message[]>([]);

 const messages = useMemo(
   () => [...roomMessages, ...liveMessages],
   [roomMessages, liveMessages],
 );

  /*
   * WebSocket
   */

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      console.error("No access token");

      router.push("/login");

      return;
    }

    const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

    const socket = new WebSocket(
      `${WS_URL}/ws/chat/${conversationId}/?token=${token}`,
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

        /*
         * Backend may return:
         *
         * {
         *   "message": {...}
         * }
         *
         * OR
         *
         * {
         *   "content": "hello"
         * }
         */

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

  function sendMessage(event: React.FormEvent) {
    event.preventDefault();

    const message = text.trim();

    if (!message) {
      return;
    }

    const socket = socketRef.current;

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not connected");

      return;
    }

    socket.send(
      JSON.stringify({
        message: message,
      }),
    );

    setText("");
  }

  if (getChatRoom.isFetching) return <RefreshCw className="animate-spin" />;

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}

      <div className="h-16 border-b flex items-center px-4 gap-3">
        <button onClick={() => router.push("/chat")} className="text-xl">
          ←
        </button>

        <div>
          <h1 className="font-bold">Chat</h1>

          <div className="text-xs">
            {connected ? (
              <span className="text-green-500">Online</span>
            ) : (
              <span className="text-red-500">Disconnected</span>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}

      <div className="flex-1 overflow-y-auto p-4">
        {getChatRoom.isFetching ? (
          <div>Loading messages...</div>
        ) : (
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div key={message.id ?? `message-${index}`} className="flex">
                <div className="max-w-xs bg-blue-500 text-white px-4 py-2 rounded-lg">
                  {message.content}
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message input */}

      <form onSubmit={sendMessage} className="border-t p-3 flex gap-2">
        <input
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

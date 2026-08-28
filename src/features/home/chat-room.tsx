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
import { Form, Formik, FormikState } from "formik"
import { Button } from "@/components/ui/button";
import EmptyData from "@/components/empty-data";
interface Message {
  id: string
  conversation: string,
  sender: { username: string },
  text: string,
  created_at: Date,
  is_read: boolean,
  message_type: string
}

interface ChatRoomProps {
  conversationId: string;
}
const WS_URL = process.env.NEXT_PUBLIC_WS_URL!;
export default function ChatRoom({ conversationId }: ChatRoomProps) {
  const router = useRouter();
  const { data: session } = useSession()
  const postMutation = useDynamicMutation({})
  const token = session?.user?.access
  const username = session?.user?.user?.username

  const [connected, setConnected] = useState(false);

  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [liveMessages, setLiveMessages] = useState<Message[]>([]);

  /*
   * Get old messages
   */

  const getChatRoom = useFetchData(
    [queryKeys.getChats, conversationId],
    `messages/?conversation=${conversationId}`,
  );


  const messages: Message[] = useMemo(
    () => [...(getChatRoom.data ?? []), ...liveMessages],
    [getChatRoom.data, liveMessages],
  );

  /*
   * WebSocket
   */
  useEffect(() => {
    if (!conversationId || !token) {
      return;
    }

    let isCurrent = true;

    const url =
      `${WS_URL}ws/chat/${conversationId}/?token=${encodeURIComponent(token)}`;

    console.log("Opening WebSocket:", url);

    const socket = new WebSocket(url);

    socketRef.current = socket;

    socket.onopen = () => {
      if (!isCurrent) return;

      console.log("WebSocket connected");
      setConnected(true);
    };

    socket.onmessage = (event) => {
      if (!isCurrent) return;

      try {
        const message: Message = JSON.parse(event.data);

        console.log("New message:", message);

        setLiveMessages((prev) => {
          if (message.id && prev.some((m) => m.id === message.id)) {
            return prev;
          }

          return [...prev, message];
        });
      } catch (error) {
        console.error("Invalid WebSocket message:", error);
      }
    };

    socket.onerror = (error) => {
      if (!isCurrent) return;

      console.error("WebSocket error:", error);
    };

    socket.onclose = (event) => {
      if (!isCurrent) return;

      console.log(
        "WebSocket disconnected:",
        event.code,
        event.reason || "No reason"
      );

      setConnected(false);
    };

    return () => {
      isCurrent = false;

      console.log("Closing WebSocket");

      socket.onopen = null;
      socket.onmessage = null;
      socket.onerror = null;
      socket.onclose = null;

      if (
        socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CONNECTING
      ) {
        socket.close();
      }

      if (socketRef.current === socket) {
        socketRef.current = null;
      }
    };
  }, [conversationId, token]);

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

  async function sendMessage(values: { message: string }, resetForm: (nextState?: Partial<FormikState<{
    message: string;
  }>> | undefined) => void) {
    try {
      await postMutation.mutateAsync({
        url: "messages/",
        method: "POST",
        body: {
          conversation: conversationId,
          text: values.message,
          message_type: "text"
        },
        onSuccess: () => {
          resetForm();
        },
      });
    } catch (err) {
      console.log(err);
    }
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
          {messages?.length ? messages?.map((message, index) => {
            const messageDate = new Date(message.created_at);

            const currentDate = messageDate.toLocaleDateString("en-GB");

            const previousDate =
              index > 0
                ? new Date(messages[index - 1].created_at).toLocaleDateString("en-GB")
                : null;

            const showDateSeparator = currentDate !== previousDate;

            return (
              <React.Fragment key={index}>
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
                      username === message.sender?.username
                        ? "ml-auto bg-[#E2E8F0]"
                        : "mr-auto bg-[#FDF8F6] pe-10"
                    )}
                  >
                    {message.text}

                    <p
                      className={cn(
                        "text-end text-xs text-black/30",
                        username !== message.sender?.username && "-me-7"
                      )}
                    >
                      <MessageTime date={message.created_at} />
                    </p>
                  </div>
                </div>
              </React.Fragment>
            );
          })
            : <EmptyData title={"Chat history appears here."} />}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message input */}

      <Formik
        initialValues={{
          message: ""
        }}
        validationSchema={""}
        onSubmit={(val, { resetForm }) => {
          sendMessage(val, resetForm);
        }}
      >
        {({ setFieldValue, values }) => (
          <Form className="border-t p-3 flex gap-2">
            <Input
              type="text"
              value={values.message}
              onChange={(event) => setFieldValue("message", event.target.value)}
              placeholder="Write a message..."
              className="flex-1 border rounded-lg px-4 py-2 outline-none"
            />
            <Button
              type="submit"
              disabled={!connected || postMutation.isPending}
              className="bg-blue-500 text-white px-5 py-2 rounded-lg disabled:bg-gray-400"
            >
              {postMutation.isPending ? "Sending.." : "Send"}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

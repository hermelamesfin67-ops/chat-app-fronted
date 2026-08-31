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
import useDynamicMutation from "@/lib/api/use-post-data";
import { formatDateSeparator } from "@/utils/date";
import { Form, Formik, FormikState } from "formik"
import EmptyData from "@/components/empty-data";
import { Send } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import MessageActions from "./message-actions";
import Image from "next/image";

export interface Message {
  message_id: string,
  conversation_id: string,
  sender: {
    username: string,
    email: string,
    phone_number: string,
    profile_picture: string
  },
  text: string,
  created_at: Date,
  is_read: boolean,
  message_type: string
}

const initialMessage = {
  message_id: "",
  conversation_id: "",
  sender: {
    username: "",
    email: "",
    phone_number: "",
    profile_picture: ""
  },
  text: "",
  created_at: new Date(),
  is_read: false,
  message_type: ""
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

  const [isEditMode, setIsEditMode] = useState(false)
  const [messageToBeEdit, setMessageToBeEdit] = useState<Message>(initialMessage);

  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [liveMessages, setLiveMessages] = useState<Message[]>([]);

  const getRoomData = useFetchData(
    [queryKeys.getRoomData, conversationId],
    `chat-rooms/?conversation=${conversationId}`,
  );
  const roomData = getRoomData.data

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

      console.log("🟢 WebSocket connected");
      setConnected(true);
    };

    socket.onmessage = (event) => {
      if (!isCurrent) return;

      try {
        const message: Message = JSON.parse(event.data);

        console.log("🔥 New message:", message);

        setLiveMessages((prev) => [
          ...prev,
          message,
        ]);

      } catch (error) {
        console.error("Invalid WebSocket message:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("🔴 WebSocket error:", error);
    };

    socket.onclose = (event) => {
      console.log(
        "🟡 WebSocket disconnected:",
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

  async function updateMessage(values: { message: string }, resetForm: (nextState?: Partial<FormikState<{
    message: string;
  }>> | undefined) => void) {
    try {
      await postMutation.mutateAsync({
        url: isEditMode ? `messages/${messageToBeEdit.message_id}/` : "messages/",
        method: isEditMode ? "PUT" : "POST",
        body: {
          conversation: conversationId,
          text: values.message,
          message_type: "text"
        },
        onSuccess: () => {
          resetForm();
          setIsEditMode(false)
          setMessageToBeEdit(initialMessage)
        },
      });
    } catch (err) {
      console.log(err);
    }
  }
  function sendMessage(
    values: { message: string },
    resetForm: (
      nextState?: Partial<FormikState<{ message: string }>>
    ) => void
  ) {
    const socket = socketRef.current;

    console.log("SOCKET:", socket);
    console.log("READY STATE:", socket?.readyState);

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.log("❌ Socket isn't open");
      return;
    }

    const text = values.message.trim();

    if (!text) return;

    console.log("📤 SENDING:", text);

    socket.send(
      JSON.stringify({
        text: text,
      })
    );

    console.log("📤 SEND CALLED");

    resetForm();
  }


  if (getChatRoom.isFetching) return <ChatRoomLoader />;

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}

      <div className="h-16 border-b flex items-center px-4 gap-3 bg-white rounded-md shadow-md">
        <button onClick={() => router.push(routes.home)} className="text-xl">
          ←
        </button>

        <div>
          {roomData?.length ?
            <div className="flex items-center gap-3">
              <div className="border rounded-full w-12 h-12 bg-gray-50 overflow-hidden">
                <Image
                  src={roomData[0]?.other_user?.profile}
                  alt="avatar"
                  loading="eager"
                  className="object-cover"
                  width={100}
                  height={100}
                />
              </div>
              <div>
                <h1 className="font-bold capitalize">{roomData[0]?.other_user?.name}</h1>
                <div className="text-xs">
                  {connected ? (
                    <span className="text-green-500">Online</span>
                  ) : (
                    <span className="text-blue-500">Connecting</span>
                  )}
                </div>
              </div>
            </div>
            : "Connecting..."}


        </div>
      </div>

      {/* Messages */}

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-3">
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
                {/* messages/10/ */}
                <Popover>
                  <PopoverTrigger>
                    <div className="flex w-full">
                      <div
                        className={cn(
                          "min-w-16 leading-3 max-w-md px-2.5 py-0.5 text-sm rounded-lg",
                          username === message.sender?.username
                            ? "ml-auto bg-[#38BDF8] text-white text-end"
                            : "mr-auto bg-[#E0F2FE] text-[#1E293B] text-start pe-7",
                        )}
                      >
                        {message.text}

                        <p
                          className={cn(
                            "text-end text-xs text-white/60",
                            username !== message.sender?.username && "-me-3"
                          )}
                        >
                          <MessageTime date={message.created_at} />
                        </p>
                      </div>
                    </div>
                  </PopoverTrigger>
                  {username === message.sender?.username &&
                    <PopoverContent align={username === message.sender?.username ? "end" : "start"} className={cn("w-fit")}>
                      <MessageActions
                        message={message}
                        setIsEditMode={setIsEditMode}
                        setMessageToBeEdit={setMessageToBeEdit}
                      />
                    </PopoverContent>
                  }
                </Popover>

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
          message: messageToBeEdit.text ?? ""
        }}
        enableReinitialize={!!isEditMode}
        validationSchema={""}
        onSubmit={(val, { resetForm }) => {
          console.log(isEditMode)
          if (isEditMode) updateMessage(val, resetForm);
          else sendMessage(val, resetForm);
        }}
      >
        {({ setFieldValue, values }) => {
          return (
            <Form className="bg-white rounded-md shadow-md p-3 flex items-center gap-2">
              <textarea
                rows={2}
                value={values.message}
                onChange={(event) => setFieldValue("message", event.target.value)}
                placeholder="Write a message..."
                className="flex-1 border rounded-lg px-4 py-2 text-sm outline-none"
              />
              <button
                type="submit"
                disabled={!connected || postMutation.isPending}
                className="border border-[#0284C7] p-2 rounded-lg"
              >

                {postMutation.isPending ? "Sending.." : <Send className="text-[#0284C7] disabled:text-black text-2xl" size={28} />}
              </button>
            </Form>
          )
        }}
      </Formik>
    </div >
  );
}

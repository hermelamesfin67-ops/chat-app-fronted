import ChatRoom from "@/features/home/chat-room";
import { metaObject } from "@/lib/site-seo";

export const metadata = {
    ...metaObject("My Conversations"),
};

type Props = {
    params: Promise<{ slug: string }>;
};

async function page({ params }: Props) {
    const { slug } = await params;

    return (
        <ChatRoom conversationId={slug} />
    )
}

export default page
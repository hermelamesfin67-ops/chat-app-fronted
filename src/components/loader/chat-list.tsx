import { Skeleton } from "../ui/skeleton"

function ChatListLoader() {
    return (
        <div className="grid gap-2 p-1">
            {Array(10).fill(0).map((_, i) => (
                <div key={i} className="h-20 w-full flex gap-3 items-center shadow p-3 rounded-3xl">
                    <Skeleton className="rounded-full w-12 h-12 shrink-0" />
                    <div className="fle flex-col gap-1 w-full">
                        <div className="flex justify-between w-full gap-2">
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-3 w-10" />
                        </div>
                        <Skeleton className="h-3 w-48 mt-2" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ChatListLoader
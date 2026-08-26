import { Skeleton } from "../ui/skeleton"

function ChatRoomLoader() {
    return (
        <div className="grid gap-2 p-3">
            {Array(10).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col gap-3">
                    <Skeleton className="h-5 w-20 mr-auto" />
                    <Skeleton className="h-9 w-64 ml-auto" />

                    <Skeleton className="h-20 w-64 mr-auto" />
                    <Skeleton className="h-16 w-36 ml-auto" />

                    <Skeleton className="h-14 w-40 mr-auto" />
                    <Skeleton className="h-24 w-64 ml-auto" />
                </div>
            ))}
        </div>
    )
}

export default ChatRoomLoader
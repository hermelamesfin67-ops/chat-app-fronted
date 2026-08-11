import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import ChatLists from "./chat-lists"

function HomePage() {
  return (
    <div className="flex flex-col gap-3 p-3 mb-16">
      <div className="sticky top-2 flex items-center gap-1 w-full border z-50 rounded-full p-1 px-2.5 bg-gray-50 dark:bg-gray-100 border-gray-200 shadow-none">
        <Search className="text-gray-400" />
        <Input />
      </div>

      <ChatLists />
    </div>
  )
}

export default HomePage
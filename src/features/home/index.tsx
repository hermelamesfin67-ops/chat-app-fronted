"use client"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import ChatLists from "./chat-lists"
import { useState } from "react"
import SearchPage from "../search"
import { useDebounce } from "react-use"
import { useFetchData } from "@/lib/api/use-fetch-data"
import { queryKeys } from "@/lib/api/query-keys"

function HomePage() {
  const [searchMode, setSearchMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedValue, setDebouncedValue] = useState("")

  const getSearch = useFetchData(
    [queryKeys.getSearch, debouncedValue],
    `users/search/?q=${debouncedValue}`,
    undefined,
    !!debouncedValue
  );
  const users = getSearch.data;

  const [,] = useDebounce(
    () => {
      setDebouncedValue?.(searchTerm.trim());
    },
    1000,
    [searchTerm],
  );


  return (
    <div className="flex flex-col gap-3 p-3 mb-16">
      <div className="sticky top-2 flex items-center gap-1 w-full border z-50 rounded-full p-1 px-2.5 bg-white border-gray-200 shadow-none">
        <Search className="text-gray-400" />
        <Input
          onChange={(e) => setSearchTerm(e.target.value)}
          onClick={() => setSearchMode((prev) => !prev)}
        />
      </div>
      {!searchMode
        ? <ChatLists />
        : <SearchPage
          isLoading={getSearch.isFetching}
          data={users}
        />}
    </div>
  )
}

export default HomePage
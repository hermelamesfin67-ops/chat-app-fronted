import { Send, Search, Home, Settings } from "lucide-react";

function BottomNav() {
    return (
        <nav className="flex justify-between fixed bottom-0 left-0 right-0 p-3 border rounded-full m-3 shadow-lg">
            <Home />
            <Send />
            <Search />
            <Settings />
        </nav>
    )
}

export default BottomNav
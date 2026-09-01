"use client"
import { routes } from "@/lib/routes";
import { Home, Settings, UserShield } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menus = [
    { link: routes.home, icon: <Home /> },
    // { link: routes.search, icon: <Search /> },
    { link: routes.profile, icon: <UserShield /> },
    { link: routes.settings, icon: <Settings /> },
]

function BottomNav() {
    const { data: session } = useSession()
    const pathName = usePathname()

    const isChatPage = pathName.startsWith('/chats/');
    if (isChatPage || !session) return null;
    return (
        <nav className="flex justify-between fixed bottom-0 left-0 right-0 p-3 border bg-white rounded-full m-3 shadow-lg max-w-lg mx-auto">
            {menus.map((menu, index) => (
                <Link href={menu.link} key={index} className="w-fit">
                    {menu?.icon}
                </Link>
            ))}
        </nav>
    )
}

export default BottomNav
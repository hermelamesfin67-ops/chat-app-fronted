import { routes } from "@/lib/routes";
import { Search, Home, Settings, UserShield } from "lucide-react";
import Link from "next/link";

const menus = [
    { link: routes.home, icon: <Home /> },
    { link: routes.search, icon: <Search /> },
    { link: routes.profile, icon: <UserShield /> },
    { link: routes.settings, icon: <Settings /> },
]

function BottomNav() {
    return (
        <nav className="flex justify-between fixed bottom-0 left-0 right-0 p-3 border bg-white rounded-full m-3 shadow-lg">
            {menus.map((menu, index) => (
                <Link href={menu.link} key={index} className="w-fit">
                    {menu?.icon}
                </Link>
            ))}
        </nav>
    )
}

export default BottomNav
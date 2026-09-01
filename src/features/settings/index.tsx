"use client"
import useDynamicMutation from "@/lib/api/use-post-data";
import { routes } from "@/lib/routes";
import { SquareUser, LockKeyhole, Globe, Bell, MessageCircleQuestionMark, LogOut, ChevronRight } from "lucide-react"
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


function Settings() {
    const router = useRouter()
    const { data: session } = useSession()
    const postMutation = useDynamicMutation({})
    const handleLogout = async () => {
        try {
            await postMutation.mutateAsync({
                url: "logout/",
                method: "POST",
                body: {
                    refresh: session?.user?.refresh
                },
                onSuccess: () => {
                    signOut()
                },
            });
        } catch (err) {
            console.log(err);
        }
    };

    const menus = [
        { name: "Account", link: "#", icon: <SquareUser /> },
        { name: "Privacy", link: "#", icon: <LockKeyhole /> },
        { name: "Language", link: "#", icon: <Globe /> },
        { name: "Notification", link: "#", icon: <Bell /> },
        { name: "Help", link: "#", icon: <MessageCircleQuestionMark /> },
        { name: "Change Password", link: routes.changePassword, icon: <LockKeyhole /> },
        { name: "Logout", link: "#", icon: <LogOut />, onclick: handleLogout },
    ]

    return (
        <div className="p-3 flex flex-col gap-5 py-5">
            <p className="text-2xl font-bold">Settings</p>
            {menus.map((menu, i) => (
                <div onClick={() => {
                    if (menu.onclick) menu.onclick()
                    else router.push(menu.link)
                }} key={i} className="flex items-center gap-3 justify-between w-full">
                    <div className="flex items-center gap-2 w-full">
                        <div className="bg-gray-200 p-1 rounded-md">
                            {menu.icon}
                        </div>
                        <p className="text-sm font-normal">
                            {menu.name}
                        </p>
                    </div>
                    <ChevronRight />
                </div>
            ))}
        </div>
    )
}

export default Settings
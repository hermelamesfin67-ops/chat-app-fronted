"use client"
import useDynamicMutation from "@/lib/api/use-post-data";
import { SquareUser, LockKeyhole, Globe, Bell, MessageCircleQuestionMark, LogOut, ChevronRight } from "lucide-react"
import { signOut } from "next-auth/react";


function Settings() {
    const postMutation = useDynamicMutation({})
    const handleLogout = async () => {
        signOut()
        return
        try {
            await postMutation.mutateAsync({
                url: "logout/",
                method: "POST",
                body: {
                },
                onSuccess: () => {
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
        { name: "Logout", link: "#", icon: <LogOut />, onclick: handleLogout },
    ]

    return (
        <div className="p-3 flex flex-col gap-5 py-5">
            <p className="text-2xl font-bold">Settings</p>
            {menus.map((menu, i) => (
                <div onClick={() => {
                    if (menu.onclick) menu.onclick()
                    else return
                }} key={i} className="flex items-center gap-3 justify-between">
                    <div className="flex items-center gap-2">
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
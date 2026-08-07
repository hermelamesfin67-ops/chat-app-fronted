import { Ellipsis } from "lucide-react"
import Logo from "./logo"


function SplashScreen() {
    return (
        <div className="h-screen w-full bg-primary flex flex-col gap-7 items-center justify-center">
            <Logo className="w-24 h-24" />
            <p className="text-white font-bold text-3xl text-center">Chatty</p>

            <p className="text-white text-center">Connect.Chat.Share.</p>

            <div className="absolute bottom-10 flex items-center justify-center">
                <Ellipsis className="w-10 h-10 text-white animate-caret-blink" />
            </div>

        </div>
    )
}

export default SplashScreen
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import Link from "next/link";

const SignOut = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-2">
            <h3>Session Expired!</h3>
            <p>Your session is expired, please login again to access the portal! </p>
            <Link href={routes.signIn} className="">
                <Button id="signOut">
                    Sign Out
                </Button>
            </Link>
        </div>
    );
};

export default SignOut;

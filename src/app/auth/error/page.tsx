import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import Link from "next/link";

const Error = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-2">
            <h3>Something went wrong!</h3>
            <p>
                sorry we are experiencing some issue while we process your request,
                please try again!{" "}
            </p>
            <Link href={routes.signIn} className="">
                <Button id="backToHome">
                    Back To SignIn
                </Button>
            </Link>
        </div>
    );
};

export default Error;

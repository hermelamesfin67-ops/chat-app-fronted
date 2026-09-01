import Profile from "@/features/profile";
import { metaObject } from "@/lib/site-seo";

export const metadata = {
    ...metaObject("Profile"),
};

export default function page() {
    return (
        <Profile />
    )
}

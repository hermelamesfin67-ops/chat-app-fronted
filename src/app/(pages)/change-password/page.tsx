import ChangePassword from "@/features/settings/change-password";
import { metaObject } from "@/lib/site-seo";

export const metadata = {
    ...metaObject("Change Password"),
};

export default function page() {
    return (
        <ChangePassword />
    )
}

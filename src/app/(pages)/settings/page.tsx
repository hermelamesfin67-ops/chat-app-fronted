import Settings from "@/features/settings";
import { metaObject } from "@/lib/site-seo";

export const metadata = {
    ...metaObject("Settings"),
};

export default function page() {
    return (
        <Settings />
    )
}

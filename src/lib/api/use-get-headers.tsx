import { useSession } from "next-auth/react";

type HeaderType = "FormData" | "Json";
interface Props {
  type?: HeaderType;
  noEnc?: boolean;
}
export const useGetHeaders = ({ type = "Json" }: Props) => {
  const { data: session } = useSession()
  if (type === "FormData") {
    return {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
      ...(session?.user.access && {
        Authorization: `Bearer ${session?.user.access}`
      }),
    };
  } else {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(session?.user.access && {
        Authorization: `Bearer ${session?.user.access}`
      }),
    };
  }
};

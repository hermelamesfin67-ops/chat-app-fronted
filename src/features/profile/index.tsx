"use client"
import FormikInput from "@/components/forms/input";
import ChatListLoader from "@/components/loader/chat-list";
import { Button } from "@/components/ui/button";
import { queryKeys } from "@/lib/api/query-keys";
import { useFetchData } from "@/lib/api/use-fetch-data";
import useDynamicMutation from "@/lib/api/use-post-data";
import { normalizePhoneNumber } from "@/lib/normalize-phone-number";
import { cn } from "@/lib/utils";
import { profileSchema, ProfileSchemaType } from "@/validations/profile.schema";
import { useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { PencilIcon } from "lucide-react";
import Image from "next/image"
import { useState } from "react";
import { toast } from "sonner";

function Profile() {
    const queryClient = useQueryClient()
    const postMutation = useDynamicMutation({ type: "FormData" })
    const [isEditMode, setIsEditMode] = useState(false);
    const getProfile = useFetchData(
        [queryKeys.getProfile],
        `profile/`,
    );
    const profile = getProfile.data;

    const updateProfile = async (values: ProfileSchemaType) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updatedData: any = {
            bio: values.bio,
            username: values.username,
            phone_number: "0".concat(values.phoneNumber),
            email: values.email,

        }
        if (values.avatar) {
            updatedData["profile_picture"] = values.avatar;
        }
        try {
            await postMutation.mutateAsync({
                url: "profile/",
                method: "PUT",
                body: updatedData,
                onSuccess: () => {
                    setIsEditMode(false)
                    queryClient.invalidateQueries({
                        queryKey: [queryKeys.getProfile],
                    });
                    toast.success("Profile updated successfully");
                },
            });
        } catch (err) {
            console.log(err);
        }
    }

    if (getProfile.isFetching) return <ChatListLoader />

    return (
        <Formik
            initialValues={{
                avatar: "" as unknown as File,
                username: profile?.username || "",
                bio: profile?.bio || "",
                phoneNumber: profile?.phone_number ? normalizePhoneNumber(profile?.phone_number) : "",
                email: profile?.email || "",
            }}
            validationSchema={profileSchema}
            onSubmit={(val) => updateProfile(val)}
        >
            {({ setFieldValue, values }) => (

                <Form className="flex flex-col gap-5 p-5">
                    <div className="flex justify-end">
                        <Button type="button" onClick={() => setIsEditMode((prev) => !prev)}>
                            <PencilIcon />
                        </Button>
                    </div>
                    <div className="flex flex-col items-center justify-center h-44">
                        <div>
                            <div className="rounded-full border bg-gray-50 overflow-hidden p-0.5">
                                <Image
                                    width={100}
                                    height={100}
                                    src={values.avatar ? URL.createObjectURL(values.avatar) : profile?.profile_picture} alt="profile"
                                    className="w-24 h-24 rounded-full"
                                />
                            </div>
                            {isEditMode && (
                                <label htmlFor="avatar" className="text-primary font-semibold text-sm">Upload Photo</label>
                            )}
                            <input id="avatar" type="file" className="hidden" onChange={(e) => {
                                setFieldValue("avatar", e.target.files && e.target.files[0])
                            }} />
                        </div>
                        {isEditMode ?
                            <FormikInput
                                id="username"
                                name="username"
                                label="Username"
                                pattern="username"
                                placeholder="Enter username"
                            />
                            : <p className="text-center capitalize text-3xl font-semibold">{profile?.username}</p>
                        }
                        {!isEditMode &&
                            <p className={cn("text-center text-sm", profile?.is_online && "text-primary")}>{profile?.is_online ? "Online" : "Offline"}</p>}
                    </div>

                    <div className="flex flex-col gap-3">
                        <FormikInput
                            id="phoneNumber"
                            name="phoneNumber"
                            label="Phone Number"
                            placeholder="900000000"
                            pattern="number"
                            maxLength={9}
                            prefix="+251"
                            disabled={!isEditMode}
                            className="bg-gray-50 dark:bg-gray-100"
                        />
                        <FormikInput
                            id="email"
                            name="email"
                            label="Email"
                            pattern="email"
                            disabled={!isEditMode}
                            placeholder="Enter Email"
                        />
                        <FormikInput
                            id="bio"
                            name="bio"
                            label="Bio"
                            disabled={!isEditMode}
                            placeholder="Enter bio"
                        />
                    </div>

                    {isEditMode &&
                        <div className="mt-7 flex flex-col gap-1.5 w-full">
                            <Button size={"lg"}
                                disabled={postMutation.isPending}
                                className={"w-full"} type="submit"
                            >
                                {postMutation.isPending ? "Loading..." : "Save Changes"}
                            </Button>
                        </div>
                    }
                </Form>
            )}

        </Formik>

    )
}

export default Profile
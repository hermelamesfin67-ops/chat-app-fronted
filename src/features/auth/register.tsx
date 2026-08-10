"use client"
import FormikInput from "@/components/forms/input"
import FormikMaskedInput from "@/components/forms/masked-input"
import { Button } from "@/components/ui/button"
import { Form, Formik } from "formik"
import AuthWrapper from "./auth-wrapper"
import Link from "next/link"
import { routes } from "@/lib/routes"
import Image from "next/image"
import { createAccountSchema, CreateAccountSchemaType } from "@/validations/auth.schema"
import useDynamicMutation from "@/lib/api/use-post-data"
import { toast } from "sonner"

function Register() {
    const postMutation = useDynamicMutation({ type: "FormData" })

    const initialValues = {
        username: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        avatar: null as unknown as File
    }
    const handleUserRegistration = async (values: CreateAccountSchemaType) => {
        try {
            await postMutation.mutateAsync({
                url: "signup/",
                method: "POST",
                body: {
                    username: values.username,
                    phone_number: "+251".concat(values.phoneNumber),
                    password: values.password,
                    confirm_password: values.confirmPassword,
                    profile_picture: values.avatar,
                },
                onSuccess: (res) => {
                    toast.success(res.message);
                },
            });
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <AuthWrapper title="Create Account">
            <Formik
                initialValues={initialValues}
                validationSchema={createAccountSchema}
                onSubmit={(val) => handleUserRegistration(val)}
            >
                {({ values, setFieldValue }) => {
                    return (
                        <Form className="flex flex-col gap-4 w-full">
                            <div className="flex flex-col gap-1.5 items-center justify-center">
                                <div className="border rounded-full w-16 h-16 bg-gray-50 overflow-hidden p-0.5">
                                    <Image src={values.avatar ? URL.createObjectURL(values.avatar) : "/profile.jpeg"} alt="PP" className="object-cover" width={100} height={100} />
                                </div>
                                <label htmlFor="avatar" className="text-primary font-semibold text-sm">Tab to add photo</label>
                                <input id="avatar" type="file" className="hidden" onChange={(e) => {
                                    setFieldValue("avatar", e.target.files && e.target.files[0])
                                }} />
                            </div>
                            <FormikInput
                                id="username"
                                name="username"
                                label="Username"
                                pattern="username"
                                placeholder="Enter username"
                            />
                            <FormikInput
                                id="phoneNumber"
                                name="phoneNumber"
                                label="Phone Number"
                                placeholder="900000000"
                                pattern="number"
                                maxLength={9}
                                prefix="+251"
                                className="bg-gray-50 dark:bg-gray-100"
                            />
                            <FormikMaskedInput
                                id="password"
                                name="password"
                                label="Password"
                                placeholder="Enter password"
                                viewToggle
                            />
                            <FormikMaskedInput
                                id="confirmPassword"
                                name="confirmPassword"
                                label="Confirm Password"
                                placeholder="Confirm password"
                                viewToggle
                            />


                            <div className="mt-5 flex flex-col gap-1.5 w-full">
                                <Button size={"lg"} className={"w-full"} type="submit">
                                    Sign Up
                                </Button>

                                <Link href={routes.signIn} className="text-sm  text-primary py-3">Already have an account ? Login</Link>
                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </AuthWrapper>

    )
}

export default Register
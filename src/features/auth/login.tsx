"use client"
import FormikInput from "@/components/forms/input"
import FormikMaskedInput from "@/components/forms/masked-input"
import { Button } from "@/components/ui/button"
import { Form, Formik } from "formik"
import AuthWrapper from "./auth-wrapper"
import Link from "next/link"
import { routes } from "@/lib/routes"
import useDynamicMutation from "@/lib/api/use-post-data"
import { toast } from "sonner"
import { loginSchema, LoginSchemaType } from "@/validations/auth.schema"
import { signIn } from "next-auth/react"

function Login() {
    const postMutation = useDynamicMutation({ type: "FormData" })

    const initialValues = {
        phoneNumber: "",
        password: "",
    }
    const handleLogin = async (values: LoginSchemaType) => {
        try {
            await postMutation.mutateAsync({
                url: "login/",
                method: "POST",
                body: {
                    phone_number: "0".concat(values.phoneNumber),
                    password: values.password,
                },
                onSuccess: (res) => {
                    signIn("credentials", {
                        data: JSON.stringify(res),
                        callbackUrl: "/",
                    });
                    toast.loading("Login Successfully Redirecting...");
                },
            });
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <AuthWrapper title="Welcome back">
            <Formik
                initialValues={initialValues}
                validationSchema={loginSchema}
                onSubmit={(val) => handleLogin(val)}
            >
                <Form className="flex flex-col gap-4 w-full">
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


                    <div className="mt-5 flex flex-col gap-1.5 w-full">
                        <Button size={"lg"} className={"w-full"} type="submit">
                            Login
                        </Button>
                        <p className="text-xs text-primary">Forgot password?</p>


                        <Link href={routes.signUp} className="text-sm  text-primary py-3">Don&apos;t have an account ? Sign Up</Link>
                    </div>
                </Form>
            </Formik>
        </AuthWrapper>
    )
}

export default Login
"use client"
import FormikMaskedInput from '@/components/forms/masked-input'
import { Button } from '@/components/ui/button'
import useDynamicMutation from '@/lib/api/use-post-data'
import { routes } from '@/lib/routes'
import { changePasswordSchema, ChangePasswordSchemaType } from '@/validations/auth.schema'
import { Form, Formik } from 'formik'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

function ChangePassword() {
    const router = useRouter()
    const postMutation = useDynamicMutation({})

    const updatePassword = async (val: ChangePasswordSchemaType) => {
        try {
            await postMutation.mutateAsync({
                url: "change-password/",
                method: "POST",
                body: {
                    old_password: val.oldPassword,
                    new_password: val.password,
                    confirm_password: val.confirmPassword
                },
                onSuccess: () => {
                    router.push(routes.signIn)
                    toast.success("Password Changed Successfully, Please Login again");
                },
            });
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <Formik
            initialValues={{
                oldPassword: "",
                password: "",
                confirmPassword: "",
            }}
            validationSchema={changePasswordSchema}
            onSubmit={(val) => updatePassword(val)}
        >
            {() => (
                <Form className="flex flex-col justify-center gap-5 p-5 h-screen">
                    <p className="text-center capitalize text-3xl font-semibold pb-5">
                        Change Password
                    </p>
                    <div className="flex flex-col gap-3">
                        <FormikMaskedInput
                            id="oldPassword"
                            name="oldPassword"
                            label="Old Password"
                            placeholder="Enter old password"
                            viewToggle
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
                    </div>

                    <div className="mt-7 flex flex-col gap-1.5 w-full">
                        <Button size={"lg"}
                            disabled={postMutation.isPending}
                            className={"w-full"} type="submit"
                        >
                            {postMutation.isPending ? "Loading..." : "Save Changes"}
                        </Button>
                    </div>
                </Form>
            )}

        </Formik>
    )
}

export default ChangePassword
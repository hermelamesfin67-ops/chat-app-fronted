"use client"
import React, { useState } from 'react'
import AuthWrapper from './auth-wrapper'
import { ErrorMessage, Formik, Form } from 'formik'
import FormikInput from '@/components/forms/input'
import useDynamicMutation from '@/lib/api/use-post-data'
import { createPasswordSchema, CreatePasswordSchemaType, requestOtpSchema, RequestOtpSchemaType, verifyOtpSchema, VerifyOtpSchemaType } from '@/validations/auth.schema'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { cn } from '@/lib/utils'
import { formatTime } from '@/utils/date'
import FormikMaskedInput from '@/components/forms/masked-input'
import { useRouter } from 'next/navigation'
import { routes } from '@/lib/routes'

type StepType = "REQUEST_PASSWORD" | "VERIFY_OTP" | "FORGOT_PASSWORD"

function ForgotPassword() {
    const [step, setStep] = React.useState<StepType>("REQUEST_PASSWORD")
    const [phone, setPhone] = useState("")
    const [time, setTime] = useState(0)
    const [tempToken, setTempToken] = useState("")

    return (
        <AuthWrapper
            title={cn(step === "REQUEST_PASSWORD" ? "Request OTP" : step === "VERIFY_OTP" ? "Verify OTP" : "Create New Password")}
        >
            {step === "REQUEST_PASSWORD" && <RequestOTP setStep={setStep} setPhone={setPhone} setTime={setTime} />}
            {step === "VERIFY_OTP" && <VerifyOTP setStep={setStep} phone={phone} time={time} setTime={setTime} setTempToken={setTempToken} />}
            {step === "FORGOT_PASSWORD" && <CreatePassword tempToken={tempToken} />}
        </AuthWrapper>
    )
}

export default ForgotPassword


const RequestOTP = ({ setStep, setPhone, setTime }
    : {
        setStep: React.Dispatch<React.SetStateAction<StepType>>,
        setPhone: React.Dispatch<React.SetStateAction<string>>,
        setTime: React.Dispatch<React.SetStateAction<number>>
    }) => {
    const postMutation = useDynamicMutation({ type: "FormData" })

    const requestOtp = async (values: RequestOtpSchemaType) => {
        setPhone("0".concat(values.phoneNumber))
        try {
            await postMutation.mutateAsync({
                url: "forgot-password/",
                method: "POST",
                body: {
                    phone_number: "0".concat(values.phoneNumber),
                },
                onSuccess: (res) => {
                    setTime(res?.otp_expires_in)
                    setStep("VERIFY_OTP")
                    toast.success(res?.message || "OTP sent successfully check your email!");
                },
            });
        } catch (err) {
            console.log(err);
        }
    };

    return <Formik
        initialValues={{
            phoneNumber: ""
        }}
        validationSchema={requestOtpSchema}
        onSubmit={(val) => requestOtp(val)}
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

            <div className="mt-5 flex flex-col gap-1.5 w-full">
                <Button size={"lg"} disabled={postMutation.isPending} className={"w-full"} type="submit">
                    {postMutation.isPending ? "Loading..." : "Request OTP"}
                </Button>
            </div>
        </Form>
    </Formik>
}

const VerifyOTP = ({ phone, setStep, time, setTime, setTempToken }
    : {
        time: number,
        phone: string,
        setStep: React.Dispatch<React.SetStateAction<StepType>>,
        setTempToken: React.Dispatch<React.SetStateAction<string>>,
        setTime: React.Dispatch<React.SetStateAction<number>>
    }) => {
    const postMutation = useDynamicMutation({ type: "FormData" })

    React.useEffect(() => {
        if (time > 0) {
            const timer = setInterval(() => {
                setTime(time - 1);
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [setTime, time]);

    const verifyOtp = async (values: VerifyOtpSchemaType) => {
        try {
            await postMutation.mutateAsync({
                url: "verify-otp/",
                method: "POST",
                body: {
                    otp: values.otp,
                    phone_number: phone,
                },
                onSuccess: (res) => {
                    setTempToken(res?.access_token)
                    setStep("FORGOT_PASSWORD")
                    toast.success(res?.message || "OTP verified successfully!");
                },
            });
        } catch (err) {
            console.log(err);
        }
    };

    return <Formik
        initialValues={{
            otp: ""
        }}
        validationSchema={verifyOtpSchema}
        onSubmit={(val) => verifyOtp(val)}
    >
        {({ values, setFieldValue }) => (
            <Form className="flex flex-col gap-4 w-full">
                <div className="flex flex-col gap-1 items-center justify-center w-full">
                    <InputOTP
                        maxLength={6}
                        value={values.otp}
                        onChange={(val) => setFieldValue("otp", val)}
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} className='w-10 h-10' />
                            <InputOTPSlot index={1} className='w-10 h-10' />
                            <InputOTPSlot index={2} className='w-10 h-10' />
                            <InputOTPSlot index={3} className='w-10 h-10' />
                            <InputOTPSlot index={4} className='w-10 h-10' />
                        </InputOTPGroup>
                    </InputOTP>
                    <div className="mt-1">
                        {time > 0 && (
                            <p className="text-black font-semibold text-center">
                                {formatTime(time)}
                                <span> {time < 60 ? "Sec" : "Min"}</span>
                            </p>
                        )}
                    </div>
                    <ErrorMessage
                        name={"otp"}
                        component="div"
                        className={"text-xs text-red-500 pt-1 font-medium"}
                    />

                </div>

                <div className="mt-5 flex flex-col gap-1.5 w-full">
                    <Button size={"lg"} disabled={postMutation.isPending} className={"w-full"} type="submit">
                        {postMutation.isPending ? "Loading..." : "Verify OTP"}
                    </Button>
                </div>
            </Form>
        )}

    </Formik>
}


const CreatePassword = ({ tempToken }
    : {
        tempToken: string,
    }) => {
    const router = useRouter()
    const postMutation = useDynamicMutation({ type: "FormData" })

    const createPassword = async (values: CreatePasswordSchemaType) => {
        try {
            await postMutation.mutateAsync({
                url: "reset-password/",
                method: "POST",
                body: {
                    new_password: values.password,
                    confirm_password: values.confirmPassword,
                    access_token: tempToken
                },
                onSuccess: () => {
                    router.replace(routes.signIn)
                    toast.success("Password reset successfully, Please login with your new password!");
                },
            });
        } catch (err) {
            console.log(err);
        }
    };

    return <Formik
        initialValues={{
            password: "",
            confirmPassword: "",
        }}
        validationSchema={createPasswordSchema}
        onSubmit={(val) => createPassword(val)}
    >
        <Form className="flex flex-col gap-4 w-full">
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
                <Button size={"lg"} disabled={postMutation.isPending} className={"w-full"} type="submit">
                    {postMutation.isPending ? "Loading..." : "Create New Password"}
                </Button>
            </div>
        </Form>
    </Formik>
}
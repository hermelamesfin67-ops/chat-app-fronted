import React from 'react'
import { useField, ErrorMessage } from "formik"
import { cn } from '@/utils';
import { Input } from '../ui/input';

interface FormikInputProps {
    id: string;
    name: string;
    label?: string | React.ReactNode;
    prefix?: string;
    placeholder?: string;
    className?: string;
    inputClassName?: string;
    color?: string;
    disabled?: boolean;
    size?: string | number | undefined
    maxLength?: number;
    required?: boolean;
    labelClassName?: string;
    pattern?:
    | "email"
    | "username"
    | "alphabet"
    | "alphaNumerics"
    | "number"
    | "wholeNumber"
    | "url"
    | "upperCaseAndNumerics"
    | "amharicAndEnglishLetters";
}

const FormikInput: React.FC<FormikInputProps> = ({
    id,
    name,
    label,
    prefix,
    placeholder,
    className,
    inputClassName,
    color = "primary",
    disabled = false,
    size,
    maxLength = 100,
    pattern,
    required,
    labelClassName,
    ...props
}) => {
    const [field] = useField(name);
    return (
        <div className={cn("flex flex-col gap-1 w-full")}>
            <div className={cn("flex items-center gap-1 font-semibold text-sm", labelClassName)}>
                {label}
                {required && (
                    <span className='text-red-500'>
                        *
                    </span>
                )}
            </div>
            <div className={cn('flex items-center gap-0.5 border rounded-md p-0.5', className)}>
                {prefix && (
                    <span className="text-sm font-medium">{prefix}</span>
                )}
                <Input
                    id={id}
                    prefix={prefix}
                    placeholder={placeholder}
                    autoComplete="off"
                    maxLength={maxLength}
                    onInput={(e) => {
                        const input = e.currentTarget;

                        if (pattern === "wholeNumber") {
                            input.value = input.value.replace(/[^0-9]/g, "");
                        }
                        if (pattern === "number") {
                            input.value = input.value
                                // allow digits and dot only
                                .replace(/[^0-9.]/g, "")
                                // allow only one dot
                                .replace(/(\..*)\./g, "$1")
                                // remove leading zeros (but keep "0." case)
                                .replace(/^0+(?=\d)/, "")
                                // limit to 2 decimal places
                                .replace(/^(\d+)(\.\d{0,2})?.*$/, "$1$2");
                        }
                        if (pattern === "email") {
                            input.value = input.value
                                ?.toLowerCase()
                                .replace(/[^a-zA-Z0-9@_%-+.]/g, "")
                                .replace(/\s+/g, " ") // allow only one space
                                // Prevent consecutive dots
                                .replace(/\.{2,}/g, ".")
                                .replace(/^\s/, ""); // prevent starting with space;
                        }
                        if (pattern === "username") {
                            input.value = input.value?.toLowerCase().replace(/[^a-z0-9]/g, "");
                        }
                        if (pattern === "upperCaseAndNumerics") {
                            input.value = input.value?.replace(/[^A-Z0-9]/g, "");
                        }
                        if (pattern === "alphaNumerics") {
                            input.value = input.value.replace(/[^a-zA-Z0-9]/g, "");
                        }
                        if (pattern === "alphabet") {
                            input.value = input.value
                                .replace(/[^a-zA-Z\s]/g, "") // remove non-letters
                                .replace(/\s+/g, " ") // allow only one space
                                .replace(/^\s/, ""); // prevent starting with space
                        }
                        if (pattern === "url") {
                            input.value = input.value.replace(
                                /[^a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]/g,
                                "",
                            );
                        }
                        if (pattern === "amharicAndEnglishLetters") {
                            input.value = input.value.replace(
                                /[^\p{Script=Ethiopic}a-zA-Z0-9\s#*.,!?:፣፤፥፦፧፨\-]/gu,
                                "",
                            );
                        }
                        if (input.value.length > input.maxLength) {
                            input.value = input.value.slice(0, input.maxLength);
                        }
                    }}
                    {...field}
                    name={name}
                    className={cn("text-sm placeholder:text-xs [&>label>span]:font-medium bg-gray-50 dark:bg-gray-100 border-gray-50  shadow-none", inputClassName)}
                    color={color}
                    disabled={disabled}
                    size={size as unknown as number | undefined}
                    {...props}
                />
            </div>

            <ErrorMessage
                name={"username"}
                component="div"
                className={"text-xs text-red-500 pt-1 font-medium"}
            />
        </div>
    )
}

export default FormikInput
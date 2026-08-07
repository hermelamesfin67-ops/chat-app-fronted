"use client";
import React, { useState, useMemo } from "react";
import { useField, ErrorMessage } from "formik";
import { Input } from "../ui/input";
import { cn } from "@/utils";
import { Eye, EyeOff } from "lucide-react";

interface FormikMaskedInputProps {
  id: string;
  name: string;
  label?: string | React.ReactNode;
  suffix?: string | React.ReactNode;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  color?: string;
  disabled?: boolean;
  size?: string | number | undefined
  maxLength?: number;
  required?: boolean;
  labelClassName?: string;
  pattern?: string;
  viewToggle?: boolean;
}

const FormikMaskedInput: React.FC<FormikMaskedInputProps> = ({
  id,
  name,
  label,
  className,
  placeholder,
  inputClassName,
  color = "primary",
  disabled = false,
  size = "md",
  maxLength = 100,
  required,
  labelClassName,
  pattern,
  suffix,
  viewToggle = false,
  ...props
}) => {
  const [field, , helpers] = useField(name);
  const [visible, setVisible] = useState(false);

  const regex = useMemo(() => {
    if (!pattern) return null;

    try {
      if (pattern.startsWith("/") && pattern.lastIndexOf("/") > 0) {
        const lastSlash = pattern.lastIndexOf("/");
        const body = pattern.slice(1, lastSlash);
        const flags = pattern.slice(lastSlash + 1);
        return new RegExp(body, flags);
      }

      return new RegExp(pattern, "g");
    } catch {
      return null;
    }
  }, [pattern]);

  const realValue = field.value || "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    if (!visible) {
      const diff = inputValue.length - realValue.length;

      if (diff > 0) {
        const added = inputValue.slice(-diff);
        inputValue = realValue + added;
      } else {
        inputValue = realValue.slice(0, inputValue.length);
      }
    }

    if (regex) {
      inputValue = inputValue.replace(regex, "");
    }

    helpers.setValue(inputValue);
  };

  const displayValue = visible ? realValue : "*".repeat(realValue.length);

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className={cn("flex items-center gap-1 font-semibold text-sm", labelClassName)}>
        {label}
        {required && <span className='text-red-500'>
          *
        </span>}
      </div>
      <div className="flex items-center gap-1 w-full border rounded-md p-0.5">
        <Input
          id={id}
          autoComplete="one-time-code"
          maxLength={maxLength}
          placeholder={placeholder}
          value={displayValue}
          onChange={handleChange}
          name={name}
          className={cn("text-sm placeholder:text-xs bg-gray-50 dark:bg-gray-100 border-gray-50 shadow-none", inputClassName)}
          color={color}
          disabled={disabled}
          size={size as unknown as number | undefined}
          onCopy={(e) => e.preventDefault()}
          onCut={(e) => e.preventDefault()}
          onPaste={(e) => e.preventDefault()}
          {...props}
        />
        <div className="flex items-center gap-2">
          {viewToggle ? (
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              className="text-gray-500"
            >
              {visible ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
          ) : null}

          {suffix}
        </div>
      </div>

      <ErrorMessage
        name={name}
        component="div"
        className="text-xs text-red-500 pt-1 font-medium"
      />
    </div>
  );
};

export default FormikMaskedInput;

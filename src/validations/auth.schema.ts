import * as Yup from "yup";

export const createAccountSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  email: Yup.string()
    .email("Invalid email")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format",
    )
    .required("Email is required"),
  phoneNumber: Yup.string()
    .required("Phone Number is required")
    .matches(/^[97]\d{8}$/, "Phone number must start with 9 or 7"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Minimum 6 characters is allowed."),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Password must match")
    .transform((value) => value.trim())
    .required("Confirm Password is required"),
  avatar: Yup.mixed().optional(),
});

export const loginSchema = Yup.object().shape({
  phoneNumber: Yup.string()
    .required("Phone Number is required")
    .matches(
      /^[97]\d{8}$/,
      "Phone number must start with 9 or 7 and be 9 digits long",
    ),
  password: Yup.string().required("Password is required"),
});

export const changePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string().required("Old Password is required"),
  password: Yup.string()
    .required("New Password is required")
    .min(6, "Minimum 6 characters is allowed."),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Password must match")
    .transform((value) => value.trim())
    .required("Confirm Password is required"),
});


export type CreateAccountSchemaType = Yup.InferType<typeof createAccountSchema>;
export type LoginSchemaType = Yup.InferType<typeof loginSchema>;
export type ChangePasswordSchemaType = Yup.InferType<typeof changePasswordSchema>;
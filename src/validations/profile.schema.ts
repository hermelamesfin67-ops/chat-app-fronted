import * as Yup from "yup";

export const profileSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  bio: Yup.string().optional(),
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
  avatar: Yup.mixed().optional(),
});

export type ProfileSchemaType = Yup.InferType<typeof profileSchema>;
